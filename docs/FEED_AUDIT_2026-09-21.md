# Feed audit — 21 September 2026

Audience check for RIA AI Report: RIAs, broker-dealers, and wealth professionals following AI (advisor tech, wealthtech, regulation, compliance, banking and fintech AI, and AI as an investment theme). Suggestions only. Nothing in `scripts/sources.ts` or `scripts/scrape-sources.ts` was changed.

## Method

Probed **2026-09-21T17:34Z** from this machine.

- All **107** RSS/Atom URLs in `scripts/sources.ts`. Browser user agent, 10 second timeout, one retry, concurrency 6. Parsed with the same `fast-xml-parser` settings as `scripts/fetch-feeds.ts`.
- For each feed: HTTP status, item count, newest item date, and whether the newest 15 items pass that feed’s `requireAny` list (`AI_FILTER`, `SUPERVISION_FILTER`, or `FINANCE_OR_ENTERPRISE`). The build uses the same 15-item cap.
- Sample titles (up to five that passed the filter, otherwise the three newest raw titles) were read for editorial fit.
- `npm run validate:feeds` was not run as a second pass. It records liveness and age only, not titles or filter hits. This probe covers those liveness checks and finished in about 33 seconds.
- Last-build column is `feedStats` from `public/data/headlines.json` generated **2026-09-21T17:42Z** (112 stats: 107 RSS + 5 scrapers). That count is after `requireAny` and the per-source cap, before the age window and dedup. `FAIL 0` means that build’s fetch failed. An earlier file from 2026-09-20T13:41Z had nine fetch failures (FA Magazine, Robert Huebscher, WealthTech Today, Diamond Consultants, Fintech Business Weekly, VentureBeat AI, Import AI, ETF Trends, Envestnet). The 17:42 build recovered all of those except VentureBeat. This probe still parsed VentureBeat (7 items, newest 2026-08-27), so that failure is intermittent.
- HTML scrapers: the file has **five** HTML sources. Anthropic News and Anthropic Research use the card regex. FINRA Notices, Jump, and Zocks use the extractors in `scripts/lib/listingCards.ts`. Each listing page was fetched with the same browser user agent and 10 second timeout, then run through the extractor the build uses. UK AISI and Gray Swan are not in the file.

A feed can be HTTP 200 and still be a bad fit: off-topic firehose, vendor spam, no AI hits inside the 15 items the build actually reads, stale, or a duplicate of a better feed.

## Counts

| | |
|---|---|
| Configured | **112** (107 RSS/Atom + 5 HTML scrapers) |
| HTTP/parse OK with items | **107 / 107** RSS (103 newest under 60 days, 2 stale, 2 with no parseable date). All 5 scrapers returned HTTP 200. |
| Zero-item feeds | **0** RSS parsed empty. FINRA Notices parsed 34 rows and kept 0 after the keyword filter. |
| Fail (HTTP, timeout, or parse) | **0** on this probe. The 17:42 build still marks VentureBeat AI as a fetch failure. |
| Zero AI hits in the newest 15 | **15** RSS feeds (see reasons; most are regulators) |
| KEEP | **66** |
| WATCH | **34** |
| SUGGEST-REMOVE | **12** |

Zero-pass RSS feeds this probe: FA Magazine, AdvisorHub, Professional Adviser, CFTC Press, Federal Reserve, OCC News, FDIC Press, CFPB Newsroom, Treasury Press, FCA News, EBA News, Bank of England, IPE, Investment Week, Orion (vendor).

## Results

