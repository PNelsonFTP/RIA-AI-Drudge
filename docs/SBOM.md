# RIA AI Report — Software Bill of Materials

Human-readable SBOM. The machine-readable CycloneDX 1.5 document is
[SBOM.json](./SBOM.json). Regenerate both any time dependencies change:

```bash
npm run sbom
```

_Last regenerated: 2026-09-18_

## Scope

- **Runtime (shipped to browsers):** React + ReactDOM only. Everything else is
  build-time tooling that never leaves CI (or the local `build:data` run).
- **Build/CI:** TypeScript, Vite, Tailwind, tsx, fast-xml-parser.
- **No server runtime.** The deployed site will be static HTML/JS/CSS/JSON on
  GitHub Pages once a public repo is created.

## Direct dependencies

<!-- SBOM-TABLE:START -->
| Package | Resolved | License | Scope |
|---------|----------|---------|-------|
| `@tailwindcss/vite` | 4.3.2 | MIT | dev/build |
| `@types/node` | 25.9.4 | MIT | dev/build |
| `@types/react` | 19.2.17 | MIT | dev/build |
| `@types/react-dom` | 19.2.3 | MIT | dev/build |
| `@vitejs/plugin-react` | 4.7.0 | MIT | dev/build |
| `fast-xml-parser` | 5.9.3 | MIT | dev/build |
| `react` | 19.2.7 | MIT | runtime |
| `react-dom` | 19.2.7 | MIT | runtime |
| `tailwindcss` | 4.3.2 | MIT | dev/build |
| `tsx` | 4.23.0 | MIT | dev/build |
| `typescript` | 5.8.3 | Apache-2.0 | dev/build |
| `vite` | 6.4.3 | MIT | dev/build |
<!-- SBOM-TABLE:END -->

Transitive packages: see [SBOM.json](./SBOM.json) (full component list with
purl + SHA-512 hashes from `package-lock.json`).

## Vulnerability status

`npm audit` as of **2026-09-18**: **5 findings** (0 critical, 4 high, 1 moderate).
All are **dev/build** transitive packages, not the React runtime shipped to
browsers.

| Advisory | Severity | Package | Notes |
|----------|----------|---------|-------|
| GHSA-28wg-ghj8-5hjv, GHSA-2v37-7h3g-55p8 | high | `nanoid` ≤3.3.17 | Via Vite/PostCSS toolchain. `npm audit fix` claims a bump. |
| GHSA-fxqj-rqcc-2cmp, GHSA-r28c-9q8g-f849 | high | `postcss` ≤8.5.22 | Source-map path issues in the **build** toolchain, not the static site. |
| (moderate) | moderate | `fast-xml-parser` (dev) | Used only in CI/`build:data` (`XMLParser`, not XMLBuilder). Track in [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md) P1.8. |

`--omit=dev --audit-level=high` (the weekly CI gate) should stay clean because
React/ReactDOM have no current high+ advisories. Do not skip the gate; do run
`npm audit fix` in a dedicated pass and re-`npm run sbom`.

## External services consumed at build time (CI / `npm run build:data` only)

| Service | Purpose | Auth | Data sent |
|---------|---------|------|-----------|
| ~95 RSS/Atom feeds (`scripts/sources.ts`) | Headlines | None | None (GET only) |
| anthropic.com, aisi.gov.uk, grayswan.ai (HTML scrape) | Lab listings (inherited scrapers; AISI/Gray Swan are low-fit leftovers) | None | None |
| hn.algolia.com | Hacker News velocity signal | None | None |
| news.google.com/rss | Query feeds (FINRA, SEC, RIA AI, vendors, etc.) | None | None |
| stooq.com, query1.finance.yahoo.com | Stock quotes | None | None |
| api.anthropic.com | Daily brief (Claude Sonnet 5) | `ANTHROPIC_API_KEY` (optional Actions secret) | Fetched headline titles/summaries only |

No third-party requests happen in the browser — the SPA fetches only its own
static JSON.

## Platform / infrastructure

| Component | Version / notes |
|-----------|-----------------|
| Node.js (CI) | 22 (`.github/workflows/refresh.yml`) |
| GitHub Actions | `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` |
| Hosting | **Not live yet.** Workflows are ready; Pages waits for a public repo. |

## Update policy

- Semver-compatible updates: `npm update && npm audit` during a working session.
- After any lockfile change: `npm run sbom`.
- Major upgrades (Vite 8, plugin-react 6, TypeScript 6): see
  [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md).
