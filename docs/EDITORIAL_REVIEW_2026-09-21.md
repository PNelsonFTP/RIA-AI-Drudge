# Editorial review — 2026-09-21

Payload reviewed: `public/data/headlines.json` and `public/data/headlines-preview.json` (same stories; preview is the homepage and omits view-all lists), plus `public/data/brief.json`. Generated **2026-09-20T13:41:52Z**.

- Homepage: **108** stories (`totalCount`).
- View-all lists: **186** category slots, **166** unique URLs (about 20 are the same story filed in a second column).
- Brief: `source: "fallback"` (template, not an edited synthesis).
- Site lead URL: SEC speech “Remarks Before 12th Annual Government Enforcement Institute.”

Audience used for every judgment: RIAs, broker-dealers, advisors, and wealth or asset managers. Relevant news is practice tools, wealthtech, regulation and compliance, bank and fintech AI, and AI as an investment theme. Lab and general-tech items belong in a “what’s coming” column.

Filters referenced below are the current `AI_FILTER`, `SUPERVISION_FILTER`, `FINANCE_OR_ENTERPRISE`, `KEYWORDS`, and `AGE_WINDOWS` in `scripts/sources.ts`. Homepage order is the `articles` array. View-all is `articlesAll`.

**Every removal below is a suggestion only. This review does not delete feeds or edit `scripts/sources.ts`.**

---

## What’s working

The week’s real advisor story is visible, even though it is scattered.

- **Claude for financial advisors** is covered as a product fact: Wealth Solutions Report, plus Wealthbox, Wealth.com, and eMoney posts about CRM and estate-planning connectors, and Orion “gives Claude direct access to portfolio and CRM data.”
- **Practice tools:** InvestmentNews, “Advisors get the keys: AdvisorCRM and Zeplyn…”; Financial Planning, “Advisors want more client time. Is AI actually giving it to them?”; T3 on Zeplyn Agent Studio and AdvisorCRM Studio.
- **RIA reporting:** RIABiz on the Savvy stake sale (LPL disruption-by-AI) and on Schwab’s Anthropic custody contract. These are the best original stories in the file.
- **Wealthtech trade press:** WealthManagement.com on Envestnet’s WealthStack update and Allworth’s AI stack.
- **Institutional is the cleanest column** (see below): defined-contribution advisors actually using AI, from PlanAdviser and PlanSponsor.
- **A few bank items are on mission:** ABA Banking Journal, “New tool released to help state bank examiners assess AI risks”; Banking Dive, “State regulators float AI framework for banks, examiners”; American Banker on agentic payments.
- **One SEC item is the right primary source:** “Information in the Age of AI” (Joshua White, Division of Economic and Risk Analysis, 2026-09-17).
- **One Google News hit is doing the job ThinkAdvisor’s own feed cannot:** “Firms Cheer FINRA's Comms Plan but Call for More AI Clarity” (ThinkAdvisor, via GN: FINRA AI).
- The bare token `ai` is not matching “said” or “available”. The false positives below are summary mentions, link roundups, and extra supervision words, not the short-token bug.

---

## Per category

“Belong?” is whether a homepage reader in this audience should see that headline in that column.

### Advisor tech — 6 shown / 6 view-all — mostly belongs, thin

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | Advisors get the keys: AdvisorCRM and Zeplyn let firms build their own AI tools | InvestmentNews | Yes |
| 2 | Advisors want more client time. Is AI actually giving it to them? | Financial Planning | Yes |
| 3 | AdvisorCRM Launches AdvisorCRM Studio to Help Advisors Build Custom Apps Without Coding | T3 Technology Hub | Yes (product announcement) |
| 4 | Why Open APIs Are the Foundation of Modern Wealth Platforms | SS&C (vendor) | Weak. AI is one clause in the summary; this is a platform essay |
| 5 | Orion Gives Claude Direct Access To Portfolio And CRM Data | GN: wealth AI vendors | Yes, but it is a syndicated vendor item (thewealthadvisor.com), and the `crm` keyword pulled it out of Vendor Watch |

Kitces fetched 1 item and contributed 0. The column is six stories from a mix of trade press, a vendor, and Google News.

### Industry news — 15 shown / 34 view-all — does not belong as a lead column

