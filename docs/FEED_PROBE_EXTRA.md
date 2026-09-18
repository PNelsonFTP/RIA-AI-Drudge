# Extra feed probe (independent expansion)

Probed 2026-09-18 for the standalone RIA/BD/wealth aggregator. This pass searched beyond the curated tier list: official regulator feeds, trade and retirement press, bank/fintech, labs, wirehouse/AM newsrooms, consultancies, Google News query RSS, and PR-wire search feeds.

`scripts/sources.ts` was not modified.

## Method

- Browser UA, HTTP GET, 8s timeout, redirects followed (including 308), gzip accepted.
- Phase 1: 276 explicit candidate URLs across 143 source families.
- Phase 2: homepage fetch + `<link rel="alternate">` discovery + conventional `/feed`, `/rss.xml`, `/atom.xml` paths for misses (433 more URLs).
- Phase 3: curl retries for 403s, malformed XML salvage (`lxml` recover / item regex), Feedburner and section-tag alternates (Kitces, RIABiz, PlanSponsor/PlanAdviser/Tearsheet/ABA AI tags, BIS press list, NVIDIA newsroom, CFA Market Integrity, FT section RSS).
- **Unique URLs probed: 709** in phases 1–2, plus **~110** targeted retries. **103** parsed as RSS/Atom in the first pass; several more after salvage.
- **Keep rule:** parseable RSS/Atom with ≥1 item, and newest item within 90 days (after 2026-06-20), except regulators (any parseable item). Deduped by normalized URL. Preferred AI/section feeds over sitewide firehoses. Dropped PR copies, empty channels, stale feeds, and generic wires that only produced junk titles.

## Counts

| | n |
|---|---|
| Source families considered | 143 |
| Unique URLs probed (phase 1–2) | 709 |
| Parseable RSS/Atom (phase 1–2) | 103 |
| **Keepers written to `discovered-extra.json`** | **70** |
| Must-consider families with a keeper | 38 of 17 regulator + 19 trade + 10 fintech + 9 labs + 9 wirehouse/AM + 3 consulting + 6 Google News + 2 PR groups |
| Independent extras kept | 26 |

## Top keepers (use these first)

1. **SEC Press Releases** / **SEC Speeches** — primary enforcement and AI-washing signal.
2. **FINRA is missing** (Cloudflare 403) — cover via **Google News: FINRA artificial intelligence** until a first-party feed is reachable.
3. **Kitces** (`feeds.feedburner.com/KitcesNerdsEyeView`) — first-party `/feed/` is 403; Feedburner works.
4. **RIABiz** (`/rss`) — conventional `/feed` 404s.
5. **WealthManagement.com**, **InvestmentNews**, **Financial Planning**, **FA-Mag**, **AdvisorHub**.
6. **PlanSponsor AI** and **PlanAdviser AI** tag feeds (DC/retirement AI, not the sitewide firehose).
7. **Finextra AI**, **American Banker**, **Banking Dive**, **Tearsheet AI**, **ABA Banking Journal AI**.
8. **Federal Reserve** press + speeches, **CFTC**, **FDIC**, **Treasury**, **NASAA**, **CFPB**, **FCA**, **ESMA**, **BIS**, **White House**.
9. **WealthTech Today**, **T3 Technology Hub**, **Wealth Solutions Report**.
10. Google News queries for RIA AI, wealthtech AI, notetaker, copilot, SEC AI-washing.

## Keepers

