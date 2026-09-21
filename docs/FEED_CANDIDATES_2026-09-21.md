# Additional feed candidates (21 September 2026)

Standalone RIA AI Report. `scripts/sources.ts` was not modified. Nothing here was added to the live list.

Audience: RIAs, broker-dealers, advisors, and wealth or asset managers tracking AI.

## Method

- Browser Chrome UA, HTTP GET, 10s timeout, redirects followed.
- 309 source families. **2,162 HTTP requests** (2,056 in the main pass, 106 follow-ups).
- A keeper had to parse as RSS or Atom and include an item on or after **2026-06-23** (90 days). Regulators could be older; a stale or off-topic regulator feed was still dropped.
- Skipped URLs already in `scripts/sources.ts` or the 18 September discovered JSON files.
- Re-checked previously blocked or stale families. They appear below only when today’s fetch returned a fresh, parseable feed.

## Counts

| | n |
|---|---|
| Source families | 309 |
| HTTP requests | 2,162 |
| Fresh parseable feeds on a new URL | 116 |
| Already-known URL (redirected back to a live feed) | 2 |
| **Add now** | **26** |
| Maybe | 18 |

## Add now

| Name | URL | Category | Why it fits | Newest item | Sample title | Priority |
|---|---|---|---|---|---|---|
| Barron's Advisor | https://feeds.content.dowjones.io/public/rss/barronsadvisor | practice | Advisor-desk feed that was missing from the trade list. Same-day items on the AI trade and advisor deepfakes. Filter AI so practice-management pieces stay out. | 2026-09-21 | Is That a Prospective Client or an AI Deepfake? An Emerging Threat for Financial Advisors. | add now |
| FT Wealth Management | https://www.ft.com/wealth-management?format=rss | wealthtech | Distinct from the FT Asset Management and FT AI feeds already configured. Lead item is an AI wealth-platform story (St James’s Place). | 2026-09-17 | St James’s Place looks smartly attired for the AI wealth party | add now |
| Money Marketing | https://www.moneymarketing.co.uk/feed/ | practice | UK adviser trade book alongside Professional Adviser. Same-day column on AI as a moving target for advice firms. | 2026-09-21 | Cathi Harrison: The cutting edge of AI is a moving target | add now |
| Top1000funds.com | https://www.top1000funds.com/feed/ | institutional | Asset-owner desk. Two AI pieces in the last week (concentration risk; private-markets AI). Filter AI. | 2026-09-21 | Concentration and dependence are two AI issues asset owners should fear | add now |
| Investment Adviser Association | https://www.investmentadviser.org/feed/ | regulation | Primary adviser-association feed. Latest item is the SEC exam risk alert on annual compliance reviews. Filter exams plus AI so alt-product webinars drop. | 2026-09-15 | SEC Division of Examinations Issues Risk Alert Highlighting Issues With Investment Adviser Annual Compliance Reviews | add now |
| OCC Bulletins | https://www.occ.gov/rss/occ_bulletins.xml | regulation | Supervisory bulletins, separate from `occ_news.xml`. Current item is the cybersecurity supervision work program, plus third-party risk guidance. | 2026-09-21 | Cybersecurity: Cybersecurity Supervision Work Program | add now |
| Ballard Consumer Finance Monitor | https://www.consumerfinancemonitor.com/feed/ | compliance | Law-firm feed with a same-week CSBS artificial-intelligence supervisory framework for state examiners, plus an agentic-AI consumer-finance piece. | 2026-09-18 | CSBS Releases Artificial Intelligence Supervisory Framework for State Examiners | add now |
| The Diff | https://www.thediff.co/archive/rss/ | markets | Finance-and-technology letters. This week’s run includes AI-exposure and frontier-pacing notes. Filter AI. | 2026-09-21 | In AI Exposure, Sometimes Worse is Better | add now |
| SemiAnalysis | https://newsletter.semianalysis.com/feed | markets | The old `semianalysis.com/feed/` is still stale. This newsletter URL is current (datacenter buildout, agentic inference). Whole feed is AI infrastructure. | 2026-09-18 | Everyone Says Datacenter Moratoriums Are Killing the US Buildout. We disagree | add now |
| One Useful Thing | https://www.oneusefulthing.org/feed | industry | Ethan Mollick on how organizations actually use agents and chatbots. Enterprise AI, rather than a gadget roundup. | 2026-09-18 | Agency and Agents | add now |
| iCapital | https://icapital.com/feed/ | vendors | Alts platform for advisors. 15 September item: alternative-investment data inside Claude for financial advisors. Filter AI. | 2026-09-18 | iCapital brings alternative investment data into Claude for Financial Advisors | add now |
| WSGR Data Advisor | https://www.wsgrdataadvisor.com/feed/ | compliance | Wilson Sonsini privacy and AI law. In-window items include the EU AI Act enforcement phase and a Ninth Circuit agentic-AI decision. | 2026-09-18 | EU AI Act Enforcement Phase Begins | add now |
| Columbia Blue Sky | https://clsbluesky.law.columbia.edu/feed/ | compliance | Securities-law blog. 17 September item is on Anthropic’s antitrust waiver and the law and economics of AI. Filter AI. | 2026-09-21 | What Anthropic’s Antitrust Waiver Says About the Law and Economics of AI | add now |
| The D&O Diary | https://www.dandodiary.com/feed/ | compliance | D&O and securities-litigation blog. 15 September item on D&O risk from AI-driven performance claims. Filter AI. | 2026-09-21 | The CVS Case and the Emerging D&O Risks of AI-Driven Performance | add now |
| Compliance Week | https://www.complianceweek.com/feed/ | compliance | Compliance trade press. 18 September item on the UK approach to AI supervision in financial services. Filter AI. | 2026-09-21 | Experts welcome U.K.’s approach to AI supervision in financial services—but with provisos | add now |
| Corporate Compliance Insights | https://www.corporatecomplianceinsights.com/feed/ | compliance | Same-day “SEC to Advisers” piece plus a survey on AI policies that get bypassed. Filter AI and adviser. | 2026-09-21 | SEC to Advisers: Don’t Say ‘May’ When You Mean ‘Does’ | add now |
| Alston Privacy | https://www.alstonprivacy.com/feed/ | compliance | Privacy counsel blog. In-window: prompt-injection sanctions, GenAI transparency guidance, and NYDFS cybersecurity risk assessments. | 2026-09-21 | Connecticut Court Issues First Prompt Injection Sanctions | add now |
| SEC3 Compliance | https://sec3compliance.com/feed/ | compliance | RIA exam-prep commentary. Latest item tracks the SEC risk alert on annual compliance reviews, plus Reg S-P exam readiness. | 2026-09-18 | SEC Risk Alert Highlights Annual Compliance Review Deficiencies | add now |
| The Daily Upside | https://www.thedailyupside.com/feed/ | markets | Markets brief advisors already read. Same-day “AI Risks” item ahead of the Trump-Xi summit. Filter AI. | 2026-09-21 | AI Risks, Trade War Loom Over Trump-Xi Summit | add now |
| FactSet Insight | https://insight.factset.com/rss.xml | vendors | Research notes, not a press-release wire. 18 September: more than 65% of S&P 500 earnings calls cited AI. Filter AI. | 2026-09-21 | More Than 65% of S&P 500 Earnings Calls for Q2 Cited “AI” | add now |
| Aiera | https://aiera.com/feed/ | vendors | Buy-side research AI. Recent titles are about AI in financial research and broker-research licensing. | 2026-08-25 | Triangulating Value with AI in Research | add now |
| Theta Lake | https://thetalake.com/feed/ | vendors | Communications-compliance vendor. 26 August item is AI interaction governance with CrowdStrike; an earlier item covers the Claude compliance API. | 2026-08-26 | Theta Lake Announces AI Interaction Governance Integration with CrowdStrike Falcon Next-Gen SIEM | add now |
| T3 Conferences | https://t3conferences.com/feed/ | wealthtech | Conference feed, separate from T3 Technology Hub. July items on the AI-augmented advisor. Filter AI so sponsorship posts drop. | 2026-07-30 | #T32027 Conference Registration Opens: Event Focused on the AI-Augmented Advisor | add now |
| AWS Industries | https://aws.amazon.com/blogs/industries/feed/ | banking_fintech | All-industry blog, so filter to financial services. Current items: uncontrolled copilot platforms in FS, multi-agent FSI risk, and KYC/KYB agents. | 2026-09-20 | EUC 2.0: Why Uncontrolled copilot platforms are Financial Services’ Next Governance Challenge | add now |
| WatersTechnology | https://www.waterstechnology.com/feeds/rss | banking_fintech | Capital-markets technology. Fresh items on GPU-compute derivatives and whether agents stick on the desk. Previously no parseable feed; this URL parsed today. | 2026-09-21 | GPU compute derivatives are put to the test | add now |
| MIT Sloan Management Review | https://sloanreview.mit.edu/feed/ | research | Enterprise management. Recent items include “How AI Creates a Capability Mirage” and “When AI Disruption Never Ends.” The AI topic feed itself is empty, so use the site feed with an AI filter. | 2026-09-21 | How AI Creates a Capability Mirage | add now |