This is the largest homepage column (`displayCap` 15 versus 10 elsewhere) and it is the second category in `CATEGORIES`, so general tech outweighs advisor tech, regulation, and practice on the front page. Nine sources, several of them capped at the global limit of 6 items.

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | Humans, not rogue AI, are still the biggest cybersecurity risk to energy systems | The Verge AI | No. General security |
| 2 | Meta's Muse Is Better at Surveilling Than Helping Me | Wired AI | No. Consumer gadget |
| 3 | It’s Donald Trump Versus MAGA on Data Centers | Wired AI | Marginal. Politics of data centers, not advisor news |
| 4 | Flock reportedly tries to shrink workforce with employee buyouts | TechCrunch AI | No. Not an AI story |
| 5 | Google’s Gemini is the latest AI model to hack other companies | TechCrunch AI | “What’s coming” only. Also duplicated in Labs and Markets |

View-all makes the column worse, same sources:

- “Petlibro’s new AI-powered feeder is a game changer for multi-cat homes” — TechCrunch AI
- “Prices go up in 7 days. Get your Disrupt ticket now.” — TechCrunch AI
- “Join the WIRED World Fair in Miami on November 4” — Wired AI
- “Meta’s Muse is creepy…” — The Verge AI (second Muse item)
- “Small AI models let drones autonomously identify and attack battlefield targets” — Ars Technica AI
- “AI hallucination of Chinese nuclear components almost led to US military attack” — Ars Technica AI
- “FAA tees up $875M AI tool to help manage air traffic congestion” — Ars Technica AI
- Entire Reuters Google News set (six items, none about AI): “Global shares edge higher…”, “FedEx, Advent-led consortium secures over 89% of InPost…”, “Beretta Holding launches offer to raise stake in Sturm Ruger”, “Warren Buffett steps down…”, “Australia's central bank chief warns inflation risks materialising”, “Former Chelsea owners Boehly and Walter sell holdings to Clearlake” — Reuters AI (GN)
- “The global credit tightening is underway” — Axios AI (GN)
- “Claude Projects v2…, Google family agent…” and “Jev, Periodic Neon, Gemini 3.8 Live” — TLDR AI (newsletter dumps, not stories)

A Chinese model on a government site, mathematicians using AI, and “could AI kill us all” are the same general-tech pile.

### Regulation — 8 shown / 8 view-all — thin, and half the column is not AI supervision

Four sources. Two of three SEC speeches are not AI items. Google News is a third of the column.

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | Remarks Before 12th Annual Government Enforcement Institute | SEC Speeches | No. Summary is only “David Woodcock, Director, Division of Enforcement.” This is the site lead |
| 2 | Firms Cheer FINRA's Comms Plan but Call for More AI Clarity | GN: FINRA AI | Yes (ThinkAdvisor) |
| 3 | Information in the Age of AI | SEC Speeches | Yes |
| 4 | EXAMS Accessible and Integrated | SEC Speeches | No. Exam-program branding, not an AI exam priority |
| 5 | Anthropic Launches Claude for Financial Advisors, Taking Aim at Wealth Management | GN: FINRA AI | Wrong column. Product launch, copied from finance.biggo.com |

Also in the eight: “Internal Reviews Covering the Use of AI by FINRA Associated Persons” (National Law Review via GN: FINRA AI) belongs. “NASAA Comment Letter to FINRA Regarding Regulatory Notice 26-14” has no AI in the title or summary. Debevoise, “Does Your AI Need a Boss?”, is a good compliance essay filed here by keyword overlap.

Fed, OCC, FDIC, CFPB, Treasury, and CFTC feeds returned 0 items after `AI_FILTER`. That is consistent with a quiet week at those presses, not with a dump. The column is thin because the items that *did* pass are the wrong SEC and NASAA headlines, while the high-volume regulation feeds contributed nothing visible: EU AI Act tracker 15 fetched / 0 shown, GN: SEC AI 11 fetched / 0 shown.

### Wealthtech — 10 shown / 20 view-all — real trade news under a bad query

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | UPI MDR could upend lending, wealth-tech economics | GN: wealthtech AI | No. India payments. Matched because the query treats “wealth-tech” as enough |
| 2 | WealthStack Roundup: Summarizing Envestnet's Third 2026 Technology Update | WealthManagement.com | Yes |
| 3 | Allworth: A Tech Stack Built to Leverage AI Today | WealthManagement.com | Yes |
| 4 | UK Leads European WealthTech Funding Despite Market Shifts in H1 2026 | GN: wealthtech AI | Marginal. Funding roundup, off the US RIA desk |
| 5 | Crowwd raises $260,000 to turn its investor community into a wealth-tech platform | GN: wealthtech AI | No. Tiny raise, and the same story is listed twice more |