| Name | URL | Category | HTTP / parse | Newest item | Kept in 2026-09-21 build | Verdict | Reason |
|---|---|---|---|---|---|---|---|
| Kitces — Advisor FinTech | https://feeds.feedburner.com/KitcesNerdsEyeView | advisor_tech | 200 OK | 2026-09-21 | 1 | KEEP | September AdvisorTech roundup (2026-09-07) is the right column; only 1 of 11 items matches, and it sits just outside the 8-day advisor-tech window. |
| InvestmentNews | https://www.investmentnews.com/rss | advisor_tech | 200 OK | 2026-09-21 | 1 | KEEP | Fresh hit today: AI chatbots giving wrong financial answers. Thin (1 of the newest 15) but on the desk. |
| WealthManagement.com | https://www.wealthmanagement.com/rss.xml | wealthtech | 200 OK | 2027-02-22 | 3 | KEEP | Current AI hits (retail Anthropic risk, WealthStack/Envestnet, Allworth’s AI stack). One item is future-dated 2027-02-22. |
| Financial Planning | https://www.financial-planning.com/feed?rss=true | practice | 200 OK | 2026-09-18 | 1 | KEEP | “Advisors want more client time. Is AI actually giving it to them?” (2026-09-17). Right story, low volume. |
| FA Magazine | https://www.fa-mag.com/rss.php | practice | 200 OK | 2026-09-21 | 0 | WATCH | Live, 237 items, 21 AI matches in the full file (Schwab/Claude, Black Diamond, advisor time). Zero in the newest 15, which is all the build reads. Do not drop. |
| RIABiz | https://www.riabiz.com/rss | practice | 200 OK | 2026-09-18 | 6 | KEEP | Best RIA AI reporting in the set: Schwab/Anthropic, Savvy, Bicknell’s bots, Altruist Hazel, Hamachi. 6 of 20 match. |
| Wealth Solutions Report | https://www.wealthsolutionsreport.com/rss/ | wealthtech | 200 OK | 2026-09-21 | 4 | KEEP | On-desk and current, including the Claude-for-advisors launch and “AI is the headline” for RIA founders. |
| Robert Huebscher | https://roberthuebscher.substack.com/feed | practice | 200 OK | 2026-09-14 | 3 | WATCH | Feed is live (yesterday’s build failed). The AI essays in the newest 15 are from 2026-05-28, so the age window drops them. |
| AdvisorHub | https://www.advisorhub.com/feed/ | practice | 200 OK | 2026-09-21 | 0 | WATCH | 10-item feed is all market/wire copy this week (0 AI). Their CogniCor/SEC agentic pieces are arriving via Google News instead. |
| Professional Adviser | https://www.professionaladviser.com/feeds/rss | practice | 200 OK | 2026-09-21 | 0 | WATCH | UK adviser firehose. AI stories reached the 2026-09-20 page, then fell out of the newest-15 cap by this probe (0 of 40’s top 15). |
| AI for Advisors (podcast) | https://anchor.fm/s/1086ac6ac/podcast/rss | advisor_tech | 200 OK | 2026-09-01 | 15 | WATCH | Episodes are on mission (agents, note-takers, CRM) but the latest is 2026-09-01, outside the 8-day window, so nothing is on the page. |
| RIA Collective (podcast) | https://rss.buzzsprout.com/2014808.rss | practice | 200 OK | 2026-09-07 | 0 | WATCH | AI episodes (Hoskin, Clawson, Sova) newest-match 2026-08-04. The 2026-09-07 episode did not match. Low priority and quiet. |
| WealthTech Today | https://wealthtechtoday.com/feed/ | wealthtech | 200 OK | 2026-09-17 | 10 | KEEP | Dedicated wealthtech show, all 10 items relevant (agentic suites, Copilot vocabulary). Yesterday’s fetch failure was transient. |
| T3 Technology Hub | https://t3technologyhub.com/feed/ | wealthtech | 200 OK | 2026-09-16 | 10 | KEEP | Unfiltered wealthtech product news that is actually the beat: Vanilla agentic planning, Zeplyn Agent Studio, Robinhood Cortex. |
| Abnormal Returns | https://abnormalreturns.com/feed/ | practice | 200 OK | 2026-09-21 | 5 | WATCH | One clear AI links post (“the AI safety debate”). The other four kept items are daily link blogs whose bodies merely mention AI. |
| Diamond Consultants | https://www.diamond-consultants.com/feed/ | practice | 200 OK | 2026-09-17 | 1 | WATCH | Recruiting blog. One AssetMark capacity piece matches only because the summary says “technology, and AI.” Yesterday’s fetch failed. |
| GN: advisor AI notetaker | https://news.google.com/rss/search?q=advisor+AI+notetaker+OR+%22meeting+notes%22+RIA&hl=en-US&gl=US&ceid=US:en | advisor_tech | 200 OK | 2026-09-21 | 15 | KEEP | Best Google query in the list: Wealth Solutions Report, InvestmentNews, ThinkAdvisor/Cerulli, AdvisorHub. Fresh 2026-09-21. |
| GN: wealth copilot | https://news.google.com/rss/search?q=%22wealth+management%22+copilot+OR+%22advisor+copilot%22&hl=en-US&gl=US&ceid=US:en | wealthtech | 200 OK | 2026-08-30 | 15 | SUGGEST-REMOVE | Newest result 2026-08-30 and nothing on the last page. Query collides with the consumer app Copilot Money. |
| Finextra AI | https://www.finextra.com/rss/channel.aspx?channel=ai | banking_fintech | 200 OK | 2026-11-05 | 15 | KEEP | Dedicated AI channel, payments/reg-change items are in scope for banking. Newest stamp is future-dated 2026-11-05. |
| ABA Banking Journal AI | https://bankingjournal.aba.com/tag/artificial-intelligence/feed/ | banking_fintech | 200 OK | 2026-09-21 | 10 | KEEP | Tag feed is current: examiner AI-risk tool, banks’ wealth units, time AI gives back. |
| American Banker AI | https://www.americanbanker.com/artificial-intelligence.rss | banking_fintech | 200 OK | 2026-09-21 | 15 | KEEP | AI-tagged and fresh. Mixes commerce (Shopify/Meta checkout) with bank AI build-out and agentic payments. |
| FinTech Global | https://fintech.global/feed/ | banking_fintech | 200 OK | 2026-09-21 | 4 | WATCH | PR wire. Real hits (AI due diligence, insurer AI) sit next to funding rounds that match only in the summary. Yesterday’s page had a useful DDQ item. |
| Banking Dive | https://www.bankingdive.com/feeds/news/ | banking_fintech | 200 OK | 2026-09-21 | 3 | KEEP | State-regulator AI exam framework and Stripe’s AI-bot wallet are on mission. One M&A brief looks like a summary match. |
| Fintech Takes | https://fintechtakes.com/feed/ | banking_fintech | 200 OK | 2026-09-18 | 2 | WATCH | High-quality when it hits, but the two AI posts in this file are dated 2026-05-29 while the feed itself updated 2026-09-18. |
| Fintech Business Weekly | https://fintechbusinessweekly.substack.com/feed | banking_fintech | 200 OK | 2026-09-20 | 3 | WATCH | Parses today (yesterday failed). Newest AI/compliance item is 2026-08-19, outside the 8-day banking window. |
| Tearsheet AI | https://tearsheet.co/category/artificial-intelligence/feed/ | banking_fintech | 200 OK | 2026-09-15 | 10 | KEEP | Category feed is all AI and mostly banking: agentic dispute ops, Titan, BofA, Plaid. Newest 2026-09-15. |
| PYMNTS AI | https://www.pymnts.com/category/news/artificial-intelligence/feed/ | banking_fintech | 200 OK | 2026-09-21 | 10 | KEEP | Current banking-relevant AI (BofA ventures, agentic lending, government guardrails) plus some commerce. |
| FinTech Futures | https://www.fintechfutures.com/rss.xml | banking_fintech | 200 OK | 2026-09-21 | 5 | KEEP | Fresh and in scope: Evergreen.ai advice app, Danske agentic payment, Sibos AI-in-finance panels. |
| A-Team Insight | https://a-teaminsight.com/feed/ | banking_fintech | 200 OK | 2026-09-21 | 4 | KEEP | Capital-markets AI an RIA compliance desk can use: insider-trading surveillance models, generative AI in the communications record. |
| LLRX | https://www.llrx.com/feed/ | compliance | 200 OK | 2026-09-19 | 1 | KEEP | Thin but exact: “AI in Finance and Banking, September 15, 2026.” |
| Debevoise Data Blog | https://www.debevoisedatablog.com/feed/ | compliance | 200 OK | 2026-09-14 | 11 | KEEP | Core compliance analysis (agentic controls, EU AI Act transparency) plus some firm self-promo. 11 of the newest 15 match. |
| Ncontracts Nsight (vendor) | https://www.ncontracts.com/nsight-blog/rss.xml | compliance | 200 OK | 2026-09-17 | 2 | KEEP | Vendor, but “How AI Is Changing the Compliance Officer’s Role” (2026-09-17) is the right topic. One roundup is weaker. |
| SEC Press | https://www.sec.gov/news/pressreleases.rss | regulation | 200 OK | 2026-09-17 | 1 | KEEP | Live (newest 2026-09-17). Supervision filter kept one IAC meeting notice (2026-09-03). Emptiness is the filter, not a dead feed. |
| SEC Speeches | https://www.sec.gov/news/speeches-statements.rss | regulation | 200 OK | 2026-09-18 | 3 | KEEP | Producing: “Information in the Age of AI” plus an EXAMS item (2026-09-18). |
| NASAA | https://www.nasaa.org/feed/ | regulation | 200 OK | 2026-09-18 | 4 | KEEP | Live. Supervision filter keeps FINRA comment letters and exam-retest notices, which is what that filter is for, not a broken feed. |
| CFTC Press | https://www.cftc.gov/rss.xml | regulation | 200 OK | 2026-09-18 | 0 | KEEP | Live enforcement captions (2026-09-18), zero AI keywords. Keep for the next AI/enforcement release. |
| Federal Reserve | https://www.federalreserve.gov/feeds/press_all.xml | regulation | 200 OK | 2026-09-18 | 0 | KEEP | Live FOMC and enforcement (2026-09-18), zero AI keywords. Filter is doing its job. |
| Federal Reserve Speeches | https://www.federalreserve.gov/feeds/speeches.xml | regulation | 200 OK | 2026-09-18 | 2 | KEEP | Feed is current. Last AI speeches are Barr and Bowman on 2026-07-14, outside the 21-day window, so the page is empty. |
| OCC News | https://www.occ.gov/rss/occ_news.xml | regulation | 200 OK | 2026-09-17 | 0 | KEEP | Live (2026-09-17): enforcement and third-party risk, zero AI keywords. |
| FDIC Press | https://www.fdic.gov/rss.xml | regulation | 200 OK | 2026-09-14 | 0 | KEEP | Live meeting notices (2026-09-14), zero AI keywords. |
| CFPB Newsroom | https://www.consumerfinance.gov/about-us/newsroom/feed/ | regulation | 200 OK | 2026-08-14 | 0 | WATCH | Zero AI, and the feed itself has been quiet since 2026-08-14 (complaint-narrative shutdown, not AI). Still the primary consumer bureau feed. |
| Treasury Press | https://home.treasury.gov/rss.xml | regulation | 200 STALE | 2026-07-22 | 0 | WATCH | HTTP 200 but stale (newest 2026-07-22) and the items are SSBCI Q&A, not press releases. Do not drop the slot; the URL looks like the wrong Treasury product. |
| NIST News | https://www.nist.gov/news-events/news/rss.xml | regulation | 200 OK | 2026-09-18 | 1 | KEEP | Live newsroom. Only AI hit in the newest 15 is Genesis Mission (2026-08-04), outside the 21-day window. |
| FCA News | https://www.fca.org.uk/news/rss.xml | regulation | 200 no-date | — | 0 | WATCH | 20 items, zero AI, and no parseable dates, so the age window treats the feed as stale. UK conduct regulator; do not drop. |
| ESMA | https://www.esma.europa.eu/rss.xml | regulation | 200 no-date | — | 1 | WATCH | Has the joint ESA frontier-AI governance note, but no parseable dates, so the build will treat it as stale and drop it. |
| BIS Press | https://www.bis.org/doclist/all_pressrels.rss | regulation | 200 OK | 2026-09-08 | 1 | KEEP | Live (newest 2026-09-08). Only AI-tinged match is 2026-06-28, so the page is empty. Keep the press room. |
| FSB News | https://www.fsb.org/feed/ | regulation | 200 OK | 2026-09-11 | 3 | KEEP | On mission: chair warning on frontier AI models and the responsible-adoption consultation (match newest 2026-08-31). |
| EBA News | https://www.eba.europa.eu/news-press/news/rss.xml | regulation | 200 OK | 2026-09-18 | 0 | KEEP | Live (2026-09-18 DORA third-party guidelines), zero AI keywords. Adjacent, correctly filtered. |
| Bank of England | https://www.bankofengland.co.uk/rss/news | regulation | 200 OK | 2026-09-21 | 0 | KEEP | 50 items updated today, zero AI keywords (office space, reserves, reporting minutes). |
| EU AI Act tracker | https://artificialintelligenceact.eu/feed/ | regulation | 200 OK | 2026-08-07 | 15 | WATCH | No requireAny and the items are real Act explainers, but nothing newer than 2026-08-07, outside the 21-day regulation window. |
| GN: FINRA AI | https://news.google.com/rss/search?q=FINRA+%22artificial+intelligence%22+OR+%22generative+AI%22&hl=en-US&gl=US&ceid=US:en | regulation | 200 OK | 2026-09-18 | 11 | KEEP | Stand-in for FINRA’s blocked first-party feed. ThinkAdvisor, National Law Review, and Law360 are the right stories; one ANI politics item is noise. |
| GN: SEC AI | https://news.google.com/rss/search?q=SEC+(AI-washing+OR+%22artificial+intelligence%22+advisor+OR+RIA)&hl=en-US&gl=US&ceid=US:en | regulation | 200 OK | 2026-09-20 | 10 | WATCH | One real AdvisorHub agentic-AI story. The rest of the top is ticker spam, tax-prep, and Coinbase. Query is too loose to trust unsupervised. |
| PlanSponsor AI | https://www.plansponsor.com/tag/artificial-intelligence/feed/ | institutional | 200 OK | 2026-09-16 | 15 | KEEP | AI tag is full and on the institutional desk (T. Rowe, public DB plans, senators on AI). Newest 2026-09-16. |
| PlanAdviser AI | https://www.planadviser.com/tag/artificial-intelligence/feed/ | institutional | 200 OK | 2026-09-16 | 15 | KEEP | Same tag, useful: DC adviser adoption, time-vs-mistakes, AI product launches. Newest 2026-09-16. |
| Risk.net | https://www.risk.net/feeds/rss | institutional | 200 OK | 2026-09-21 | 2 | KEEP | Two fresh, exact hits: “Risk managers go softly-softly on AI adoption” and “lexical risk” as LLMs spread. |
| IPE | https://www.ipe.com/8133.rss | institutional | 200 OK | 2026-09-18 | 0 | SUGGEST-REMOVE | Five pension-reform briefs, zero AI matches, nothing on the last page. |
| Investment Week | https://www.investmentweek.co.uk/feeds/rss | institutional | 200 OK | 2026-09-21 | 0 | WATCH | UK fund firehose. BlackRock “AI trade’s second act” was on the 2026-09-20 page; today’s newest 15 have zero AI matches. |
| FT Asset Management | https://www.ft.com/asset-management?format=rss | institutional | 200 OK | 2026-09-21 | 2 | KEEP | Fresh and exact: “AI in finance must be policed differently” and a Claude investing column. |
| Emerj AI Research | https://emerj.com/feed/ | research | 200 OK | 2026-09-21 | 10 | SUGGEST-REMOVE | Unfiltered “AI at {company}.” Current file is Cleveland Clinic, drug discovery (sponsored), and SMBs. Four items reached the last page. |
| McKinsey Insights | https://www.mckinsey.com/insights/rss | research | 200 OK | 2026-09-21 | 7 | KEEP | Fresh research. Several hits are outside wealth (Novartis, Genentech, semis); agentic-workflow pieces still earn the slot. |
| eMoney Advisor (vendor) | https://emoneyadvisor.com/feed/ | vendors | 200 OK | 2026-09-16 | 3 | KEEP | Vendor, but the posts are the advisor AI question: agentic budgeting, when AI insights are trustworthy, the advice gap. |
| CFA Market Integrity | https://blogs.cfainstitute.org/marketintegrity/feed/ | research | 200 OK | 2026-09-15 | 1 | WATCH | 500-item blog, one AI match, dated 2025-10-31, so the age window drops it. Right institution, not producing. |
| Insight Partners | https://www.insightpartners.com/feed/ | research | 200 OK | 2026-09-17 | 8 | SUGGEST-REMOVE | VC marketing (“Helping founders achieve exceptional”), duplicated on the last page. Low priority and off the RIA desk. |
| Adams Street Insights | https://www.adamsstreetpartners.com/insights/feed/ | research | 200 OK | 2026-09-16 | 3 | SUGGEST-REMOVE | PE/VC interviews. AI is incidental (“future of venture,” “is your PE playbook still right”). |
| TechCrunch AI | https://techcrunch.com/category/artificial-intelligence/feed/ | industry | 200 OK | 2026-09-21 | 15 | WATCH | Category feed is fresh but this week’s top is Disrupt promo and a Googlebook laptop, not finance or advisor AI. |
| The Verge AI | https://www.theverge.com/rss/ai-artificial-intelligence/index.xml | industry | 200 OK | 2026-09-21 | 10 | KEEP | Real AI news this week: Siri settlement, UN safeguards, Muse blocked, Huang on AI fears. Some Apple-strategy filler. |
| MIT Tech Review AI | https://www.technologyreview.com/topic/artificial-intelligence/feed | industry | 200 OK | 2026-09-21 | 10 | WATCH | Topic feed is mostly a US-border surveillance package this week, plus one “could AI kill us” Q&A. Not the usual AI file. |
| Ars Technica AI | https://arstechnica.com/ai/feed/ | industry | 200 OK | 2026-09-21 | 15 | KEEP | Clean AI news: Gemini hacking companies, “AI Force,” hallucination and military targeting, FAA AI tool. |
| VentureBeat AI | https://venturebeat.com/category/ai/feed/ | industry | 200 OK | 2026-08-27 | FAIL 0 | WATCH | Parses today (yesterday failed) but only 7 items, newest 2026-08-27. Enterprise-agent essays, outside the 5-day industry window. |
| Wired AI | https://www.wired.com/feed/tag/ai/latest/rss | industry | 200 OK | 2026-09-21 | 10 | KEEP | Mix of gadgets and real AI policy (US/China alerts, Muse surveillance, data centers). Fresh. |
| CNBC Tech | https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664 | industry | 200 OK | 2026-09-21 | 2 | KEEP | Thin after the filter, but the hits are finance: a Chinese model wired to Wall Street data, and OpenAI/Anthropic revenue vs Chinese models. |
| Reuters AI (GN) | https://news.google.com/rss/search?q=site:reuters.com+(AI+OR+%22artificial+intelligence%22)+(%22wealth+management%22+OR+advisor+OR+RIA+OR+FINRA+OR+SEC+OR+banker)&hl=en-US&gl=US&ceid=US:en | industry | 200 OK | 2026-09-21 | 15 | SUGGEST-REMOVE | No AI in the newest results (gold, a papal envoy, India output). The query’s “RIA” token is matching the Russian news agency. |
| Axios AI (GN) | https://news.google.com/rss/search?q=site:axios.com+(AI+OR+%22artificial+intelligence%22)+(wealth+OR+advisor+OR+RIA+OR+FINRA+OR+SEC+OR+bank)&hl=en-US&gl=US&ceid=US:en | industry | 200 OK | 2026-09-21 | 15 | SUGGEST-REMOVE | Same shape as the Reuters query. Newest items are politics and credit; one line is actually about the AI boom. |
| GN: RIA AI | https://news.google.com/rss/search?q=RIA+AI+OR+%22registered+investment+advisor%22+%22artificial+intelligence%22&hl=en-US&gl=US&ceid=US:en | industry | 200 OK | 2026-09-15 | 15 | KEEP | The query is working: RIABiz on Schwab/Anthropic, Cerulli capacity, InvestmentNews productivity, an RIA compliance framework. |
| Ben's Bites | https://www.bensbites.com/feed | industry | 200 OK | 2026-09-17 | 4 | WATCH | Finance filter does not really gate it, because claude/gpt are needles. Kept items are Muse, “GPT-6,” and mobile agents. |
| Stratechery | https://stratechery.com/feed/ | industry | 200 OK | 2026-09-21 | 2 | KEEP | Filter is holding a real pair: OpenAI ads in ChatGPT, and the OpenAI math / reward-hacking note. |
| Exponential View | https://www.exponentialview.co/feed | industry | 200 OK | 2026-09-21 | 2 | KEEP | Two finance-adjacent hits: Anthropic’s spending and AI revenue at $229 billion. |
| Import AI | https://importai.substack.com/feed | labs | 200 OK | 2026-09-21 | 2 | WATCH | Parses today (yesterday failed). September issues are not passing the finance filter; the matches are from 2026-07-27. |
| TLDR AI | https://tldr.tech/api/rss/ai | industry | 200 OK | 2026-09-21 | 11 | SUGGEST-REMOVE | Emoji link-dump headlines (Muse connectors, family agent, Siri swapping). Not stories, and the model-name needles let them through. |
| OpenAI News | https://openai.com/news/rss.xml | labs | 200 OK | 2026-09-21 | 15 | KEEP | Official feed, updated today. Mostly lab/product, plus Cooley using ChatGPT on IPO work. 1,214 items; the build keeps 15. |
| Google DeepMind Blog | https://deepmind.google/blog/rss.xml | labs | 200 OK | 2026-09-15 | 15 | KEEP | Official model lab: Gemini 3.8, plus genomics and weather. Right “what’s coming” source. |
| Google AI Blog | https://blog.google/technology/ai/rss/ | labs | 200 OK | 2026-09-18 | 15 | WATCH | Official, but the current 15 are fashion, societal impact, and science marketing, not advisor or finance AI. |
| Microsoft Blog | https://blogs.microsoft.com/feed/ | labs | 200 OK | 2026-09-17 | 9 | KEEP | Corporate and broad (education, FY26), still the Copilot vendor’s own AI record. 9 of 10 match. |
| Meta AI Blog | https://about.fb.com/feed/ | labs | 200 OK | 2026-09-21 | 4 | WATCH | about.fb.com with an AI keyword. Muse and the infra lab matter; prosthetics and a Meta One subscription do not. |
| FT Artificial Intelligence | https://www.ft.com/artificial-intelligence?format=rss | markets | 200 OK | 2026-09-21 | 4 | KEEP | Finance filter is keeping the right FT file: policing AI in finance, Anthropic IPO maths, “AI Force.” |
| Bloomberg Markets | https://feeds.bloomberg.com/markets/news.rss | markets | 200 OK | 2026-09-21 | 3 | KEEP | Fresh AI-trade items (AMD, Accenture/Anthropic) mixed with metals and a stock-mover brief. |
| Bloomberg Tech | https://feeds.bloomberg.com/technology/news.rss | markets | 200 OK | 2026-09-21 | 10 | KEEP | Best wire for the AI theme: OpenAI on global standards, Harvey on open models, Muse blocked, AI cyber. |
| MarketWatch | https://feeds.content.dowjones.io/public/rss/mw_topstories | markets | 200 OK | 2026-09-21 | 2 | KEEP | Low priority but producing today: Meta’s AI assistant and AMD’s AI-stock move. 2 of 10. |
| WSJ Tech | https://feeds.content.dowjones.io/public/rss/RSSWSJD | markets | 200 OK | 2026-09-21 | 9 | KEEP | Fresh AI policy and corporate-adoption pieces (OpenAI standards, leadership trust, FedEx “fuel for AI”). |
| ETF Trends | https://www.etftrends.com/feed/ | markets | 200 OK | 2026-09-21 | 2 | KEEP | Two fresh AI-ETF items (broadening beyond AI stocks; Oracle cloud). Yesterday’s fetch failure was transient. |
| GN: wealthtech AI | https://news.google.com/rss/search?q=wealthtech+OR+%22wealth+tech%22+OR+%22advisor+AI%22+OR+%22RIA+AI%22&hl=en-US&gl=US&ceid=US:en | wealthtech | 200 OK | 2026-09-19 | 15 | SUGGEST-REMOVE | Top of the file is “wealth-tech” startup wires (Crowwd/India, UPI), not US advisor tech. Nine of those reached the last page. |
| GN: AI capex / ETF | https://news.google.com/rss/search?q=%22artificial+intelligence%22+(capex+OR+ETF+OR+NVIDIA+OR+%22AI+trade%22)+stock&hl=en-US&gl=US&ceid=US:en | markets | 200 OK | 2026-09-21 | 15 | SUGGEST-REMOVE | Motley Fool and “which AI stock / could 10X” listicles. Eight reached the last page. |
| Citrini Research | https://www.citriniresearch.com/feed | markets | 200 OK | 2026-09-16 | 15 | WATCH | No filter, so defense and macro notes (“Missile Restocking,” “Regime Change”) publish beside real AI notes. None survived onto the last page. |
| WealthTech Strategy | https://www.wealthtechstrategy.com/blog-feed.xml | vendors | 200 OK | 2026-09-21 | 15 | WATCH | Sep 16–20 items are core (Jump, Zeplyn, Claude for advisors, Hadrius). Today’s newest titles are literally “$” transaction blurbs, including the Crowwd raise. |
| Envestnet (vendor) | https://www.envestnet.com/rss.xml | vendors | 200 OK | 2026-09-14 | 4 | KEEP | Real product AI (Tamarac Report Studio, adaptive wealthtech). Titles are terse (“Claude”). Yesterday’s fetch failure was transient. |
| Docupace (vendor) | https://www.docupace.com/feed | vendors | 200 OK | 2026-09-14 | 4 | WATCH | Mostly “CEO was quoted” clippings. Newest match 2026-09-02, outside the 10-day vendor window, so nothing reached the page. |
| Orion (vendor) | https://www.orion.com/rss.xml | vendors | 200 OK | 2026-09-20 | 0 | SUGGEST-REMOVE | Whole feed is two items, neither about AI: a weekly market note and a podcast. |
| Advisor360 (vendor) | https://www.advisor360.com/blog/rss.xml | vendors | 200 OK | 2026-08-28 | 10 | WATCH | The posts are the right advisor-AI product blog, but the newest is 2026-08-28, outside the 10-day vendor window. |
| Altruist (vendor) | https://www.altruist.com/feed | vendors | 200 OK | 2026-09-10 | 6 | KEEP | Hazel and the Vanguard deal are the story. One generic “18 best AI tools” listicle. Newest 2026-09-10, just outside the vendor window. |
| Wealthbox (vendor) | https://www.wealthbox.com/blog/feed | vendors | 200 OK | 2026-09-15 | 6 | KEEP | Product AI that advisors actually deploy: agents, Claude CRM connector, meeting prep. Newest 2026-09-15. |
| TIFIN (vendor) | https://www.tifin.com/feed | vendors | 200 STALE | 2026-06-29 | 10 | SUGGEST-REMOVE | Stale since 2026-06-29 (84 days). Vendor hard window is 10 days, so it cannot reach the page. |
| Vanilla (vendor) | https://www.justvanilla.com/blog/feed | vendors | 200 OK | 2026-09-17 | 3 | KEEP | Agentic estate planning, current (2026-09-17), which is the vendor’s actual AI news. |
| Wealth.com (vendor) | https://www.wealth.com/feed | vendors | 200 OK | 2026-09-21 | 3 | KEEP | Estate and tax planning inside Claude, plus the &Partners selection. Fresh. |
| Nitrogen (vendor) | https://www.nitrogenwealth.com/feed | vendors | 200 OK | 2026-09-17 | 1 | WATCH | Only AI match is a June 17 due-diligence post. Newer items do not match, so the page gets nothing. |
| Practifi (vendor) | https://www.practifi.com/blog/feed | vendors | 200 OK | 2026-09-09 | 5 | KEEP | Intelligent CRM / AI ROI / governance posts through 2026-09-09. Just outside the 10-day window, still the right blog. |
| SS&C (vendor) | https://www.ssctech.com/blog/rss.xml | vendors | 200 OK | 2026-09-18 | 2 | KEEP | One clear AI platform post (2026-09-17) and one API essay that is a weaker match. |
| GN: wealth AI vendors | https://news.google.com/rss/search?q=(Envestnet+OR+Orion+OR+Altruist+OR+Jump+OR+Zocks+OR+TIFIN)+AI+(advisor+OR+RIA+OR+wealth)&hl=en-US&gl=US&ceid=US:en | vendors | 200 OK | 2026-09-18 | 15 | KEEP | Wire-heavy (Business Wire, Pulse 2.0, FF News) but it is how Jump, Orion/Claude, and Envestnet AI show up. Those vendors have weak or empty first-party feeds. |
| Anthropic News | https://www.anthropic.com/news | labs | 200 partial | 2026-08-31 | 1 | WATCH | Page has 10 news links, including Sep 18 and Sep 17. The card regex kept 1 (Aug 31), so the labs window shows nothing. Title sits outside the short anchor on the missed cards. |
| Anthropic Research | https://www.anthropic.com/research | labs | 200 partial | 2026-09-09 | 3 | WATCH | Page has 9 research links, including a Sep 17 biomodeling post. The regex kept 3, newest Sep 9, which is outside the 8-day labs window. |
| FINRA Notices | https://www.finra.org/rules-guidance/notices | regulation | 200 OK | 2026-08-26 | 0 | KEEP | Extractor read 34 notices. None passed once the word “finra” is excluded from the filter. Newest is TRACE (Aug 26). The Jul 9 Rule 2210 communications proposal is the AI-adjacent item, and the title does not say AI. |
| Jump (vendor) | https://jump.ai/blog | vendors | 200 OK | 2026-09-14 | 6 | KEEP | Extractor works (69 cards). Kept posts are the AI maturity model and the Claude MCP connector. Non-AI practice posts are dropped. Build cap is 6. |
| Zocks (vendor) | https://www.zocks.io/resources/blog | vendors | 200 OK | 2026-09-11 | 1 | WATCH | Webflow selector found only 2 cards. The one that passed is a “Fireflies alternatives” listicle, not a product note. No RSS, so leave it and watch. |

