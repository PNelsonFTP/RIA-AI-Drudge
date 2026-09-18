# RIA AI Report — Documentation Index

Standalone Drudge-style aggregator for **RIAs, broker-dealers, and wealth
professionals** following AI. This folder is **not** part of AI Drudge.

Last full handoff: **2026-09-18** (first-run local site).

## Status

| Item | Value |
|------|-------|
| Local preview | http://127.0.0.1:5173/RIA-AI-Drudge/ (`base: "/RIA-AI-Drudge/"`) |
| Public GitHub repo | https://github.com/PNelsonFTP/RIA-AI-Drudge |
| GitHub Pages | https://pnelsonftp.github.io/RIA-AI-Drudge/ |
| Workspace | `/Users/paulnelson/Documents/Development/RIA-AI-Drudge/` |

## Documents

| Document | Audience | Contents |
|----------|----------|----------|
| [../README.md](../README.md) | Everyone | Quick start |
| [HANDOFF.md](./HANDOFF.md) | Operators | Dev, deploy (when ready), troubleshooting |
| [DESIGN.md](./DESIGN.md) | Engineers | Architecture, pipeline, scoring, client |
| [PROJECT_HISTORY.md](./PROJECT_HISTORY.md) | Everyone | First-run chronology |
| [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md) | Product / engineering | Roadmap + tech-debt |
| [SBOM.md](./SBOM.md) / [SBOM.json](./SBOM.json) | Security | Dependencies (CycloneDX 1.5) |
| [FEED_PROBE_CURATED.md](./FEED_PROBE_CURATED.md) | Editors | Probe of `ai-news-sources-RIA.md` |
| [FEED_PROBE_EXTRA.md](./FEED_PROBE_EXTRA.md) | Editors | Independent finance/AI feed expansion |
| [FEED_PROBE_VENDORS.md](./FEED_PROBE_VENDORS.md) | Editors | Vendor / law / AM insight RSS (18 keepers not all wired) |
| [../ai-news-sources-RIA.md](../ai-news-sources-RIA.md) | Editors | Curated tiers 1–9 |
| [../INITIAL_PROMPT.md](../INITIAL_PROMPT.md) | New chat | Rebuild / continue prompt |
| [../CONSTRAINTS.md](../CONSTRAINTS.md) | New chat | Hard rules |
| [../FOLLOW_UP_PROMPTS.md](../FOLLOW_UP_PROMPTS.md) | New chat | Repo/Pages and later passes |

## Key facts

- **Stack:** Vite 6, React 19, TypeScript 5.8, Tailwind v4, fast-xml-parser 5
- **Architecture:** Build-time RSS/HTML fetch → static JSON → SPA (Pages later)
- **Categories:** 12 (advisor tech, industry, regulation, wealthtech, practice,
  compliance, banking/fintech, markets, institutional, labs, research, vendors)
- **Feeds:** ~95 RSS + 4 HTML scrapes; first-run builds ~96/97 OK, ~110 stories
- **Refresh (after repo):** hourly Actions + weekly feed audit
- **Security:** no server; browser never fetches third-party feeds; optional
  Anthropic key only in CI