View-all repeats Crowwd as “Crowwd Raises Rs 2.5 Cr…” (BW Disrupt) and “Crowwd raises ₹2.5 crore angel funding” (ET Entrepreneur). Also: “PortfolioFuture Launches Data-Driven Fund Discovery…” (T3 Technology Hub) has no AI in the title. The better items are lower: Wealth Solutions Report on Claude, T3 on Robinhood Cortex and Zeplyn Agent Studio, Vanilla’s agentic estate-planning launch.

GN: wealth copilot fetched 15 and contributed 0 to the page.

### Practice and RIA — 8 shown / 8 view-all — two excellent stories, then link blogs

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | Sunday links: the AI safety debate | Abnormal Returns | No. A link roundup. “AI safety” is the label; the body is bonds and Berkshire |
| 2 | Ritik Malhotra sells not-for-sale Savvy stake… LPL-disruption-by-AI | RIABiz | Yes |
| 3 | Advisors want more client time… | Financial Planning | Yes (also in Advisor tech and Research) |
| 4 | Thursday links: differentiated trust | Abnormal Returns | No. Passed because the summary mentions an Anthropic IPO link and “AI fears” in cybersecurity stocks |
| 5 | 'Fool's gold' warning as more than half of consumers embrace AI for decision-making | Professional Adviser | Marginal. UK consumers, not RIA practice |

“Cathi Harrison on Verve's next phase…” does belong: the summary is about AI cutting adviser costs. “Tuesday links: playing by its rules” (Abnormal Returns) does not. The Schwab–Anthropic RIABiz piece is the right lead for this column and is sitting at #7 because the link blog is newer.

### Compliance — 5 shown / 5 view-all — short, one real framework piece

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | September 2026 Vendor Management News | Ncontracts Nsight (vendor) | Weak. Monthly vendor newsletter; AI governance is a clause |
| 2 | How RIAs can build a practical AI compliance framework | GN: RIA AI | Yes (FinTech Global) |
| 3 | AI in Finance and Banking, September 15, 2026 | LLRX | Yes, as a digest |
| 4 | Does Your AI Need a Boss? The Case for Employee-Style Controls for Agentic AI | Debevoise Data Blog | Yes |
| 5 | Debevoise Wins “Innovation of the Year” for STAAR 2.0 | Debevoise Data Blog | No. Law-firm award for its own tool |

### Banking and fintech — 10 shown / 20 view-all — future-dated Finextra on top

Finextra items are dated **2026-10-21, 2026-11-03, and 2026-11-05** in a file built on 2026-09-20, so they sort above same-week reporting.

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | How acquirers are commercialising fraud intelligence | Finextra AI | Marginal. Payments, and the date is in the future |
| 2 | Mind the gap: What’s missing from modern resilience? | Finextra AI | No. Resilience essay, future-dated |
| 3 | AI in payments: Short-term gains, long-term transformation | Finextra AI | Marginal |
| 4 | Ant International Unveils 100 Products to Drive Agentic Financial Operations | PYMNTS AI | Vendor dump |
| 5 | California Governor Mobilizes Expert Panel to Strengthen AI Safety Laws | PYMNTS AI | No. State AI safety, not bank AI |

Buried under that, and more useful: “Zeidler bets AI can cut DDQ review time” (FinTech Global), “Stripe’s wallet embraces AI bots” and “State regulators float AI framework for banks, examiners” (Banking Dive), “New tool released to help state bank examiners assess AI risks” (ABA Banking Journal AI). “OpenAI Targets Legal Tech Market With Astra for Law” (PYMNTS) is legal tech, not banking. “Beyond connectivity: Creating more value across the payments lifecycle” (Finextra) has no AI in the title.

### AI markets — 10 shown / 20 view-all — listicles ahead of the investment theme

`AGE_WINDOWS.markets` is 3 soft days / 5 hard days. Citrini Research fetched 15 items and placed 0. Same-day stock tips fill the hole.

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | Marsh CEO Says Geopolitics Tops CEO Risks | Bloomberg Markets | No. Headline is geopolitics; “AI” appears later in the summary |
| 2 | AI’s Wobbly House of Cards Puts Markets and US Economy at Risk | Bloomberg Markets | Yes |
| 3 | Should You Invest in an Anthropic IPO ETF? What Investors Need to Know Right Now. | GN: AI capex / ETF | No. Motley Fool listicle |
| 4 | Burned Out and Unemployed, Young People in China Are Launching AI Startups | WSJ Tech | No. Labor color, not the AI trade |
| 5 | Trump announces ‘AI Force’… | FT Artificial Intelligence | Marginal here. Politics, not a portfolio story |

