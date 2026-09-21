# CFP AI Report — Project History

First-run build: **2026-09-18**. Sibling of AI Drudge; **separate git history,
branding, sources, and localStorage.** Do not merge the two repos.

## Origin

The owner asked for another Drudge-style site using the same formats and
layouts as AI Drudge, aimed at financial professionals keeping up on AI
(practice tools, wealthtech, regulation, AI as an investment theme). Work
lives only in `/Users/paulnelson/Documents/Development/RIA-AI-Drudge/`.

Inputs:

- `ai-news-sources-RIA.md` — curated tiers 1–9 (September 2026)
- Independent probes of regulators, trade press, bank/fintech, labs, Google
  News queries, and vendor/law-firm RSS
- Architecture cloned from the AI Drudge *pattern* (Vite/React/static hourly
  JSON), not from a git copy of that remote

## 2026-09-18 — First run

Shipped locally, no public GitHub remote yet.

| Area | What landed |
|------|-------------|
| Product name | **RIA AI REPORT** (masthead); folder `RIA-AI-Drudge` |
| Stack | Vite 6 + React 19 + TS 5.8 + Tailwind v4 |
| Layout | Same 3-column wire: ticker, brief, trending, lead, LATEST, columns |
| Client features | Bookmarks + snapshots, read-later, mutes, read-state, search, theme, Feed Health, preview/full payload |
| localStorage prefix | `ria-ai-report:` |
| Categories | 12 RIA-specific IDs (see [DESIGN.md](./DESIGN.md) §6) |
| `requireAny` | AI-keyword filter on broad / regulator / vendor firehoses |
| Sources | ~95 live RSS URLs after probe-and-prune; Google News stand-ins for FINRA / WAF-blocked trade press |
| Stocks | BLK, SCHW, MS, JPM, AMP, LPLA, NVDA, MSFT |
| Workflows | `refresh.yml` + `feed-audit.yml` copied and ready (idle until a repo exists) |
| Prompts | `INITIAL_PROMPT.md`, `CONSTRAINTS.md`, `FOLLOW_UP_PROMPTS.md` |
| Feed research | `docs/FEED_PROBE_CURATED.md`, `FEED_PROBE_EXTRA.md`, `FEED_PROBE_VENDORS.md`, `scripts/discovered-*.json` |

### Source research (same day)

- Curated list: 94 RSS-marked families, ~1,070 URL candidates, **48 keepers**
- Extra expansion: 709+ URLs, **70 keepers**
- Vendor/law last-chance: Envestnet + Docupace RSS worked; law-firm RSS did not
- Beehiiv (AI Advisor Stack, Fintech Brainfood): `rss_url: null`
- FINRA / ThinkAdvisor / Advisor Perspectives / Financial Brand: WAF 403

### First-look homepage (local)

Typical rebuild after the merge pass: **~96/97 feeds OK**, **~110–111 grouped
stories**, 1 trending cluster (Anthropic Claude for advisors), ticker live,
fallback daily brief. `vite.config.ts` `base` is `"/"` for localhost.

### Explicitly not done (first run)

- Combining this tree with AI Drudge
- Layout redesign

### 2026-09-18 — Public repo + Pages

- Repo: https://github.com/PNelsonFTP/RIA-AI-Drudge
- Pages: https://pnelsonftp.github.io/RIA-AI-Drudge/
- `vite.config.ts` `base` set to `/RIA-AI-Drudge/`
- Hourly `refresh.yml` began committing `chore(data): refresh` snapshots

## 2026-09-20 — Editorial polish

The first public payload was a working aggregator that still opened on a
TechCrunch lab story, wrapped Google News links, and let regulator and vendor
feeds run too wide. The polish on `main` (`375cef7`, then `9a035f9`):

- Google News unwrap cap raised to at least every unique wrapper, SEC/FINRA/RIA first
- Lead and fallback brief prefer regulation, advisor tech, and wealthtech
- SEC/NASAA use `SUPERVISION_FILTER`; Fed and Treasury stay on `AI_FILTER`
- Kitces, Wealth Solutions Report, and Huebscher are AI-filtered
- `requireAny` matches a leading “AI” / “LLM” / “GPT” and not “available”
- AISI, Gray Swan, White House, NVIDIA newsroom, and Business Wire removed
- Vendor badge; trade press beats a wire twin within about 10% score
- Ticker order BLK SCHW MS JPM AMP LPLA; View All and mutes fixed on first paint

A rebuild that day showed 0 displayed `news.google.com` links, an SEC speech
as the lead, and Wealth Solutions Report’s Claude-for-advisors story as
trending #1.

## 2026-09-20 — First Trust chrome and rename

Visual system copied from XPND Drudge / ftportfolios.com: navy masthead, gold
rule, Arial, silver bars, striped page, light default (`dd99d00`).

The public title changed from **RIA AI REPORT** to **CFP AI REPORT** in the
masthead, document title, Atom feed, and brief fallback. The repo path,
Pages URL, and `ria-ai-report:` storage prefix were left in place so existing
bookmarks and the GitHub project site did not move.

Pages deploy [35514241553](https://github.com/PNelsonFTP/RIA-AI-Drudge/actions/runs/35514241553)
served `<title>CFP AI REPORT</title>`.

## 2026-09-21 — Documentation

README, handoff, design, SBOM, future improvements, and this history were
rewritten to match the live site. Probe write-ups under `docs/FEED_PROBE_*.md`
stay dated 2026-09-18.
