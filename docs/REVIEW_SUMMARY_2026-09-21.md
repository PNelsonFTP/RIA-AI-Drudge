# Review summary — 21 September 2026

Four reviews of CFP AI Report (`RIA-AI-Drudge`). The 12 suggested removals were **not** deleted. The 26 add-now feeds were added, and filters were tightened (Google News and general-tech columns, supervision keywords, future dates, cross-source dedup). A data refresh after that is in `public/data/`.

| Review | File |
|--------|------|
| Every current feed | [FEED_AUDIT_2026-09-21.md](./FEED_AUDIT_2026-09-21.md) |
| What the homepage showed | [EDITORIAL_REVIEW_2026-09-21.md](./EDITORIAL_REVIEW_2026-09-21.md) |
| Pipeline and quality gate | [REVIEW_2026-09-21.md](./REVIEW_2026-09-21.md) |
| New feeds | [FEED_CANDIDATES_2026-09-21.md](./FEED_CANDIDATES_2026-09-21.md) and `scripts/discovered-2026-09-21.json` |

## Feed health

112 sources (107 RSS/Atom + 5 HTML scrapers). Every RSS URL parsed on this probe. **66 keep, 34 watch, 12 suggest-remove.** VentureBeat failed in one build and parsed on the probe (intermittent). Quiet regulator feeds (SEC, Fed, OCC, FDIC, CFTC, and peers) are empty because the AI keyword filter is working. Leave them.

### Suggested removals (not done)

1. Reuters AI (Google News) — the query token `RIA` matches the Russian news agency, so Industry fills with ordinary market wires.
2. Axios AI (Google News) — politics and credit, not AI.
3. GN: wealthtech AI — India and UK funding wires.
4. GN: AI capex / ETF — stock listicles. FT, Bloomberg Tech, and WSJ Tech already cover the trade.
5. Emerj AI Research — unfiltered company profiles.
6. TLDR AI — newsletter link dumps.
7. Insight Partners — VC marketing.
8. Adams Street Insights — PE and VC interviews.
9. GN: wealth copilot — stale, and it hits the consumer app Copilot Money.
10. IPE — pension briefs, no AI in the window the build reads.
11. Orion (vendor) — no AI items; the Orion–Claude story already arrives via Google News.
12. TIFIN (vendor) — nothing since 29 June, outside the vendor age window.

Do not drop FA Magazine. It has AI stories, but they sit behind the newest 15 items the build reads.

## Editorial and code (same underlying bugs)

- Unfiltered Google News feeds put non-AI stories on the homepage, including a non-AI SEC enforcement speech as the lead when supervision keywords match without an AI term.
- Exact title and URL dedup keeps the first source and drops the Google News twin before trending, so two outlets never become a cluster.
- The quality gate counts a feed as OK when it returns XML, even if every headline is off topic.
- Industry is still the largest column and is full of gadget, promo, and general-tech items from TechCrunch, The Verge, Wired, and Ars.
- The parts that fit the audience are Institutional (PlanAdviser, PlanSponsor), RIA practice pieces (RIABiz, InvestmentNews, Financial Planning), and the Claude-for-advisors cluster.

## Added 21 September 2026

The candidate pass probed 2,162 URLs and marked **26 add-now**. Those are now in `scripts/sources.ts`, including Barron's Advisor, FT Wealth Management, Investment Adviser Association, OCC Bulletins, Money Marketing, Top1000funds.com, The Diff, SemiAnalysis (newsletter URL), iCapital, and One Useful Thing.

Still blocked or stale: FINRA first-party, ThinkAdvisor, Advisor Perspectives, Institutional Investor (newest 11 June 2025). The old AI-CIO `/feed/` is dead; `/news/feed/` is alive but current headlines are allocator news, not AI.

## Still waiting on approval

Say which of the 12 suggested removals to drop. They are still in the list.