The rest of the Google News query is the same genre: “Nvidia Stock Hasn't Set a Record in 4 Months…” (Globe and Mail), “Applied Materials vs. Nvidia…” (Globe and Mail), “Prediction: This Nvidia-Backed Artificial Intelligence (AI) Stock Could 10X by 2033” (Motley Fool), “Better Artificial Intelligence (AI) Stock Pick for 2027: Nvidia versus Micron” (Yahoo Finance). FT’s Anthropic-revenue, OpenAI-burn, and Nscale-listing items, further down the view-all list, are the actual investment-theme coverage. “What It’s Like to Work in One of America’s Data Centers” (WSJ Tech) and “MBA Programs Race to Adapt to the AI Era” (Bloomberg Tech) are not.

### Institutional — 6 shown / 6 view-all — best section

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | BlackRock MyMap's Chris Ellis Thomas: Three ways to invest in AI trade's second act | Investment Week | Yes (also copied into Markets) |
| 2 | AI Use Surges Among DC Advisers, Consultants, per T. Rowe Price | PlanAdviser AI | Yes |
| 3 | T. Rowe Price: DC Consultants Move Past AI Indecision | PlanSponsor AI | Yes. Same study as #2, acceptable duplication |
| 4 | AI Brings Gains for Time Management, but More Mistakes, Too | PlanAdviser AI | Yes |
| 5 | AI Product & Service Launches – 9/14/2026 | PlanAdviser AI | Yes, as a roundup |

“Claude thinks I’m an investment dunce” (FT Asset Management) is a column, and it is still about using a model on an investment question. Nothing in this column is a gadget, a drone, or a stock-tip listicle.

### Labs and models — 10 shown / 20 view-all — consumer blogs, not a “what’s coming” brief

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | Google’s Gemini is the latest AI model to hack other companies | TechCrunch AI | Duplicate of Industry |
| 2 | Gemini went rogue, hacked three companies, and Google hid it | The Verge AI | Same story again. This is also trending #3 |
| 3 | Introducing the Australian Youth Safety Blueprint | OpenAI News | No |
| 4 | New experts join Google’s AI & Economy team | Google AI Blog | No |
| 5 | Co-creating the future of fashion with Google | Google AI Blog | No |

Also off the advisor “what’s coming” brief: Meta on bionic prosthetics and on the Meta One subscription; OpenAI on workshops for older adults and on advertising; Google on fashion-adjacent “societal impact.” Closer to useful: “Introducing Astra for Law” / Cooley IPO work with ChatGPT (legal ops, still not wealth), “What we’ve learned from Microsoft’s own AI transformation,” and, below the fold, “Introducing Gemini 3.8 Live….” DeepMind’s model post is one item. The column reads as vendor blogs plus the Gemini-hack cluster.

### Research — 10 shown / 20 view-all — routed leftovers and general AI

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | Advisors want more client time… | Financial Planning | Yes, but it is here because a keyword matched, and it is already in two other columns |
| 2 | The $2.3 trillion horizon: How AI is rewriting the semiconductor story | McKinsey Insights | No. Semiconductors |
| 3 | Cutting the ‘coordination tax’: How agentic AI can reshape workflows | McKinsey Insights | Marginal. Generic enterprise |
| 4 | Helping founders achieve “exceptional” | Insight Partners | No. VC talent note that mentions AI |
| 5 | The CMO as impact driver… Genentech CMO Zoë Lazarre | McKinsey Insights | No. Pharma marketing |

“In Conversation With Accel’s Rich Wong: The Future of Venture” (Adams Street Insights) is a VC interview. Emerj’s “Drug Discovery AI” item is sponsored life-sciences content; “Artificial Intelligence at AIG” is an insurer profile. The item this audience would actually want, “RIAs Plan to Add Jobs as AI Boosts Capacity: Cerulli” (GN: advisor AI notetaker / ThinkAdvisor), is in the view-all list and not on the Advisor tech homepage. The `cerulli` keyword files it under Research, and the advisor-tech age window is shorter than Research’s.

### Vendor watch — 10 shown / 19 view-all — right idea, PR on top

| # | Title | Source | Belong? |
| --- | --- | --- | --- |
| 1 | Jacobi Selected as Tech Solution for Aberdeen's Model Portfolio Service | WealthTech Strategy | No. Summary cites PR Newswire. No AI |
| 2 | Envestnet Enhances Wealth Data Platform with Dynamic Benchmarking and AI-Driven Advisor Insights | GN: wealth AI vendors | Yes (FF News syndication) |
| 3 | Quartz launches in the UK with £2.75M to give everyone their own personal banker | WealthTech Strategy | No. Consumer banking launch, no AI requirement on this feed |
| 4 | Verapath and GenTrust Launch VIRA, an AI-Native Wealth Management Platform for RIAs | WealthTech Strategy | Yes |
| 5 | Opportunities and Risks: How Advisors Are Using AI for Estate Planning | Vanilla (vendor) | Yes |

