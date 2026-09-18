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