| Source | Feed | Category | Pri | Newest | Notes |
|---|---|---|---|---|---|
| SEC Press Releases | https://www.sec.gov/news/pressreleases.rss | regulation | critical | 2026-09-17 | Must |
| SEC Speeches and Statements | https://www.sec.gov/news/speeches-statements.rss | regulation | critical | 2026-09-17 | Must |
| CFTC Press Releases | https://www.cftc.gov/rss.xml | regulation | critical | 2026-09-15 | Must |
| Federal Reserve Press | https://www.federalreserve.gov/feeds/press_all.xml | regulation | critical | 2026-09-16 | Must |
| Federal Reserve Speeches | https://www.federalreserve.gov/feeds/speeches.xml | regulation | critical | 2026-09-03 | Must |
| FDIC Press Releases | https://public.govdelivery.com/topics/USFDIC_26/feed.rss | regulation | critical | 2026-09-17 | GovDelivery |
| Treasury Press Releases | https://home.treasury.gov/rss.xml | regulation | critical | 2026-07-22 | Must; low cadence |
| NASAA News | https://www.nasaa.org/feed/ | regulation | high | 2026-09-17 | Must |
| CFPB Newsroom | https://www.consumerfinance.gov/about-us/newsroom/feed/ | regulation | high | 2026-08-14 | Must; blog feed empty |
| NIST News | https://www.nist.gov/news-events/news/rss.xml | regulation | high | 2026-09-15 | Must; sitewide (AI page has no feed) |
| FCA News | https://www.fca.org.uk/news/rss.xml | regulation | high | — | Items present; no dates |
| ESMA News | https://www.esma.europa.eu/rss.xml | regulation | high | — | Items present; no dates |
| BIS Press | https://www.bis.org/doclist/all_pressrels.rss | regulation | high | 2026-09-08 | `/rss.xml` is job listings — not used |
| White House News | https://www.whitehouse.gov/news/feed/ | regulation | high | 2026-09-17 | Must |
| FSB News | https://www.fsb.org/feed/ | regulation | high | 2026-09-11 | Extra |
| EBA News | https://www.eba.europa.eu/news-press/news/rss.xml | regulation | medium | 2026-09-18 | Extra |
| Bank of England News | https://www.bankofengland.co.uk/rss/news | regulation | medium | 2026-09-18 | Extra (PRA/FCA sibling) |
| Kitces Nerd's Eye View | https://feeds.feedburner.com/KitcesNerdsEyeView | advisor_tech | high | 2026-09-17 | First-party 403; AI keyword filter |
| InvestmentNews | https://www.investmentnews.com/rss | advisor_tech | high | 2026-09-18 | Advisor-tech path 404 |
| WealthManagement.com | https://www.wealthmanagement.com/rss.xml | wealthtech | high | 2026-09-18 | AI section RSS 404; filter AI |
| Financial Planning | https://www.financial-planning.com/feed?rss=true | practice | high | 2026-09-18 | Must |
| FA-Mag | https://www.fa-mag.com/rss.php | practice | high | 2026-09-18 | Must |
| RIABiz | https://www.riabiz.com/rss | practice | high | 2026-09-18 | `/feed` 404 |
| Abnormal Returns | https://abnormalreturns.com/feed/ | practice | medium | 2026-09-17 | Adviser-links feed empty |
| PlanSponsor AI | https://www.plansponsor.com/tag/artificial-intelligence/feed/ | practice | medium | 2026-09-16 | Prefer over sitewide |
| PlanAdviser AI | https://www.planadviser.com/tag/artificial-intelligence/feed/ | practice | medium | 2026-09-16 | Prefer over sitewide |
| AdvisorHub | https://www.advisorhub.com/feed/ | practice | high | 2026-09-17 | Extra; wirehouse/RIA moves |
| Wealth Solutions Report | https://www.wealthsolutionsreport.com/rss/ | wealthtech | high | 2026-09-17 | Extra |
| WealthTech Today | https://wealthtechtoday.com/feed/ | wealthtech | high | 2026-09-17 | Extra (Ezra Group) |
| T3 Technology Hub | https://t3technologyhub.com/feed/ | advisor_tech | high | 2026-09-16 | Extra |
| Robert Huebscher | https://roberthuebscher.substack.com/feed | practice | medium | 2026-09-14 | Extra |
| Professional Adviser | https://www.professionaladviser.com/feeds/rss | practice | medium | 2026-09-18 | Extra (UK) |
| International Adviser | https://www.international-adviser.com/feed/ | practice | medium | 2026-09-17 | Extra |
| Wealth Professional | https://www.wealthprofessional.ca/rss | practice | medium | 2026-09-18 | Extra (CA) |
| 401(k) Specialist | https://401kspecialistmag.com/feed/ | practice | medium | 2026-09-17 | Extra; filter AI |
| Retirement Income Journal | https://retirementincomejournal.com/feed/ | practice | medium | 2026-09-01 | Extra; filter AI |
| Finextra AI | https://www.finextra.com/rss/channel.aspx?channel=ai | banking_fintech | medium | 2026-09-18 | Must; AI channel |
| American Banker | https://www.americanbanker.com/feed?rss=true | banking_fintech | medium | 2026-09-18 | AI hub has no separate feed |
| Banking Dive | https://www.bankingdive.com/feeds/news/ | banking_fintech | medium | 2026-09-17 | Must; filter AI |
| ABA Banking Journal AI | https://bankingjournal.aba.com/tag/artificial-intelligence/feed/ | banking_fintech | medium | 2026-09-17 | Prefer over sitewide |
| Fintech Takes | https://fintechtakes.com/feed/ | banking_fintech | medium | 2026-09-18 | Must |
| Fintech Business Weekly | https://fintechbusinessweekly.substack.com/feed | banking_fintech | medium | 2026-09-16 | Must |
| Tearsheet AI | https://tearsheet.co/category/artificial-intelligence/feed/ | banking_fintech | medium | 2026-09-15 | Prefer over sitewide |
| PYMNTS AI | https://www.pymnts.com/category/news/artificial-intelligence/feed/ | banking_fintech | medium | 2026-09-18 | Extra |
| FinTech Futures | https://www.fintechfutures.com/rss.xml | banking_fintech | medium | 2026-09-18 | Extra |
| A-Team Insight | https://a-teaminsight.com/feed/ | banking_fintech | medium | 2026-09-18 | Extra (capital-markets tech) |
| LLRX AI in Finance | https://www.llrx.com/feed/ | research | medium | 2026-09-15 | Extra; primary-source roundup |
| Risk.net | https://www.risk.net/feeds/rss | institutional | medium | 2026-09-18 | Extra; salvage-parsed |
| Google News: RIA AI | news.google.com/rss/search?q=RIA+AI… | industry | medium | 2026-09-18 | Must |
| Google News: wealthtech AI | …q=wealthtech+AI… | wealthtech | medium | 2026-09-17 | Must |
| Google News: FINRA AI | …q=FINRA+artificial+intelligence… | regulation | medium | 2026-09-15 | Must; FINRA proxy |
| Google News: SEC AI washing | …q=SEC+"AI+washing"… | regulation | medium | 2026-08-18 | Must |
| Google News: advisor AI notetaker | …q=advisor+AI+notetaker… | advisor_tech | medium | 2026-09-14 | Must |
| Google News: wealth management copilot | …q="wealth+management"+copilot… | wealthtech | medium | 2026-08-30 | Must |
| OpenAI News | https://openai.com/news/rss.xml | labs | medium | 2026-09-17 | Finance-relevance filter later |
| Microsoft Blog | https://blogs.microsoft.com/feed/ | labs | medium | 2026-09-17 | `/ai/feed/` is HTTP 410 |
| NVIDIA Newsroom | https://nvidianews.nvidia.com/releases.xml | labs | medium | 2026-09-17 | Official newsroom |
| TechCrunch AI | https://techcrunch.com/category/artificial-intelligence/feed/ | industry | medium | 2026-09-17 | Must |
| The Verge AI | https://www.theverge.com/rss/ai-artificial-intelligence/index.xml | industry | medium | 2026-09-17 | Must |
| MIT Technology Review AI | https://www.technologyreview.com/topic/artificial-intelligence/feed | industry | medium | 2026-09-18 | Must |
| Ars Technica AI | https://arstechnica.com/ai/feed/ | industry | medium | 2026-09-17 | Must |
| Finews | https://www.finews.com/news/english-news?format=feed&type=rss | practice | medium | 2026-09-18 | Extra (CH private banking) |
| IPE | https://www.ipe.com/8133.rss | institutional | medium | 2026-09-18 | Extra |
| Investment Week | https://www.investmentweek.co.uk/feeds/rss | institutional | medium | 2026-09-18 | Extra |
| FT Asset Management | https://www.ft.com/asset-management?format=rss | institutional | medium | 2026-09-18 | Extra; paywalled body |
| FT Artificial Intelligence | https://www.ft.com/artificial-intelligence?format=rss | industry | medium | 2026-09-18 | Extra; paywalled body |
| CFA Institute Market Integrity Insights | https://blogs.cfainstitute.org/marketintegrity/feed/ | research | medium | 2026-09-15 | Enterprising Investor has no RSS |
| Insight Partners Ideas | https://www.insightpartners.com/feed/ | research | medium | 2026-09-17 | Extra |
| Adams Street Insights | https://www.adamsstreetpartners.com/insights/feed/ | research | low | 2026-09-16 | Extra |
| ETF Trends | https://www.etftrends.com/feed/ | markets | medium | 2026-09-18 | Extra; filter AI |