Wealthbox “Introducing AI Agents,” Wealth.com “Estate and Tax Planning Inside Claude,” and eMoney “Agentic AI Reshapes How Advisors Plan Their 2027 Tech Budgets” belong in this column. They are vendor posts, which is what the column is for. Jump’s Schwab/Fidelity account-opening launch is real product news and sits at the bottom of view-all, under Jacobi and Quartz. WealthTech Strategy accounts for 8 of the view-all slots, the most of any single source in that list.

---

## Sources that dominate or dump off-topic items

Global cap is 6 items per source, so “dominance” here means a feed both fills that cap and spends it on the wrong subject. Counts are view-all appearances.

| Source | In payload | What it dumped |
| --- | --- | --- |
| Reuters AI (GN) | 6 | Six non-AI Reuters market stories. The Google News query is not holding. This feed has no `requireAny` |
| The Verge AI | 7 slots (cap 6 unique) | Muse, energy-grid security, antitrust, Gemini hack. No finance gate |
| TechCrunch AI | 7 slots | Flock layoffs, cat feeder, Disrupt ticket promo, Gemini hack |
| Wired AI | 6 | Muse, data-center politics, World Fair promo, mathematicians |
| Ars Technica AI | 6 | Drones, nuclear-targeting hallucination, FAA, a Chinese model on a .gov site |
| GN: wealthtech AI | 6 | UPI/India, Crowwd three times, a UK funding roundup, Envestnet–Vestmark |
| GN: AI capex / ETF | 5 | Motley Fool and Globe and Mail Nvidia listicles |
| Finextra AI | 6 | Payments essays, three of them future-dated, sitting on top of Banking |
| WealthTech Strategy | 8 | PR Newswire rewrite (Jacobi) and non-AI launches. Feed has `vendor: true` and no `requireAny` |
| OpenAI News | 6 | Youth safety, older-adult workshops, advertising |
| Google AI Blog | 5 | Fashion, hiring, “societal impact” |
| PYMNTS AI | 4 | 100-product unveil, California AI panel, Astra for Law |
| TLDR AI | 2 | Emoji digest headlines |
| Abnormal Returns | 3 | All three are “Sunday/Thursday/Tuesday links” |
| McKinsey Insights | 6 | Semiconductors, Genentech, insurance, plus one useful agentic-workflow piece |

T3 Technology Hub (no `requireAny`) mixed AdvisorCRM and Zeplyn, which belong, with PortfolioFuture, which does not.

Feeds that fetched a full page and then showed nothing, so they are not today’s dump but they are also not helping the thin columns: EU AI Act tracker (15), GN: SEC AI (11), GN: wealth copilot (15), Citrini Research (15), AI for Advisors podcast (15), Advisor360 (10), TIFIN (10).

---

## Vendor versus original reporting

There is no Business Wire source in the payload. PR still gets in through republishers.

- **PR Newswire, inside a story:** WealthTech Strategy, “Jacobi Selected as Tech Solution for Aberdeen's Model Portfolio Service.” The summary is a PR Newswire citation. Quartz on the same feed is a company newsroom rewrite.
- **Named `(vendor)` posts on the homepage:** SS&C (also filed into Advisor tech), Wealthbox, Vanilla, Ncontracts. In view-all: Wealth.com (two Claude posts), eMoney, a second SS&C and a second Wealthbox. Appropriate inside Vendor Watch. SS&C’s API essay and Ncontracts’ monthly newsletter are the weak ones.
- **Google News as a PR wire:** GN: wealth AI vendors appears 9 times. Publishers on the summaries are thewealthadvisor.com, FF News, Citywire, and Pulse 2.0. Orion, Envestnet, and Jump each show up as syndicated announcements in more than one column. Citywire’s “Altruist to expand AI capabilities post-Vanguard sale” is closer to a reported piece.
- **GN: FINRA AI’s Claude item** resolves to finance.biggo.com, an aggregator, and is clustered with Wealth Solutions Report as if it were a second newsroom.
- **PYMNTS** “Ant International Unveils 100 Products…” is a product dump.
- **Debevoise’s STAAR award** is the firm announcing its own prize.
- **Emerj** “Drug Discovery AI” is labeled sponsored in the summary.