## Maybe

Fresh and parseable. Left out of the add-now file because the latest items are thin on AI, overlap a feed already configured, or the keyword hit is incidental.

| Name | URL | Category | Why it fits | Newest item | Sample title | Priority |
|---|---|---|---|---|---|---|
| Chief Investment Officer | https://www.ai-cio.com/news/feed/ | institutional | Allocator news RSS is alive. The previously probed site `/feed/` is still last updated in 2022. Latest headlines are returns, staffing, and pensions. | 2026-09-18 | AIMCo Posts 7.2% H1 Return as Portfolio Shifts Toward Canadian Energy, U.S. Tech | maybe |
| Latham Global FinReg | https://www.globalfinregblog.com/feed/ | compliance | Securities-regulatory blog. Latest notes cover tokenized transfer agents, material-risk rules, and e-delivery. No AI title in the latest ten. | 2026-09-17 | SEC Proposes Modernizing Transfer Agent Infrastructure, Including Framework for Tokenized Securities | maybe |
| Norton Rose Regulation Tomorrow | https://www.regulationtomorrow.com/feed/ | compliance | UK and EU markets and asset-management regulation, including an asset-management podcast series. No AI title in the latest ten. | 2026-09-21 | Let’s Talk Asset Management, Episode 34: UK Asset Management Framework Reforms | maybe |
| Harvard Law Corp Gov | https://corpgov.law.harvard.edu/feed/ | compliance | Governance forum used by securities lawyers. Latest items are compensation, CVRs, and director risk. | 2026-09-21 | 2026 U.S. Compensation Post Season Review | maybe |
| Asian Private Banker | https://asianprivatebanker.com/feed/ | practice | APAC private-wealth desk (hiring, flows, platforms). No AI title in the latest stories. | 2026-09-21 | Brookfield expands APAC private wealth push as Japan and Australia lead 60% inflow surge | maybe |
| Net Interest | https://www.netinterest.co/feed | banking_fintech | Deep bank and holdco analysis (Brookfield, Apollo, Guggenheim). No AI title in the latest essays. | 2026-09-19 | Brookfield of Dreams | maybe |
| American Banker Wealth | https://www.americanbanker.com/tag/wealth-management.rss | banking_fintech | Wealth desk, separate from the AI tag already configured. Latest items are leadership and pay, not AI. | 2026-09-18 | Morgan Stanley asks advisors to produce more to keep same pay | maybe |
| Meketa | https://meketa.com/news/feed/ | institutional | Consultant notes. One in-window piece on what SpaceX, Anthropic, and OpenAI IPOs would mean for institutions. | 2026-08-26 | The Mag Seven: Big Earnings, Bigger Capex | maybe |
| AssetMark | https://www.assetmark.com/feed/ | vendors | TAMP blog. July item “AI Should Make Advice More Human”; newer items are HNW cash and relationship marketing. | 2026-09-16 | AI Should Make Advice More Human | maybe |
| CIRO | https://www.ciro.ca/rss.xml | regulation | Canadian investment-dealer SRO. Working feed of hearings, CFR guidance, and the annual report. | 2026-09-17 | CIRO Releases 2026 Annual Report | maybe |
| CSA | https://www.securities-administrators.ca/news/feed/ | regulation | Canadian securities administrators. Closest tech item is a data-portability report for the investment market. | 2026-09-17 | CSA report: Data portability holds promise for investment market | maybe |
| ECB Press | https://www.ecb.europa.eu/rss/press.html | regulation | Fresh press RSS, including tokenised securities settlement. BoE, ESMA, and EBA are already configured. | 2026-09-21 | ECB to invest part of own funds in tokenised securities, with settlement via Pontes | maybe |
| ETF Express | https://etfexpress.com/feed/ | markets | European ETF wrap with one AI indexing launch (PANTA). ETF Trends is already configured. | 2026-09-21 | PANTA launches advanced AI layer to test indices | maybe |
| Bobsguide | https://www.bobsguide.com/feed/ | banking_fintech | One agentic-payments item (DBS and Stripe). The rest is open banking, digital euro, and FCA crypto. | 2026-09-18 | DBS and Stripe Form Agentic Payments Partnership in APAC | maybe |
| Federal Register AI query | https://www.federalregister.gov/api/v1/documents.rss?conditions%5Bterm%5D=%22artificial+intelligence%22&conditions%5Bagencies%5D%5B%5D=securities-and-exchange-commission&conditions%5Bagencies%5D%5B%5D=commodity-futures-trading-commission&order=newest | regulation | Parses, and the query is limited to SEC and CFTC. The newest headlines are QC 1000, binary options, and a FINRA rule filing, so the match is in the document body. | 2026-09-18 | Public Company Accounting Oversight Board; Notice of Filing of Proposed Rules on Amendments to QC 1000 | maybe |
| Gibson Dunn | https://www.gibsondunn.com/feed/ | compliance | Securities alerts plus one Ninth Circuit DMCA case on AI-generated code. | 2026-09-19 | Ninth Circuit Clarifies Limits of DMCA Liability for AI-Generated Code | maybe |
| Dynasty Financial | https://www.dynastyfinancialpartners.com/feed/ | practice | RIA platform. July item “Where AI Progress Meets Operational Reality”; newer items are M&A and market outlooks. | 2026-07-28 | Where AI Progress Meets Operational Reality | maybe |
| Portfolio Adviser | https://portfolio-adviser.com/feed/ | institutional | Fresh UK fund and ETF-strategy news. No AI title in the latest items. | 2026-09-21 | City Hive launches ACT Toolkit to improve charities’ oversight of asset managers | maybe |