`requireAny` is set on any non-AI-specific feed (sitewide trade, bank, institutional, labs). AI-tagged section feeds and regulators are unfiltered.

## Must-consider outcomes

### Regulators

| Family | Outcome | Reason |
|---|---|---|
| SEC | **Keep** press + speeches | Litigation RSS 403 |
| FINRA | **Skip** | Cloudflare 403 on every path tried, including `/feed` and notices |
| NASAA | **Keep** | `/feed/` |
| CFTC | **Keep** | `/rss.xml` |
| Federal Reserve | **Keep** | `press_all.xml` + `speeches.xml` |
| OCC | **Skip** | No public RSS; `/rss/index-rss.html` is HTML; GovDelivery topic guesses 404 |
| FDIC | **Keep** | GovDelivery `USFDIC_26` |
| CFPB | **Keep** | Newsroom feed; blog feed empty |
| NY DFS | **Skip** | Cloudflare 403 |
| Treasury | **Keep** | `/rss.xml` |
| DOL / EBSA | **Skip** | Akamai 403 |
| NIST | **Keep** | Sitewide news RSS (Taking Measure blog is off-topic science) |
| FCA | **Keep** | RSS with items, no dates |
| ESMA | **Keep** | RSS with items, no dates |
| BIS | **Keep** | `doclist/all_pressrels.rss` |
| OECD | **Skip** | Cloudflare 403 |
| White House | **Keep** | `/news/feed/` |