Original reporting that should stay at the top of its column: RIABiz, InvestmentNews, Financial Planning, WealthManagement.com, PlanAdviser, PlanSponsor, American Banker, ABA Banking Journal, Banking Dive, FT, and the one on-topic SEC speech.

---

## Regulation thinness and Google News versus first-party

The regulation homepage is eight stories from SEC Speeches (3), GN: FINRA AI (3), NASAA (1), and a routed Debevoise post (1).

What is missing is not a mystery pile of Fed press releases. Those feeds ran and matched nothing, which is what a tight AI filter should do on a week with no AI release. The holes are:

1. **`SUPERVISION_FILTER` is wider than AI.** It adds `enforcement`, `exams`, and `finra` on top of `AI_FILTER`. That is why a generic enforcement-institute speech, an “EXAMS Accessible and Integrated” speech, and a NASAA comment letter that never says “AI” occupy three of the eight slots. The enforcement speech outranks “Information in the Age of AI” and, because regulation is the highest lead rank, it becomes the site lead.
2. **The feeds that were supposed to add volume did not appear.** EU AI Act tracker: 15 items fetched, 0 on the page (21-day hard window is the likely cut). GN: SEC AI: 11 items fetched, 0 cards. They are not sitting in `related` arrays either. This file does not show them duplicating the SEC speeches, because they are absent. Do not add another SEC Google News query until those 11 are accounted for (age window and exact-title dedup both drop items before the column is built).
3. **The Google News that did land duplicates a wealthtech launch and backfills trade press.** Visible GN versus first-party:
   - “Anthropic Launches Claude for Financial Advisors” — Wealth Solutions Report in Wealthtech, and the same story again under Regulation from GN: FINRA AI (finance.biggo.com).
   - “Firms Cheer FINRA's Comms Plan…” — ThinkAdvisor via Google News only. There is no ThinkAdvisor feed (the probe notes say that site is WAF-blocked). This GN item is useful, not a duplicate.
   - “Internal Reviews Covering the Use of AI by FINRA Associated Persons” — National Law Review via Google News only. Also useful, and it is the kind of supervision piece the SEC filter failed to supply.
   - Envestnet, Orion, and Jump appear as GN syndicates in Wealthtech, Advisor tech, and Vendors, beside vendor blogs saying the same thing.
   - PlanAdviser and PlanSponsor both carry the T. Rowe DC-consultant study. That pair is first-party trade press, not Google News, and it is the healthy kind of overlap.

---

## Trending and the daily brief

Trending has **3** clusters. The build treats fewer than 4 as thin.

1. **“Anthropic Launches Claude For Financial Advisors”** — Wealth Solutions Report, plus one related GN: FINRA AI / biggo.com link. Right story, fake breadth. Wealthbox, Wealth.com, eMoney, and Orion are the same launch and did not join the cluster because the titles differ (“Brings Advisor CRM Data to Claude…”, “Estate and Tax Planning Inside Claude…”).
2. **“Trump announces ‘AI Force’…”** — FT, with a WSJ Tech related. Real two-outlet story. It is national politics. Fine as a lower “what’s coming” item, weak as trending #2 for this audience.
3. **“Gemini went rogue, hacked three companies, and Google hid it”** — The Verge, with FT related. TechCrunch’s version stays a separate Industry card. Lab safety, not advisor news, and it is trending #3.

`brief.json` (`source: "fallback"`, generated a second later) pastes titles into a fixed skeleton:

- Headline: “Today's top CFP AI story: Anthropic Launches Claude For Financial Advisors.” The prefix is mechanical. The story choice is the one good call in the brief.
- Bullet 2 is the enforcement-institute speech, because the fallback takes `regulation`’s first card.
- Bullet 3 is “Sunday links: the AI safety debate,” because that is `practice`’s first card.
- Bullet 4 is the InvestmentNews AdvisorCRM piece. That one belongs.
- Bullet 5 is “UPI MDR could upend lending, wealth-tech economics,” because that is `wealthtech`’s first card.

The brief is amplifying the ranking bugs. It is not an editor’s selection.

---

## `requireAny` false positives and false negatives

Matching is title plus summary, case-insensitive. Tokens of length 3 or less use a word boundary. Longer needles are substrings. There is no reject log in the JSON, so false negatives are inferred from feeds that fetched items and then placed nothing, not from headlines that were seen and dropped.

### False positives visible in titles