## Suggested removals

Ranked by how much bad copy they put on the page, then by feeds that are simply dead. Replacements are already configured.

1. **Reuters AI (GN)** — The newest items are not about AI (gold, a papal envoy, India’s infrastructure print). The query token `RIA` is matching the Russian news agency, and `advisor` is matching “chief economic advisor.” Replace with FT Artificial Intelligence, Bloomberg Tech, and WSJ Tech.
2. **Axios AI (GN)** — Same query shape. Four of the five newest items are politics or credit; one is about the AI boom. Replace with FT Artificial Intelligence and Bloomberg Tech.
3. **GN: wealthtech AI** — The query treats the word “wealth-tech” as enough, so the file is Crowwd’s India pre-seed, UPI pricing, and UK funding roundups. Nine of those reached the 2026-09-20 page. Replace with GN: advisor AI notetaker (RIABiz, InvestmentNews, ThinkAdvisor, AdvisorHub) and WealthManagement.com.
4. **GN: AI capex / ETF** — Motley Fool and “which stock could 10X” listicles. Eight reached the last page. Replace with Bloomberg Tech, WSJ Tech, FT Artificial Intelligence, and ETF Trends.
5. **Emerj AI Research** — Unfiltered company profiles. This week: Cleveland Clinic, sponsored drug-discovery AI, SMB agentic AI. Four items reached the page. Replace with McKinsey Insights and American Banker AI.
6. **TLDR AI** — Digest headlines (“Muse connectors,” “Google family agent”), not stories. `FINANCE_OR_ENTERPRISE` includes `claude` / `gpt` / `gemini`, so the filter does not stop them. Replace with Ars Technica AI, Wired AI, and the lab feeds.
7. **Insight Partners** — VC content marketing, duplicated on the research page. Replace with McKinsey Insights. No need for another venture blog.
8. **Adams Street Insights** — PE and VC interviews where AI is a passing word. Low priority. No replacement required.
9. **GN: wealth copilot** — Nothing newer than 2026-08-30, nothing on the last page, and the query mixes advisor copilots with the consumer budgeting app Copilot Money. Replace with GN: advisor AI notetaker and the trade press.
10. **IPE** — Five items, all pension-reform briefs, zero AI, nothing on the page. Replace with PlanSponsor AI and PlanAdviser AI (both full as of 2026-09-16).
11. **Orion (vendor)** — Two items, neither about AI (weekly market note, podcast). The Orion–Claude story is already on GN: wealth AI vendors.
12. **TIFIN (vendor)** — Nothing since 2026-06-29. The vendor age window is 10 days, so this feed cannot reach the page. GN: wealth AI vendors already names TIFIN.

