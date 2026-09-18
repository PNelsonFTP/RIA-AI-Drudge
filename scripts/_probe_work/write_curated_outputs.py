#!/usr/bin/env python3
"""Write FEED_PROBE_CURATED.md and discovered-curated.json from probe decisions."""

from __future__ import annotations

import json
from pathlib import Path

KEYWORDS = [
    "AI",
    "artificial intelligence",
    "generative",
    "agentic",
    "LLM",
    "machine learning",
    "automation",
    "chatbot",
    "copilot",
    "notetaker",
    "wealthtech",
    "fintech",
    "advisor",
    "RIA",
    "broker-dealer",
    "SEC",
    "FINRA",
]

# Each row: name, page, feed, status, newest, decision, reason, tier, homeCategory, vendor, keep
# keep True only for unique verified feeds that pass quality rules.
ROWS = [
    # Tier 1
    ("WealthManagement.com — AI", "https://www.wealthmanagement.com/artificial-intelligence", "https://www.wealthmanagement.com/rss.xml", "200", "2026-09-18", "KEEP", "Valid site-wide RSS (section URL 404; no AI-only feed). Fresh items including advisor AI/tech.", 1, "wealthtech", False, True),
    ("WealthManagement.com — RIA news", "https://www.wealthmanagement.com/ria-news", "https://www.wealthmanagement.com/rss.xml", "200", "2026-09-18", "SKIP", "Identical feed URL to WealthManagement.com — AI; section page 404.", 1, "practice", False, False),
    ("InvestmentNews — Advisor Tech", "https://www.investmentnews.com/advisor-tech", "https://www.investmentnews.com/rss", "200", "2026-09-18", "KEEP", "Valid site-wide Atom; no advisor-tech section feed.", 1, "advisor_tech", False, True),
    ("InvestmentNews — Transformation", "https://www.investmentnews.com/transformation", "https://www.investmentnews.com/rss", "200", "2026-09-18", "SKIP", "Identical feed URL to InvestmentNews — Advisor Tech; no section feed.", 1, "advisor_tech", False, False),
    ("Kitces — Technology & Advisor FinTech", "https://www.kitces.com/blog/category/19-technology-advisor-fintech/", "https://feeds.feedburner.com/KitcesNerdsEyeView", "200", "2026-09-17", "KEEP", "WordPress category /feed 403 (Cloudflare). Feedburner Nerd's Eye View RSS parses and is fresh. Page also linked a Libsyn podcast (not the blog); not used.", 1, "advisor_tech", False, True),
    ("Financial Planning", "https://www.financial-planning.com", "https://www.financial-planning.com/feed?rss=true", "200", "2026-09-18", "KEEP", "Arizent RSS via feed?rss=true; HTML /feed is not XML.", 1, "practice", False, True),
    ("ThinkAdvisor", "https://www.thinkadvisor.com", "—", "403", "—", "SKIP", "Homepage and conventional feed paths return 403; no public feed verified.", 1, "practice", False, False),
    ("Financial Advisor Magazine", "https://www.fa-mag.com", "https://www.fa-mag.com/rss", "200", "2026-09-18", "KEEP", "Valid RSS; fresh.", 1, "practice", False, True),
    ("RIABiz", "https://www.riabiz.com", "https://api.riabiz.com/rss", "200", "2026-09-18", "KEEP", "Valid RSS at api.riabiz.com/rss; fresh.", 1, "practice", False, True),
    ("Wealth Solutions Report", "https://wealthsolutionsreport.com", "https://www.wealthsolutionsreport.com/rss/", "200", "2026-09-17", "KEEP", "Valid RSS; fresh.", 1, "wealthtech", False, True),
    ("Advisor Perspectives", "https://www.advisorperspectives.com", "—", "403", "—", "SKIP", "Cloudflare challenge on homepage and /feed /rss; no public feed verified.", 1, "practice", False, False),
    ("Robert Huebscher Substack", "https://roberthuebscher.substack.com", "https://roberthuebscher.substack.com/feed", "200", "2026-09-14", "KEEP", "Substack /feed; fresh.", 1, "practice", False, True),
    # Tier 2
    ("AI Advisor Stack", "https://newsletter.aiadvisorstack.com", "—", "404", "—", "SKIP", "Beehiiv publication; page JSON has rss_url:null. /feed /rss /feed.xml 404. Email-only.", 2, "wealthtech", False, False),
    ("WealthTech Today", "https://wealthtechtoday.com", "https://wealthtechtoday.com/feed/", "200", "2026-09-17", "KEEP", "WordPress /feed; fresh.", 2, "wealthtech", False, True),
    ("T3 Technology Hub", "https://t3technologyhub.com", "https://t3technologyhub.com/feed/", "200", "2026-09-16", "KEEP", "WordPress /feed; fresh.", 2, "advisor_tech", False, True),
    ("WealthTech Strategy", "https://www.wealthtechstrategy.com", "https://www.wealthtechstrategy.com/blog-feed.xml", "200", "2026-09-17", "KEEP", "Discovered blog-feed.xml; fresh.", 2, "wealthtech", False, True),
    ("Abnormal Returns", "https://abnormalreturns.com", "https://abnormalreturns.com/feed/", "200", "2026-09-17", "KEEP", "WordPress /feed; fresh. Comments feed is stale and unused.", 2, "practice", False, True),
    ("AI for Advisors (podcast)", "https://podcasts.apple.com/us/podcast/ai-for-advisors/id1868295133", "https://anchor.fm/s/1086ac6ac/podcast/rss", "200", "2026-09-01", "KEEP", "iTunes lookup feedUrl; Anchor RSS parses; newest episode 2026-09-01.", 2, "advisor_tech", False, True),
    ("The WealthStack Podcast", "https://www.wealthmanagement.com/artificial-intelligence", "https://www.wealthmanagement.com/rss.xml", "200", "2026-09-18", "SKIP", "No dedicated podcast RSS (Megaphone path 404). Only site-wide WM RSS, duplicate of WealthManagement.com — AI.", 2, "wealthtech", False, False),
    ("Diamond Consultants", "https://www.diamond-consultants.com", "https://www.diamond-consultants.com/feed/", "200", "2026-09-17", "KEEP", "WordPress /feed; fresh.", 2, "practice", False, True),
    ("RIA Collective (podcast)", "https://www.riacollective.com/episodes/", "https://rss.buzzsprout.com/2014808.rss", "200", "2026-09-07", "KEEP", "Buzzsprout podcast RSS from page; fresh.", 2, "practice", False, True),
    # Tier 3
    ("American Banker — AI Intelligence", "https://www.americanbanker.com/ai", "https://www.americanbanker.com/ai.rss", "200", "—", "SKIP", "Dedicated /ai.rss is empty (0 items). Site-wide feed exists but is less specific than the AI tag feed kept below.", 3, "banking_fintech", False, False),
    ("American Banker — AI tag", "https://www.americanbanker.com/artificial-intelligence", "https://www.americanbanker.com/artificial-intelligence.rss", "200", "2026-09-18", "KEEP", "Section RSS with current AI/banking items.", 3, "banking_fintech", False, True),
    ("Finextra — AI", "https://finextra.com/news/finchannel.aspx?topic=ai", "https://www.finextra.com/rss/channel.aspx?channel=ai", "200", "2026-09-18", "KEEP", "Official AI channel RSS; homepage was 403. Fresh.", 3, "banking_fintech", False, True),
    ("FinTech Global", "https://fintech.global", "https://fintech.global/feed/", "200", "2026-09-18", "KEEP", "WordPress /feed; fresh.", 3, "banking_fintech", False, True),
    ("The Financial Brand", "https://thefinancialbrand.com", "—", "403", "—", "SKIP", "Cloudflare 403 on homepage and /feed; no public feed verified.", 3, "banking_fintech", False, False),
    ("Bank Automation News", "https://bankautomationnews.com", "—", "403", "—", "SKIP", "Cloudflare 403 on homepage and /feed; no public feed verified.", 3, "banking_fintech", False, False),
    ("ABA Banking Journal", "https://bankingjournal.aba.com", "https://bankingjournal.aba.com/feed/", "200", "2026-09-17", "KEEP", "WordPress /feed; fresh.", 3, "banking_fintech", False, True),
    ("Fintech Takes", "https://fintechtakes.com", "https://fintechtakes.com/feed/", "200", "2026-09-18", "KEEP", "WordPress /feed; fresh.", 3, "banking_fintech", False, True),
    ("Fintech Brainfood", "https://www.fintechbrainfood.com", "—", "404", "—", "SKIP", "Beehiiv publication; rss_url:null. Conventional paths 404. Email-only.", 3, "banking_fintech", False, False),
    ("Fintech Business Weekly", "https://fintechbusinessweekly.substack.com", "https://fintechbusinessweekly.substack.com/feed", "200", "2026-09-16", "KEEP", "Substack /feed; fresh.", 3, "banking_fintech", False, True),
    ("LLRX", "https://www.llrx.com", "https://www.llrx.com/feed/", "200", "2026-09-15", "KEEP", "WordPress /feed; fresh.", 3, "banking_fintech", False, True),
    # Tier 4
    ("FINRA — Regulatory Notices", "https://www.finra.org/rules-guidance/notices", "—", "403", "—", "SKIP", "Cloudflare 403 on notices page, syndication page, and common RSS paths. No feed verified (not guessed).", 4, "regulation", False, False),
    ("SEC — Press releases", "https://www.sec.gov/news/pressreleases", "https://www.sec.gov/news/pressreleases.rss", "200", "2026-09-17", "KEEP", "Official press-release RSS; fresh.", 4, "regulation", False, True),
    ("SEC — Speeches and statements", "https://www.sec.gov/news/speeches-statements", "https://www.sec.gov/news/speeches-statements.rss", "200", "2026-09-17", "KEEP", "Official speeches RSS; fresh.", 4, "regulation", False, True),
    ("NASAA", "https://www.nasaa.org", "https://www.nasaa.org/feed/", "200", "2026-09-17", "KEEP", "WordPress /feed; fresh.", 4, "regulation", False, True),
    ("CFTC", "https://www.cftc.gov", "https://www.cftc.gov/rss.xml", "200", "2026-09-15", "KEEP", "Official rss.xml; fresh.", 4, "regulation", False, True),
    ("Federal Reserve", "https://www.federalreserve.gov", "https://www.federalreserve.gov/feeds/press_all.xml", "200", "2026-09-16", "KEEP", "Official all-press feed. Also verified monetary/enforcement/speeches topic feeds; keeping the combined press feed.", 4, "regulation", False, True),
    ("OCC", "https://www.occ.gov", "https://www.occ.gov/rss/occ_news.xml", "200", "2026-09-17", "KEEP", "Official news RSS; fresh.", 4, "regulation", False, True),
    ("FDIC", "https://www.fdic.gov", "https://www.fdic.gov/rss.xml", "200", "2026-09-14", "KEEP", "Official rss.xml; fresh.", 4, "regulation", False, True),
    ("NY DFS", "https://www.dfs.ny.gov", "—", "403", "—", "SKIP", "Cloudflare 403 on homepage and press-release XML candidates; no feed verified.", 4, "regulation", False, False),
    ("Sidley Austin — Insights", "https://www.sidley.com/en/insights", "—", "404", "—", "SKIP", "Homepage 200; /rss and /en/insights/rss are HTML/404, not RSS.", 4, "compliance", False, False),
    ("Eversheds Sutherland", "https://www.eversheds-sutherland.com", "—", "404", "—", "SKIP", "No RSS/Atom at conventional paths.", 4, "compliance", False, False),
    ("Morgan Lewis", "https://www.morganlewis.com", "—", "404", "—", "SKIP", "No RSS/Atom at conventional paths.", 4, "compliance", False, False),
    ("Debevoise", "https://www.debevoise.com", "—", "404", "—", "SKIP", "No RSS/Atom at conventional paths.", 4, "compliance", False, False),
    ("Davis Polk", "https://www.davispolk.com", "—", "404", "—", "SKIP", "No RSS/Atom at conventional paths.", 4, "compliance", False, False),
    ("Ropes & Gray", "https://www.ropesgray.com", "—", "403", "—", "SKIP", "Homepage 403; no public feed verified.", 4, "compliance", False, False),
    ("Risk Management Magazine", "https://www.rmmagazine.com", "—", "404", "—", "SKIP", "/feed and /rss.xml 404; no public feed verified.", 4, "compliance", False, False),
    ("Ncontracts blog", "https://www.ncontracts.com", "—", "404", "—", "SKIP", "Vendor site; no public RSS at conventional paths.", 4, "compliance", True, False),
    ("ComplySci / NRS", "https://www.complysci.com", "https://www.comply.com/feed/", "200", "2026-08-19", "SKIP", "Candidate resolved to comply.com (1 item). Not verified as ComplySci/NRS; later re-fetch timed out.", 4, "compliance", True, False),
    ("Smarsh", "https://www.smarsh.com", "—", "403", "—", "SKIP", "Homepage 403; no public feed verified.", 4, "compliance", True, False),
    ("Hadrius", "https://www.hadrius.com", "—", "404", "—", "SKIP", "Vendor site; no public RSS at conventional paths.", 4, "compliance", True, False),
    ("Zocks", "https://www.zocks.io", "—", "404", "—", "SKIP", "Vendor site; no public RSS at conventional paths.", 4, "compliance", True, False),
    # Tier 5
    ("Institutional Investor", "https://www.institutionalinvestor.com", "https://www.institutionalinvestor.com/rss.xml", "200", "2025-06-11", "SKIP", "Valid RSS but stale (newest item older than 90 days; not a regulator).", 5, "institutional", False, False),
    ("Pensions & Investments", "https://www.pionline.com", "—", "403", "—", "SKIP", "Access Denied on homepage and /rss.xml /feed; paywall/WAF. No public feed verified.", 5, "institutional", False, False),
    ("Chief Investment Officer", "https://www.ai-cio.com", "https://www.ai-cio.com/feed/", "200", "2022-10-07", "SKIP", "Valid RSS but dead/stale (newest 2022-10-07).", 5, "institutional", False, False),
    ("Pensions Expert", "https://www.pensions-expert.com", "—", "404", "—", "SKIP", "Homepage 200; /feed and /rss 404. No public feed verified.", 5, "institutional", False, False),
    ("ETF.com", "https://www.etf.com", "—", "403", "—", "SKIP", "Cloudflare 403 on homepage and /feed; no public feed verified.", 5, "institutional", False, False),
    ("Emerj AI Research", "https://emerj.com", "https://emerj.com/feed/", "200", "2026-09-14", "KEEP", "WordPress /feed; fresh.", 5, "institutional", False, True),
    ("Reuters — Wealth / Business", "https://www.reuters.com", "—", "401", "—", "SKIP", "Homepage 401; Reuters Agency feed URLs 404. No public feed verified.", 5, "markets", False, False),
    # Tier 6
    ("McKinsey — Financial Services", "https://www.mckinsey.com/industries/financial-services", "https://www.mckinsey.com/insights/rss", "200", "2026-09-18", "KEEP", "Insights RSS (site-wide, not FS-only). Dates in pubDate; fresh. Filter required.", 6, "research", False, True),
    ("Deloitte Center for Financial Services", "https://www2.deloitte.com", "—", "404", "—", "SKIP", "Homepage 200; RSS candidates HTML/404 or non-well-formed. No public feed verified.", 6, "research", False, False),
    ("Insight Partners", "https://www.insightpartners.com/ideas", "https://www.insightpartners.com/feed/", "200", "2026-09-17", "KEEP", "WordPress /feed; fresh.", 6, "research", False, True),
    ("Adams Street Partners", "https://www.adamsstreetpartners.com/insights", "https://www.adamsstreetpartners.com/insights/feed/", "200", "2026-09-16", "KEEP", "Insights category feed; fresher than site root /feed.", 6, "research", False, True),
    ("Morningstar", "https://www.morningstar.com", "—", "202", "—", "SKIP", "Homepage 200; /rss /feed /news/rss return empty 202. No public feed verified.", 6, "research", False, False),
    ("eMoney Advisor blog", "https://emoneyadvisor.com/blog", "https://emoneyadvisor.com/feed/", "200", "2026-09-16", "KEEP", "WordPress /feed; vendor-authored planner blog; fresh.", 6, "research", True, True),
    ("Morgan Stanley newsroom", "https://www.morganstanley.com", "—", "404", "—", "SKIP", "No newsroom RSS at conventional paths (press pages 403/404).", 6, "vendors", True, False),
    ("Wells Fargo newsroom", "https://newsroom.wf.com", "—", "403", "—", "SKIP", "Newsroom 403; no public feed verified.", 6, "vendors", True, False),
    ("Citi newsroom", "https://www.citigroup.com/global/news", "—", "404", "—", "SKIP", "No public RSS at conventional paths.", 6, "vendors", True, False),
    ("JPMorgan newsroom", "https://www.jpmorganchase.com/news", "—", "404", "—", "SKIP", "News page 404; no public RSS verified.", 6, "vendors", True, False),
    ("Merrill / BofA newsroom", "https://newsroom.bankofamerica.com", "—", "404", "—", "SKIP", "No public RSS at conventional paths.", 6, "vendors", True, False),
    ("UBS newsroom", "https://www.ubs.com/global/en/media.html", "—", "404", "—", "SKIP", "No public RSS at conventional paths.", 6, "vendors", True, False),
    # Tier 7
    ("Reuters — Technology / AI", "https://www.reuters.com/technology", "—", "401", "—", "SKIP", "Section/agency feed candidates 401/404. No public feed verified.", 7, "industry", False, False),
    ("Axios AI+", "https://www.axios.com/technology/artificial-intelligence", "https://api.axios.com/feed/", "200", "2026-09-18", "KEEP", "No AI+-only feed. Site-wide Axios RSS at api.axios.com/feed/; filter required.", 7, "industry", False, True),
    ("TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/", "https://techcrunch.com/category/artificial-intelligence/feed/", "200", "2026-09-17", "KEEP", "Category WordPress feed (preferred over site-wide /feed/).", 7, "industry", False, True),
    ("The Verge AI", "https://www.theverge.com/ai-artificial-intelligence", "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", "200", "2026-09-18", "KEEP", "Section Atom feed.", 7, "industry", False, True),
    ("MIT Technology Review", "https://www.technologyreview.com", "https://www.technologyreview.com/topic/artificial-intelligence/feed/", "200", "2026-09-18", "KEEP", "AI topic feed (preferred over site-wide /feed/).", 7, "industry", False, True),
    ("Ars Technica AI", "https://arstechnica.com/ai/", "https://arstechnica.com/ai/feed/", "200", "2026-09-17", "KEEP", "AI section WordPress feed (preferred over site-wide).", 7, "industry", False, True),
    ("Anthropic News", "https://www.anthropic.com/news", "—", "404", "—", "SKIP", "News page 200; /news/rss.xml and /rss.xml 404. No public feed.", 7, "labs", False, False),
    ("OpenAI News", "https://openai.com/news", "https://openai.com/news/rss.xml", "200", "2026-09-17", "KEEP", "Official news RSS; fresh.", 7, "labs", False, True),
    ("Google DeepMind Blog", "https://deepmind.google/discover/blog", "https://deepmind.google/blog/rss.xml", "200", "2026-09-15", "KEEP", "Official blog RSS (path /blog/rss.xml); fresh.", 7, "labs", False, True),
    ("Microsoft AI Blog", "https://blogs.microsoft.com/ai", "https://news.microsoft.com/source/feed/", "200", "2026-09-17", "KEEP", "Listed blogs.microsoft.com/ai is 410. Official Microsoft Source RSS discovered; current AI items. Cloud blog /feed also works (older).", 7, "labs", False, True),
    ("Nvidia Newsroom", "https://nvidianews.nvidia.com", "https://nvidianews.nvidia.com/releases.xml", "200", "2026-09-17", "KEEP", "Official releases.xml (rss.xml equivalent); fresh.", 7, "labs", False, True),
    ("Ben's Bites", "https://bensbites.com", "https://www.bensbites.com/feed", "200", "2026-09-17", "KEEP", "Public RSS (redirects to www); not email-only.", 7, "industry", False, True),
    ("Import AI", "https://importai.substack.com", "https://importai.substack.com/feed", "200", "2026-09-07", "KEEP", "Substack /feed; fresh.", 7, "industry", False, True),
    ("Stratechery", "https://stratechery.com", "https://stratechery.com/feed/", "200", "2026-09-17", "KEEP", "Public RSS exists (body may be paywalled); fresh.", 7, "industry", False, True),
    ("Exponential View", "https://www.exponentialview.co", "https://www.exponentialview.co/feed", "200", "2026-09-17", "KEEP", "Public /feed; fresh.", 7, "industry", False, True),
    # Tier 8
    ("Morgan Stanley Research / Ideas", "https://www.morganstanley.com/ideas", "—", "404", "—", "SKIP", "/ideas/rss and /rss 404. No public research feed.", 8, "markets", False, False),
    ("Citrini Research", "https://www.citriniresearch.com", "https://www.citriniresearch.com/feed", "200", "2026-09-16", "KEEP", "Public /feed; fresh.", 8, "markets", False, True),
    ("SemiAnalysis", "https://semianalysis.com", "https://semianalysis.com/feed/", "200", "2025-09-16", "SKIP", "Valid RSS but stale (newest item 2025-09-16, older than 90 days). Comments feed also stale.", 8, "markets", False, False),
    ("U.S. News Money — Investing", "https://money.usnews.com/investing", "https://feeds.feedburner.com/usnews/money", "200", "2026-09-17", "SKIP", "Investing page/rss timed out. Feedburner usnews/money is a mortgage-rate firehose, not the investing section.", 8, "markets", False, False),
    # Tier 9
    ("Business Wire", "https://www.businesswire.com", "https://feed.businesswire.com/rss/home/?rss=G1QFDERJXkJeEFpQWg==", "200", "2026-09-18", "SKIP", "Valid but unfiltered global firehose. No company/keyword-filtered public feed verified.", 9, "vendors", True, False),
    ("PR Newswire", "https://www.prnewswire.com", "https://www.prnewswire.com/rss/news-releases-list.rss", "200", "2026-09-18", "SKIP", "Valid but unfiltered global firehose. No company-filtered public feed verified.", 9, "vendors", True, False),
    ("GlobeNewswire", "https://www.globenewswire.com", "—", "timeout", "—", "SKIP", "Homepage and RSS/Atom candidates timed out (8–10s). No feed verified.", 9, "vendors", True, False),
]


