# INITIAL PROMPT — RIA AI Report

Paste this into a **new** Cursor conversation whose workspace is
`/Users/paulnelson/Documents/Development/RIA-AI-Drudge/`.

Do **not** open or edit `/Users/paulnelson/Documents/Development/ai-drudge`.
This site is a sibling project. Same *kind* of layout and pipeline; separate
git history, branding, sources, localStorage keys, and GitHub Pages repo.

---

## Task

Build **RIA AI Report**, a Drudge-style three-column static aggregator for
financial professionals (RIAs, broker-dealers, advisors, wealth/asset
management) who need to keep up on AI: advisor tools, wealthtech, regulation,
compliance, bank/fintech AI, and AI as an investment theme.

Read first:

- `CONSTRAINTS.md`
- `ai-news-sources-RIA.md` (curated tiers 1–9 — consider every RSS-capable source)
- `FOLLOW_UP_PROMPTS.md` (later, not day one)

Then implement a first-run site that a human can open locally (`npm run dev`)
and later publish to a **new** public GitHub repo + GitHub Pages. Do not
create the GitHub remote or Pages site until the owner asks.

## Product

| | |
|---|---|
| Public name | **RIA AI REPORT** |
| Folder | `/Users/paulnelson/Documents/Development/RIA-AI-Drudge/` |
| Future Pages path (placeholder) | `/RIA-AI-Drudge/` — use `base: "/"` until the repo name is confirmed |
| Audience | Brokers, RIAs, BDs, wealth/asset management |
| Cadence | Hourly rebuild in GitHub Actions; browser only loads static JSON |

## Architecture to clone (do not import the other repo)

Vite 6 + React 19 + TypeScript + Tailwind v4. All RSS/HTML/API fetch at
**build time**. Client: SWR + sessionStorage, preview/full JSON split,
bookmarks, read-later, mutes, read-state, search, theme, Feed Health,
LATEST strip, Daily Brief, stock ticker, 3-column category grid.

Homepage layout must stay Drudge-dense: masthead, ticker, brief, trending,
lead, LATEST, then 3 columns. Do not invent a dashboard or card grid.

## Categories (homepage order)

1. `advisor_tech` — ADVISOR TECH
2. `industry` — INDUSTRY NEWS
3. `regulation` — REGULATION
4. `wealthtech` — WEALTHTECH
5. `practice` — PRACTICE & RIA
6. `compliance` — COMPLIANCE
7. `banking_fintech` — BANKING & FINTECH
8. `markets` — AI MARKETS
9. `institutional` — INSTITUTIONAL
10. `labs` — LABS & MODELS
11. `research` — RESEARCH
12. `vendors` — VENDOR WATCH

Left column ≈ practice/wealthtech. Center ≈ industry/breaking. Right ≈
regulation/compliance. Trending + lead sit above the grid.

## Sources

1. Probe every RSS-marked row in `ai-news-sources-RIA.md`. Keep only live,
   parseable feeds. Skip email-only and paywall-body sources except headlines
   if a public feed exists.
2. Add your own researched feeds: regulators, trade press, bank/fintech,
   wirehouse/custodian newsrooms, consultancies, labs, Google News queries,
   PR wires filtered to wealth/RIA/AI.
3. Broad feeds (tiers 3, 5, 6, 7, 8) must use `requireAny` AI-keyword
   filters. Word-bound `ai`. Tiers 1, 2, 4 can run lighter.
4. Label vendor newsrooms in the source name (`… (vendor)`).
5. Quality-first: no stale (>90d except regulators), no abandoned blogs,
   no duplicate URLs.

## Out of scope until asked

- Creating a GitHub repository
- Pushing to origin
- Enabling GitHub Pages
- Combining this site with AI Drudge
- Changing the 3-column wire

## Done when

`npm install && npm run build:data && npm run dev` paints a populated
homepage with RIA/advisor-relevant AI headlines, Feed Health, ticker, and
the same interaction set as the reference layout.