### Trade

| Family | Outcome | Reason |
|---|---|---|
| Kitces | **Keep** | Feedburner only; kitces.com 403 |
| Advisor Perspectives | **Skip** | Cloudflare challenge |
| ThinkAdvisor | **Skip** | Cloudflare challenge |
| InvestmentNews | **Keep** | Sitewide `/rss`; advisor-tech `/feed` 404 |
| WealthManagement | **Keep** | Sitewide `rss.xml`; AI path 404 |
| Financial Planning | **Keep** | `feed?rss=true` |
| FA-Mag | **Keep** | `rss.php` |
| RIABiz | **Keep** | `/rss` |
| Citywire | **Skip** | HTML/bot wall; no parseable RSS |
| Abnormal Returns | **Keep** | Main feed |
| PlanSponsor | **Keep** | AI tag feed (sitewide XML was malformed but salvageable; tag feed cleaner) |
| PlanAdviser | **Keep** | AI tag feed |
| NAPA | **Skip** | 403 |
| BenefitsPRO | **Skip** | Cloudflare 403 |
| ETF.com | **Skip** | Cloudflare 403 |
| Institutional Investor | **Skip** | `rss.xml` stale (newest 2025-06-11) |
| Pensions & Investments | **Skip** | Access denied |
| AI-CIO | **Skip** | Feed abandoned (newest 2022-10-07) |
| Ignites / FundFire | **Skip** | Login/paywall redirects; no public RSS |

### Fintech / bank

| Family | Outcome | Reason |
|---|---|---|
| Finextra | **Keep** | AI channel RSS |
| American Banker | **Keep** | Sitewide `feed?rss=true` |
| Financial Brand | **Skip** | Cloudflare 403 |
| Banking Dive | **Keep** | `/feeds/news/` |
| ABA Banking Journal | **Keep** | AI tag feed |
| Bank Automation News | **Skip** | Cloudflare 403 |
| Fintech Takes | **Keep** | `/feed/` |
| Fintech Brainfood | **Skip** | Timeout / 404; no Ghost/Substack feed |
| Fintech Business Weekly | **Keep** | Substack `/feed` |
| Tearsheet | **Keep** | AI category feed |

### Labs / tech

| Family | Outcome | Reason |
|---|---|---|
| OpenAI | **Keep** | `news/rss.xml` |
| Microsoft AI | **Keep** | Sitewide blog; `/ai/feed/` HTTP 410 |
| NVIDIA | **Keep** | `nvidianews.nvidia.com/releases.xml` |
| TechCrunch AI | **Keep** | Category feed |
| The Verge AI | **Keep** | Section Atom |
| MIT Technology Review | **Keep** | Topic feed |
| Ars Technica | **Keep** | `/ai/feed/` |
| Axios | **Skip** | Only `api.axios.com/feed/` works — general politics, not AI |
| Reuters tech | **Skip** | Agency feed 404; `feeds.reuters.com` NXDOMAIN; site RSS 404 |

