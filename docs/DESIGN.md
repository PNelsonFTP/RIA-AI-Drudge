# RIA AI Report — Design Document

Architecture, data flow, and editorial rules for the static aggregator.
Last updated: 2026-09-18 (first run).

## 1. System overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│              build:data (local now; GitHub Actions hourly later)         │
│  RSS + HTML scrape + HN index + stocks + brief                           │
│  → public/data/*.json + public/feed.xml                                  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     Static host (localhost / Pages later)                │
│   index.html + JS/CSS                                                    │
│   data/headlines-preview.json, headlines.json, stocks.json, brief.json   │
│   feed.xml                                                               │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     Browser (React SPA, no backend)                      │
│   Fetch own JSON → SWR/sessionStorage → 3-column Drudge layout           │
│   localStorage prefix: ria-ai-report:                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

**All third-party fetch happens at build time, never in the browser.**

This project is a **sibling** of AI Drudge, not a fork that shares a remote.
Same pipeline class; different categories, sources, keys, and product name.

## 2. Technology stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript 5.8 |
| Build | Vite 6 (`base: "/"` until the Pages repo name is known) |
| Styling | Tailwind CSS v4 |
| XML | `fast-xml-parser` 5.x |
| Hosting | Local first look; GitHub Pages after a new public repo |
| CI | `.github/workflows/refresh.yml` (hourly) + `feed-audit.yml` (weekly) — idle until remote exists |

## 3. Build pipeline

### 3.1 Orchestration (`scripts/build-data.ts`)

1. `fetchAllFeeds()`, `scrapeAllSources()`, `fetchHn()` in parallel
2. `buildCategories()` — keyword route, score, age windows, diversity, trending
3. Write minified `headlines.json` + `headlines-preview.json`
4. Atom `public/feed.xml` (placeholder `SITE_URL` until Pages)
5. Stocks + Claude/fallback brief

If fetch+scrape produce zero articles, the previous `headlines.json` is kept.

### 3.2 RSS fetch (`scripts/fetch-feeds.ts`)

- Per-host pool (max 2), 8s timeout, 3 retries, rotating User-Agent
- RSS 2.0 / Atom / RDF; 15 items per feed
- **`requireAny`:** if a source lists keywords, the item is dropped unless
  title+summary matches one of them. Tokens of length ≤3 use word boundaries.
- URL unwrap for Google News / hnrss (`scripts/lib/unwrapUrl.ts`)
- Dedup by normalized URL, then lowercased title

### 3.3 HTML scrape (`scripts/scrape-sources.ts`)

Inherited listing-card scrapers: Anthropic News/Research (useful for LABS),
plus UK AISI and Gray Swan (low RIA fit — candidates to drop; see
[FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md)).

### 3.4 Scoring (`scripts/lib/score.ts`)

```
finalScore = priority + recency (48h half-life) + importance keywords
           + HN velocity boost + home-category bonus
```

### 3.5 Routing (`scripts/lib/router.ts`)

1. Global per-source cap (6)
2. Home category + `KEYWORDS` extra routes
3. Age window → score → starvation fill → Jaccard grouping → diversity
4. Trending: ≥2 sources, freshness gate; lead prefers a non-`GN:`/`HN:`
   headline within 10% of the top score
5. Lead URL: highest-scoring story under 72h

### 3.6 Stocks (`scripts/fetch-stocks.ts`)

BLK, SCHW, MS, JPM, AMP, LPLA, NVDA, MSFT — Stooq primary, Yahoo fallback.

### 3.7 Daily brief (`scripts/generate-brief.ts`)

Claude Sonnet 5 if `ANTHROPIC_API_KEY` is set (anti-hallucination; cited URLs
must exist in the input). Otherwise: trending + regulation/industry/advisor
leads + cross-category sample.

### 3.8 Quality gate (`scripts/check-data.ts`)

First-run thresholds are looser than AI Drudge because many regulators
correctly return 0 items after the AI filter:

| Check | First-run value |
|-------|-----------------|
| Hard-fail feed OK ratio | 40% (raise toward 80% after Pages is stable) |
| Warn feed OK ratio | 60% |
| Max displayed item age | 30 days |
| Warn median age | 96h |

### 3.9 Feed validator (`scripts/validate-feeds.ts`)

`npm run validate:feeds` — liveness, parse, freshness, redirects. Weekly
`feed-audit.yml` will upsert a GitHub issue once the repo exists.

## 4. Data contracts

`scripts/types.ts` and `src/lib/types.ts` must stay in sync.

`HeadlinesPayload`: `generatedAt`, `totalCount`, `trending`, `categories`
(`articles` + `articlesAll`), `feedStats`, optional `leadUrl`, `partial`.

### localStorage / sessionStorage (`ria-ai-report:`)

| Key | Purpose |
|-----|---------|
| `bookmarks` / `read-later` | Saved IDs |
| `article-snapshots` | Full article copies so saves survive hourly aging |
| `muted-sources` / `muted-categories` | Hides |
| `seen-articles` | Read-state LRU (cap 500) |
| `last-visit` | "N new since last visit" |
| `theme` | `dark` \| `light` |
| `cache:headlines` / `cache:stocks` / `cache:brief` | sessionStorage SWR |

## 5. Client

Header → ticker → Daily Brief → Trending → Lead → LATEST → 3 columns
(`CATEGORIES` index `% 3`). Bookmarks and queue views merge live payload +
snapshots. Search and View All call `loadFull()`.

## 6. Categories (homepage order)

| # | id | Label | Column (i % 3) |
|---|----|-------|----------------|
| 0 | `advisor_tech` | ADVISOR TECH | left |
| 1 | `industry` | INDUSTRY NEWS | center |
| 2 | `regulation` | REGULATION | right |
| 3 | `wealthtech` | WEALTHTECH | left |
| 4 | `practice` | PRACTICE & RIA | center |
| 5 | `compliance` | COMPLIANCE | right |
| 6 | `banking_fintech` | BANKING & FINTECH | left |
| 7 | `markets` | AI MARKETS | center |
| 8 | `institutional` | INSTITUTIONAL | right |
| 9 | `labs` | LABS & MODELS | left |
| 10 | `research` | RESEARCH | center |
| 11 | `vendors` | VENDOR WATCH | right |

Age windows live in `AGE_WINDOWS` (`scripts/sources.ts`). Regulation /
compliance / research are slow lanes (14–21 days). Industry and markets
are fast (3–5 days).

## 7. Editorial rules

- Broad feeds (bank press, sitewide trade, most regulators, vendors) use
  `requireAny: AI_FILTER`.
- AI-section feeds (Finextra AI, ABA AI tag, PlanSponsor AI, American Banker
  AI) are unfiltered.
- FINRA first-party RSS is Cloudflare-blocked; **GN: FINRA AI** is the stand-in.
- ThinkAdvisor, Advisor Perspectives, Financial Brand: WAF — do not re-add
  `/feed` blindly.
- Kitces is Feedburner-only (`feeds.feedburner.com/KitcesNerdsEyeView`).
- RIABiz is `https://www.riabiz.com/rss` (or `api.riabiz.com/rss`).
- Vendor items: source name includes `(vendor)` and/or home category `vendors`.
- Paywalled sources: headline + outbound link only.

## 8. Failure modes

| Mode | Behavior |
|------|----------|
| One feed 403/429/timeout | Empty array; others continue |
| Zero articles overall | Keep previous JSON |
| Google News unwrap miss | Keep GN URL; Jaccard still clusters |
| Regulator + AI filter | Feed OK, 0 items — expected most days |
| VentureBeat 429 | Transient; next hourly run retries |
| Missing `ANTHROPIC_API_KEY` | Fallback brief |
