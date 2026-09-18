# Curated RSS/Atom feed probe (RIA-AI-Drudge)

Probed **18 September 2026** against tiers 1–9 in `ai-news-sources-RIA.md` (RSS and RSS/Email only).

## Method

For each RSS-marked source: fetched the homepage/section URL (browser UA, 8s timeout), collected `<link rel="alternate" type="application/rss+xml|atom+xml">` plus in-page feed hrefs, then tried conventional paths (`/feed`, `/feed/`, `/rss`, `/rss.xml`, `/feed.xml`, `/atom.xml`, `/index.xml`, `{path}/feed`). Substack-style origins also tried `/feed`. Podcasts used the Apple page plus iTunes `lookup` `feedUrl`. Each unique candidate was HTTP-probed (HEAD then GET). XML had to parse as RSS or Atom with items.

## Quality rules applied

- No guessed URLs in the KEEP list — every keeper was a successful 200 parse.
- Paywall-only / email-only / scrape-only skipped unless a real public feed was found.
- Feeds whose newest item is older than 90 days (before 2026-06-20) skipped unless a regulator.
- Identical feed URLs kept once (highest-signal source).
- Unfiltered PR-wire firehoses skipped (no company-filtered public feed found).

## Counts

- Sources evaluated: **94**
- Candidate URLs attempted: **~1,070** (991 unique first-pass candidates + targeted follow-ups)
- KEEP: **48** unique feeds
- SKIP: **46**

## Results

