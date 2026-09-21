# CFP AI Report

Drudge-style headline aggregator for **CFPs, RIAs, broker-dealers, and wealth
professionals** who need to keep up on AI — advisor tools, wealthtech,
regulation, and AI as an investment theme.

The public name is **CFP AI REPORT**. The folder and GitHub repo stay
`RIA-AI-Drudge`. Browser storage keys stay `ria-ai-report:` so bookmarks and
mutes survive the rename.

This folder is a **standalone** project. It is not part of AI Drudge. Do not
attach the AI Drudge remote.

**Status (2026-09-21):** public GitHub repo, hourly refresh, GitHub Pages live.

- Repo: https://github.com/PNelsonFTP/RIA-AI-Drudge
- Site: https://pnelsonftp.github.io/RIA-AI-Drudge/

Visual system matches [XPND Drudge](https://pnelsonftp.github.io/xpnd-drudge/)
and [First Trust Portfolios](https://www.ftportfolios.com/): navy masthead,
gold rule, Arial, silver section bars, striped page. Light is the default
theme. The content is still this project's RIA / CFP AI headlines.

## Run locally

```bash
cd /Users/paulnelson/Documents/Development/RIA-AI-Drudge
npm ci
npm run build:data
npm run build:check
npm run dev
```

Open http://127.0.0.1:5173/RIA-AI-Drudge/ (`vite.config.ts` `base` is
`/RIA-AI-Drudge/`). If that port is taken, Vite prints the next one.

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build:data` | Fetch RSS/HTML + stocks + HN index + brief → `public/data/` and `public/feed.xml` |
| `npm run build:check` | Quality gate on `public/data/headlines.json` |
| `npm run validate:feeds` | Per-feed liveness, parse, freshness |
| `npm test` | Unwrap, router, `requireAny`, story-grouping tests |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Serve `dist/` |
| `npm run sbom` | Refresh `docs/SBOM.json` and the table in `docs/SBOM.md` |

## What the site does

Build time fetches about **107 RSS/Atom feeds** and **2 HTML scrapes**
(Anthropic News and Research). The browser only loads static JSON:

| File | Role |
|------|------|
| `public/data/headlines-preview.json` | First paint (default lists, empty View All tails) |
| `public/data/headlines.json` | Full payload, including View All |
| `public/data/stocks.json` | BLK, SCHW, MS, JPM, AMP, LPLA, NVDA, MSFT |
| `public/data/brief.json` | Daily brief (Claude if `ANTHROPIC_API_KEY` is set, otherwise a curated fallback) |
| `public/feed.xml` | Atom feed of the site itself |

Homepage order: sticky navy header and search, scrolling ticker, section jump
chips, then a two-rail top (lead + trending | daily brief + latest), then
three category columns.

## Documentation

| Doc | What |
|-----|------|
| [docs/README.md](docs/README.md) | Index and current facts |
| [docs/HANDOFF.md](docs/HANDOFF.md) | Operate, add feeds, troubleshoot |
| [docs/DESIGN.md](docs/DESIGN.md) | Architecture, scoring, visual system |
| [docs/FUTURE_IMPROVEMENTS.md](docs/FUTURE_IMPROVEMENTS.md) | What shipped and what is still open |
| [docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md) | Chronology |
| [docs/SBOM.md](docs/SBOM.md) | Human SBOM (`npm run sbom`) |
| [ai-news-sources-RIA.md](ai-news-sources-RIA.md) | Curated source tiers |
| [CONSTRAINTS.md](CONSTRAINTS.md) | Hard rules |
| [INITIAL_PROMPT.md](INITIAL_PROMPT.md) | Original rebuild prompt (name has since changed) |

## Stack

Vite 6 + React 19 + TypeScript + Tailwind v4. All third-party RSS, HTML, and
quote fetches happen at **build time**. GitHub Actions (`.github/workflows/refresh.yml`)
refreshes data hourly and deploys Pages. A weekly feed audit is
`.github/workflows/feed-audit.yml`.
