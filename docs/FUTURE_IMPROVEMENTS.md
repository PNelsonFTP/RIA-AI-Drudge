# CFP AI Report — Future Improvements

Updated **2026-09-21**. The first-look list from 2026-09-18 is mostly shipped.
What remains is source coverage, history hygiene, and a few product extras.
None of these block the live site.

Priorities: **P1** next, **P2** useful, **P3** larger.

---

## Shipped (do not re-open as if they were undone)

| Item | Where it landed |
|------|-----------------|
| Public repo + GitHub Pages | https://github.com/PNelsonFTP/RIA-AI-Drudge and https://pnelsonftp.github.io/RIA-AI-Drudge/ |
| `base` and Atom `SITE_URL` | `/RIA-AI-Drudge/` and the Pages URL |
| Quality gate tightened | `check-data.ts`: hard-fail under 75% feeds OK, warn under 85%, 30-day max age |
| Regulator filter | `SUPERVISION_FILTER` on SEC/NASAA; Fed/Treasury/OCC stay on `AI_FILTER`; GN FINRA/SEC also filtered. Weekday REGULATION runs are on-topic (SEC, FINRA, NASAA) with no FOMC pile-up |
| RIA / CFP voice for lead and brief | `RIA_LEAD_RANK`; brief skips a generic trending cluster when a home-category story exists. Masthead is **CFP AI REPORT** |
| Trending lead quality | Press over aggregator, vendor, and wire within ~10% (`pickTrendingLead`, `groupStories`) |
| Vendor badge | `vendor?: boolean` and a gold VENDOR chip |
| Google News unwrap | Cap is at least 160 and at least the unique GN URL count; SEC/FINRA/RIA/wealth unwrapped first. Displayed `news.google.com` links on the 2026-09-20 rebuild were 0 |
| Drop AISI, Gray Swan, White House, NVIDIA newsroom, Business Wire firehose | Scrapers are Anthropic-only. Vendor column cages Shopify / PtEverywhere / Dreamforce |
| `requireAny` token fix | “AI …” at the start of a title matches; “available” does not |
| First-paint bugs | Wealth ticker order, View All keeps preview rows, lead reads `articles` before empty `articlesAll`, mutes apply to trending / lead / brief |
| First Trust / XPND chrome | `src/styles.css`, light default, `ria-ai-report:theme-v2` |
| Tests | unwrap, router (including lead rank and vendor cage), `requireAny`, `groupStories` |
| Podcasts | AI for Advisors and RIA Collective RSS are wired (they can still return 0) |

---

## Done 2026-09-21

| Item | Result |
|------|--------|
| P1.1 FINRA | `https://www.finra.org/rss.xml` is 200 but stale FAQs plus PDF filenames. The notices table is scraped and kept only when the description matches supervision/AI terms other than the word “finra” itself. On 2026-09-21 that list had no AI title (TRACE, elections, margin), so the scrape is OK / 0 and `GN: FINRA AI` remains the stand-in until a matching notice is published. |
| P1.2 Trade press | Re-probed 2026-09-21. **Skip** ThinkAdvisor `/feed/` and `/artificial-intelligence/feed/` (403 Cloudflare). **Skip** Advisor Perspectives `/feed`, `/rss`, `/articles` (403 Cloudflare). **Skip** Financial Brand `/feed/` and `/rss/` (403 Cloudflare). No new URLs were guessed. |
| P1.3 Audit | `npm audit fix` on the toolchain. Re-run `npm test`, `npm run build`, and `npm run sbom`. Remaining high findings, if any, are listed in [SBOM.md](./SBOM.md). |
| P1.4 Trending | Strict window stays 72h. Backfill to 120h runs only when fewer than 3 clusters are inside 72h. Jaccard stays 0.4. `check-data` warns below 3, which is the observed floor. |
| P2.5 Wirehouses | Re-probed 2026-09-21. **Skip** Morgan Stanley press (403), Schwab pressroom (403 Cloudflare), Wells Fargo newsroom (403 Cloudflare). **Skip** JPM stories, BlackRock newsroom, Vanguard advisor insights, UBS media, and Goldman pressroom: HTML returned, but the cards are navigation or marketing, not a stable dated news list. Fidelity’s press list flickered to an empty body on retry, so it was not wired. |
| P2.6 Jump and Zocks | No RSS (Jump `/feed` 404, Zocks `/feed` 404). Blog cards are scraped: `https://jump.ai/blog` and `https://www.zocks.io/resources/blog`, AI-filtered, vendor badge. `GN: wealth AI vendors` already queries Jump and Zocks. |
| P2.7 Citywire | Re-probed 2026-09-21. `https://citywire.com/ria/`, `/ria/rss`, and `https://www.citywire.com/ria/` all returned **200 with a 212-byte empty shell**. **Skip.** |
| P2.10 Search | `public/data/search-index.json` is written at build time. The client fetches it on search focus or the first character, and does not download `headlines.json` just to search. |
| P2.11 PWA | `vite-plugin-pwa`, manifest name **CFP AI REPORT**, runtime cache `cfp-ai-report-data-v1` (stale-while-revalidate for `data/*.json`). Icons are this site’s navy/gold mark, not another aggregator’s. Desktop installability can be checked from the production build. iOS Safari was not available in this environment; the apple-touch icon is `icon-192.png`. |