| Source | Page URL | Feed URL | Status | Newest item | Decision | Reason |
|---|---|---|---|---|---|---|
| WealthManagement.com — AI | https://www.wealthmanagement.com/artificial-intelligence | https://www.wealthmanagement.com/rss.xml | 200 | 2026-09-18 | KEEP | Valid site-wide RSS (section URL 404; no AI-only feed). Fresh items including advisor AI/tech. |
| WealthManagement.com — RIA news | https://www.wealthmanagement.com/ria-news | https://www.wealthmanagement.com/rss.xml | 200 | 2026-09-18 | SKIP | Identical feed URL to WealthManagement.com — AI; section page 404. |
| InvestmentNews — Advisor Tech | https://www.investmentnews.com/advisor-tech | https://www.investmentnews.com/rss | 200 | 2026-09-18 | KEEP | Valid site-wide Atom; no advisor-tech section feed. |
| InvestmentNews — Transformation | https://www.investmentnews.com/transformation | https://www.investmentnews.com/rss | 200 | 2026-09-18 | SKIP | Identical feed URL to InvestmentNews — Advisor Tech; no section feed. |
| Kitces — Technology & Advisor FinTech | https://www.kitces.com/blog/category/19-technology-advisor-fintech/ | https://feeds.feedburner.com/KitcesNerdsEyeView | 200 | 2026-09-17 | KEEP | WordPress category /feed 403 (Cloudflare). Feedburner Nerd's Eye View RSS parses and is fresh. Page also linked a Libsyn podcast (not the blog); not used. |
| Financial Planning | https://www.financial-planning.com | https://www.financial-planning.com/feed?rss=true | 200 | 2026-09-18 | KEEP | Arizent RSS via feed?rss=true; HTML /feed is not XML. |
| ThinkAdvisor | https://www.thinkadvisor.com | — | 403 | — | SKIP | Homepage and conventional feed paths return 403; no public feed verified. |
| Financial Advisor Magazine | https://www.fa-mag.com | https://www.fa-mag.com/rss | 200 | 2026-09-18 | KEEP | Valid RSS; fresh. |
| RIABiz | https://www.riabiz.com | https://api.riabiz.com/rss | 200 | 2026-09-18 | KEEP | Valid RSS at api.riabiz.com/rss; fresh. |
| Wealth Solutions Report | https://wealthsolutionsreport.com | https://www.wealthsolutionsreport.com/rss/ | 200 | 2026-09-17 | KEEP | Valid RSS; fresh. |
| Advisor Perspectives | https://www.advisorperspectives.com | — | 403 | — | SKIP | Cloudflare challenge on homepage and /feed /rss; no public feed verified. |
| Robert Huebscher Substack | https://roberthuebscher.substack.com | https://roberthuebscher.substack.com/feed | 200 | 2026-09-14 | KEEP | Substack /feed; fresh. |
| AI Advisor Stack | https://newsletter.aiadvisorstack.com | — | 404 | — | SKIP | Beehiiv publication; page JSON has rss_url:null. /feed /rss /feed.xml 404. Email-only. |
| WealthTech Today | https://wealthtechtoday.com | https://wealthtechtoday.com/feed/ | 200 | 2026-09-17 | KEEP | WordPress /feed; fresh. |
| T3 Technology Hub | https://t3technologyhub.com | https://t3technologyhub.com/feed/ | 200 | 2026-09-16 | KEEP | WordPress /feed; fresh. |
| WealthTech Strategy | https://www.wealthtechstrategy.com | https://www.wealthtechstrategy.com/blog-feed.xml | 200 | 2026-09-17 | KEEP | Discovered blog-feed.xml; fresh. |
| Abnormal Returns | https://abnormalreturns.com | https://abnormalreturns.com/feed/ | 200 | 2026-09-17 | KEEP | WordPress /feed; fresh. Comments feed is stale and unused. |
| AI for Advisors (podcast) | https://podcasts.apple.com/us/podcast/ai-for-advisors/id1868295133 | https://anchor.fm/s/1086ac6ac/podcast/rss | 200 | 2026-09-01 | KEEP | iTunes lookup feedUrl; Anchor RSS parses; newest episode 2026-09-01. |
| The WealthStack Podcast | https://www.wealthmanagement.com/artificial-intelligence | https://www.wealthmanagement.com/rss.xml | 200 | 2026-09-18 | SKIP | No dedicated podcast RSS (Megaphone path 404). Only site-wide WM RSS, duplicate of WealthManagement.com — AI. |
| Diamond Consultants | https://www.diamond-consultants.com | https://www.diamond-consultants.com/feed/ | 200 | 2026-09-17 | KEEP | WordPress /feed; fresh. |
| RIA Collective (podcast) | https://www.riacollective.com/episodes/ | https://rss.buzzsprout.com/2014808.rss | 200 | 2026-09-07 | KEEP | Buzzsprout podcast RSS from page; fresh. |
| American Banker — AI Intelligence | https://www.americanbanker.com/ai | https://www.americanbanker.com/ai.rss | 200 | — | SKIP | Dedicated /ai.rss is empty (0 items). Site-wide feed exists but is less specific than the AI tag feed kept below. |
| American Banker — AI tag | https://www.americanbanker.com/artificial-intelligence | https://www.americanbanker.com/artificial-intelligence.rss | 200 | 2026-09-18 | KEEP | Section RSS with current AI/banking items. |
| Finextra — AI | https://finextra.com/news/finchannel.aspx?topic=ai | https://www.finextra.com/rss/channel.aspx?channel=ai | 200 | 2026-09-18 | KEEP | Official AI channel RSS; homepage was 403. Fresh. |
| FinTech Global | https://fintech.global | https://fintech.global/feed/ | 200 | 2026-09-18 | KEEP | WordPress /feed; fresh. |
| The Financial Brand | https://thefinancialbrand.com | — | 403 | — | SKIP | Cloudflare 403 on homepage and /feed; no public feed verified. |
| Bank Automation News | https://bankautomationnews.com | — | 403 | — | SKIP | Cloudflare 403 on homepage and /feed; no public feed verified. |
| ABA Banking Journal | https://bankingjournal.aba.com | https://bankingjournal.aba.com/feed/ | 200 | 2026-09-17 | KEEP | WordPress /feed; fresh. |
| Fintech Takes | https://fintechtakes.com | https://fintechtakes.com/feed/ | 200 | 2026-09-18 | KEEP | WordPress /feed; fresh. |
| Fintech Brainfood | https://www.fintechbrainfood.com | — | 404 | — | SKIP | Beehiiv publication; rss_url:null. Conventional paths 404. Email-only. |
| Fintech Business Weekly | https://fintechbusinessweekly.substack.com | https://fintechbusinessweekly.substack.com/feed | 200 | 2026-09-16 | KEEP | Substack /feed; fresh. |
| LLRX | https://www.llrx.com | https://www.llrx.com/feed/ | 200 | 2026-09-15 | KEEP | WordPress /feed; fresh. |
| FINRA — Regulatory Notices | https://www.finra.org/rules-guidance/notices | — | 403 | — | SKIP | Cloudflare 403 on notices page, syndication page, and common RSS paths. No feed verified (not guessed). |
| SEC — Press releases | https://www.sec.gov/news/pressreleases | https://www.sec.gov/news/pressreleases.rss | 200 | 2026-09-17 | KEEP | Official press-release RSS; fresh. |
| SEC — Speeches and statements | https://www.sec.gov/news/speeches-statements | https://www.sec.gov/news/speeches-statements.rss | 200 | 2026-09-17 | KEEP | Official speeches RSS; fresh. |
| NASAA | https://www.nasaa.org | https://www.nasaa.org/feed/ | 200 | 2026-09-17 | KEEP | WordPress /feed; fresh. |
| CFTC | https://www.cftc.gov | https://www.cftc.gov/rss.xml | 200 | 2026-09-15 | KEEP | Official rss.xml; fresh. |
| Federal Reserve | https://www.federalreserve.gov | https://www.federalreserve.gov/feeds/press_all.xml | 200 | 2026-09-16 | KEEP | Official all-press feed. Also verified monetary/enforcement/speeches topic feeds; keeping the combined press feed. |
| OCC | https://www.occ.gov | https://www.occ.gov/rss/occ_news.xml | 200 | 2026-09-17 | KEEP | Official news RSS; fresh. |
| FDIC | https://www.fdic.gov | https://www.fdic.gov/rss.xml | 200 | 2026-09-14 | KEEP | Official rss.xml; fresh. |
| NY DFS | https://www.dfs.ny.gov | — | 403 | — | SKIP | Cloudflare 403 on homepage and press-release XML candidates; no feed verified. |
| Sidley Austin — Insights | https://www.sidley.com/en/insights | — | 404 | — | SKIP | Homepage 200; /rss and /en/insights/rss are HTML/404, not RSS. |
| Eversheds Sutherland | https://www.eversheds-sutherland.com | — | 404 | — | SKIP | No RSS/Atom at conventional paths. |
| Morgan Lewis | https://www.morganlewis.com | — | 404 | — | SKIP | No RSS/Atom at conventional paths. |
| Debevoise | https://www.debevoise.com | — | 404 | — | SKIP | No RSS/Atom at conventional paths. |
| Davis Polk | https://www.davispolk.com | — | 404 | — | SKIP | No RSS/Atom at conventional paths. |
| Ropes & Gray | https://www.ropesgray.com | — | 403 | — | SKIP | Homepage 403; no public feed verified. |
| Risk Management Magazine | https://www.rmmagazine.com | — | 404 | — | SKIP | /feed and /rss.xml 404; no public feed verified. |
| Ncontracts blog | https://www.ncontracts.com | — | 404 | — | SKIP | Vendor site; no public RSS at conventional paths. |
| ComplySci / NRS | https://www.complysci.com | https://www.comply.com/feed/ | 200 | 2026-08-19 | SKIP | Candidate resolved to comply.com (1 item). Not verified as ComplySci/NRS; later re-fetch timed out. |
| Smarsh | https://www.smarsh.com | — | 403 | — | SKIP | Homepage 403; no public feed verified. |
| Hadrius | https://www.hadrius.com | — | 404 | — | SKIP | Vendor site; no public RSS at conventional paths. |
| Zocks | https://www.zocks.io | — | 404 | — | SKIP | Vendor site; no public RSS at conventional paths. |
| Institutional Investor | https://www.institutionalinvestor.com | https://www.institutionalinvestor.com/rss.xml | 200 | 2025-06-11 | SKIP | Valid RSS but stale (newest item older than 90 days; not a regulator). |
| Pensions & Investments | https://www.pionline.com | — | 403 | — | SKIP | Access Denied on homepage and /rss.xml /feed; paywall/WAF. No public feed verified. |
| Chief Investment Officer | https://www.ai-cio.com | https://www.ai-cio.com/feed/ | 200 | 2022-10-07 | SKIP | Valid RSS but dead/stale (newest 2022-10-07). |
| Pensions Expert | https://www.pensions-expert.com | — | 404 | — | SKIP | Homepage 200; /feed and /rss 404. No public feed verified. |
| ETF.com | https://www.etf.com | — | 403 | — | SKIP | Cloudflare 403 on homepage and /feed; no public feed verified. |
| Emerj AI Research | https://emerj.com | https://emerj.com/feed/ | 200 | 2026-09-14 | KEEP | WordPress /feed; fresh. |
| Reuters — Wealth / Business | https://www.reuters.com | — | 401 | — | SKIP | Homepage 401; Reuters Agency feed URLs 404. No public feed verified. |
| McKinsey — Financial Services | https://www.mckinsey.com/industries/financial-services | https://www.mckinsey.com/insights/rss | 200 | 2026-09-18 | KEEP | Insights RSS (site-wide, not FS-only). Dates in pubDate; fresh. Filter required. |
| Deloitte Center for Financial Services | https://www2.deloitte.com | — | 404 | — | SKIP | Homepage 200; RSS candidates HTML/404 or non-well-formed. No public feed verified. |
| Insight Partners | https://www.insightpartners.com/ideas | https://www.insightpartners.com/feed/ | 200 | 2026-09-17 | KEEP | WordPress /feed; fresh. |
| Adams Street Partners | https://www.adamsstreetpartners.com/insights | https://www.adamsstreetpartners.com/insights/feed/ | 200 | 2026-09-16 | KEEP | Insights category feed; fresher than site root /feed. |
| Morningstar | https://www.morningstar.com | — | 202 | — | SKIP | Homepage 200; /rss /feed /news/rss return empty 202. No public feed verified. |
| eMoney Advisor blog | https://emoneyadvisor.com/blog | https://emoneyadvisor.com/feed/ | 200 | 2026-09-16 | KEEP | WordPress /feed; vendor-authored planner blog; fresh. |
| Morgan Stanley newsroom | https://www.morganstanley.com | — | 404 | — | SKIP | No newsroom RSS at conventional paths (press pages 403/404). |
| Wells Fargo newsroom | https://newsroom.wf.com | — | 403 | — | SKIP | Newsroom 403; no public feed verified. |
| Citi newsroom | https://www.citigroup.com/global/news | — | 404 | — | SKIP | No public RSS at conventional paths. |
| JPMorgan newsroom | https://www.jpmorganchase.com/news | — | 404 | — | SKIP | News page 404; no public RSS verified. |
| Merrill / BofA newsroom | https://newsroom.bankofamerica.com | — | 404 | — | SKIP | No public RSS at conventional paths. |
| UBS newsroom | https://www.ubs.com/global/en/media.html | — | 404 | — | SKIP | No public RSS at conventional paths. |
| Reuters — Technology / AI | https://www.reuters.com/technology | — | 401 | — | SKIP | Section/agency feed candidates 401/404. No public feed verified. |
| Axios AI+ | https://www.axios.com/technology/artificial-intelligence | https://api.axios.com/feed/ | 200 | 2026-09-18 | KEEP | No AI+-only feed. Site-wide Axios RSS at api.axios.com/feed/; filter required. |
| TechCrunch AI | https://techcrunch.com/category/artificial-intelligence/ | https://techcrunch.com/category/artificial-intelligence/feed/ | 200 | 2026-09-17 | KEEP | Category WordPress feed (preferred over site-wide /feed/). |
| The Verge AI | https://www.theverge.com/ai-artificial-intelligence | https://www.theverge.com/rss/ai-artificial-intelligence/index.xml | 200 | 2026-09-18 | KEEP | Section Atom feed. |
| MIT Technology Review | https://www.technologyreview.com | https://www.technologyreview.com/topic/artificial-intelligence/feed/ | 200 | 2026-09-18 | KEEP | AI topic feed (preferred over site-wide /feed/). |
| Ars Technica AI | https://arstechnica.com/ai/ | https://arstechnica.com/ai/feed/ | 200 | 2026-09-17 | KEEP | AI section WordPress feed (preferred over site-wide). |
| Anthropic News | https://www.anthropic.com/news | — | 404 | — | SKIP | News page 200; /news/rss.xml and /rss.xml 404. No public feed. |
| OpenAI News | https://openai.com/news | https://openai.com/news/rss.xml | 200 | 2026-09-17 | KEEP | Official news RSS; fresh. |
| Google DeepMind Blog | https://deepmind.google/discover/blog | https://deepmind.google/blog/rss.xml | 200 | 2026-09-15 | KEEP | Official blog RSS (path /blog/rss.xml); fresh. |
| Microsoft AI Blog | https://blogs.microsoft.com/ai | https://news.microsoft.com/source/feed/ | 200 | 2026-09-17 | KEEP | Listed blogs.microsoft.com/ai is 410. Official Microsoft Source RSS discovered; current AI items. Cloud blog /feed also works (older). |
| Nvidia Newsroom | https://nvidianews.nvidia.com | https://nvidianews.nvidia.com/releases.xml | 200 | 2026-09-17 | KEEP | Official releases.xml (rss.xml equivalent); fresh. |
| Ben's Bites | https://bensbites.com | https://www.bensbites.com/feed | 200 | 2026-09-17 | KEEP | Public RSS (redirects to www); not email-only. |
| Import AI | https://importai.substack.com | https://importai.substack.com/feed | 200 | 2026-09-07 | KEEP | Substack /feed; fresh. |
| Stratechery | https://stratechery.com | https://stratechery.com/feed/ | 200 | 2026-09-17 | KEEP | Public RSS exists (body may be paywalled); fresh. |
| Exponential View | https://www.exponentialview.co | https://www.exponentialview.co/feed | 200 | 2026-09-17 | KEEP | Public /feed; fresh. |
| Morgan Stanley Research / Ideas | https://www.morganstanley.com/ideas | — | 404 | — | SKIP | /ideas/rss and /rss 404. No public research feed. |
| Citrini Research | https://www.citriniresearch.com | https://www.citriniresearch.com/feed | 200 | 2026-09-16 | KEEP | Public /feed; fresh. |
| SemiAnalysis | https://semianalysis.com | https://semianalysis.com/feed/ | 200 | 2025-09-16 | SKIP | Valid RSS but stale (newest item 2025-09-16, older than 90 days). Comments feed also stale. |
| U.S. News Money — Investing | https://money.usnews.com/investing | https://feeds.feedburner.com/usnews/money | 200 | 2026-09-17 | SKIP | Investing page/rss timed out. Feedburner usnews/money is a mortgage-rate firehose, not the investing section. |
| Business Wire | https://www.businesswire.com | https://feed.businesswire.com/rss/home/?rss=G1QFDERJXkJeEFpQWg== | 200 | 2026-09-18 | SKIP | Valid but unfiltered global firehose. No company/keyword-filtered public feed verified. |
| PR Newswire | https://www.prnewswire.com | https://www.prnewswire.com/rss/news-releases-list.rss | 200 | 2026-09-18 | SKIP | Valid but unfiltered global firehose. No company-filtered public feed verified. |
| GlobeNewswire | https://www.globenewswire.com | — | timeout | — | SKIP | Homepage and RSS/Atom candidates timed out (8–10s). No feed verified. |

## Notes

- WealthManagement.com AI and RIA section pages 404; only the site-wide `rss.xml` works. One future-dated CMS item (2027-02-22) appears in that feed; editorial pubDates are current as of 2026-09-18.
- Kitces category WordPress feed is Cloudflare-blocked; Feedburner is the verified public blog feed (all Nerd's Eye View, not tech-only).
- Microsoft’s listed AI blog URL is gone (410). Keeper is the official Microsoft Source feed.
- FINRA, NY DFS, ThinkAdvisor, Advisor Perspectives, and several trade sites are WAF/403 from this probe environment — they may still publish feeds that a residential browser can see.
