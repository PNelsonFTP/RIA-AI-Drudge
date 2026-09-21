// Client-side types. Mirror of scripts/types.ts but standalone so the
// browser bundle never pulls in fast-xml-parser / node built-ins.

export type Priority = "critical" | "high" | "medium" | "low";

export type CategoryId =
  | "advisor_tech"
  | "wealthtech"
  | "practice"
  | "regulation"
  | "compliance"
  | "banking_fintech"
  | "institutional"
  | "research"
  | "markets"
  | "labs"
  | "industry"
  | "vendors";

export interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  category: CategoryId;
  priority: Priority;
  publishedAt: string | null;
  publishedRaw: string | null;
  summary: string | null;
  collectedAt: string;
  vendor?: boolean;
}

export interface GroupedArticle extends Article {
  related: Article[];
}

export interface TrendingStory {
  lead: GroupedArticle;
  sources: string[];
  sourceCount: number;
  categoryIds: string[];
}

export interface CategoryBucket {
  id: CategoryId;
  label: string;
  articles: GroupedArticle[];
  articlesAll: GroupedArticle[];
  sourceCount: number;
  fullCount?: number;
}

export interface FeedStat {
  source: string;
  ok: boolean;
  count: number;
}

export interface HeadlinesPayload {
  generatedAt: string;
  totalCount: number;
  trending: TrendingStory[];
  categories: CategoryBucket[];
  feedStats: FeedStat[];
  leadUrl?: string | null;
  partial?: boolean;
}

export interface StockQuote {
  symbol: string;
  price: number | null;
  changePct: number | null;
  fetchedAt: string;
}

export interface SearchItem {
  id: string;
  title: string;
  url: string;
  source: string;
  category: CategoryId;
  priority: Priority;
  publishedAt: string | null;
  summary: string | null;
  vendor?: boolean;
  relatedSources: string[];
}

export interface SearchIndex {
  generatedAt: string;
  items: SearchItem[];
}

export interface Brief {
  generatedAt: string;
  source: "claude" | "fallback";
  headline: string;
  bullets: string[];
  citedArticles: { title: string; url: string; source: string }[];
}
