import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildCategories, isAggregatorSource, pickTrendingLead } from "./router";
import { CATEGORIES } from "../sources";
import type { GroupedArticle } from "../types";

function article(partial: Partial<GroupedArticle> & Pick<GroupedArticle, "title" | "url" | "source">): GroupedArticle {
  return {
    id: partial.id ?? partial.url,
    category: "industry",
    priority: "high",
    publishedAt: "2026-08-18T12:00:00.000Z",
    publishedRaw: null,
    summary: null,
    collectedAt: "2026-08-18T12:00:00.000Z",
    related: [],
    ...partial,
  };
}

describe("trending lead quality", () => {
  it("treats HN/GN/Reddit titles as aggregators", () => {
    assert.equal(isAggregatorSource("HN: AI (150+ points)"), true);
    assert.equal(isAggregatorSource("GN: Prompt Injection"), true);
    assert.equal(isAggregatorSource("Reuters AI (Google News)"), true);
    assert.equal(isAggregatorSource("TechCrunch AI"), false);
  });

  it("prefers a press headline within 10% of the top aggregator score", () => {
    const hn = article({ title: "tencent/Hy3", url: "https://news.ycombinator.com/item?id=1", source: "HN: AI (150+ points)" });
    const press = article({
      title: "Tencent releases Hy3, a 295B open model",
      url: "https://simonwillison.net/2026/Jul/6/hy3/",
      source: "Simon Willison",
    });
    const lead = pickTrendingLead([
      { article: hn, score: 100 },
      { article: press, score: 92 },
    ]);
    assert.equal(lead.source, "Simon Willison");
    assert.equal(lead.related.some((r) => r.source.startsWith("HN:")), true);
  });

  it("prefers trade press over a vendor or wire twin within 10%", () => {
    const wire = article({
      title: "Envestnet launches AI platform",
      url: "https://www.businesswire.com/envestnet-ai",
      source: "Business Wire wealth AI",
    });
    const press = article({
      title: "Envestnet launches AI platform for advisors",
      url: "https://www.riabiz.com/envestnet-ai",
      source: "RIABiz",
    });
    const lead = pickTrendingLead([
      { article: { ...wire, vendor: true }, score: 100 },
      { article: press, score: 92 },
    ]);
    assert.equal(lead.source, "RIABiz");
  });

  it("keeps the aggregator when no press alternative is close", () => {
    const hn = article({ title: "only on HN", url: "https://news.ycombinator.com/item?id=2", source: "HN: AI (150+ points)" });
    const old = article({ title: "unrelated press", url: "https://example.com/old", source: "TechCrunch AI" });
    const lead = pickTrendingLead([
      { article: hn, score: 100 },
      { article: old, score: 50 },
    ]);
    assert.equal(lead.source, "HN: AI (150+ points)");
  });
});

describe("RIA-home lead preference", () => {
  it("prefers a regulation home story over a higher-scoring industry piece", () => {
    const now = new Date().toISOString();
    const industry = article({
      title: "Lab researchers publish a weekend hack",
      url: "https://techcrunch.com/lab-hack",
      source: "TechCrunch AI",
      category: "industry",
      priority: "high",
      publishedAt: now,
    });
    const ria = article({
      title: "SEC updates AI supervision exam priorities",
      url: "https://www.sec.gov/ai-exam",
      source: "SEC Press",
      category: "regulation",
      priority: "high",
      publishedAt: now,
    });
    const { leadUrl, buckets } = buildCategories([industry, ria]);
    assert.equal(leadUrl, ria.url);
    assert.equal(buckets.length, CATEGORIES.length);
    assert.equal(buckets.map((b) => b.id).join(","), CATEGORIES.map((c) => c.id).join(","));
  });

  it("emits every category bucket even when there are no articles", () => {
    const { buckets, leadUrl } = buildCategories([]);
    assert.equal(leadUrl, null);
    assert.equal(buckets.length, CATEGORIES.length);
    for (const b of buckets) {
      assert.deepEqual(b.articles, []);
      assert.deepEqual(b.articlesAll, []);
      assert.equal(b.sourceCount, 0);
    }
  });

  it("ranks regulation above a fresher practice linkdump for the site lead", () => {
    const now = new Date().toISOString();
    const practice = article({
      title: "Sunday links: the AI safety debate",
      url: "https://abnormalreturns.com/sunday-links",
      source: "Abnormal Returns",
      category: "practice",
      priority: "medium",
      publishedAt: now,
    });
    const regulation = article({
      title: "Remarks Before the Government Enforcement Institute",
      url: "https://www.sec.gov/enforcement-remarks",
      source: "SEC Speeches",
      category: "regulation",
      priority: "high",
      publishedAt: now,
    });
    const { leadUrl } = buildCategories([practice, regulation]);
    assert.equal(leadUrl, regulation.url);
  });

  it("keeps Shopify / NVIDIA Dreamforce out of vendor and advisor-tech columns", () => {
    const now = new Date().toISOString();
    const shopify = article({
      title: "How Shopify and Meta are diving deeper into banking product launch",
      url: "https://www.americanbanker.com/shopify-banking",
      source: "American Banker AI",
      category: "banking_fintech",
      priority: "medium",
      publishedAt: now,
    });
    const nvidia = article({
      title: "NVIDIA Dreamforce keynote on AI agents",
      url: "https://nvidianews.nvidia.com/dreamforce",
      source: "TechCrunch AI",
      category: "advisor_tech",
      priority: "medium",
      publishedAt: now,
    });
    const envestnet = article({
      title: "Envestnet enhances wealth data platform with AI-driven advisor insights",
      url: "https://www.envestnet.com/ai",
      source: "Envestnet (vendor)",
      category: "vendors",
      priority: "medium",
      publishedAt: now,
      vendor: true,
    });
    const { buckets } = buildCategories([shopify, nvidia, envestnet]);
    const vendors = buckets.find((b) => b.id === "vendors");
    const tech = buckets.find((b) => b.id === "advisor_tech");
    assert.equal(vendors?.articles.some((a) => /shopify/i.test(a.title)), false);
    assert.equal(tech?.articles.some((a) => /dreamforce/i.test(a.title)), false);
    assert.equal(vendors?.articles.some((a) => a.url === envestnet.url), true);
  });

  it("keeps a 96-hour multi-source story when fewer than 3 clusters are under 72 hours", () => {
    const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
    const publishedAt = hoursAgo(96);
    const sec = article({
      title: "SEC updates AI supervision exam priorities",
      url: "https://www.sec.gov/ai-supervision-old",
      source: "SEC Press",
      category: "regulation",
      priority: "high",
      publishedAt,
    });
    const press = article({
      title: "SEC updates AI supervision exam priorities",
      url: "https://www.riabiz.com/ai-supervision-old",
      source: "RIABiz",
      category: "practice",
      priority: "high",
      publishedAt,
    });
    const { trending } = buildCategories([sec, press]);
    assert.equal(trending.some((t) => t.lead.url === sec.url || t.lead.url === press.url), true);
  });

  it("falls back to the highest-scoring story when no RIA-home candidate exists", () => {
    const now = new Date().toISOString();
    const industry = article({
      title: "Lab researchers publish a weekend hack",
      url: "https://techcrunch.com/lab-hack-only",
      source: "TechCrunch AI",
      category: "industry",
      priority: "high",
      publishedAt: now,
    });
    const { leadUrl } = buildCategories([industry]);
    assert.equal(leadUrl, industry.url);
  });
});
