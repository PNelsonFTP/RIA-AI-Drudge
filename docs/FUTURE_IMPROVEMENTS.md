# RIA AI Report — Future Improvements

Roadmap after the 2026-09-18 first run. None of these block a local first look.
Priorities: **P1** do first (especially go-live), **P2** meaningful, **P3** larger.

---

## P1 — Go-live and editorial quality

### 1. Public GitHub repo + GitHub Pages

**Problem:** The site is local-only. Workflows will not run until a remote exists.

**Proposal:** New **public** repository (do not attach AI Drudge’s remote). Set
`vite.config.ts` `base` to `/<repo>/`, `SITE_URL` in `emitFeed.ts`, push `main`,
enable Pages from `refresh.yml`. Prompt: [FOLLOW_UP_PROMPTS.md](../FOLLOW_UP_PROMPTS.md) §2.

**Acceptance:** Public Pages URL loads; header “updated Xm ago” after the first
Actions run; footer Feed Health matches CI `feedStats`.

### 2. Tighten the quality gate for CI

**Problem:** `check-data.ts` `minFeedOkRatio` is 0.40 so a first-run list could
ship. After Pages, that is too loose.

**Proposal:** Raise toward 0.80 / warn 0.90 once hourly CI is green for a few days.
Keep the 30-day max-age hard fail.

**Acceptance:** A sudden drop to “half the feeds dead” fails the hourly job.

### 3. Regulator signal without starving REGULATION

**Problem:** SEC/Fed/OCC/FDIC/CFTC often parse OK but yield **0 items** after
`AI_FILTER`. The right column is thin except for Google News + EU AI Act.

**Proposal:** For tier-4 primary sources, either (a) drop `requireAny` and
down-rank off-topic items, or (b) keep a dedicated “all exam/enforcement”
lane plus the AI filter. Prefer linking the **primary** URL when GN and SEC
both have the story.

**Acceptance:** REGULATION has ≥4 on-topic items on a typical weekday without
filling with unrelated rate-decision headlines.

### 4. FINRA / WAF-blocked trade press

**Problem:** FINRA, ThinkAdvisor, Advisor Perspectives, Financial Brand have
no reachable first-party RSS from this environment.

**Proposal:** Retry from Actions IPs after go-live; add FINRA HTML scrape
(notices + AI key-topic page) if RSS stays 403; keep GN queries as backup.

**Acceptance:** At least one first-party FINRA item path, or a documented
decision to stay on GN.

### 5. Finance-relevance filter for labs / general AI

**Problem:** LABS and INDUSTRY can dominate the brief and LATEST with model
and gadget stories (e.g. Raspberry Pi on FT AI). Advisors need “what’s coming”
but not every lab post.

**Proposal:** Optional second filter on tier-7 feeds: keep items matching
models/agents/regulation/enterprise/security **or** finance/RIA keywords.
Retune `generate-brief.ts` variety order and system prompt for RIA voice.

**Acceptance:** Fallback brief no longer leads with off-theme consumer tech
when a wealthtech/reg story is in the payload.

### 6. Trending density

**Problem:** First-run builds often show **1** trending cluster (Jaccard ≥ 0.4
and ≥2 sources inside 72h).

**Proposal:** Slightly relax title Jaccard for GN-vs-publisher twins after
unwrap; ensure unwrap coverage on the RIA query feeds; allow a 120h backfill
sooner when clusters < 3.

**Acceptance:** ≥3 trending rows on a normal news day.

### 7. Visible vendor tag

**Problem:** Constraints ask for a sponsor/vendor label. Today that is only
`(vendor)` in the source name.

**Proposal:** `vendor?: boolean` on `FeedSource` / `Article` and a small badge
on `Headline.tsx`. Prefer trade-press originals over Business Wire twins in
grouping.

**Acceptance:** Envestnet/eMoney/Docupace (and GN wire copies) are visually
distinct from Kitces/RIABiz.

### 8. npm audit on the first-run lockfile

**Problem:** `npm install` reported high/moderate advisories in the cloned
lockfile (Vite/esbuild family — confirm current `npm audit`).

**Proposal:** Upgrade patched Vite/Tailwind/tsx as needed; keep the weekly
`npm audit --omit=dev --audit-level=high` gate in `feed-audit.yml`.

**Acceptance:** Production audit high+ is clean, or residual issues are
documented with a reason.

---

## P2 — Sources and product

### 9. Drop or replace leftover AI-Drudge scrapers