| Title | Source | Why it passed |
| --- | --- | --- |
| Remarks Before 12th Annual Government Enforcement Institute | SEC Speeches | `SUPERVISION_FILTER` includes `enforcement`. Summary never says AI |
| EXAMS Accessible and Integrated | SEC Speeches | `exams` (five letters, so a substring) |
| NASAA Comment Letter to FINRA Regarding Regulatory Notice 26-14 | NASAA | `finra` is on `SUPERVISION_FILTER` with no AI term required. Summary is a repeat of the title |
| Marsh CEO Says Geopolitics Tops CEO Risks | Bloomberg Markets | `ai` hits a later sentence in the summary |
| Thursday links: differentiated trust | Abnormal Returns | Summary mentions an Anthropic IPO item and “AI fears” in cybersecurity stocks |
| Tuesday links: playing by its rules | Abnormal Returns | Same pattern: one AI clause inside a link blog |
| Sunday links: the AI safety debate | Abnormal Returns | Title contains “AI,” but the item is still a roundup |
| Helping founders achieve “exceptional” | Insight Partners | `AI_FILTER` hits “AI” as a talent buzzword |
| The CMO as impact driver… Genentech | McKinsey Insights | AI mentioned in a pharma marketing interview |
| Mind the gap: What’s missing from modern resilience? | Finextra AI | No `requireAny` on the AI-channel feed |
| Beyond connectivity… payments lifecycle | Finextra AI | Same |
| PortfolioFuture Launches Data-Driven Fund Discovery… | T3 Technology Hub | No `requireAny` |
| Jacobi Selected… Aberdeen's Model Portfolio Service | WealthTech Strategy | No `requireAny`. PR Newswire |
| Quartz launches in the UK… | WealthTech Strategy | No `requireAny` |
| Flock reportedly tries to shrink workforce… | TechCrunch AI | AI-category feed, no `requireAny`, and the item is not about AI |
| Petlibro’s new AI-powered feeder… | TechCrunch AI | `ai-powered` is a true keyword match and the wrong product |
| Prices go up in 7 days. Get your Disrupt ticket now. | TechCrunch AI | Promo on an unfiltered AI feed |
| Global shares edge higher… (and the five other Reuters headlines) | Reuters AI (GN) | No `requireAny`. The Google query returned ordinary Reuters copy |
| The global credit tightening is underway | Axios AI (GN) | Same failure mode |
| UPI MDR could upend lending, wealth-tech economics | GN: wealthtech AI | Query is `wealthtech OR "wealth tech" OR …` with no `requireAny` |
| Should You Invest in an Anthropic IPO ETF?… | GN: AI capex / ETF | Query includes NVIDIA / ETF / stock and has no `requireAny` |

`FINANCE_OR_ENTERPRISE` includes `security` as a substring, so “cybersecurity” matches. That did not have to fire to explain this week’s visible junk. The visible failures are unfiltered category feeds, supervision words, and `ai` inside summaries of roundups.

### Keyword router side effects

- `crm` files SS&C’s API essay and the Orion Claude item into Advisor tech.
- `gemini ` copies the hack story from Industry into Labs.
- `cerulli` and `survey` copy advisor and vendor items into Research, where the 21-day window keeps them after Advisor tech’s 8-day window has moved on.
- `datacenter` / `capex` pull color stories toward Markets. The WSJ data-center workplace piece is in Markets because that is the WSJ Tech home category, not because of a clever route.

### False negatives (inferred)

Stories that clearly belong and are buried, not deleted:

- “RIAs Plan to Add Jobs as AI Boosts Capacity: Cerulli” — Research view-all, not Advisor tech.
- “New tool released to help state bank examiners assess AI risks” (ABA) and “State regulators float AI framework for banks, examiners” (Banking Dive) — under future-dated Finextra.
- “Jump Launches AI-Assisted Real-Time Account Opening With Schwab Advisor Services And Fidelity” — bottom of Vendor view-all.
- Schwab–Anthropic (RIABiz) — under Abnormal Returns in Practice.

Feeds that passed `requireAny` (or have no filter) and still contributed 0 homepage stories, so a real item may have been aged out:

- Kitces — Advisor FinTech: 1 fetched, 0 shown (advisor tech hard window is 8 days). This is the critical practice-tech source.
- Citrini Research: 15 fetched, 0 shown (markets hard window is 5 days), while Motley Fool items from the same morning are on the homepage.
- GN: wealth copilot: 15 fetched, 0 shown.
- EU AI Act tracker: 15 / 0. GN: SEC AI: 11 / 0.
- Altruist (vendor): 6 AI-filtered items fetched, 0 from the vendor feed. The Altruist headline on the page is the Citywire piece via Google News.

---

## Suggested changes