### Wirehouses / custodians / AM

All must-consider newsrooms were probed (Morgan Stanley, JPM, BlackRock, Vanguard Advisors, Fidelity, Schwab, UBS, Wells Fargo, Goldman insights). **None expose a public parseable RSS.** Typical results: 404 on `/feed`/`rss`, or 403. Not kept.

BNY, LPL, State Street, BofA newsrooms also failed the same way.

### Consulting

| Family | Outcome | Reason |
|---|---|---|
| McKinsey FS | **Skip** | `insights/rss` has 50 items but **no dates** — cannot prove 90-day freshness |
| Deloitte CFS | **Skip** | No RSS (404 / HTML) |
| CFA Enterprising Investor | **Skip** | `blogs.cfainstitute.org/investor/feed/` is HTML after site migration |
| CFA Market Integrity | **Keep (extra)** | Working substitute on the same institute |

### Google News + PR wires

| Family | Outcome | Reason |
|---|---|---|
| Google News (6 queries) | **Keep** | All six search RSS feeds parse and are fresh |
| PR Newswire FS list | **Skip** | Parseable but unfiltered junk (webinars, shipping, insurance) |
| PR Newswire “wealth management AI” search | **Skip** | No RSS search endpoint (HTML only) |
| Business Wire industry RSS | **Skip** | Channel keys return empty “channel you requested was not found” |
| GlobeNewswire finance/banking | **Skip** | Timeouts |

## Independent extras that were found and kept

AdvisorHub; Wealth Solutions Report; WealthTech Today; T3 Technology Hub; Robert Huebscher; Professional Adviser; International Adviser; Wealth Professional (Canada); 401(k) Specialist; Retirement Income Journal; PYMNTS AI; FinTech Futures; A-Team Insight; LLRX; Risk.net; FSB; EBA; Bank of England; Finews; IPE; Investment Week; FT Asset Management; FT AI; CFA Market Integrity Insights; Insight Partners; Adams Street; ETF Trends.

## Notable extras probed and dropped

| Source | Reason |
|---|---|
| WealthTech Strategy | PR-digest aggregator (prefer original reporting) |
| Sifted | EU VC firehose; weak RIA fit |
| The Fintech Times | Low-signal product PR |
| Payments Dive | Payments-adjacent; not wealth/RIA |
| Axios general feed | Not an AI feed |
| Bank Director | Stale since 2023-05 |
| DigFin | Stale (newest 2025-07) |
| Ezra Group | Stale since 2021 |
| AI-CIO | Stale since 2022 |
| Institutional Investor | Stale since 2025-06 |
| AI Advisor Stack | Newsletter host 404; no `/feed` |
| Citywire Wealth Manager / NMA | Bot wall |
| FT Adviser / PWM / Family Wealth Report | 403 or 404 |
| IOSCO / FinCEN / NFA / EIOPA / SIFMA / ICI / CFP Board | 403/404; no working RSS |
| WatersTechnology / Celent / F2 Strategy | No parseable recent feed |

## Quality notes

- Prefer **section/AI tag feeds** (PlanSponsor, PlanAdviser, Tearsheet, ABA BJ, Finextra, PYMNTS) over sitewide copies of the same host.
- **Kitces** and **RIABiz** only work on non-obvious URLs; do not “fix” them back to `/feed/`.
- **FINRA, ThinkAdvisor, Advisor Perspectives, Financial Brand, ETF.com, P&I, NY DFS, OECD, DOL** look like they *should* have feeds but are WAF-blocked from this probe environment. Re-try from a residential IP or with a feed reader cookie before giving up permanently.
- Wirehouse/AM “insights” pages are scrape-only. Do not invent RSS URLs.
- Google News query feeds are aggregators (duplicates of trade press). Useful as a FINRA/SEC safety net; demote when first-party trade feeds overlap.
- FCA/ESMA items have no `pubDate`; treated as regulators so they stay. Downstream scoring should not treat `newestItem: null` as stale.
