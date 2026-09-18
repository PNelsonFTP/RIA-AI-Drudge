# Vendor / law / AM insight RSS probe

Probed **18 September 2026** for vendor newsrooms, compliance-vendor blogs, law-firm insights, and asset-manager / consultancy research listed in the parent brief (and `ai-news-sources-RIA.md` tiers 4, 6, 9).

`scripts/sources.ts` was not modified.

## Method

- HTTP **GET** only, **8s timeout**, browser Chrome UA, redirects followed (including 308).
- For each org: homepage + `/blog` `/news` `/insights` `/press` `/newsroom`, `<link rel="alternate" type="application/rss+xml|atom+xml">`, in-page feed hrefs, and conventional paths (`/feed`, `/feed/`, `/rss.xml`, `/feed.xml`, `/atom.xml`, `/blog/feed`, `/news/feed`, `/insights/feed`).
- XML had to parse as RSS or Atom with items. Drupal/WordPress feeds with HTML entities were salvaged with recovering XML parse (Orion `rss.xml`, Debevoise Data Blog).
- **Freshness:** newest item on or after **2026-03-22** (180 days). Vendor blogs may be slower than trade press; 180 days is the keep window.
- **Quality:** skip marketing-fluff feeds that never mention AI in recent items and have no justifiable `requireAny`. Mixed incumbent blogs kept only with an AI keyword filter. AI-native blogs whose recent items are all on-topic may use `requireAny: null`.
- One canonical URL per org. Comment feeds, empty category feeds, and PR-only siblings dropped.

## Counts

| | n |
|---|---|
| Orgs in the must-probe list | 44 |
| Unique HTTP candidates (homes + conventional + extras) | ~720 |
| Parseable RSS/Atom (including empty/stale siblings) | 29 orgs had at least one XML response; 18 unique fresh keepers after quality filter |
| **KEEP (`scripts/discovered-vendors.json`)** | **18** |
| SKIP (no public feed, WAF, fluff, or stale) | 26 |

## Keepers

| Source | Page URL | Feed URL | Status | Newest item | Decision | Reason |
|---|---|---|---|---|---|---|
| Advisor360 | https://www.advisor360.com | https://www.advisor360.com/blog/rss.xml | 200 | 2026-08-28 | KEEP | Drupal blog RSS. Recent titles are AI meeting prep / agentic workflow. `requireAny` null. |
| Altruist | https://www.altruist.com | https://www.altruist.com/feed | 200 | 2026-09-10 | KEEP | WordPress /feed. Hazel AI planning + OpenAI mixed with ops posts. Filter required. |
| Docupace | https://www.docupace.com | https://www.docupace.com/feed | 200 | 2026-09-14 | KEEP | WordPress /feed. Surveillance / automation / AI in descriptions. Filter required. |
| Emerj | https://emerj.com | https://emerj.com/feed | 200 | 2026-09-14 | KEEP | WordPress /feed. AI-in-enterprise research (incl. financial services). Entire feed is on-topic. |
| Envestnet | https://www.envestnet.com | https://www.envestnet.com/rss.xml | 200 | 2026-09-14 | KEEP | Site RSS. Claude / Adaptive WealthTech mixed with planning posts. Filter required. |
| Insight Partners | https://www.insightpartners.com/ideas | https://www.insightpartners.com/feed | 200 | 2026-09-17 | KEEP | WordPress /feed (ideas path `/ideas/feed` is 403). Strong AI/enterprise items; filter required. |
| Ncontracts | https://www.ncontracts.com | https://www.ncontracts.com/nsight-blog/rss.xml | 200 | 2026-09-17 | KEEP | Nsight blog RSS (root `/feed` is not the blog). Mixed vendor-risk news plus “How AI Is Changing the Compliance Officer’s Role”. Filter required. |
| Nitrogen | https://www.nitrogenwealth.com | https://www.nitrogenwealth.com/feed | 200 | 2026-09-17 | KEEP | WordPress /feed. Mostly insurance/product; one in-window AI due-diligence post justifies `requireAny`. |
| Orion | https://www.orion.com | https://www.orion.com/rss.xml | 200 | 2026-09-16 | KEEP | Drupal RSS (`application/rss+xml`). Needs entity-recover parse. Anthropic/Claude + AI/data items mixed with events. Filter required. `/news/feed` is the same channel with weaker dates. |
| Practifi | https://www.practifi.com | https://www.practifi.com/blog/feed | 200 | 2026-09-09 | KEEP | WordPress blog feed. Sentir AI CRM + gen-AI adoption mixed with CRM process posts. Filter required. |
| SS&C | https://www.ssctech.com | https://www.ssctech.com/blog/rss.xml | 200 | 2026-09-18 | KEEP | Blog RSS linked from `/blog`. Mixed alts/wealth platform; “Innovation and AI” in-window. Filter required. |
| TIFIN | https://www.tifin.com | https://www.tifin.com/feed | 200 | 2026-06-29 | KEEP | WordPress /feed. TIFIN.AI / agentic OS / FactSet AI — all recent titles on-topic. Slower cadence, inside 180 days. |
| Vanilla | https://www.justvanilla.com | https://www.justvanilla.com/blog/feed | 200 | 2026-09-17 | KEEP | WordPress blog feed. Agentic estate planning + awards. Filter required. |
| Wealth.com | https://www.wealth.com | https://www.wealth.com/feed | 200 | 2026-09-15 | KEEP | WordPress /feed. Claude-for-advisors estate/tax posts mixed with product notes. Filter required. |
| Wealthbox | https://www.wealthbox.com | https://www.wealthbox.com/blog/feed | 200 | 2026-09-15 | KEEP | WordPress blog feed. AI Agents + Claude for Financial Advisors. Site `/rss.xml` is a weaker customer-logo channel — not used. Filter required. |
| eMoney Advisor | https://emoneyadvisor.com | https://emoneyadvisor.com/feed | 200 | 2026-09-16 | KEEP | WordPress /feed. Agentic AI / tech-budget posts mixed with summit/awards. Filter required. |
| Adams Street Partners Insights | https://www.adamsstreetpartners.com/insights | https://www.adamsstreetpartners.com/insights/feed | 200 | 2026-09-16 | KEEP | Insights category feed (AI in venture/advice pieces). Site `/feed` is fundraising PR — skipped. Filter required. |
| Debevoise Data Blog | https://www.debevoisedatablog.com | https://www.debevoisedatablog.com/feed/ | 200 | 2026-09-14 | KEEP | WordPress RSS (~2 MB). Agentic-AI controls, legal-data-for-AI. Firm site `debevoise.com` has no feed. Privacy/cyber mixed in — filter required. |

