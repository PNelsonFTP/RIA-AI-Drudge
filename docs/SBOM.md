# CFP AI Report — Software Bill of Materials

Human-readable SBOM for **CFP AI REPORT** (`ria-ai-report` on npm, repo
`RIA-AI-Drudge`). The machine-readable CycloneDX 1.5 document is
[SBOM.json](./SBOM.json). Regenerate both after any dependency change:

```bash
npm run sbom
```

_Last regenerated: 2026-09-21_

`npm run sbom` rewrites the date on the line above and replaces the table
between the markers. The narrative sections are maintained by hand.

## Scope

- **Runtime shipped to browsers:** React and ReactDOM only. The Pages artifact
  is static HTML, JS, CSS, and JSON.
- **Build and CI:** TypeScript, Vite, Tailwind, tsx, fast-xml-parser. These
  run in GitHub Actions and on a developer machine. They are not imported by
  the browser bundle except for the CSS/JS Vite emits.
- **No server process** on the public site.

## Direct dependencies

<!-- SBOM-TABLE:START -->
| Package | Resolved | License | Scope |
|---------|----------|---------|-------|
| `@tailwindcss/vite` | 4.3.2 | MIT | dev/build |
| `@types/node` | 25.9.4 | MIT | dev/build |
| `@types/react` | 19.2.17 | MIT | dev/build |
| `@types/react-dom` | 19.2.3 | MIT | dev/build |
| `@vitejs/plugin-react` | 4.7.0 | MIT | dev/build |
| `fast-xml-parser` | 5.11.1 | MIT | dev/build |
| `react` | 19.2.7 | MIT | runtime |
| `react-dom` | 19.2.7 | MIT | runtime |
| `tailwindcss` | 4.3.2 | MIT | dev/build |
| `tsx` | 4.23.0 | MIT | dev/build |
| `typescript` | 5.8.3 | Apache-2.0 | dev/build |
| `vite` | 6.4.3 | MIT | dev/build |
| `vite-plugin-pwa` | 1.3.0 | MIT | dev/build |
<!-- SBOM-TABLE:END -->

Transitive packages, purls, and SHA-512 hashes from `package-lock.json` are
in [SBOM.json](./SBOM.json).

## Vulnerability status

`npm audit` on **2026-09-21**, after `npm audit fix` in the same pass that
added `vite-plugin-pwa`: **0 findings**.

Earlier the same day the lockfile had 4 high and 1 moderate, all dev/build
(`nanoid`, `postcss`, `browserslist`, `fast-xml-parser`, `baseline-browser-mapping`).
Those are cleared without a Vite 8 major. `fast-xml-parser` stays a
devDependency used only by `build:data`.

The weekly workflow gate remains:

```bash
npm audit --omit=dev --audit-level=high
```

Do not weaken it. After the next lockfile change, rerun `npm audit` and
`npm run sbom`.

## External services at build time only

Called by `npm run build:data` and by the hourly Actions job. The browser
does not call them.

| Service | Purpose | Auth | Data sent |
|---------|---------|------|-----------|
| ~107 RSS/Atom feeds in `scripts/sources.ts` | Headlines | None | GET only |
| anthropic.com, finra.org notices, jump.ai/blog, zocks.io blog | HTML listing scrapes | None | GET only |
| hn.algolia.com | Hacker News velocity signal for scoring | None | GET only |
| news.google.com RSS plus batchexecute unwrap | FINRA, SEC, RIA, wealth, vendor, and market queries; publisher URL resolution | None | GET only |
| stooq.com, query1.finance.yahoo.com | Quotes for BLK, SCHW, MS, JPM, AMP, LPLA, NVDA, MSFT | None | GET only |
| api.anthropic.com | Daily brief | `ANTHROPIC_API_KEY` (optional Actions secret) | Headline titles and summaries already fetched. No reader data |

UK AISI and Gray Swan are **not** scraped.

## Platform

| Component | Notes |
|-----------|--------|
| Node.js in CI | 22 (`.github/workflows/refresh.yml`, `feed-audit.yml`) |
| Actions | `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` |
| Hosting | GitHub Pages, project site, HTTPS enforced. Source branch `main`, deploy from the workflow artifact (`dist/`), not from a branch folder |
| Public URL | https://pnelsonftp.github.io/RIA-AI-Drudge/ |
| Repo visibility | Public |

Pages cache is short (on the order of 10 minutes). A successful deploy is
visible as `server: GitHub.com` on the HTML response.

## Update policy

- Compatible bumps: `npm update`, then `npm test`, `npm audit`, `npm run sbom`.
- After any lockfile change: commit the regenerated `docs/SBOM.json` and the
  table in this file.
- Major upgrades (Vite 8, plugin-react 6, TypeScript 6): one at a time. See
  [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md).
