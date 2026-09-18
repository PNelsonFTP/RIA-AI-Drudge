# AI News Sources for Financial Professionals

Curated source list for a Drudge-style aggregation site targeting brokers, RIAs, investment advisors, broker-dealers, and asset/wealth management professionals. Compiled September 2026.

## How to use this file

- Each source has a **tier** (1 = tightest fit / highest priority for the front page; 9 = supporting/vendor).
- **Feed** column: `RSS` = site is known to publish standard RSS/Atom feeds (locate the feed URL programmatically from the site's `<link rel="alternate">` tags or `/feed`, `/rss`, `/feed.xml` conventions — do NOT hardcode guessed feed URLs without validating them). `Scrape` = no reliable feed; scrape the section page or newsletter archive. `Email` = newsletter-only; capture via an inbox-to-feed bridge (e.g., Kill the Newsletter, Feedbin, or a dedicated mailbox parser). `Paywall` = headlines/teasers are usually public; full text is not.
- **Keyword filter**: Tier 3, 5, 6, 7, and 8 sources are broad; apply an AI keyword filter (`AI`, `artificial intelligence`, `generative`, `agentic`, `LLM`, `machine learning`, `automation`, `chatbot`, `copilot`, `notetaker`, names of major models/vendors) before surfacing items. Tier 1, 2, 4, and 9 sources can generally be surfaced with a lighter filter.
- **Dedup**: many Tier 1 and Tier 2 outlets cover the same vendor announcements within hours of each other; dedupe by normalized headline + vendor name.

---

## Tier 1 — Advisor / RIA / BD trade press with dedicated AI or advisortech coverage

| Source | URL | Feed | Notes |
|---|---|---|---|
| WealthManagement.com — AI section | https://www.wealthmanagement.com/artificial-intelligence | RSS | Davis Janowski's AI/wealthtech beat. Also home to the WealthStack Podcast and the "Advisors and AI" program page. Best single trade source for vendor/agentic platform announcements. |
| WealthManagement.com — RIA news | https://www.wealthmanagement.com/ria-news | RSS | RIA Edge conference coverage; advisor AI adoption surveys. |
| InvestmentNews — Advisor Tech | https://www.investmentnews.com/advisor-tech | RSS | Kitces / Henry-Moreland running advisortech column: AI-native CRMs, AI compliance tools, notetakers, incumbent AI launches. |
| InvestmentNews — Transformation | https://www.investmentnews.com/transformation | RSS | AI budgets/ROI research, industry surveys. |
| Kitces Nerd's Eye View — Technology & Advisor FinTech | https://www.kitces.com/blog/category/19-technology-advisor-fintech/ | RSS | Monthly "Latest in Financial #AdvisorTech" roundup; Financial AdvisorTech Solutions Map and AdvisorTech Directory. |
| Financial Planning (Arizent) | https://www.financial-planning.com | RSS | Technology section; annual expert predictions on AI in wealthtech. |
| ThinkAdvisor | https://www.thinkadvisor.com | RSS | Technology section; strong regulatory/compliance angle on AI. |
| Financial Advisor Magazine | https://www.fa-mag.com | RSS | Advisor AI coverage plus client-facing "AI-proof the portfolio" stories. |
| RIABiz | https://www.riabiz.com | RSS | Opinionated RIA coverage (e.g., RIAs vs. wirehouses on AI adoption). |
| Citywire RIA | https://citywire.com/ria | Scrape | Advisor moves, wealthtech funding, growth roles. Registration for some content. |
| Barron's Advisor | https://www.barrons.com/advisor | Paywall | Practice management and tech for advisors. |
| WSJ Wealth Adviser | https://www.wsj.com | Paywall | Wirehouse AI rollouts, industry trend pieces. |
| Bloomberg Wealth | https://www.bloomberg.com/wealth | Paywall | Wealth-industry AI coverage; also Bloomberg Technology. |
| Wealth Solutions Report | https://wealthsolutionsreport.com | RSS | Interviews with T3, Oasis Group, Syntax Data on AI adoption in wealth management. |
| Advisor Perspectives | https://www.advisorperspectives.com | RSS | Practitioner-written analysis. |
| Robert Huebscher Substack | https://roberthuebscher.substack.com | RSS | Advisor Perspectives founder; AI-and-financial-planning interviews. |

## Tier 2 — Wealthtech-specific newsletters, blogs, and podcasts (highest AI signal)

| Source | URL | Feed | Notes |
|---|---|---|---|
| AI Advisor Stack (weekly newsletter) | https://newsletter.aiadvisorstack.com | RSS / Email | Weekly curation of AI news for RIAs and independent advisors; talks to the leading AI wealthtech providers. Substack-style archive. |
| WealthTech Today (Craig Iskowitz / Ezra Group) | https://wealthtechtoday.com | RSS | Monthly wealthtech news episodes; buyer's guides (AI notetakers, agentic OS). Ezra Group monthly newsletter and AI agents directory. |
| Ezra Group | https://ezragroupllc.com | Scrape / Email | Consulting firm; monthly newsletter; AI agents directory for advisors. |
| T3 Technology Hub (Joel Bruckenstein) | https://t3technologyhub.com | RSS | Runs AI University at T3 conference; co-produces annual T3 / Inside Information software survey. Vendor press releases and commentary. |
| T3 Conferences | https://t3conferences.com | Scrape | Conference news, "T3 in the news" page. |
| Bob Veres' Inside Information | https://www.bobveres.com | Email / Paywall | Monthly subscription publication; annual software survey data on which AI tools advisors actually use. |
| WealthTech Strategy | https://www.wealthtechstrategy.com | RSS | Curated daily digest of wealthtech press releases (Envestnet, Orion, FE fundinfo, WealthAi, etc.). |
| Abnormal Returns — Adviser Links | https://abnormalreturns.com | RSS / Email | Free Friday advisor-focused newsletter aggregating Kitces, RIABiz, Citywire, ThinkAdvisor, InvestmentNews links. |
| AI for Advisors (podcast) | https://podcasts.apple.com/us/podcast/ai-for-advisors/id1868295133 | RSS (podcast feed) | Hosts James Cantwell and Mark Heynen; AI in wealth management, advisor workflows, MCP/orchestration, RIA M&A. |
| The WealthStack Podcast | https://www.wealthmanagement.com/artificial-intelligence | RSS (podcast feed) | Shannon Rosic; AI vendor CEO interviews (Jump, Nevis, etc.). |
| Diamond Consultants podcast | https://www.diamond-consultants.com | RSS | AI as competitive advantage for RIAs; AI prospecting. |
| RIA Collective (podcast) | https://www.riacollective.com/episodes/ | RSS (podcast feed) | Charlie Van Derven; AI inside advisory firms. |
| Envestnet — Inside WealthTech | https://www.envestnet.com/wealth-management/wealthtech-trends | Scrape | Vendor-hosted podcast/blog with industry guests. |
| Orion — Advisor Wealthtech Survey | https://orion.com/2026-wealthtech-outlook | Scrape | Annual survey on AI priorities and pain points. |
| Kitces AdvisorTech Map | https://www.kitces.com (map published within monthly roundup) | Scrape | Category map of 500–600 wealthtech vendors; useful for a "vendor landscape" sidebar. |

## Tier 3 — Broader fintech / banking press with strong AI channels

Apply AI keyword filter.

| Source | URL | Feed | Notes |
|---|---|---|---|
| American Banker — AI Intelligence hub | https://www.americanbanker.com/ai | RSS | Research, analysis and data on how banks use AI; regulator signals on generative/agentic AI. Has a dedicated Technology AI newsletter. |
| American Banker — AI tag | https://www.americanbanker.com/artificial-intelligence | RSS | Tag page for all AI stories. |
| Finextra — AI channel | https://finextra.com/news/finchannel.aspx?topic=ai | RSS | EU AI Act, guardrails, fraud; mixes sponsored and editorial — check bylines. |
| FinTech Global — WealthTech | https://fintech.global | RSS | Wealthtech funding stats, WealthTech100 / AIFinTech100 rankings. |
| The Financial Brand | https://thefinancialbrand.com | RSS | Bank/credit union AI adoption. |
| Bank Automation News | https://bankautomationnews.com | RSS | Automation and AI in banking ops. |
| ABA Banking Journal | https://bankingjournal.aba.com | RSS | Agentic AI in financial services; ABA publishes an AI policy template. |
| Fintech Takes (Alex Johnson) | https://fintechtakes.com | RSS / Email | Newsletter with regular AI-in-finance analysis. |
| Fintech Brainfood (Simon Taylor) | https://www.fintechbrainfood.com | RSS / Email | Weekly fintech newsletter, frequent AI coverage. |
| Fintech Business Weekly (Jason Mikula) | https://fintechbusinessweekly.substack.com | RSS / Email | Fintech/regulatory newsletter. |
| Finpresso | https://finpresso.com | Email | Daily finance-and-AI email brief. |
| CB Insights | https://www.cbinsights.com | Email / Paywall | AI venture and market data. |
| LLRX — AI in Finance and Banking column | https://www.llrx.com | RSS | Semi-monthly roundup of news, government documents, papers, and central bank actions on AI in banking/finance; links to primary sources. |

## Tier 4 — Regulators, compliance, and legal (primary sources)

Essential for BD/RIA readers. Low volume, high importance — consider a dedicated "Regulatory" column.

| Source | URL | Feed | Notes |
|---|---|---|---|
| FINRA — AI key topic page | https://www.finra.org/rules-guidance/key-topics/artificial-intelligence | Scrape | Reports, notices, podcasts, investor insights on AI. |
| FINRA — Annual Regulatory Oversight Report, GenAI section | https://www.finra.org/rules-guidance/guidance/reports/2026-finra-annual-regulatory-oversight-report/gen-ai | Scrape | Annual; states FINRA rules are technologically neutral and apply to GenAI. |
| FINRA — Regulatory Notices | https://www.finra.org/rules-guidance/notices | RSS | Watch for AI-related notices (e.g., Rule 3110 supervision). |
| SEC — Press releases | https://www.sec.gov/news/pressreleases | RSS | Enforcement actions (AI-washing cases like Delphia), rulemaking. |
| SEC — Speeches and statements | https://www.sec.gov/news/speeches-statements | RSS | Commissioner views on AI regulation. |
| SEC — Division of Examinations | https://www.sec.gov/exams | Scrape | Exam priorities and risk alerts; GenAI is a standing exam priority. |
| NASAA | https://www.nasaa.org | RSS | State-registered RIA angle; joint investor alerts on AI fraud. |
| U.S. Treasury — AI in financial services | https://home.treasury.gov | Scrape | Public-private partnership; AI Lexicon and Financial Services AI Risk Management Framework. |
| CFTC | https://www.cftc.gov | RSS | AI advisories for derivatives markets. |
| Federal Reserve / OCC / FDIC | https://www.federalreserve.gov, https://www.occ.gov, https://www.fdic.gov | RSS | Bank AI/model risk guidance. |
| NY DFS | https://www.dfs.ny.gov | RSS | State AI/cyber guidance for financial firms. |
| NIST AI RMF | https://www.nist.gov/itl/ai-risk-management-framework | Scrape | Baseline framework referenced by financial regulators. |
| EU AI Act — official | https://artificialintelligenceact.eu | Scrape | Tracker with implementation timeline. |
| Sidley Austin — insights | https://www.sidley.com/en/insights | RSS | Securities/commodities AI guidance summaries. |
| Taft Law — bulletins | https://www.taftlaw.com | Scrape | FINRA/Treasury AI guidance summaries. |
| Eversheds Sutherland | https://www.eversheds-sutherland.com | RSS | FINRA enforcement process, AI compliance. |
| Morgan Lewis, Debevoise, Davis Polk, Ropes & Gray | firm sites | RSS | Client alerts on SEC/FINRA AI developments. |
| Risk Management Magazine (RIMS) | https://www.rmmagazine.com | RSS | Enforcement trend pieces on AI compliance on Wall Street. |
| Compliance vendor blogs (Ncontracts, ComplySci/NRS, Smarsh, Hadrius, Zocks) | various | RSS | Practical, but vendor-authored — label as such. |

## Tier 5 — Institutional / asset management press

Apply AI keyword filter.

| Source | URL | Feed | Notes |
|---|---|---|---|
| Institutional Investor | https://www.institutionalinvestor.com | RSS | Asset owners and AI; pension fund AI hiring. |
| Pensions & Investments | https://www.pionline.com | RSS / Paywall | Institutional AI adoption. |
| FundFire (FT Specialist) | https://www.fundfire.com | Paywall | Best on asset manager distribution/AI; headlines public. |
| Ignites (FT Specialist) | https://www.ignites.com | Paywall | Mutual fund/ETF industry AI. |
| Chief Investment Officer | https://www.ai-cio.com | RSS | Allocator perspective. |
| Pensions Expert (UK) | https://www.pensions-expert.com | RSS | Asset manager AI risk surveys. |
| ETF.com | https://www.etf.com | RSS | AI in product/distribution; conference coverage. |
| Emerj AI Research | https://emerj.com | RSS | AI-in-asset-management podcast series with CTO/CAIO guests. |
| Financial Times — Asset Management | https://www.ft.com/asset-management | Paywall | Global asset management AI coverage. |
| Reuters — Wealth / Business | https://www.reuters.com | RSS | Wirehouse and asset manager AI news. |

## Tier 6 — Asset manager, custodian, and consultancy research

Slow cadence, high quality. Good for a "Research" sidebar.

| Source | URL | Feed | Notes |
|---|---|---|---|
| Cerulli Associates | https://www.cerulli.com | Scrape | Advisor/investor surveys widely cited in trade press. |
| F2 Strategy | https://www.f2strategy.com | Scrape | Wealth management AI spending/ROI surveys. |
| Crisil Coalition Greenwich | https://www.greenwich.com | Scrape | Trading desk / broker AI adoption. |
| McKinsey — Financial Services | https://www.mckinsey.com/industries/financial-services | RSS | AI in wealth/asset management. |
| Deloitte Center for Financial Services | https://www2.deloitte.com | RSS | Annual outlooks. |
| EY — Wealth & Asset Management | https://www.ey.com | Scrape | AI adoption surveys. |
| Accenture — Capital Markets | https://www.accenture.com | Scrape | Wealth management AI reports. |
| Grant Thornton / ThoughtLab | https://www.grantthornton.com | Scrape | "The AI-powered investment firm" global survey. |
| Insight Partners | https://www.insightpartners.com/ideas | RSS | VC view on AI wealthtech. |
| Adams Street Partners | https://www.adamsstreetpartners.com/insights | RSS | PE view on AI and the future of advice. |
| Vanguard Advisors — Insights | https://advisors.vanguard.com/insights | Scrape | AI and the advisor role. |
| BlackRock — Financial Professionals Insights | https://www.blackrock.com/us/financial-professionals/insights | Scrape | AI-driven advisor growth. |
| Capital Group PracticeLab | https://www.capitalgroup.com/advisor/practicelab | Scrape | How advisors use AI tools. |
| Fidelity Institutional / Clearing & Custody | https://clearingcustody.fidelity.com/insights | Scrape | State of AI in wealth management. |
| Schwab Advisor Services | https://advisorservices.schwab.com | Scrape | RIA benchmarking, AI adoption. |
| Morningstar | https://www.morningstar.com | RSS | Advisor and investor AI research. |
| Broadridge | https://www.broadridge.com | Scrape | Digital transformation / AI studies. |
| eMoney Advisor blog | https://emoneyadvisor.com/blog | RSS | Planner AI surveys. |
| Wirehouse/bank newsrooms | Morgan Stanley, Wells Fargo, Citi, JPMorgan, Merrill, UBS | RSS / Scrape | Official AI rollout announcements (e.g., Advisor Gateway, CitiScribe, AI @ Morgan Stanley Debrief). |

## Tier 7 — General AI news (the "what's coming" column)

Most AI stories that reach the finance sector appear in tech press days earlier. Apply a finance-relevance filter (models, agents, regulation, enterprise adoption, security).

| Source | URL | Feed | Notes |
|---|---|---|---|
| The Information — AI Agenda | https://www.theinformation.com | Paywall | Corporate AI moves. |
| Bloomberg Technology | https://www.bloomberg.com/technology | Paywall | |
| Reuters — Technology / AI | https://www.reuters.com/technology | RSS | |
| Financial Times — AI | https://www.ft.com/artificial-intelligence | Paywall | |
| WSJ Tech | https://www.wsj.com/tech | Paywall | |
| Axios AI+ | https://www.axios.com/technology/artificial-intelligence | RSS / Email | |
| TechCrunch AI | https://techcrunch.com/category/artificial-intelligence/ | RSS | |
| The Verge AI | https://www.theverge.com/ai-artificial-intelligence | RSS | |
| MIT Technology Review | https://www.technologyreview.com | RSS | |
| Ars Technica AI | https://arstechnica.com/ai/ | RSS | |
| Anthropic News | https://www.anthropic.com/news | RSS | |
| OpenAI News | https://openai.com/news | RSS | |
| Google DeepMind Blog | https://deepmind.google/discover/blog | RSS | |
| Microsoft AI Blog | https://blogs.microsoft.com/ai | RSS | |
| Nvidia Newsroom | https://nvidianews.nvidia.com | RSS | |
| Ben's Bites | https://bensbites.com | Email / RSS | Daily AI digest. |
| TLDR AI | https://tldr.tech/ai | Email | |
| Import AI (Jack Clark) | https://importai.substack.com | RSS / Email | |
| Stratechery (Ben Thompson) | https://stratechery.com | RSS / Paywall | |
| Exponential View (Azeem Azhar) | https://www.exponentialview.co | RSS / Paywall | |
| Money Stuff (Matt Levine, Bloomberg) | https://www.bloomberg.com/opinion/authors/ARbTQlRLRjE/matthew-s-levine | Email | AI-meets-markets commentary. |

## Tier 8 — AI as an investment theme (client-facing content)

Useful for advisors fielding client questions about AI stocks, capex, and market risk.

| Source | URL | Feed | Notes |
|---|---|---|---|
| Goldman Sachs Research | https://www.goldmansachs.com/insights | Scrape | AI capex, productivity. |
| Morgan Stanley Research | https://www.morganstanley.com/ideas | RSS | AI investment themes. |
| JPMorgan Wealth Management insights | https://www.jpmorgan.com/insights | Scrape | |
| BlackRock Investment Institute | https://www.blackrock.com/corporate/insights/blackrock-investment-institute | Scrape | AI, politics, portfolios. |
| Citrini Research | https://www.citriniresearch.com | Email / RSS | AI-trade narratives that have moved markets. |
| SemiAnalysis | https://semianalysis.com | RSS / Paywall | Chips, data centers, hyperscaler capex. |
| Morningstar | https://www.morningstar.com | RSS | AI stock/ETF coverage. |
| Barron's | https://www.barrons.com | Paywall | AI stocks for retail/advisors. |
| U.S. News Money — Investing | https://money.usnews.com/investing | RSS | Retail-facing AI investing pieces. |

## Tier 9 — Wealthtech vendor newsrooms (product launches)

Scrape press/newsroom pages or use PR wire feeds (Business Wire, PR Newswire, GlobeNewswire) filtered by company name. Label items as vendor announcements.

AI-native / AI-first advisor tools: Jump (jumpapp.com), Zocks (zocks.io), Zeplyn (zeplyn.ai), FINNY (finny.ai), Wealth.com, Vanilla (justvanilla.com), Holistiplan, FP Alpha, Nitrogen, Savvy Wealth, Nevis, WealthAi, Wavvest, Subatomic AI, Boosted.ai, Datalign Advisory, Goodfin, OneVest, TIFIN, Hadrius, Greenboard.

Incumbent platforms adding AI: Orion, Envestnet / Tamarac, Altruist, Advisor360°, RightCapital, eMoney, MoneyGuidePro, YCharts, Salesforce Financial Services Cloud, Apex Fintech Solutions, Conquest Planning, Advyzon, AdvisorEngine, Docupace, Redtail, Wealthbox, Practifi, BlackRock Aladdin Wealth, Broadridge, SS&C, FIS, Fidelity, Schwab, Pershing.

PR wires: https://www.businesswire.com, https://www.prnewswire.com, https://www.globenewswire.com — search terms: `wealth management AI`, `financial advisors AI`, `RIA AI`, `wealthtech`.

---

## Suggested front-page column mapping (Drudge-style)

- **Left column — Advisor Practice & Wealthtech**: Tier 1, Tier 2, Tier 9 (filtered).
- **Center column — Top stories / breaking**: highest-velocity items across all tiers; prioritize Tier 1, 3, 7 when a single story appears in 3+ sources.
- **Right column — Regulation, Compliance & Risk**: Tier 4, plus AI security/fraud items from Tier 3 and Tier 7.
- **Sidebars / footers**: Research (Tier 6), AI as Investment Theme (Tier 8), Podcasts (Tier 2 audio), Institutional (Tier 5).

## Quality flags to encode

- Mark vendor-authored content (Tier 6 asset-manager blogs, Tier 9, compliance vendor blogs) with a visible "sponsor/vendor" tag.
- Prefer original reporting over syndicated PR-wire copies when the same announcement appears in multiple outlets.
- Weight regulator primary sources (Tier 4) above secondary law-firm summaries; link the summary alongside the primary.
- Paywalled sources: link headline to source, never reproduce body text.
