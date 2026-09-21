# CFP AI Report — Handoff

Operations guide. Last updated: **2026-09-21**.

Public name **CFP AI REPORT**. Repo and Pages path remain `RIA-AI-Drudge`.
Do not rename the GitHub repo or the `ria-ai-report:` storage prefix unless
you also plan a bookmark migration.

## Quick reference

| Item | Value |
|------|-------|
| Public name | **CFP AI REPORT** |
| Local path | `/Users/paulnelson/Documents/Development/RIA-AI-Drudge/` |
| Local URL | http://127.0.0.1:5173/RIA-AI-Drudge/ |
| Git remote | https://github.com/PNelsonFTP/RIA-AI-Drudge |
| Pages | https://pnelsonftp.github.io/RIA-AI-Drudge/ |
| Vite `base` | `/RIA-AI-Drudge/` (`vite.config.ts`) |
| Atom `SITE_URL` | `https://pnelsonftp.github.io/RIA-AI-Drudge/` (`scripts/lib/emitFeed.ts`) |
| Hourly workflow | `.github/workflows/refresh.yml` — cron `5 * * * *`, also on push to `main` |
| Weekly feed audit | `.github/workflows/feed-audit.yml` — Mondays 12:00 UTC |
| Node (CI) | 22 |
| Optional secret | `ANTHROPIC_API_KEY` — Claude brief; fallback works without it |
| Sibling (do not edit) | `/Users/paulnelson/Documents/Development/ai-drudge/` |

`origin` **is** GitHub. There is no separate Cursor Origin host for this
site. Pages is what serves https://pnelsonftp.github.io/RIA-AI-Drudge/.

## Local development

```bash
cd /Users/paulnelson/Documents/Development/RIA-AI-Drudge
npm ci
npm run build:data
npm run build:check
npm run dev
```

Production-shaped check before a push:

```bash
npm run typecheck
npm test
npm run build
```

`npm test` runs `scripts/lib/unwrapUrl.test.ts`, `router.test.ts`,
`requireAny.test.ts`, and `groupStories.test.ts`. If `tsx --test` fails with
an IPC error in a sandbox, use `node --import tsx --test` on those files.

### npm scripts

| Script | Purpose |
|--------|---------|
| `dev` | Vite dev server |
| `build` | `tsc -b` + Vite → `dist/` |
| `build:data` | Fetch feeds + stocks + HN + brief |
| `build:check` | Quality gate on `public/data/headlines.json` |
| `validate:feeds` | Per-URL liveness / parse / freshness |
| `test` | Unwrap, router, keyword gate, grouping |
| `sbom` | Refresh `docs/SBOM.json` and the table in `docs/SBOM.md` |
| `typecheck` | `tsc --noEmit` |
| `preview` | Serve `dist/` |

## Deploy

A push to `main` starts **Refresh and deploy**:

1. Typecheck, test, `build:data`, `build:check`
2. Commit refreshed `public/data` and `public/feed.xml` if they changed (`chore(data): refresh …`)
3. `npm run build` and deploy `dist/` to GitHub Pages

Do not force-push `main`. Hourly data commits land on `main`; pull or merge
before pushing local work, and keep the **CFP** title if `brief.json` or
`feed.xml` conflicts with a bot refresh (the bot still emits whatever
`generate-brief.ts` / `emitFeed.ts` say at that commit).

Watch a run:

```bash
gh run list --repo PNelsonFTP/RIA-AI-Drudge --limit 5
gh run watch <id> --repo PNelsonFTP/RIA-AI-Drudge --exit-status
```

Confirm the live title:

```bash
curl -sS https://pnelsonftp.github.io/RIA-AI-Drudge/ | head
```

Expect `<title>CFP AI REPORT</title>`. Hard-refresh if a browser tab is stale
(Pages cache is about 10 minutes).

## Add or fix a feed

