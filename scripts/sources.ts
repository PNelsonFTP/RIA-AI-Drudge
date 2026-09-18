// Source feed list for RIA AI Report.
//
// Audience: RIAs, BDs, advisors, wealth/asset management.
// Curated list: ../ai-news-sources-RIA.md (tiers 1–9).
// Probe notes: docs/FEED_PROBE_CURATED.md, docs/FEED_PROBE_EXTRA.md
// Only keep live RSS/Atom. Broad outlets use requireAny (AI keywords).
// Re-check: npm run validate:feeds
//
// Do not re-add blindly (probed 2026-09-18): FINRA first-party (403),
// ThinkAdvisor / Advisor Perspectives / Financial Brand (WAF), AI Advisor
// Stack / Fintech Brainfood (Beehiiv rss_url null), Kitces.com/feed (use
// Feedburner), OCC /rss/occ.xml (use occ_news.xml), wirehouse newsrooms
// (no RSS), most law-firm insight RSS (403/404).

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

export type Priority = "critical" | "high" | "medium" | "low";

export interface FeedSource {
  name: string;
  url: string;
  category: CategoryId;
  priority: Priority;
  /** Keep item only if title/summary matches one of these (case-insensitive). Short tokens use word boundaries. */
  requireAny?: string[];
  /** Sponsor / product-vendor feed — UI may badge these separately. */
  vendor?: boolean;
}

/** Default AI filter for trade-adjacent / bank / general news firehoses. */
export const AI_FILTER = [
  "artificial intelligence",
  "generative",
  "agentic",
  "machine learning",
  "large language",
  "llm",
  "llms",
  "gpt",
  "chatgpt",
  "claude",
  "gemini",
  "openai",
  "anthropic",
  "copilot",
  "chatbot",
  "notetaker",
  "wealthtech",
  "advisortech",
  "advisor tech",
  "ai-powered",
  "ai powered",
  "genai",
  "gen-ai",
  "ai",
];

/** SEC / NASAA: AI plus exam/enforcement/adviser signal — not a full firehose. */
export const SUPERVISION_FILTER = [
  ...AI_FILTER,
  "examination",
  "exam priority",
  "exams",
  "enforcement",
  "adviser",
  "advisor",
  "ria",
  "ai-washing",
  "form adv",
  "model risk",
  "supervision",
  "finra",
];

/** Noisy AI newsletters / FT AI: keep finance or enterprise-adjacent items. */
export const FINANCE_OR_ENTERPRISE = [
  "wealth",
  "ria",
  "advisor",
  "adviser",
  "finra",
  "sec",
  "enterprise",
  "agentic",
  "security",
  "regulation",
  "examination",
  "exam priority",
  "fiduciary",
  "compliance",
  "notetaker",
  "copilot",
  "supervision",
  "model risk",
  "openai",
  "anthropic",
  "claude",
  "gemini",
  "chatgpt",
  "gpt",
];