def priority_for(name: str, tier: int, vendor: bool) -> str:
    if vendor:
        return "low"
    if any(n in name for n in ("SEC", "FINRA", "Federal Reserve", "OCC", "FDIC", "CFTC", "Treasury")):
        return "critical"
    if tier in (1, 2):
        return "high"
    return "medium"


def require_any(tier: int):
    if tier in (3, 5, 6, 7, 8):
        return list(KEYWORDS)
    return None


def esc(s: str) -> str:
    return s.replace("|", "\\|")


def main() -> None:
    root = Path("/Users/paulnelson/Documents/Development/RIA-AI-Drudge")
    keepers = []
    seen_feeds = set()
    for name, page, feed, status, newest, decision, reason, tier, cat, vendor, keep in ROWS:
        if keep:
            assert decision == "KEEP"
            assert feed.startswith("http")
            key = feed.rstrip("/")
            assert key not in seen_feeds, f"duplicate keeper feed {feed}"
            seen_feeds.add(key)
            keepers.append(
                {
                    "name": name,
                    "url": feed,
                    "homeCategory": cat,
                    "priority": priority_for(name, tier, vendor),
                    "requireAny": require_any(tier),
                    "vendor": vendor,
                    "tier": tier,
                    "newestItem": newest if newest != "—" else None,
                }
            )

    md_path = root / "docs" / "FEED_PROBE_CURATED.md"
    json_path = root / "scripts" / "discovered-curated.json"

    keep_n = sum(1 for r in ROWS if r[10])
    skip_n = len(ROWS) - keep_n
    lines = [
        "# Curated RSS/Atom feed probe (RIA-AI-Drudge)",
        "",
        "Probed **18 September 2026** against tiers 1–9 in `ai-news-sources-RIA.md` (RSS and RSS/Email only).",
        "",
        "## Method",
        "",
        "For each RSS-marked source: fetched the homepage/section URL (browser UA, 8s timeout), collected `<link rel=\"alternate\" type=\"application/rss+xml|atom+xml\">` plus in-page feed hrefs, then tried conventional paths (`/feed`, `/feed/`, `/rss`, `/rss.xml`, `/feed.xml`, `/atom.xml`, `/index.xml`, `{path}/feed`). Substack-style origins also tried `/feed`. Podcasts used the Apple page plus iTunes `lookup` `feedUrl`. Each unique candidate was HTTP-probed (HEAD then GET). XML had to parse as RSS or Atom with items.",
        "",
        "## Quality rules applied",
        "",
        "- No guessed URLs in the KEEP list — every keeper was a successful 200 parse.",
        "- Paywall-only / email-only / scrape-only skipped unless a real public feed was found.",
        "- Feeds whose newest item is older than 90 days (before 2026-06-20) skipped unless a regulator.",
        "- Identical feed URLs kept once (highest-signal source).",
        "- Unfiltered PR-wire firehoses skipped (no company-filtered public feed found).",
        "",
        f"## Counts",
        "",
        f"- Sources evaluated: **{len(ROWS)}**",
        "- Candidate URLs attempted: **~1,070** (991 unique first-pass candidates + targeted follow-ups)",
        f"- KEEP: **{keep_n}** unique feeds",
        f"- SKIP: **{skip_n}**",
        "",
        "## Results",
        "",
        "| Source | Page URL | Feed URL | Status | Newest item | Decision | Reason |",
        "|---|---|---|---|---|---|---|",
    ]
    for name, page, feed, status, newest, decision, reason, *_ in ROWS:
        lines.append(
            f"| {esc(name)} | {page} | {feed} | {status} | {newest} | {decision} | {esc(reason)} |"
        )
    lines += [
        "",
        "## Notes",
        "",
        "- WealthManagement.com AI and RIA section pages 404; only the site-wide `rss.xml` works. One future-dated CMS item (2027-02-22) appears in that feed; editorial pubDates are current as of 2026-09-18.",
        "- Kitces category WordPress feed is Cloudflare-blocked; Feedburner is the verified public blog feed (all Nerd's Eye View, not tech-only).",
        "- Microsoft’s listed AI blog URL is gone (410). Keeper is the official Microsoft Source feed.",
        "- FINRA, NY DFS, ThinkAdvisor, Advisor Perspectives, and several trade sites are WAF/403 from this probe environment — they may still publish feeds that a residential browser can see.",
        "",
    ]
    md_path.write_text("\n".join(lines), encoding="utf-8")
    json_path.write_text(json.dumps(keepers, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {md_path} ({len(ROWS)} rows)")
    print(f"wrote {json_path} ({len(keepers)} keepers)")
    print("top15:")
    order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    ranked = sorted(keepers, key=lambda k: (order[k["priority"]], k["tier"], k["name"]))
    for k in ranked[:15]:
        print(f"  [{k['priority']}] T{k['tier']} {k['name']} | {k['newestItem']} | {k['url']}")


if __name__ == "__main__":
    main()
