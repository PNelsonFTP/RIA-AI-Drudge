# RIA AI Report

Drudge-style headline aggregator for **RIAs, broker-dealers, and wealth
professionals** who need to keep up on AI — advisor tools, wealthtech,
regulation, and AI as an investment theme.

This folder is a **standalone** project. It is not part of AI Drudge.

**Status (2026-09-18):** public repo + GitHub Pages.

- Repo: https://github.com/PNelsonFTP/RIA-AI-Drudge
- Site: https://pnelsonftp.github.io/RIA-AI-Drudge/

## Run locally

```bash
cd /Users/paulnelson/Documents/Development/RIA-AI-Drudge
npm install
npm run build:data
npm run build:check
npm run dev
```

Open http://localhost:5173/

| Script | Purpose |
|--------|---------|
| `npm run build:data` | Fetch RSS/HTML + stocks + brief |
| `npm run build:check` | Quality gate on generated JSON |
| `npm run validate:feeds` | Per-feed liveness audit |
| `npm run sbom` | Refresh `docs/SBOM.json` + `docs/SBOM.md` |
| `npm test` | URL unwrap + trending-lead tests |
| `npm run build` | Production bundle → `dist/` |

## Documentation

Full handoff lives in [`docs/`](docs/README.md):

| Doc | What |
|-----|------|
| [docs/HANDOFF.md](docs/HANDOFF.md) | Operate, add feeds, go-live checklist |
| [docs/DESIGN.md](docs/DESIGN.md) | Architecture and editorial rules |
| [docs/FUTURE_IMPROVEMENTS.md](docs/FUTURE_IMPROVEMENTS.md) | P1–P3 roadmap + tech debt |
| [docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md) | First-run chronology |
| [docs/SBOM.md](docs/SBOM.md) | Human SBOM (`npm run sbom`) |
| [ai-news-sources-RIA.md](ai-news-sources-RIA.md) | Curated source tiers |
| [INITIAL_PROMPT.md](INITIAL_PROMPT.md) | New-conversation rebuild prompt |
| [CONSTRAINTS.md](CONSTRAINTS.md) | Hard rules (do not mix with AI Drudge) |

## Stack

Vite 6 + React 19 + TypeScript + Tailwind v4. All third-party RSS/HTML/API
fetch happens at **build time**. The browser only loads static JSON.

## GitHub + Pages

Public repo: [PNelsonFTP/RIA-AI-Drudge](https://github.com/PNelsonFTP/RIA-AI-Drudge).
Hourly refresh + Pages deploy: `.github/workflows/refresh.yml`. Do not attach
this tree to the AI Drudge remote.