Not on this list, on purpose: FA Magazine, Professional Adviser, and Investment Week look empty in the newest 15. FA Magazine has 21 AI matches further down a 237-item file, including Schwab/Claude and Black Diamond. The UK titles were on the 2026-09-20 page and rotated out of the cap overnight. WealthTech Strategy’s September 16–20 items (Jump, Zeplyn, Claude for advisors, Hadrius) are core; only today’s newest titles are broken `$` blurbs. Watch that feed. Do not drop it yet.

## Do not remove

These look empty because `requireAny` is working, or because a real AI item has no date the age window can use. They are the primary regulator record. GN: FINRA AI should stay beside the notices scraper: it is how ThinkAdvisor and Law360 items arrive.

- **SEC Press** — 25 releases, newest 2026-09-17. One supervision-filter hit (Investor Advisory Committee meeting, Sep 3). Not an outage.
- **SEC Speeches** — Not empty. “Information in the Age of AI” is in the 2026-09-18 file. Listed so it is not grouped with the quiet rooms.
- **CFTC Press** — 10 live enforcement captions (Sep 18), zero AI keywords.
- **Federal Reserve** — 20 live items (FOMC, enforcement, Sep 18), zero AI keywords.
- **Federal Reserve Speeches** — Feed is current. The AI speeches (Barr on living standards, Bowman on sound practices) are 2026-07-14, outside the 21-day regulation window.
- **OCC News** — Live Sep 17 (enforcement, third-party risk guidance), zero AI keywords.
- **FDIC Press** — Live meeting notices (Sep 14), zero AI keywords.
- **CFPB Newsroom** — Zero AI, and quiet since 2026-08-14. Keep the bureau feed; the staleness is a separate watch, not a reason to delete it.
- **Treasury Press** — Zero AI and stale (Jul 22). The body is SSBCI Q&A, not the press room. Keep a Treasury slot; replace the URL only after a press feed is confirmed.
- **NIST News** — Live. The Genesis Mission AI item is 2026-08-04, outside the window.
- **FCA News** — 20 items, zero AI, no parseable dates (the build treats missing dates as stale).
- **ESMA** — The joint EBA/EIOPA/ESMA note on frontier-AI ICT risk is in the feed and has no parseable date, so it will not survive the age window. That is a date bug, not a bad source.
- **BIS Press** — Live (Sep 8). The only AI-tinged match is 2026-06-28.
- **EBA News** — Live Sep 18 DORA third-party guidelines, zero AI keywords.
- **Bank of England** — 50 items dated today, zero AI keywords.
- **FINRA Notices** (scraper, not RSS) — 34 notices parsed from the rules-and-guidance table, zero keyword hits. Newest row is 26 Aug (TRACE). The 9 Jul proposal to modernize Rule 2210 is the communications item the trade press is tying to AI, and the notice title does not say AI, so the filter drops it. Keep the scraper. `sources.ts` still warns that FINRA’s first-party RSS was a 403 on 18 Sep; this audit did not re-probe that URL.
- **NASAA** and **FSB News** are producing (exam and FINRA letters, and the FSB frontier-AI warning). They are not empty. SEC Speeches is producing too (“Information in the Age of AI”).

## Scrapers

Five HTML sources, all HTTP 200 on 21 Sep 2026.

**Anthropic News and Anthropic Research** still use a card regex that requires the headline inside the `<a>`. The news page has 10 `/news/` links. The regex kept 1, dated **31 Aug 2026**. Links dated **18 Sep** (Accenture) and **17 Sep** (life sciences) were skipped because the anchor is short and the headline sits outside it. The research page has 9 `/research/` links. The regex kept 3, newest **9 Sep 2026**, and skipped a **17 Sep** biomodeling post. Labs hard window is 8 days, so neither source is reaching the page. Fix the matcher. Do not remove them.

**FINRA Notices** is doing the job the blocked FINRA RSS could not. Thirty-four notice rows parsed. Zero survived the keyword filter, which is expected for a week of TRACE, continuing education, and best-execution titles. Keep it. See “Do not remove.”

**Jump** is a good vendor scrape: current AI posts (maturity model, Claude connector) and the filter is dropping the non-AI practice essays. Keep.

**Zocks** is thin. Two cards, one listicle. Watch, do not remove, because there is no RSS.