## Still not usable today

Re-fetched. Still no fresh parseable feed, so they are not in the tables above.

- **FINRA** notices and common RSS paths: Cloudflare 403.
- **ThinkAdvisor** (`/feed?rss=true` included) and **Advisor Perspectives**: 403.
- **Institutional Investor** `rss.xml`: parses, newest item 2025-06-11.
- **DigFin**: parses, newest item 2025-07-17.
- **Chief Investment Officer** site `/feed/`: still the abandoned channel. The live one is `/news/feed/` (see Maybe).
- **Citywire RIA / Americas**: bot wall. **WealthBriefing** and **Family Wealth Report**: HTML, no RSS link. **FT Adviser**, **Advisor.ca**, **ETF.com**, **Pensions & Investments**, **The Financial Brand**, **Bank Automation News**, **NY DFS**, **DOL/EBSA**: 403.
- **Wirehouse and asset-manager insight pages** (BlackRock, Vanguard, Schwab learn, Fidelity viewpoints, JPM, Goldman, Morgan Stanley, AQR, GMO, Research Affiliates, Man Institute, Oaktree, PIMCO): no public RSS. Fidelity’s newsroom RSS and Schwab’s `rss.xml` are product and routing blurbs.
- **Anthropic** news: still no RSS (HTML scrape remains the path). **Morningstar**, **Cerulli**, **F2 Strategy**, **Stanford HAI**, **Brookings** `/feed/` (redirects to the homepage): no parseable feed.
- **Investment Executive** and **Hardin Compliance**: TLS failure from this probe. **Covington Financial Services**: connect timeout. Not treated as keepers.
