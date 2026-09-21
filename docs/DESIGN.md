# CFP AI Report — Design Document

Architecture, data flow, editorial rules, and visual system.
Last updated: **2026-09-21**.

## 1. System overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│     build:data  (local, or GitHub Actions hourly + on push to main)     │
│  RSS + Anthropic HTML scrape + HN index + stocks + brief                 │
│  → public/data/*.json + public/feed.xml                                  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  GitHub Pages  https://pnelsonftp.github.io/RIA-AI-Drudge/               │
│   index.html + JS/CSS (dist/)                                            │
│   data/headlines-preview.json, headlines.json, stocks.json, brief.json   │
│   feed.xml                                                               │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  Browser SPA — fetches only its own JSON                                 │
│  First Trust / XPND chrome, 3-column wire, localStorage ria-ai-report:   │
└──────────────────────────────────────────────────────────────────────────┘
```

**All third-party fetch happens at build time, never in the browser.**

This project is a **sibling** of AI Drudge, not a fork that shares a remote.
Same pipeline class; different categories, sources, storage keys, and name.
The look was later aligned with XPND Drudge (First Trust), not with the
original black/red monospace Drudge skin.

## 2. Technology stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript 5.8 |
| Build | Vite 6, `base: "/RIA-AI-Drudge/"` |
| Styling | Tailwind CSS v4 plus `src/styles.css` component classes |
| XML | `fast-xml-parser` 5.x (build time only) |
| Hosting | GitHub Pages via `actions/deploy-pages` |
| CI | `refresh.yml` (hourly + push) and `feed-audit.yml` (Mondays) |

## 3. Build pipeline

### 3.1 Orchestration (`scripts/build-data.ts`)

1. `fetchAllFeeds()`, `scrapeAllSources()`, and the HN index in parallel
2. `buildCategories()` — keyword route, score, age windows, diversity, trending, lead URL
3. Write `headlines.json` and a preview file (`partial`, View All tails omitted)
4. Atom `public/feed.xml` with title **CFP AI REPORT**, and `search-index.json` (deduped titles and summaries for the search box)
5. Stocks, then Claude or the fallback brief

If fetch plus scrape produce zero articles, the previous `headlines.json` is kept.

### 3.2 RSS fetch (`scripts/fetch-feeds.ts`)

- About 107 sources, 2 concurrent requests per host, timeout and retries
- RSS 2.0 / Atom / RDF; up to 15 items per feed
- **`requireAny`:** drop the item unless title or summary matches. Implemented in `scripts/lib/requireAny.ts`. Tokens of length ≤ 3 use a word boundary on the **trimmed** needle, so a title that starts with “AI” matches and “available” / “said” do not. `gpt` / `chatgpt` and `llm` / `llms` are families.
- Google News URLs are unwrapped after fetch. SEC / FINRA / RIA / wealth queries are sorted first. The cap is `max(160, unique GN URL count)` so a normal build unwraps every wrapper.
- Dedup by normalized URL, then by lowercased title
- `vendor: true` is copied onto the article

### 3.3 HTML scrape (`scripts/scrape-sources.ts`)

Anthropic News and Anthropic Research, plus three listing scrapes added
2026-09-21: FINRA regulatory notices (supervision filter), Jump blog, and
Zocks blog. A fetched page with zero keyword hits counts as OK / 0 items.
UK AISI and Gray Swan are gone.

### 3.4 Scoring (`scripts/lib/score.ts`)

```
finalScore = priority + recency (48h half-life) + importance keywords
           + HN velocity boost + home-category bonus
```

Missing dates are treated as stale.

### 3.5 Routing (`scripts/lib/router.ts`)

1. Global per-source cap
2. Home category plus `KEYWORDS` extra routes
3. `allowInBucket` drops Shopify / PtEverywhere / marine / off-topic NVIDIA from VENDOR WATCH and Dreamforce / NVIDIA gadget stories from ADVISOR TECH
4. Age window → score → starvation fill → Jaccard grouping (scores passed in) → diversity
5. Trending: clusters with multiple sources, fresh under 72 hours. If fewer than 3 clusters qualify, the window widens to 120 hours. Jaccard stays 0.4. The displayed lead prefers trade press over GN, HN, vendor, and wire sources when that press score is within 10% of the top score. Ties on source count prefer an RIA-home category.
6. Site `leadUrl`: among stories under 72 hours, rank **regulation > advisor tech > wealthtech > compliance > practice**. Industry and labs do not win while any of those exist.

### 3.6 Story grouping (`scripts/lib/groupStories.ts`)

Jaccard threshold 0.4 on title tokens. Inside a cluster, trade press beats Business Wire, PR Newswire, GlobeNewswire, GN, and `vendor: true` items when its score is at least 90% of the cluster max.

### 3.7 Stocks (`scripts/fetch-stocks.ts`)

BLK, SCHW, MS, JPM, AMP, LPLA, NVDA, MSFT. Stooq first, Yahoo fallback.
The client ticker repeats that order and scrolls it on the navy bar.

### 3.8 Daily brief (`scripts/generate-brief.ts`)

Claude if `ANTHROPIC_API_KEY` is set. The model may only summarize titles and summaries it was given, and cited URLs must exist in the input.

Fallback, in order:

1. Top trending story, skipping industry / labs / markets when an RIA-home item exists
2. First article from regulation, advisor tech, wealthtech, practice, compliance, then industry
3. Up to three more items from a variety order that prefers practice and advisor tech over labs

Headline prefix: `Today's top CFP AI story:`.

### 3.9 Quality gate (`scripts/check-data.ts`)

| Check | Value |
|-------|--------|
| Hard-fail feed OK ratio | 75% |
| Warn feed OK ratio | 85% |
| Max displayed item age | 30 days (hard fail) |
| Warn median age | 96 hours |
| Warn if REGULATION shows | fewer than 3 items |
| Warn if trending clusters | fewer than 4 |

### 3.10 Feed validator (`scripts/validate-feeds.ts`)

`npm run validate:feeds` checks liveness, parse, freshness, and redirects.
`feed-audit.yml` runs it weekly and can open or update a GitHub issue. It
does not block the hourly refresh. The same workflow runs
`npm audit --omit=dev --audit-level=high`.

## 4. Data contracts

`scripts/types.ts` and `src/lib/types.ts` must stay in sync.

`Article` includes optional `vendor`. `HeadlinesPayload` includes
`generatedAt`, `totalCount`, `trending`, `categories` (`articles`,
`articlesAll`, `fullCount` on the preview), `feedStats`, `leadUrl`, and
`partial` on the preview file.

### Storage (`ria-ai-report:`)

| Key | Purpose |
|-----|---------|
| `bookmarks` / `read-later` | Saved IDs |
| `article-snapshots` | Copies so saves survive the hourly refresh |
| `muted-sources` / `muted-categories` | Hides |
| `seen-articles` | Read-state LRU |
| `last-visit` | “N new since last visit” |
| `theme-v2` | `light` (default) or `dark`. The old `theme` key is ignored so the First Trust light theme wins once |
| `cache:headlines` / `cache:stocks` / `cache:brief` | sessionStorage stale-while-revalidate |

## 5. Client

Sticky chrome: skip link, navy header (logo, story count, bookmarks, later,
mutes, theme), silver search row, scrolling ticker, section chips.

Main well (white on the striped page):

- Left: lead story, then trending
- Right: daily brief, then latest
- Below: three columns, `CATEGORIES` index modulo 3

Bookmarks and read-later merge the live payload with snapshots. Search and
View All call `loadFull()`. Until `articlesAll` arrives, View All keeps the
preview rows. Mutes apply to columns, trending (promoting a related item),
the lead, and brief headline/bullets that cite a muted source.

`/` focuses search when the user is not already in a field.

## 6. Visual system

Sampled from ftportfolios.com and implemented the same way as XPND Drudge.

| Token | Light |
|-------|--------|
| Navy | `#2f4e75` → `#243b5a` |
| Deep navy text | `#002f5d` |
| Gold rule / REPORT word | `#edc339` |
| Link | `#00589f` |
| Orange markers (brief bullets, trending numbers, NEW) | `#f0902a` |
| Page | `#eeeeee` with a 1px `#dddddd` stripe every 5px |
| Siren (critical headlines, down moves on white) | `#cc0000` |

Dark theme remaps surfaces to navy (`#0e1b2a` / `#16273a`) and links to
`#6fb3e8`. The masthead stays navy with a gold rule in both themes.

Typeface is Arial / Helvetica. Section heads are silver gradients with a
navy left border (gold on the lead, red on trending). Headlines are blue
links with a dotted rule. Visited links go purple (`#5a3f96`). Vendor chips
are gold. Focus rings are orange.

There is no affiliation with First Trust or with Drudge Report. The footer
says so.

## 7. Categories (homepage order)

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

Age windows live in `AGE_WINDOWS`. Regulation, compliance, and research are
slow lanes (14–21 days). Industry and markets are fast (3–5 days).

## 8. Editorial rules

- Broad feeds use `AI_FILTER`. SEC and NASAA use `SUPERVISION_FILTER`. Fed, Treasury, OCC, FDIC, CFTC, and ESMA stay on `AI_FILTER` so rate decisions do not fill REGULATION.
- Kitces, Wealth Solutions Report, Huebscher, RIABiz, InvestmentNews, and the other advisor trades are filtered. An unfiltered Kitces essay must not open ADVISOR TECH.
- AI-section feeds that are already scoped (Finextra AI, ABA AI tag, PlanSponsor AI, American Banker AI) may omit `requireAny`.
- FINRA first-party RSS is Cloudflare-blocked. **GN: FINRA AI** is the stand-in, still passed through `AI_FILTER`.
- ThinkAdvisor, Advisor Perspectives, and Financial Brand were WAF-blocked. Do not re-add `/feed` without a new probe.
- Kitces is Feedburner (`feeds.feedburner.com/KitcesNerdsEyeView`).
- Vendor items set `vendor: true` and render a VENDOR badge. Trade press beats a wire twin of the same story when scores are close.
- Paywalled sources: headline and outbound link only. Never store or show article body text.

## 9. Failure modes

| Mode | Behavior |
|------|----------|
| One feed 403/429/timeout | Empty list for that source; others continue |
| Zero articles overall | Keep previous JSON |
| Google News unwrap miss | Keep the wrapper URL; grouping can still cluster on title |
| Regulator plus filter | Feed OK, 0 items — normal on a quiet week |
| VentureBeat 429 | Transient; the next hourly run retries |
| Missing `ANTHROPIC_API_KEY` | Fallback brief |
| Actions data commit during a local push | Merge; keep the CFP title strings |
