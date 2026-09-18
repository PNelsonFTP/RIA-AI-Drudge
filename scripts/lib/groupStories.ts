// Same-story grouping via Jaccard similarity on title tokens.
// Mirrors the algorithm from the original site's Task 4 (threshold 0.4).

import type { Article, GroupedArticle } from "../types";

const STOPWORDS = new Set([
  "the","a","an","and","or","but","of","to","in","on","for","with","by","at","from",
  "is","are","was","were","be","been","as","it","its","this","that","these","those",
  "says","said","will","has","have","had","new","ai","via","after","over","into",
  "you","your","i","we","our","they","their","he","she","his","her",
]);

function tokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOPWORDS.has(t))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

const THRESHOLD = 0.4;

const WIRE_SOURCE = /business\s*wire|pr\s*newswire|globenewswire/i;

function publishedMs(a: Article): number {
  return a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
}

// Aggregator / wire / vendor items stay in the cluster but should not be
// the displayed lead when trade press covers the same story.
function isWeakClusterLead(a: Article): boolean {
  if (a.source.startsWith("GN:") || a.source.startsWith("HN:")) return true;
  if (a.vendor) return true;
  if (WIRE_SOURCE.test(a.source)) return true;
  return false;
}

function pickClusterLead(members: Article[]): Article {
  const preferred = members.filter((m) => !isWeakClusterLead(m));
  const pool = preferred.length > 0 ? preferred : members;
  return [...pool].sort((a, b) => publishedMs(b) - publishedMs(a))[0] ?? members[0];
}

// Greedy clustering: process articles newest-first, then re-pick the lead
// so trade press beats Business Wire / GN twins of the same story.
export function groupStories(articles: Article[]): GroupedArticle[] {
  const sorted = [...articles].sort((a, b) => publishedMs(b) - publishedMs(a));

  const clusters: { members: Article[]; tokens: Set<string> }[] = [];

  for (const art of sorted) {
    const toks = tokens(art.title);
    let bestIdx = -1;
    let bestScore = 0;
    for (let i = 0; i < clusters.length; i++) {
      const score = jaccard(toks, clusters[i].tokens);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    if (bestIdx >= 0 && bestScore >= THRESHOLD) {
      clusters[bestIdx].members.push(art);
    } else {
      clusters.push({ members: [art], tokens: toks });
    }
  }

  return clusters.map((c) => {
    const lead = pickClusterLead(c.members);
    const related = c.members.filter((m) => m.url !== lead.url);
    return { ...lead, related };
  });
}
