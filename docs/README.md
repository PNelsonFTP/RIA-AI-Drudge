# CFP AI Report — Documentation Index

Standalone aggregator for **CFPs, RIAs, broker-dealers, and wealth
professionals** following AI. Public masthead: **CFP AI REPORT**. Folder and
repo: `RIA-AI-Drudge`. This tree is **not** part of AI Drudge.

Last full documentation pass: **2026-09-21**.

## Status

| Item | Value |
|------|-------|
| Public site | https://pnelsonftp.github.io/RIA-AI-Drudge/ |
| GitHub repo | https://github.com/PNelsonFTP/RIA-AI-Drudge (`main`) |
| Local preview | http://127.0.0.1:5173/RIA-AI-Drudge/ |
| Workspace | `/Users/paulnelson/Documents/Development/RIA-AI-Drudge/` |
| Visual system | First Trust / XPND chrome (navy, gold rule, Arial, light default) |
| Refresh | Hourly `refresh.yml` (cron `5 * * * *`) plus Pages deploy |
| Feed audit | Mondays 12:00 UTC, `feed-audit.yml` |

## Documents

| Document | Audience | Contents |
|----------|----------|----------|
| [../README.md](../README.md) | Everyone | Quick start and live URLs |
| [HANDOFF.md](./HANDOFF.md) | Operators | Dev, feeds, CI, troubleshooting |
| [DESIGN.md](./DESIGN.md) | Engineers | Pipeline, scoring, client, visual system |
| [PROJECT_HISTORY.md](./PROJECT_HISTORY.md) | Everyone | Chronology through the rename and restyle |
| [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md) | Product / engineering | Shipped work and remaining roadmap |
| [SBOM.md](./SBOM.md) / [SBOM.json](./SBOM.json) | Security | CycloneDX 1.5 plus a human summary |
| [FEED_PROBE_CURATED.md](./FEED_PROBE_CURATED.md) | Editors | 2026-09-18 probe of `ai-news-sources-RIA.md` |
| [FEED_PROBE_EXTRA.md](./FEED_PROBE_EXTRA.md) | Editors | Independent finance/AI feed expansion |
| [FEED_PROBE_VENDORS.md](./FEED_PROBE_VENDORS.md) | Editors | Vendor / law / AM insight RSS |
| [../ai-news-sources-RIA.md](../ai-news-sources-RIA.md) | Editors | Curated tiers 1–9 |
| [../CONSTRAINTS.md](../CONSTRAINTS.md) | New chat | Hard rules |
| [../INITIAL_PROMPT.md](../INITIAL_PROMPT.md) | Archive | Original build prompt (still says “RIA AI Report”) |
| [../FOLLOW_UP_PROMPTS.md](../FOLLOW_UP_PROMPTS.md) | Archive | Go-live prompts; Pages is already live |

## Key facts

- **Stack:** Vite 6, React 19, TypeScript 5.8, Tailwind v4, fast-xml-parser 5
- **Architecture:** Build-time RSS/HTML fetch → static JSON → SPA on GitHub Pages
- **Categories:** 12 (advisor tech, industry, regulation, wealthtech, practice, compliance, banking/fintech, markets, institutional, labs, research, vendors)
- **Feeds:** ~107 RSS plus Anthropic News and Anthropic Research scrapes
- **Editorial gates:** `AI_FILTER`, `SUPERVISION_FILTER` (SEC/NASAA), `FINANCE_OR_ENTERPRISE` (noisy AI letters)
- **Lead:** regulation, then advisor tech, wealthtech, compliance, practice — not a lab hack when an RIA-home story exists
- **Security:** no server; the browser never fetches third-party feeds; optional Anthropic key only in CI
- **Storage prefix:** `ria-ai-report:` (theme key is `ria-ai-report:theme-v2`)