export const SOURCES: FeedSource[] = [
  // ── Advisor / RIA trade press (tier 1) ────────────────────────────────
  { name: "Kitces — Advisor FinTech", url: "https://feeds.feedburner.com/KitcesNerdsEyeView", category: "advisor_tech", priority: "critical", requireAny: AI_FILTER },
  { name: "InvestmentNews", url: "https://www.investmentnews.com/rss", category: "advisor_tech", priority: "high", requireAny: AI_FILTER },
  { name: "WealthManagement.com", url: "https://www.wealthmanagement.com/rss.xml", category: "wealthtech", priority: "high", requireAny: AI_FILTER },
  { name: "Financial Planning", url: "https://www.financial-planning.com/feed?rss=true", category: "practice", priority: "high", requireAny: AI_FILTER },
  { name: "FA Magazine", url: "https://www.fa-mag.com/rss.php", category: "practice", priority: "high", requireAny: AI_FILTER },
  { name: "RIABiz", url: "https://www.riabiz.com/rss", category: "practice", priority: "high", requireAny: AI_FILTER },
  { name: "Wealth Solutions Report", url: "https://www.wealthsolutionsreport.com/rss/", category: "wealthtech", priority: "medium", requireAny: AI_FILTER },
  { name: "Robert Huebscher", url: "https://roberthuebscher.substack.com/feed", category: "practice", priority: "medium", requireAny: AI_FILTER },
  { name: "AdvisorHub", url: "https://www.advisorhub.com/feed/", category: "practice", priority: "high", requireAny: AI_FILTER },
  { name: "Professional Adviser", url: "https://www.professionaladviser.com/feeds/rss", category: "practice", priority: "medium", requireAny: AI_FILTER },
  { name: "AI for Advisors (podcast)", url: "https://anchor.fm/s/1086ac6ac/podcast/rss", category: "advisor_tech", priority: "low", requireAny: AI_FILTER },
  { name: "RIA Collective (podcast)", url: "https://rss.buzzsprout.com/2014808.rss", category: "practice", priority: "low", requireAny: AI_FILTER },

  // ── Wealthtech-specific (tier 2) ──────────────────────────────────────
  { name: "WealthTech Today", url: "https://wealthtechtoday.com/feed/", category: "wealthtech", priority: "high" },
  { name: "T3 Technology Hub", url: "https://t3technologyhub.com/feed/", category: "wealthtech", priority: "high" },
  { name: "Abnormal Returns", url: "https://abnormalreturns.com/feed/", category: "practice", priority: "medium", requireAny: AI_FILTER },
  { name: "Diamond Consultants", url: "https://www.diamond-consultants.com/feed/", category: "practice", priority: "medium", requireAny: AI_FILTER },
  { name: "GN: advisor AI notetaker", url: "https://news.google.com/rss/search?q=advisor+AI+notetaker+OR+%22meeting+notes%22+RIA&hl=en-US&gl=US&ceid=US:en", category: "advisor_tech", priority: "high" },
  { name: "GN: wealth copilot", url: "https://news.google.com/rss/search?q=%22wealth+management%22+copilot+OR+%22advisor+copilot%22&hl=en-US&gl=US&ceid=US:en", category: "wealthtech", priority: "medium" },

  // ── Bank / fintech press (tier 3) ─────────────────────────────────────
  { name: "Finextra AI", url: "https://www.finextra.com/rss/channel.aspx?channel=ai", category: "banking_fintech", priority: "high" },
  { name: "ABA Banking Journal AI", url: "https://bankingjournal.aba.com/tag/artificial-intelligence/feed/", category: "banking_fintech", priority: "medium" },
  { name: "American Banker AI", url: "https://www.americanbanker.com/artificial-intelligence.rss", category: "banking_fintech", priority: "medium" },
  { name: "FinTech Global", url: "https://fintech.global/feed/", category: "banking_fintech", priority: "medium", requireAny: AI_FILTER },
  { name: "Banking Dive", url: "https://www.bankingdive.com/feeds/news/", category: "banking_fintech", priority: "medium", requireAny: AI_FILTER },
  { name: "Fintech Takes", url: "https://fintechtakes.com/feed/", category: "banking_fintech", priority: "high", requireAny: AI_FILTER },
  { name: "Fintech Business Weekly", url: "https://fintechbusinessweekly.substack.com/feed", category: "banking_fintech", priority: "medium", requireAny: AI_FILTER },
  { name: "Tearsheet AI", url: "https://tearsheet.co/category/artificial-intelligence/feed/", category: "banking_fintech", priority: "medium" },
  { name: "PYMNTS AI", url: "https://www.pymnts.com/category/news/artificial-intelligence/feed/", category: "banking_fintech", priority: "medium" },
  { name: "FinTech Futures", url: "https://www.fintechfutures.com/rss.xml", category: "banking_fintech", priority: "medium", requireAny: AI_FILTER },
  { name: "A-Team Insight", url: "https://a-teaminsight.com/feed/", category: "banking_fintech", priority: "medium", requireAny: AI_FILTER },
  { name: "LLRX", url: "https://www.llrx.com/feed/", category: "compliance", priority: "medium", requireAny: AI_FILTER },
  { name: "Debevoise Data Blog", url: "https://www.debevoisedatablog.com/feed/", category: "compliance", priority: "medium", requireAny: AI_FILTER },
  { name: "Ncontracts Nsight (vendor)", url: "https://www.ncontracts.com/nsight-blog/rss.xml", category: "compliance", priority: "medium", vendor: true, requireAny: AI_FILTER },

  // ── Regulators (tier 4) — primary sources ─────────────────────────────
  { name: "SEC Press", url: "https://www.sec.gov/news/pressreleases.rss", category: "regulation", priority: "critical", requireAny: SUPERVISION_FILTER },
  { name: "SEC Speeches", url: "https://www.sec.gov/news/speeches-statements.rss", category: "regulation", priority: "critical", requireAny: SUPERVISION_FILTER },
  { name: "NASAA", url: "https://www.nasaa.org/feed/", category: "regulation", priority: "high", requireAny: SUPERVISION_FILTER },
  { name: "CFTC Press", url: "https://www.cftc.gov/rss.xml", category: "regulation", priority: "high", requireAny: AI_FILTER },
  { name: "Federal Reserve", url: "https://www.federalreserve.gov/feeds/press_all.xml", category: "regulation", priority: "critical", requireAny: AI_FILTER },
  { name: "Federal Reserve Speeches", url: "https://www.federalreserve.gov/feeds/speeches.xml", category: "regulation", priority: "high", requireAny: AI_FILTER },
  { name: "OCC News", url: "https://www.occ.gov/rss/occ_news.xml", category: "regulation", priority: "high", requireAny: AI_FILTER },
  { name: "FDIC Press", url: "https://www.fdic.gov/rss.xml", category: "regulation", priority: "high", requireAny: AI_FILTER },
  { name: "CFPB Newsroom", url: "https://www.consumerfinance.gov/about-us/newsroom/feed/", category: "regulation", priority: "medium", requireAny: AI_FILTER },
  { name: "Treasury Press", url: "https://home.treasury.gov/rss.xml", category: "regulation", priority: "high", requireAny: AI_FILTER },
  { name: "NIST News", url: "https://www.nist.gov/news-events/news/rss.xml", category: "regulation", priority: "high", requireAny: AI_FILTER },
  { name: "FCA News", url: "https://www.fca.org.uk/news/rss.xml", category: "regulation", priority: "medium", requireAny: AI_FILTER },
  { name: "ESMA", url: "https://www.esma.europa.eu/rss.xml", category: "regulation", priority: "medium", requireAny: AI_FILTER },
  { name: "BIS Press", url: "https://www.bis.org/doclist/all_pressrels.rss", category: "regulation", priority: "medium", requireAny: AI_FILTER },
  { name: "FSB News", url: "https://www.fsb.org/feed/", category: "regulation", priority: "medium", requireAny: AI_FILTER },
  { name: "EBA News", url: "https://www.eba.europa.eu/news-press/news/rss.xml", category: "regulation", priority: "medium", requireAny: AI_FILTER },
  { name: "Bank of England", url: "https://www.bankofengland.co.uk/rss/news", category: "regulation", priority: "medium", requireAny: AI_FILTER },
  { name: "EU AI Act tracker", url: "https://artificialintelligenceact.eu/feed/", category: "regulation", priority: "high" },
  { name: "GN: FINRA AI", url: "https://news.google.com/rss/search?q=FINRA+%22artificial+intelligence%22+OR+%22generative+AI%22&hl=en-US&gl=US&ceid=US:en", category: "regulation", priority: "high" },
  { name: "GN: SEC AI", url: "https://news.google.com/rss/search?q=SEC+(AI-washing+OR+%22artificial+intelligence%22+advisor+OR+RIA)&hl=en-US&gl=US&ceid=US:en", category: "regulation", priority: "high" },

  // ── Institutional (tier 5) ────────────────────────────────────────────
  { name: "PlanSponsor AI", url: "https://www.plansponsor.com/tag/artificial-intelligence/feed/", category: "institutional", priority: "medium" },
  { name: "PlanAdviser AI", url: "https://www.planadviser.com/tag/artificial-intelligence/feed/", category: "institutional", priority: "medium" },
  { name: "Risk.net", url: "https://www.risk.net/feeds/rss", category: "institutional", priority: "medium", requireAny: AI_FILTER },
  { name: "IPE", url: "https://www.ipe.com/8133.rss", category: "institutional", priority: "medium", requireAny: AI_FILTER },
  { name: "Investment Week", url: "https://www.investmentweek.co.uk/feeds/rss", category: "institutional", priority: "medium", requireAny: AI_FILTER },
  { name: "FT Asset Management", url: "https://www.ft.com/asset-management?format=rss", category: "institutional", priority: "medium", requireAny: AI_FILTER },
  { name: "Emerj AI Research", url: "https://emerj.com/feed/", category: "research", priority: "medium" },

  // ── Research / AM / consultancy (tier 6) ──────────────────────────────
  { name: "McKinsey Insights", url: "https://www.mckinsey.com/insights/rss", category: "research", priority: "medium", requireAny: AI_FILTER },
  { name: "eMoney Advisor (vendor)", url: "https://emoneyadvisor.com/feed/", category: "vendors", priority: "low", vendor: true, requireAny: AI_FILTER },
  { name: "CFA Market Integrity", url: "https://blogs.cfainstitute.org/marketintegrity/feed/", category: "research", priority: "high", requireAny: AI_FILTER },
  { name: "Insight Partners", url: "https://www.insightpartners.com/feed/", category: "research", priority: "low", requireAny: AI_FILTER },
  { name: "Adams Street Insights", url: "https://www.adamsstreetpartners.com/insights/feed/", category: "research", priority: "low", requireAny: AI_FILTER },

  // ── General AI / what's coming (tier 7) ───────────────────────────────
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", category: "industry", priority: "high" },
  { name: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", category: "industry", priority: "medium" },
  { name: "MIT Tech Review AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", category: "industry", priority: "high" },
  { name: "Ars Technica AI", url: "https://arstechnica.com/ai/feed/", category: "industry", priority: "medium" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", category: "industry", priority: "medium" },
  { name: "Wired AI", url: "https://www.wired.com/feed/tag/ai/latest/rss", category: "industry", priority: "medium" },
  { name: "CNBC Tech", url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664", category: "industry", priority: "medium", requireAny: AI_FILTER },
  { name: "Reuters AI (GN)", url: "https://news.google.com/rss/search?q=site:reuters.com+(AI+OR+%22artificial+intelligence%22)+(%22wealth+management%22+OR+advisor+OR+RIA+OR+FINRA+OR+SEC+OR+banker)&hl=en-US&gl=US&ceid=US:en", category: "industry", priority: "high" },
  { name: "Axios AI (GN)", url: "https://news.google.com/rss/search?q=site:axios.com+(AI+OR+%22artificial+intelligence%22)+(wealth+OR+advisor+OR+RIA+OR+FINRA+OR+SEC+OR+bank)&hl=en-US&gl=US&ceid=US:en", category: "industry", priority: "medium" },
  { name: "GN: RIA AI", url: "https://news.google.com/rss/search?q=RIA+AI+OR+%22registered+investment+advisor%22+%22artificial+intelligence%22&hl=en-US&gl=US&ceid=US:en", category: "industry", priority: "high" },
  { name: "Ben's Bites", url: "https://www.bensbites.com/feed", category: "industry", priority: "medium", requireAny: FINANCE_OR_ENTERPRISE },
  { name: "Stratechery", url: "https://stratechery.com/feed/", category: "industry", priority: "medium", requireAny: FINANCE_OR_ENTERPRISE },
  { name: "Exponential View", url: "https://www.exponentialview.co/feed", category: "industry", priority: "medium", requireAny: FINANCE_OR_ENTERPRISE },
  { name: "Import AI", url: "https://importai.substack.com/feed", category: "labs", priority: "medium", requireAny: FINANCE_OR_ENTERPRISE },
  { name: "TLDR AI", url: "https://tldr.tech/api/rss/ai", category: "industry", priority: "medium", requireAny: FINANCE_OR_ENTERPRISE },
  { name: "OpenAI News", url: "https://openai.com/news/rss.xml", category: "labs", priority: "high" },
  { name: "Google DeepMind Blog", url: "https://deepmind.google/blog/rss.xml", category: "labs", priority: "high" },
  { name: "Google AI Blog", url: "https://blog.google/technology/ai/rss/", category: "labs", priority: "high" },
  { name: "Microsoft Blog", url: "https://blogs.microsoft.com/feed/", category: "labs", priority: "high", requireAny: AI_FILTER },
  { name: "Meta AI Blog", url: "https://about.fb.com/feed/", category: "labs", priority: "medium", requireAny: AI_FILTER },

  // ── AI as investment theme (tier 8) ───────────────────────────────────
  { name: "FT Artificial Intelligence", url: "https://www.ft.com/artificial-intelligence?format=rss", category: "markets", priority: "high", requireAny: FINANCE_OR_ENTERPRISE },
  { name: "Bloomberg Markets", url: "https://feeds.bloomberg.com/markets/news.rss", category: "markets", priority: "high", requireAny: AI_FILTER },
  { name: "Bloomberg Tech", url: "https://feeds.bloomberg.com/technology/news.rss", category: "markets", priority: "medium", requireAny: AI_FILTER },
  { name: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", category: "markets", priority: "low", requireAny: AI_FILTER },
  { name: "WSJ Tech", url: "https://feeds.content.dowjones.io/public/rss/RSSWSJD", category: "markets", priority: "medium", requireAny: AI_FILTER },
  { name: "ETF Trends", url: "https://www.etftrends.com/feed/", category: "markets", priority: "medium", requireAny: AI_FILTER },
  { name: "GN: wealthtech AI", url: "https://news.google.com/rss/search?q=wealthtech+OR+%22wealth+tech%22+OR+%22advisor+AI%22+OR+%22RIA+AI%22&hl=en-US&gl=US&ceid=US:en", category: "wealthtech", priority: "high" },
  { name: "GN: AI capex / ETF", url: "https://news.google.com/rss/search?q=%22artificial+intelligence%22+(capex+OR+ETF+OR+NVIDIA+OR+%22AI+trade%22)+stock&hl=en-US&gl=US&ceid=US:en", category: "markets", priority: "medium" },
  { name: "Citrini Research", url: "https://www.citriniresearch.com/feed", category: "markets", priority: "medium" },

  // ── Vendor / PR (tier 9) ──────────────────────────────────────────────
  { name: "WealthTech Strategy", url: "https://www.wealthtechstrategy.com/blog-feed.xml", category: "vendors", priority: "low", vendor: true },
  { name: "Envestnet (vendor)", url: "https://www.envestnet.com/rss.xml", category: "vendors", priority: "medium", vendor: true, requireAny: AI_FILTER },
  { name: "Docupace (vendor)", url: "https://www.docupace.com/feed", category: "vendors", priority: "low", vendor: true, requireAny: AI_FILTER },
  { name: "Orion (vendor)", url: "https://www.orion.com/rss.xml", category: "vendors", priority: "medium", vendor: true, requireAny: AI_FILTER },
  { name: "Advisor360 (vendor)", url: "https://www.advisor360.com/blog/rss.xml", category: "vendors", priority: "low", vendor: true },
  { name: "Altruist (vendor)", url: "https://www.altruist.com/feed", category: "vendors", priority: "low", vendor: true, requireAny: AI_FILTER },
  { name: "Wealthbox (vendor)", url: "https://www.wealthbox.com/blog/feed", category: "vendors", priority: "low", vendor: true, requireAny: AI_FILTER },
  { name: "TIFIN (vendor)", url: "https://www.tifin.com/feed", category: "vendors", priority: "low", vendor: true },
  { name: "Vanilla (vendor)", url: "https://www.justvanilla.com/blog/feed", category: "vendors", priority: "low", vendor: true, requireAny: AI_FILTER },
  { name: "Wealth.com (vendor)", url: "https://www.wealth.com/feed", category: "vendors", priority: "low", vendor: true, requireAny: AI_FILTER },
  { name: "Nitrogen (vendor)", url: "https://www.nitrogenwealth.com/feed", category: "vendors", priority: "low", vendor: true, requireAny: AI_FILTER },
  { name: "Practifi (vendor)", url: "https://www.practifi.com/blog/feed", category: "vendors", priority: "low", vendor: true, requireAny: AI_FILTER },
  { name: "SS&C (vendor)", url: "https://www.ssctech.com/blog/rss.xml", category: "vendors", priority: "low", vendor: true, requireAny: AI_FILTER },
  { name: "GN: wealth AI vendors", url: "https://news.google.com/rss/search?q=(Envestnet+OR+Orion+OR+Altruist+OR+Jump+OR+Zocks+OR+TIFIN)+AI+(advisor+OR+RIA+OR+wealth)&hl=en-US&gl=US&ceid=US:en", category: "vendors", priority: "medium" },
];

export interface AgeWindow {
  softDays: number;
  hardDays: number;
  minItems: number;
}

export const AGE_WINDOWS: Record<CategoryId, AgeWindow> = {
  advisor_tech:    { softDays: 5,  hardDays: 8,  minItems: 4 },
  wealthtech:      { softDays: 5,  hardDays: 8,  minItems: 4 },
  practice:        { softDays: 5,  hardDays: 8,  minItems: 4 },
  industry:        { softDays: 3,  hardDays: 5,  minItems: 4 },
  regulation:      { softDays: 14, hardDays: 21, minItems: 3 },
  compliance:      { softDays: 14, hardDays: 21, minItems: 3 },
  banking_fintech: { softDays: 5,  hardDays: 8,  minItems: 3 },
  markets:         { softDays: 3,  hardDays: 5,  minItems: 4 },
  institutional:   { softDays: 10, hardDays: 14, minItems: 3 },
  labs:            { softDays: 5,  hardDays: 8,  minItems: 3 },
  research:        { softDays: 14, hardDays: 21, minItems: 3 },
  vendors:         { softDays: 7,  hardDays: 10, minItems: 3 },
};

export const KEYWORDS: { match: string[]; routeTo: CategoryId }[] = [
  { match: ["finra", "sec ", "nasaa", "cftc", "occ ", "fdic", "ny dfs", "exam priority", "regulatory notice", "enforcement", "ai-washing", "ai washing", "form adv", "rule 3110", "supervision"], routeTo: "regulation" },
  { match: ["ai compliance", "reg bi", "regbi", "books and records", "form adv", "smarsh", "hadrius"], routeTo: "compliance" },
  { match: ["crm", "notetaker", "meeting notes", "financial planning software", "moneyguide", "emoney", "rightcapital", "wealthbox", "redtail", "practifi"], routeTo: "advisor_tech" },
  { match: ["wealthtech", "advisor tech", "advisortech", "envestnet", "orion", "altruist", "tamarac", "black diamond", "t3 "], routeTo: "wealthtech" },
  { match: ["ria ", "registered investment", "independent advisor", "wirehouse", "broker-dealer", "practice management", "aum ", "succession"], routeTo: "practice" },
  { match: ["bank ai", "credit union", "core banking", "payments ai", "fraud"], routeTo: "banking_fintech" },
  { match: ["pension", "endowment", "allocator", "asset owner", "sovereign wealth", "ocios"], routeTo: "institutional" },
  { match: ["ai etf", "ai stock", "ai trade", "capex", "hyperscaler", "datacenter"], routeTo: "markets" },
  { match: ["gpt-", "gemini ", "deepmind", "foundation model"], routeTo: "labs" },
  { match: ["mckinsey", "deloitte", "survey", "white paper", "cerulli", "greenwich"], routeTo: "research" },
  { match: ["product launch", "announces ai", "unveils ai", "press release"], routeTo: "vendors" },
];

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  short: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "advisor_tech",    label: "ADVISOR TECH",      short: "ADV TECH" },
  { id: "industry",        label: "INDUSTRY NEWS",     short: "INDUSTRY" },
  { id: "regulation",      label: "REGULATION",        short: "REG" },
  { id: "wealthtech",      label: "WEALTHTECH",        short: "WTECH" },
  { id: "practice",        label: "PRACTICE & RIA",    short: "PRACTICE" },
  { id: "compliance",       label: "COMPLIANCE",        short: "COMPLY" },
  { id: "banking_fintech", label: "BANKING & FINTECH", short: "BANK" },
  { id: "markets",         label: "AI MARKETS",        short: "MARKETS" },
  { id: "institutional",   label: "INSTITUTIONAL",     short: "INST" },
  { id: "labs",            label: "LABS & MODELS",     short: "LABS" },
  { id: "research",        label: "RESEARCH",          short: "RESEARCH" },
  { id: "vendors",         label: "VENDOR WATCH",      short: "VENDORS" },
];

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  critical: 100,
  high: 50,
  medium: 10,
  low: 1,
};