## Skips

| Source | Page URL | Feed URL | Status | Newest item | Decision | Reason |
|---|---|---|---|---|---|---|
| Jump | https://jumpapp.com/blog | — | 200 / 404 | — | SKIP | Next.js marketing site. Blog 200; `/feed`, `/rss.xml`, `/blog/rss.xml`, `/blog.rss` 404. No `<link rel="alternate">`. |
| Zocks | https://zocks.io/blog | — | 200 / 404 | — | SKIP | Webflow. Blog 200; conventional RSS paths 404. No alternate link. |
| Zeplyn | https://zeplyn.ai/blog | — | 200 / 404 | — | SKIP | Webflow. Blog 200; no public RSS. |
| FINNY | https://www.finny.ai | — | timeout | — | SKIP | Homepage and feed candidates timed out at 8s. No feed verified. |
| Holistiplan | https://www.holistiplan.com | https://www.holistiplan.com/feed | 200 | 2026-07-31 | SKIP | Parseable and fresh, but in-window items are tax-planning marketing. AI/Jump posts are older than 180 days. `requireAny` would empty the feed. |
| FP Alpha | https://www.fpalpha.com | https://www.fpalpha.com/feed | 200 | 2026-06-07 | SKIP | Parseable and fresh, but recent items are estate/tax marketing. Only AI title is Nov 2025 (outside window). |
| Savvy Wealth | https://www.savvywealth.com/blog | — | 200 / 404 | — | SKIP | Webflow blog 200; no public RSS. HTML “feed” hit was LinkedIn, not RSS. |
| Nevis | https://www.getnevis.com | — | 200 / timeout | — | SKIP | `nevis.ai` / `meetnevis.com` timed out. `getnevis.com` 200 with no RSS alternate or conventional feed. |
| Hadrius | https://www.hadrius.com/blog | — | 200 / 404 | — | SKIP | Webflow blog 200; no public RSS. |
| Greenboard | https://www.greenboard.com/blog | — | 200 / 404 | — | SKIP | Webflow blog 200; `getgreenboard.com` timed out; no public RSS. |
| RightCapital | https://www.rightcapital.com/blog | — | 200 | — | SKIP | Vercel 308 then HTML blog. No RSS after redirect follow. |
| YCharts | https://ycharts.com | — | 202 | — | SKIP | Bot-challenge 202 on `/blog`, `/feed`, `/rss.xml`, `/resources/blog/feed`. No XML verified. |
| Apex Fintech Solutions | https://www.apexfintechsolutions.com/newsroom | — | 200 | — | SKIP | 308 then HTML newsroom. No RSS. |
| Advyzon | https://www.advyzon.com | — | SSL error | — | SKIP | TLS protocol-version error from this probe environment. No feed verified. |
| Redtail | https://www.redtailtechnology.com | https://www.redtailtechnology.com/rss.xml | 200 | 2026-08-14 | SKIP | Parseable and fresh, but titles/descriptions never mention AI. No justifiable `requireAny`. |
| Broadridge | https://www.broadridge.com | — | 200 / 404 | — | SKIP | Homepage 200; `/blog` `/insights` `/about/newsroom` 404. No RSS. |
| Sidley Austin Insights | https://www.sidley.com/en/insights | — | 200 / 404 | — | SKIP | Insights HTML 200. `/en/rss` is HTML; `/en/insights/rss` and conventional paths 404/308-to-404. |
| Davis Polk Insights | https://www.davispolk.com/insights | — | 200 / 404 | — | SKIP | Insights 200. `/rss.xml` 403; `/feed` and `/insights/feed` 404. |
| Ropes & Gray Insights | https://www.ropesgray.com/en/insights | — | 200 / 403 | — | SKIP | Insights sometimes 200, often 403. `/en/rss` 403. No XML. |
| Morgan Lewis Insights | https://www.morganlewis.com/pubs | — | 200 / 404 | — | SKIP | Pubs + FinReg blog HTML 200. Historical `/rss`, `/pubs/rss`, `/syndication/rss`, FinReg `/rss` all 404. |
| Eversheds Sutherland | https://www.eversheds-sutherland.com | — | 200 / 404 | — | SKIP | Homepage 200. `/rss` is HTML. Insights/articles RSS paths 404. “rss” strings in page are font data. |
| Smarsh | https://www.smarsh.com | — | 429 / 403 | — | SKIP | Rate-limited then 403. `blog.smarsh.com` not verified as RSS. |
| ComplySci / NRS | https://www.complysci.com | — | timeout | — | SKIP | `complysci.com` and `nrs-inc.com` timed out or failed. No first-party feed verified. |
| BlackRock Investment Institute | https://www.blackrock.com/corporate/insights/blackrock-investment-institute | — | 200 | — | SKIP | Pages 200. `/feeds/insights.rss` returns HTML. No BII RSS. |
| Capital Group PracticeLab | https://www.capitalgroup.com/advisor/practicelab | — | 403 / 200 | — | SKIP | PracticeLab 403; `practicelab.html` 200 with no RSS. Conventional paths 404. |
| Morningstar | https://www.morningstar.com | — | 202 | — | SKIP | News 200/202. `/rss`, `/feed`, `/news/rss`, `/rss-feeds` empty 202. Feedburner `morningstar` is HTML, not a usable AI/advisor feed. |
| Adams Street news | https://www.adamsstreetpartners.com | https://www.adamsstreetpartners.com/feed | 200 | 2026-09-14 | SKIP | Fundraising / personnel PR. No AI. Insights feed kept instead. |
| Wealthbox customer RSS | https://www.wealthbox.com | https://www.wealthbox.com/rss.xml | 200 | 2026-09-16 | SKIP | Parses, but items are customer names (“Amplify”, “Mako”). Blog `/blog/feed` kept instead. |
| Holistiplan / FP Alpha / empty WP stubs | various `/blog/feed`, `/comments/feed` | various | 200 | empty / stale | SKIP | Empty WordPress category or comment feeds. |

## Notes

- **Law firms:** only Debevoise’s dedicated Data Blog publishes a public RSS. Sidley, Davis Polk, Ropes, Morgan Lewis, and Eversheds are scrape/email-alert properties from this environment.
- **AI-native vendors** (Jump, Zocks, Zeplyn, FINNY, Hadrius, Greenboard, Nevis, Savvy) run JS/Webflow blogs with **no public RSS**. Cover via trade press or a later scrape pass — do not guess feed URLs.
- **Orion** `rss.xml` is valid RSS that stock ElementTree rejects (`undefined entity`). Recovering parse is required.
- **Debevoise Data Blog** `/feed/` is large; a 2 MB GET cap truncates the document. Raise the collector body limit or the parse fails.
- **Ncontracts** is easy to miss: the working feed is `/nsight-blog/rss.xml`, not `/feed`.
- Riskalyze (`nitrogenwealth.com` / `riskalyze.com`) serves the same Nitrogen WordPress feed; one URL kept.
- `requireAny` on mixed incumbent / VC / law blogs is intentional so Vendor Watch and Compliance do not fill with insurance-month or fundraising posts.