---

## P2 — Still open

### 8. OPML export

Emit `public/feeds.opml` from `SOURCES` during `build:data`.

### 9. Bookmark backup

Export and import JSON from the mutes panel so bookmarks survive a browser wipe.
Keep the `ria-ai-report:` prefix in the file so a restore cannot be loaded into
another aggregator by accident.

### 10. Search index

`search-index.json` of titles and summaries, loaded on the first keystroke,
so search does not depend on the full headlines file more than it already does.

### 11. PWA

`vite-plugin-pwa` with manifest name **CFP AI REPORT** and stale-while-revalidate
for `data/*.json`. Test iOS Safari before shipping. Do not reuse another
site’s cache name.

### 12. Column tuning from live data

After more weekday payloads: practice vs wealthtech bleed, ETF Trends inside
ADVISOR TECH, Abnormal Returns linkdumps in the brief variety slots. Adjust
`KEYWORDS` and `allowInBucket`. Do not change the three-column wire.

---

## P3 — Larger

### 13. Dependency majors

Vite 8, `@vitejs/plugin-react` 6, TypeScript 6 — one at a time, with a visual
check of the First Trust chrome.

### 14. Custom domain

`CNAME` plus `base: "/"` only after a domain is chosen. Update `SITE_URL` in
the same change.

### 15. Privacy-preserving analytics

Plausible or Cloudflare Web Analytics. No cookies, no third-party requests
from the article page beyond the analytics snippet.

### 16. Shared types

`scripts/types.ts` and `src/lib/types.ts` are duplicated so the browser bundle
does not import Node fetch code. A tiny shared declaration file would catch
drift. `CategoryId` and `vendor?` must move together.

### 17. Data-only history

Hourly `chore(data): refresh` commits already dominate `main`, same as the
other aggregators. An orphan data branch is optional and would change how
Pages is built. Do not do it casually.

---

## Technical debt

| Item | Location | Notes |
|------|----------|-------|
| Duplicate `types.ts` | `scripts/` and `src/lib/` | Manual sync |
| HTML scrapers outside the feed audit | `scrape-sources.ts` | Weekly audit hits RSS URLs only |
| Probe artifacts | `scripts/probe_*.py`, `scripts/_probe_work/`, `scripts/discovered-*.json` | 2026-09-18 research. Keep for the “do not re-add” list |
| Original prompts | `INITIAL_PROMPT.md`, `FOLLOW_UP_PROMPTS.md` | Still say “RIA AI Report” and “Pages later”. Live docs are this folder |
| Theme key split | `useTheme.ts` | `theme-v2` on purpose; do not write the old `theme` key again |
| fast-xml-parser advisory | devDependency | Build-time XML parse only. See P1.3 |
| Actions Node 20 deprecation warning | `refresh.yml` | checkout/setup-node/deploy-pages still target Node 20 actions; runners force Node 24. Bump action majors when they ship Node 24 tags |

---

## How to add an item

Write the problem, the proposed change, and how to know it worked. Link a
GitHub issue on `PNelsonFTP/RIA-AI-Drudge` when one exists. Do not file work
against the AI Drudge repo.
