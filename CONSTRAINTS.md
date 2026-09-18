# CONSTRAINTS — RIA AI Report

Hard rules for every conversation in this folder.

## Separation

- Workspace is **only** `/Users/paulnelson/Documents/Development/RIA-AI-Drudge/`.
- Never edit, commit, push, or open a PR in `ai-drudge`, Jesus Report, or any
  other sibling aggregator.
- Do not share localStorage keys, session cache keys, or Git remotes with
  those projects. Prefix: `ria-ai-report:`.
- Do not copy live `public/data/*.json` from another site.

## Product voice

- Masthead: **RIA AI REPORT** (red, monospace, dense).
- Subhead: AI headlines for advisors, RIAs, and wealth professionals.
- Footer may say it is an aggregator with no affiliation to Drudge Report.
- Paywalled sources: headline + link only. Never reproduce body text.

## Layout

- Keep the current 3-column Drudge wire. Propose redesigns; do not ship them
  unasked.
- Preserve: bookmarks, read-later, mutes, read-state dimming, search,
  theme toggle, Feed Health, LATEST strip, Daily Brief, stock ticker,
  hover cards, View All, preview/full payload split.

## Pipeline

- Fetch only at build time (GitHub Actions / `npm run build:data`).
- Per-feed timeout + retries + per-host concurrency (Substack / Google News).
- Keyword router + age windows + diversity cap + Jaccard story grouping.
- Trending lead prefers a non-aggregator headline within ~10% of top score.
- Unwrap Google News / hnrss URLs when possible.
- `build:check` is a quality gate. Tune thresholds; do not delete the gate.

## Editorial

- Regulator primary sources outrank law-firm summaries.
- Prefer original reporting over PR-wire copies of the same announcement.
- Vendor/sponsor items belong in VENDOR WATCH (or tagged in the source name).
- Dedup by URL and by Jaccard title clusters.

## GitHub (later)

- After the owner reviews a first look: new **public** repo, commit, push,
  GitHub Pages — same pattern as the other aggregators.
- Do not create the remote or Pages until asked.
- When the repo name is known, set `vite.config.ts` `base` and Atom `SITE_URL`.