**Suggestion only. Do not treat this section as a delete list.**

### Suggested source removals or demotions

1. **Reuters AI (GN)** — remove, or keep only with a title-level AI requirement. All six visible headlines are ordinary Reuters markets copy.
2. **Axios AI (GN)** — same suggestion. The visible item is “The global credit tightening is underway.”
3. **GN: AI capex / ETF** — remove or rewrite the query so it cannot return “could 10X” and “which stock is the better buy” listicles. FT and Bloomberg already cover the AI trade.
4. **GN: wealthtech AI** — stop treating the word “wealthtech” as sufficient. It produced UPI, a UK funding roundup, and three Crowwd wires.
5. **TechCrunch AI, The Verge AI, Wired AI, Ars Technica AI** — demote off the front page or add `FINANCE_OR_ENTERPRISE` (with `security` tightened). They are the gadget, promo, drone, and Muse pile, and they occupy the largest column.
6. **TLDR AI** — remove. Digest headlines are not stories.
7. **Meta AI Blog** — remove or require a finance/enterprise term. Visible items are prosthetics and a Meta One subscription.
8. **Google AI Blog** — same suggestion. Keep Google DeepMind for model releases.
9. **OpenAI News** — require a finance, enterprise, or model-release term so youth, advertising, and older-adult workshop posts drop.
10. **Finextra AI** — require an AI term in the title, and clamp future dates. Unclamped dates are why resilience essays lead Banking.
11. **PYMNTS AI** — tighter AI-and-banking gate, or remove. Legal-tech and 100-product unveils are what it contributed.
12. **WealthTech Strategy** — add `AI_FILTER`. It is how PR Newswire (Jacobi) and Quartz lead Vendor Watch.
13. **T3 Technology Hub** — add `AI_FILTER` so PortfolioFuture-style non-AI launches drop and AdvisorCRM / Zeplyn stay.
14. **Abnormal Returns** — require the match in the title, or remove. Three link blogs lead or pad Practice.
15. **Insight Partners and Adams Street Insights** — remove from Research. Both visible pieces are general venture.
16. **Emerj AI Research** — remove, or block sponsored life-sciences explainers. “Drug Discovery AI” is sponsored; the AIG profile is not wealth.
17. **McKinsey Insights** — require a wealth, bank, or advisor term in addition to AI, so semiconductors and Genentech drop and the agentic-workflow piece can stay.
18. **Ncontracts Nsight (vendor)** — keep the feed, but require the title itself to be about AI, not a monthly “vendor management news” roundup.

Do not remove, on this week’s evidence: RIABiz, InvestmentNews, Financial Planning, WealthManagement.com, Wealth Solutions Report, PlanAdviser, PlanSponsor, American Banker, ABA Banking Journal, Banking Dive, Kitces, FT, SEC Speeches, NASAA, Debevoise’s analysis posts, Vanilla, Wealthbox, Wealth.com, eMoney.

### Suggested filter and ranking changes

- Drop bare `enforcement` and bare `exams` from `SUPERVISION_FILTER`. Keep `exam priority`, `ai-washing`, and `model risk`. Require an AI term before `finra` alone can pass. That would have kept “Information in the Age of AI” and dropped the enforcement-institute speech, “EXAMS Accessible and Integrated,” and the NASAA letter that never mentions AI.
- For Bloomberg Markets, Abnormal Returns, and SEC Speeches, require the keyword in the **title**, not only in the summary.
- Narrow `FINANCE_OR_ENTERPRISE`: `security` currently matches “cybersecurity.” Prefer “enterprise” plus an AI term.
- In `KEYWORDS`, stop routing on bare `survey`. Be careful with `crm` (it promoted SS&C into Advisor tech) and with `gemini ` (it duplicates the hack story into Labs).
- GN: FINRA AI is worth keeping for ThinkAdvisor and National Law Review. Exclude product-launch headlines (Claude for advisors) from the regulation column so they stay in Wealthtech / Vendors.
- Widen `AGE_WINDOWS.markets` past 5 hard days so a source like Citrini can compete with same-day listicles. Check Kitces against the 8-day advisor-tech window before assuming that feed is empty.
- Give Industry the same homepage cap as the other columns, and stop putting it second. Labs and general tech should be the “what’s coming” column the audience asked for, not 15 of 108 homepage slots.
- Clamp dates that are after the build time so Finextra cannot occupy the top of Banking from October and November timestamps.
- Trending should treat the Claude connector posts as one cluster, and the brief should not take “first card of regulation / practice / wealthtech” while those first cards are an off-topic speech, a link blog, and an India payments story.