1. Edit `SOURCES` in `scripts/sources.ts`.
   - Broad outlets: `requireAny: AI_FILTER`.
   - SEC Press, SEC Speeches, NASAA: `requireAny: SUPERVISION_FILTER` (AI plus exam/enforcement, not every adviser-admin headline).
   - Noisy AI letters (Ben's Bites, Stratechery, FT AI, Import AI, TLDR): `requireAny: FINANCE_OR_ENTERPRISE`.
   - Vendor blogs: `vendor: true` and usually `requireAny: AI_FILTER`.
   - Google News FINRA/SEC queries: `requireAny: AI_FILTER` so bond tickers and generic FINRA hits do not land in REGULATION.
2. `npm run validate:feeds` — want `OK` and a recent newest item. Regulators may be empty after the filter; that is success, not a dead feed.
3. `npm run build:data && npm run build:check`.
4. Probe notes (2026-09-18, still the source of “do not retry blindly”):
   [FEED_PROBE_CURATED.md](./FEED_PROBE_CURATED.md),
   [FEED_PROBE_EXTRA.md](./FEED_PROBE_EXTRA.md),
   [FEED_PROBE_VENDORS.md](./FEED_PROBE_VENDORS.md).

Do **not** re-add these without a new successful probe:

| Source | Why |
|--------|-----|
| FINRA `rss.xml` | 200 on 2026-09-21, but items are 2019–2020 FAQs and PDF filenames. Notices are scraped instead. `GN: FINRA AI` stays. |
| ThinkAdvisor, Advisor Perspectives, Financial Brand | Cloudflare 403 on 2026-09-21. Do not guess paths. |
| Citywire `/ria/` | 200 with a 212-byte empty shell on 2026-09-21. Skip. |
| ThinkAdvisor, Advisor Perspectives, Financial Brand, ETF.com, BenefitsPRO | WAF 403 |
| AI Advisor Stack, Fintech Brainfood | Beehiiv `rss_url: null` |
| Institutional Investor, AI-CIO | Stale at probe time |
| OCC `/rss/occ.xml` | 404 — working URL is `/rss/occ_news.xml` |
| Kitces `kitces.com/feed/` | 403 — use Feedburner |
| White House, NVIDIA newsroom, Business Wire firehose | Dropped; not RIA-core. NVIDIA may appear only inside the markets GN query |
| UK AISI, Gray Swan | Dropped scrapers |
| Wirehouse / BlackRock / Schwab / Fidelity newsrooms | No public RSS verified |
| Law-firm insight RSS (Sidley, Davis Polk, Morgan Lewis, …) | 403/404 |

## Tune the homepage

| Goal | Where |
|------|--------|
| Section order / labels | `CATEGORIES` in `scripts/sources.ts` |
| Extra routing | `KEYWORDS` |
| Age / min items | `AGE_WINDOWS` |
| AI keyword filter | `AI_FILTER`, `SUPERVISION_FILTER`, `FINANCE_OR_ENTERPRISE` |
| Short-token matching (`AI`, `GPT`, `LLM` vs “available”) | `scripts/lib/requireAny.ts` |
| Site lead rank | `RIA_LEAD_RANK` in `scripts/lib/router.ts` (regulation first) |
| Client lead fallback if `leadUrl` is muted | `src/App.tsx` |
| Vendor junk (Shopify, Dreamforce, PtEverywhere) | `allowInBucket` in `router.ts` |
| Press over wire within ~10% | `groupStories.ts` and `pickTrendingLead` |
| Ticker symbols | `scripts/fetch-stocks.ts` and `ORDER` in `src/components/StockTicker.tsx` |
| Scoring weights | `scripts/lib/score.ts` |
| Colors / chrome | `src/styles.css` (First Trust tokens) |
| Quality gate | `scripts/check-data.ts` |

## Quality gate

`npm run build:check` hard-fails when:

- feed OK ratio is under **75%**
- any displayed item is older than **30 days**
- more than half of sections are empty
- `totalCount` is 0

Warnings (still exit 0): median age over 96h, OK ratio under 85%, zero-item
OK feeds, REGULATION under 3 displayed items, trending under 4 clusters.
Zero-item regulator feeds after `requireAny` are expected on quiet days.

## Normal homepage behavior

| What you should see | Notes |
|---------------------|--------|
| Masthead **CFP AI** + gold **REPORT** | First Trust navy bar, gold underline |
| Ticker order | BLK, SCHW, MS, JPM, AMP, LPLA, then NVDA, MSFT |
| Lead | A regulation / advisor-tech / wealthtech story when one exists under 72h |
| Brief headline | Same voice; fallback starts `Today's top CFP AI story:` |
| REGULATION | On-topic SEC / FINRA / NASAA / compliance items; not FOMC rate decisions |
| Displayed links | Publisher URLs. Google News wrappers are unwrapped (cap is at least 160, or every unique GN URL) |
| VENDOR badge | Gold chip on `vendor: true` sources and the vendors column |
| View All | Keeps preview rows until the full JSON arrives |
| Mute | Hides that source in columns, trending, lead, and brief citations |

## Troubleshooting

| Problem | Action |
|---------|--------|
| “Loading headlines…” forever | `public/data/headlines-preview.json` must exist; `npm run build:data` |
| Old red monospace masthead | Hard-refresh. Theme key is `ria-ai-report:theme-v2` (light default) |
| Section empty | Footer **feeds OK**, or `feedStats` in `headlines.json` |
| One source flooding | Diversity cap is already on; tighten `requireAny` or drop the feed |
| Typecheck fail | Keep `scripts/types.ts` and `src/lib/types.ts` in sync, including `vendor?` |
| Ticker dashes | Stooq and Yahoo both missed that symbol; the next rebuild retries |
| Stale-data banner | `generatedAt` older than 6 hours — wait for Actions or rerun `build:data` |
| Push rejected | `git fetch` and merge `origin/main`. Hourly bot commits land between local commits |
| Pages still shows the previous title | Wait for the Actions deploy (about a minute) and bypass cache |

## File ownership

| Area | Files |
|------|-------|
| Feeds, categories, keywords, filters | `scripts/sources.ts` |
| Fetch, GN priority, dedup | `scripts/fetch-feeds.ts` |
| Score / route / group / unwrap / brief gate | `scripts/lib/*` |
| Scrapers | `scripts/scrape-sources.ts` (Anthropic only) |
| Brief / stocks / Atom | `generate-brief.ts`, `fetch-stocks.ts`, `lib/emitFeed.ts` |
| Quality / audit / SBOM | `check-data.ts`, `validate-feeds.ts`, `report-feed-audit.ts`, `generate-sbom.ts` |
| Homepage chrome | `src/App.tsx`, `src/styles.css`, `src/components/*` |
| Persistence | `src/hooks/*` |
| CI | `.github/workflows/*.yml` |
| Curated editorial list | `ai-news-sources-RIA.md` |

## Access

| Credential | Required? |
|------------|-----------|
| GitHub write on `PNelsonFTP/RIA-AI-Drudge` | Yes, to push `main` and ship Pages |
| `ANTHROPIC_API_KEY` | No |
| Feed API keys | None |

## Document index

See [README.md](./README.md).