UK AISI and Gray Swan are not RIA-core. Replace with FINRA/Citywire/Schwab
Advisor HTML if those stay feedless.

### 10. Wirehouse / custodian / AM newsrooms

Morgan Stanley, JPM, BlackRock, Vanguard Advisors, Fidelity, Schwab, UBS,
Wells Fargo, Goldman: **no public RSS** in the 2026-09-18 probe. Add
listing-page scrapers only where cards are stable (budget ~50 lines/site).

### 11. Wealthtech vendor newsrooms

Jump, Zocks, Orion, Altruist, Wealthbox, Nitrogen, TIFIN, Hadrius, etc.
[FEED_PROBE_VENDORS.md](./FEED_PROBE_VENDORS.md) kept **18** first-party feeds.
Wired 2026-09-18: Envestnet, Docupace, eMoney, Orion, Advisor360, Altruist,
Wealthbox, TIFIN, Vanilla, Wealth.com, Nitrogen, Practifi, SS&C, Debevoise
Data Blog, Ncontracts Nsight. Remaining gap: Jump/Zocks/Webflow AI-natives
(no RSS) — scrape or leave on Google News.

### 12. Podcast / newsletter bridge

Tier 2 audio (AI for Advisors, WealthStack) and email-only (Inside Information,
Finpresso) need podcast RSS or an inbox-to-feed bridge. Easy to flood LATEST
with episode titles — keep a `podcasts` sidebar or a long age window.

### 13. Citywire RIA scrape

Marked scrape in the curated list; bot-walled in the extra probe. Worth a
second pass from Actions IPs.

### 14. Google News unwrap rate

Only ~40/165 GN URLs resolved on the last local build. Improve batchexecute
resolve / caching so publisher URLs dedupe against first-party feeds.

### 15. OPML export

Emit `public/feeds.opml` from `SOURCES` at build time.

### 16. localStorage backup / restore

Export/import JSON from the mute/manage panel so bookmarks survive a browser wipe.

### 17. Full-text search index

`search-index.json` lazy-loaded on first keystroke (titles + summaries of
`articlesAll`).

### 18. PWA

Re-add `vite-plugin-pwa` deliberately (manifest “RIA AI REPORT”, SWR for
`data/*.json`). Test iOS Safari before shipping.

### 19. Column / keyword tuning after a week of live data

Practice vs wealthtech bleed, compliance thinness, vendor vs industry
duplicates. Adjust `KEYWORDS` and `CATEGORIES` order without changing the wire.

---

## P3 — Larger

### 20. Major dependency upgrades

Vite 8, `@vitejs/plugin-react` 6, TypeScript 6 — one at a time with a visual check.

### 21. Custom domain

`CNAME` + `base: "/"` after a domain decision.

### 22. Privacy-preserving analytics

Plausible or Cloudflare Web Analytics. No cookies.

### 23. Shared types

`scripts/types.ts` and `src/lib/types.ts` are duplicated on purpose (browser
must not import Node fetch code). Codegen or a tiny shared `.d.ts` would help.

### 24. Data-only branch for hourly JSON commits

Once Pages cron is live, `public/data/` commits will dominate `main` history
(same as the other aggregators). Optional orphan/data branch.

---

## Technical debt register

| Item | Location | Notes |
|------|----------|-------|
| Duplicate `types.ts` | `scripts/` + `src/lib/` | Manual sync of `CategoryId` |
| Tests | `scripts/lib/*.test.ts` | Only unwrap + trending lead; no `requireAny` tests |
| Scraper fragility | `scrape-sources.ts` | Weekly audit does not cover HTML scrapers |
| `check-data` first-run thresholds | `check-data.ts` | 40% OK ratio — raise after CI |
| Placeholder Pages URL | `emitFeed.ts` | `pnelsonftp.github.io/RIA-AI-Drudge/` guessed |
| `base: "/"` | `vite.config.ts` | Must change for project Pages |
| Probe scripts in tree | `scripts/probe_curated_feeds.py`, `_probe_work/`, `discovered-*.json` | Research artifacts; keep or gitignore |
| Trending thin | `router.ts` | See P1.6 |
| GN unwrap incomplete | `unwrapUrl.ts` | See P2.14 |
| Vendor badge missing | `Headline.tsx` | See P1.7 |
| AISI / Gray Swan scrapers | `scrape-sources.ts` | See P2.9 |

---

## How to propose new items

Add: problem, proposal, acceptance, priority. Link a GitHub issue after the
repo exists.
