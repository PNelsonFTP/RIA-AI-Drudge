# RIA AI Report — Handoff

Operations guide. Last updated: 2026-09-18 (first local run).

## Quick reference

| Item | Value |
|------|-------|
| Public name | **CFP AI REPORT** |
| Local path | `/Users/paulnelson/Documents/Development/RIA-AI-Drudge/` |
| Local URL | http://127.0.0.1:5173/RIA-AI-Drudge/ |
| Git remote | https://github.com/PNelsonFTP/RIA-AI-Drudge |
| Pages | https://pnelsonftp.github.io/RIA-AI-Drudge/ (`base: "/RIA-AI-Drudge/"`, `SITE_URL` set) |
| Hourly workflow | `.github/workflows/refresh.yml` (cron `5 * * * *`) |
| Weekly feed audit | `.github/workflows/feed-audit.yml` (Mondays 12:00 UTC) |
| Node (CI) | 22 |
| Optional secret | `ANTHROPIC_API_KEY` — Claude brief; fallback works without it |
| Sibling (do not edit) | `/Users/paulnelson/Documents/Development/ai-drudge/` |

## Local development

```bash
cd /Users/paulnelson/Documents/Development/RIA-AI-Drudge
npm ci          # or npm install
npm run build:data
npm run build:check
npm run dev     # http://localhost:5173/
```

Production-shaped build (no Pages path yet):

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

### npm scripts

| Script | Purpose |
|--------|---------|
| `dev` | Vite dev server (`base: "/"`) |
| `build` | `tsc -b` + Vite → `dist/` |
| `build:data` | Fetch feeds + stocks + HN + brief |
| `build:check` | Quality gate on `public/data/headlines.json` |
| `validate:feeds` | Per-URL liveness / parse / freshness |
| `test` | unwrapUrl + trending-lead unit tests |
| `sbom` | Refresh `docs/SBOM.json` + table in `docs/SBOM.md` |
| `typecheck` | `tsc --noEmit` |
| `preview` | Serve `dist/` |

## Public repo + Pages

Created 2026-09-18 as [PNelsonFTP/RIA-AI-Drudge](https://github.com/PNelsonFTP/RIA-AI-Drudge).
Pages deploys from `refresh.yml`. Optional: add repo secret `ANTHROPIC_API_KEY`.
After hourly CI is green for a few days, raise `check-data.ts` `minFeedOkRatio` toward 0.80.

## Add or fix a feed

1. Edit `SOURCES` in `scripts/sources.ts`. Broad outlets need `requireAny: AI_FILTER`.
2. `npm run validate:feeds` — want `OK` and a recent newest item (regulators may be empty after the AI filter).
3. `npm run build:data && npm run build:check`
4. Probe notes: [FEED_PROBE_CURATED.md](./FEED_PROBE_CURATED.md),
   [FEED_PROBE_EXTRA.md](./FEED_PROBE_EXTRA.md)

Do **not** blindly restore these — they failed live probes on 2026-09-18:

| Source | Why |
|--------|-----|
| FINRA first-party RSS | Cloudflare 403 — use `GN: FINRA AI` |
| ThinkAdvisor, Advisor Perspectives, Financial Brand, ETF.com, BenefitsPRO | WAF 403 |
| AI Advisor Stack, Fintech Brainfood | Beehiiv `rss_url: null` |
| Institutional Investor, AI-CIO | Stale |
| OCC old URL `/rss/occ.xml` | 404 — working URL is `/rss/occ_news.xml` |
| Kitces `kitces.com/feed/` | 403 — use Feedburner |
| Wirehouse / BlackRock / Schwab / Fidelity newsrooms | No public RSS |
| Law-firm insight RSS (Sidley, Davis Polk, Morgan Lewis, …) | 403/404 |

## Tune the homepage

| Goal | File |
|------|------|
| Section order / labels | `CATEGORIES` in `scripts/sources.ts` |
| Extra routing | `KEYWORDS` in `scripts/sources.ts` |
| Age / min items | `AGE_WINDOWS` |
| AI keyword filter | `AI_FILTER` + `requireAny` on a source |
| Lead fallback order | `src/App.tsx` (`regulation`, `industry`, `advisor_tech`, …) |
| Ticker symbols | `scripts/fetch-stocks.ts` |
| Scoring weights | `scripts/lib/score.ts` |

## Known-benign first-run behavior

| Symptom | Cause |
|---------|-------|
| REGULATION shows few items | Most regulator feeds are AI-filtered; quiet weeks are normal |
| OCC / FDIC / Fed / CFTC "OK, 0 items" | Parse succeeded; no AI-keyword hit in the latest items |
| Trending often 1 cluster | Jaccard + 72h gate; RIA overlap is thinner than general AI news |
| Brief cites an off-theme FT/tech line | Fallback samples INDUSTRY/MARKETS; improve in brief/filter work |
| VentureBeat FAIL 429 | Rate limit; transient |
| Google News links still on `news.google.com` | Unwrap resolves ~25% of GN URLs; rest stay wrapped |
| AISI / Gray Swan in the fetch log | Leftover scrapers; not RIA-core |

## Troubleshooting

| Problem | Action |
|---------|--------|
| "Loading headlines…" forever | Confirm `public/data/headlines-preview.json` exists; `npm run build:data` |
| Section empty | Footer Feed Health; then `feedStats` in `headlines.json` |
| One source flooding | Already capped; tighten `requireAny` or drop the feed |
| Typecheck fail | Keep `scripts/types.ts` and `src/lib/types.ts` CategoryId unions in sync |
| Ticker dashes | Stooq + Yahoo both missed that symbol; next rebuild retries |
| Stale-data banner | Last `generatedAt` > 6h — rerun `build:data` (or hourly Actions later) |

## File ownership

| Area | Files |
|------|-------|
| Feeds, categories, keywords, AI filter | `scripts/sources.ts` |
| Fetch + `requireAny` | `scripts/fetch-feeds.ts` |
| Score / route / group / unwrap | `scripts/lib/*` |
| Scrapers | `scripts/scrape-sources.ts` |
| Brief / stocks / Atom | `generate-brief.ts`, `fetch-stocks.ts`, `lib/emitFeed.ts` |
| Quality / audit / SBOM | `check-data.ts`, `validate-feeds.ts`, `report-feed-audit.ts`, `generate-sbom.ts` |
| Homepage | `src/App.tsx`, `src/components/*` |
| Persistence | `src/hooks/*` (`ria-ai-report:` keys) |
| CI | `.github/workflows/*.yml` |
| Curated editorial list | `ai-news-sources-RIA.md` |

## Access

| Credential | Required? |
|------------|-----------|
| GitHub write on the **new** repo (later) | Yes, for Pages |
| `ANTHROPIC_API_KEY` | No |
| Feed API keys | None |

## Document index

See [README.md](./README.md).
