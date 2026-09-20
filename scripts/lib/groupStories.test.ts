import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { groupStories } from "./groupStories";
import type { Article } from "../types";

function article(partial: Partial<Article> & Pick<Article, "title" | "url" | "source">): Article {
  return {
    id: partial.id ?? partial.url,
    category: "vendors",
    priority: "medium",
    publishedAt: "2026-09-18T12:00:00.000Z",
    publishedRaw: null,
    summary: null,
    collectedAt: "2026-09-18T12:00:00.000Z",
    ...partial,
  };
}

describe("groupStories press-over-wire", () => {
  it("lets trade press lead a cluster when scores are within 10%", () => {
    const wire = article({
      title: "Envestnet announces AI data platform",
      url: "https://www.businesswire.com/envestnet",
      source: "Business Wire wealth AI",
      publishedAt: "2026-09-18T15:00:00.000Z",
    });
    const press = article({
      title: "Envestnet announces AI data platform for RIAs",
      url: "https://www.riabiz.com/envestnet",
      source: "RIABiz",
      publishedAt: "2026-09-18T14:00:00.000Z",
    });
    const scores = new Map<string, number>([
      [wire.url, 100],
      [press.url, 93],
    ]);
    const [cluster] = groupStories([wire, press], scores);
    assert.equal(cluster.source, "RIABiz");
    assert.equal(cluster.related.some((r) => r.source.includes("Business Wire")), true);
  });

  it("keeps the wire lead when no press twin is within 10%", () => {
    const wire = article({
      title: "Obscure vendor ships a widget",
      url: "https://www.businesswire.com/widget",
      source: "Business Wire wealth AI",
    });
    const [cluster] = groupStories([wire], new Map([[wire.url, 80]]));
    assert.equal(cluster.source, "Business Wire wealth AI");
  });
});
