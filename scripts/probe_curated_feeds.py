#!/usr/bin/env python3
"""Discover and HTTP-probe RSS/Atom feeds for curated RIA sources."""

from __future__ import annotations

import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from html import unescape
from typing import Any, Optional
from urllib.parse import urljoin, urlparse, urlunparse
from xml.etree import ElementTree as ET

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/128.0.0.0 Safari/537.36"
)
TIMEOUT = 8
ASOF = datetime(2026, 9, 18, tzinfo=timezone.utc)
STALE_CUTOFF = ASOF - timedelta(days=90)
MAX_WORKERS = 10

NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rss": "http://purl.org/rss/1.0/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
}

REGULATORS = {
    "FINRA",
    "SEC",
    "NASAA",
    "CFTC",
    "Federal Reserve",
    "OCC",
    "FDIC",
    "NY DFS",
    "U.S. Treasury",
}

AI_FINANCE_KEYWORDS = [
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


def session() -> requests.Session:
    s = requests.Session()
    s.headers.update(
        {
            "User-Agent": UA,
            "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.8, */*;q=0.5",
            "Accept-Language": "en-US,en;q=0.9",
        }
    )
    retry = Retry(total=1, backoff_factor=0.3, status_forcelist=[429, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry, pool_connections=20, pool_maxsize=20)
    s.mount("http://", adapter)
    s.mount("https://", adapter)
    return s


SESS = session()


SOURCES: list[dict[str, Any]] = [
    # Tier 1
    {"name": "WealthManagement.com — AI", "page": "https://www.wealthmanagement.com/artificial-intelligence", "tier": 1, "homeCategory": "wealthtech", "vendor": False},
    {"name": "WealthManagement.com — RIA news", "page": "https://www.wealthmanagement.com/ria-news", "tier": 1, "homeCategory": "practice", "vendor": False},
    {"name": "InvestmentNews — Advisor Tech", "page": "https://www.investmentnews.com/advisor-tech", "tier": 1, "homeCategory": "advisor_tech", "vendor": False},
    {"name": "InvestmentNews — Transformation", "page": "https://www.investmentnews.com/transformation", "tier": 1, "homeCategory": "advisor_tech", "vendor": False},
    {"name": "Kitces — Technology & Advisor FinTech", "page": "https://www.kitces.com/blog/category/19-technology-advisor-fintech/", "tier": 1, "homeCategory": "advisor_tech", "vendor": False},
    {"name": "Financial Planning", "page": "https://www.financial-planning.com", "tier": 1, "homeCategory": "practice", "vendor": False},
    {"name": "ThinkAdvisor", "page": "https://www.thinkadvisor.com", "tier": 1, "homeCategory": "practice", "vendor": False},
    {"name": "Financial Advisor Magazine", "page": "https://www.fa-mag.com", "tier": 1, "homeCategory": "practice", "vendor": False},
    {"name": "RIABiz", "page": "https://www.riabiz.com", "tier": 1, "homeCategory": "practice", "vendor": False},
    {"name": "Wealth Solutions Report", "page": "https://wealthsolutionsreport.com", "tier": 1, "homeCategory": "wealthtech", "vendor": False},
    {"name": "Advisor Perspectives", "page": "https://www.advisorperspectives.com", "tier": 1, "homeCategory": "practice", "vendor": False},
    {"name": "Robert Huebscher Substack", "page": "https://roberthuebscher.substack.com", "tier": 1, "homeCategory": "practice", "vendor": False},
    # Tier 2
    {"name": "AI Advisor Stack", "page": "https://newsletter.aiadvisorstack.com", "tier": 2, "homeCategory": "wealthtech", "vendor": False},
    {"name": "WealthTech Today", "page": "https://wealthtechtoday.com", "tier": 2, "homeCategory": "wealthtech", "vendor": False},
    {"name": "T3 Technology Hub", "page": "https://t3technologyhub.com", "tier": 2, "homeCategory": "advisor_tech", "vendor": False},
    {"name": "WealthTech Strategy", "page": "https://www.wealthtechstrategy.com", "tier": 2, "homeCategory": "wealthtech", "vendor": False},
    {"name": "Abnormal Returns", "page": "https://abnormalreturns.com", "tier": 2, "homeCategory": "practice", "vendor": False},
    {"name": "AI for Advisors (podcast)", "page": "https://podcasts.apple.com/us/podcast/ai-for-advisors/id1868295133", "tier": 2, "homeCategory": "advisor_tech", "vendor": False, "apple_id": "1868295133"},
    {"name": "The WealthStack Podcast", "page": "https://www.wealthmanagement.com/artificial-intelligence", "tier": 2, "homeCategory": "wealthtech", "vendor": False, "extra_pages": ["https://www.wealthmanagement.com/podcasts", "https://www.wealthmanagement.com/wealthstack"]},
    {"name": "Diamond Consultants", "page": "https://www.diamond-consultants.com", "tier": 2, "homeCategory": "practice", "vendor": False},
    {"name": "RIA Collective (podcast)", "page": "https://www.riacollective.com/episodes/", "tier": 2, "homeCategory": "practice", "vendor": False},
    # Tier 3
    {"name": "American Banker — AI Intelligence", "page": "https://www.americanbanker.com/ai", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "American Banker — AI tag", "page": "https://www.americanbanker.com/artificial-intelligence", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "Finextra — AI", "page": "https://finextra.com/news/finchannel.aspx?topic=ai", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "FinTech Global", "page": "https://fintech.global", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "The Financial Brand", "page": "https://thefinancialbrand.com", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "Bank Automation News", "page": "https://bankautomationnews.com", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "ABA Banking Journal", "page": "https://bankingjournal.aba.com", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "Fintech Takes", "page": "https://fintechtakes.com", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "Fintech Brainfood", "page": "https://www.fintechbrainfood.com", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "Fintech Business Weekly", "page": "https://fintechbusinessweekly.substack.com", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    {"name": "LLRX", "page": "https://www.llrx.com", "tier": 3, "homeCategory": "banking_fintech", "vendor": False},
    # Tier 4
    {"name": "FINRA — Regulatory Notices", "page": "https://www.finra.org/rules-guidance/notices", "tier": 4, "homeCategory": "regulation", "vendor": False, "regulator": True},
    {"name": "SEC — Press releases", "page": "https://www.sec.gov/news/pressreleases", "tier": 4, "homeCategory": "regulation", "vendor": False, "regulator": True},
    {"name": "SEC — Speeches and statements", "page": "https://www.sec.gov/news/speeches-statements", "tier": 4, "homeCategory": "regulation", "vendor": False, "regulator": True},
    {"name": "NASAA", "page": "https://www.nasaa.org", "tier": 4, "homeCategory": "regulation", "vendor": False, "regulator": True},
    {"name": "CFTC", "page": "https://www.cftc.gov", "tier": 4, "homeCategory": "regulation", "vendor": False, "regulator": True},
    {"name": "Federal Reserve", "page": "https://www.federalreserve.gov", "tier": 4, "homeCategory": "regulation", "vendor": False, "regulator": True},
    {"name": "OCC", "page": "https://www.occ.gov", "tier": 4, "homeCategory": "regulation", "vendor": False, "regulator": True},
    {"name": "FDIC", "page": "https://www.fdic.gov", "tier": 4, "homeCategory": "regulation", "vendor": False, "regulator": True},
    {"name": "NY DFS", "page": "https://www.dfs.ny.gov", "tier": 4, "homeCategory": "regulation", "vendor": False, "regulator": True},
    {"name": "Sidley Austin — Insights", "page": "https://www.sidley.com/en/insights", "tier": 4, "homeCategory": "compliance", "vendor": False},
    {"name": "Eversheds Sutherland", "page": "https://www.eversheds-sutherland.com", "tier": 4, "homeCategory": "compliance", "vendor": False},
    {"name": "Morgan Lewis", "page": "https://www.morganlewis.com", "tier": 4, "homeCategory": "compliance", "vendor": False},
    {"name": "Debevoise", "page": "https://www.debevoise.com", "tier": 4, "homeCategory": "compliance", "vendor": False},
    {"name": "Davis Polk", "page": "https://www.davispolk.com", "tier": 4, "homeCategory": "compliance", "vendor": False},
    {"name": "Ropes & Gray", "page": "https://www.ropesgray.com", "tier": 4, "homeCategory": "compliance", "vendor": False},
    {"name": "Risk Management Magazine", "page": "https://www.rmmagazine.com", "tier": 4, "homeCategory": "compliance", "vendor": False},
    {"name": "Ncontracts blog", "page": "https://www.ncontracts.com", "tier": 4, "homeCategory": "compliance", "vendor": True},
    {"name": "ComplySci / NRS", "page": "https://www.complysci.com", "tier": 4, "homeCategory": "compliance", "vendor": True, "extra_pages": ["https://www.nrs-inc.com"]},
    {"name": "Smarsh", "page": "https://www.smarsh.com", "tier": 4, "homeCategory": "compliance", "vendor": True},
    {"name": "Hadrius", "page": "https://www.hadrius.com", "tier": 4, "homeCategory": "compliance", "vendor": True},
    {"name": "Zocks", "page": "https://www.zocks.io", "tier": 4, "homeCategory": "compliance", "vendor": True},
    # Tier 5
    {"name": "Institutional Investor", "page": "https://www.institutionalinvestor.com", "tier": 5, "homeCategory": "institutional", "vendor": False},
    {"name": "Pensions & Investments", "page": "https://www.pionline.com", "tier": 5, "homeCategory": "institutional", "vendor": False},
    {"name": "Chief Investment Officer", "page": "https://www.ai-cio.com", "tier": 5, "homeCategory": "institutional", "vendor": False},
    {"name": "Pensions Expert", "page": "https://www.pensions-expert.com", "tier": 5, "homeCategory": "institutional", "vendor": False},
    {"name": "ETF.com", "page": "https://www.etf.com", "tier": 5, "homeCategory": "institutional", "vendor": False},
    {"name": "Emerj AI Research", "page": "https://emerj.com", "tier": 5, "homeCategory": "institutional", "vendor": False},
    {"name": "Reuters — Wealth / Business", "page": "https://www.reuters.com", "tier": 5, "homeCategory": "markets", "vendor": False, "extra_pages": ["https://www.reuters.com/business/", "https://www.reuters.com/business/finance/"]},
    # Tier 6
    {"name": "McKinsey — Financial Services", "page": "https://www.mckinsey.com/industries/financial-services", "tier": 6, "homeCategory": "research", "vendor": False},
    {"name": "Deloitte Center for Financial Services", "page": "https://www2.deloitte.com", "tier": 6, "homeCategory": "research", "vendor": False, "extra_pages": ["https://www2.deloitte.com/us/en/pages/financial-services/topics/center-for-financial-services.html"]},
    {"name": "Insight Partners", "page": "https://www.insightpartners.com/ideas", "tier": 6, "homeCategory": "research", "vendor": False},
    {"name": "Adams Street Partners", "page": "https://www.adamsstreetpartners.com/insights", "tier": 6, "homeCategory": "research", "vendor": False},
    {"name": "Morningstar", "page": "https://www.morningstar.com", "tier": 6, "homeCategory": "research", "vendor": False},
    {"name": "eMoney Advisor blog", "page": "https://emoneyadvisor.com/blog", "tier": 6, "homeCategory": "research", "vendor": True},
    {"name": "Morgan Stanley newsroom", "page": "https://www.morganstanley.com", "tier": 6, "homeCategory": "vendors", "vendor": True, "extra_pages": ["https://www.morganstanley.com/press-releases", "https://www.morganstanley.com/about-us-ir/press-releases"]},
    {"name": "Wells Fargo newsroom", "page": "https://newsroom.wf.com", "tier": 6, "homeCategory": "vendors", "vendor": True},
    {"name": "Citi newsroom", "page": "https://www.citigroup.com/global/news", "tier": 6, "homeCategory": "vendors", "vendor": True},
    {"name": "JPMorgan newsroom", "page": "https://www.jpmorganchase.com/news", "tier": 6, "homeCategory": "vendors", "vendor": True},
    {"name": "Merrill / BofA newsroom", "page": "https://newsroom.bankofamerica.com", "tier": 6, "homeCategory": "vendors", "vendor": True},
    {"name": "UBS newsroom", "page": "https://www.ubs.com/global/en/media.html", "tier": 6, "homeCategory": "vendors", "vendor": True},
    # Tier 7
    {"name": "Reuters — Technology / AI", "page": "https://www.reuters.com/technology", "tier": 7, "homeCategory": "industry", "vendor": False, "extra_pages": ["https://www.reuters.com/technology/artificial-intelligence/"]},
    {"name": "Axios AI+", "page": "https://www.axios.com/technology/artificial-intelligence", "tier": 7, "homeCategory": "industry", "vendor": False},
    {"name": "TechCrunch AI", "page": "https://techcrunch.com/category/artificial-intelligence/", "tier": 7, "homeCategory": "industry", "vendor": False},
    {"name": "The Verge AI", "page": "https://www.theverge.com/ai-artificial-intelligence", "tier": 7, "homeCategory": "industry", "vendor": False},
    {"name": "MIT Technology Review", "page": "https://www.technologyreview.com", "tier": 7, "homeCategory": "industry", "vendor": False},
    {"name": "Ars Technica AI", "page": "https://arstechnica.com/ai/", "tier": 7, "homeCategory": "industry", "vendor": False},
    {"name": "Anthropic News", "page": "https://www.anthropic.com/news", "tier": 7, "homeCategory": "labs", "vendor": False},
    {"name": "OpenAI News", "page": "https://openai.com/news", "tier": 7, "homeCategory": "labs", "vendor": False},
    {"name": "Google DeepMind Blog", "page": "https://deepmind.google/discover/blog", "tier": 7, "homeCategory": "labs", "vendor": False},
    {"name": "Microsoft AI Blog", "page": "https://blogs.microsoft.com/ai", "tier": 7, "homeCategory": "labs", "vendor": False},
    {"name": "Nvidia Newsroom", "page": "https://nvidianews.nvidia.com", "tier": 7, "homeCategory": "labs", "vendor": False},
    {"name": "Ben's Bites", "page": "https://bensbites.com", "tier": 7, "homeCategory": "industry", "vendor": False},
    {"name": "Import AI", "page": "https://importai.substack.com", "tier": 7, "homeCategory": "industry", "vendor": False},
    {"name": "Stratechery", "page": "https://stratechery.com", "tier": 7, "homeCategory": "industry", "vendor": False},
    {"name": "Exponential View", "page": "https://www.exponentialview.co", "tier": 7, "homeCategory": "industry", "vendor": False},
    # Tier 8
    {"name": "Morgan Stanley Research / Ideas", "page": "https://www.morganstanley.com/ideas", "tier": 8, "homeCategory": "markets", "vendor": False},
    {"name": "Citrini Research", "page": "https://www.citriniresearch.com", "tier": 8, "homeCategory": "markets", "vendor": False},
    {"name": "SemiAnalysis", "page": "https://semianalysis.com", "tier": 8, "homeCategory": "markets", "vendor": False},
    {"name": "U.S. News Money — Investing", "page": "https://money.usnews.com/investing", "tier": 8, "homeCategory": "markets", "vendor": False},
    # Tier 9 PR wires (explicit RSS-capable)
    {"name": "Business Wire", "page": "https://www.businesswire.com", "tier": 9, "homeCategory": "vendors", "vendor": True},
    {"name": "PR Newswire", "page": "https://www.prnewswire.com", "tier": 9, "homeCategory": "vendors", "vendor": True},
    {"name": "GlobeNewswire", "page": "https://www.globenewswire.com", "tier": 9, "homeCategory": "vendors", "vendor": True},
]


LINK_RE = re.compile(
    r"""<link\b([^>]*?)>""",
    re.IGNORECASE | re.DOTALL,
)
ATTR_RE = re.compile(r"""([^\s=]+)\s*=\s*(?:["']([^"']*)["']|([^\s>]+))""", re.IGNORECASE)
HREF_FEED_RE = re.compile(
    r"""(?:href|src)\s*=\s*["']([^"']+(?:rss|atom|feed|rdf)[^"']*)["']""",
    re.IGNORECASE,
)
JSON_FEED_RE = re.compile(
    r"""["'](?:feedUrl|rss_url|rssUrl|atomUrl|feed_url)["']\s*:\s*["']([^"']+)["']""",
    re.IGNORECASE,
)
ITUNES_ID_RE = re.compile(r"/id(\d+)")


def normalize_url(url: str) -> str:
    url = url.strip()
    p = urlparse(url)
    path = p.path or "/"
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")
    query = p.query
    return urlunparse((p.scheme, p.netloc.lower(), path, "", query, ""))


def origin_of(url: str) -> str:
    p = urlparse(url)
    return f"{p.scheme}://{p.netloc}"


def fetch(url: str, method: str = "GET") -> dict[str, Any]:
    out: dict[str, Any] = {
        "url": url,
        "method": method,
        "status": None,
        "content_type": None,
        "final_url": None,
        "body": None,
        "error": None,
        "elapsed": None,
    }
    try:
        t0 = time.time()
        if method == "HEAD":
            r = SESS.head(url, timeout=TIMEOUT, allow_redirects=True)
        else:
            r = SESS.get(url, timeout=TIMEOUT, allow_redirects=True)
        out["elapsed"] = round(time.time() - t0, 2)
        out["status"] = r.status_code
        out["content_type"] = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        out["final_url"] = r.url
        if method != "HEAD":
            r.encoding = r.apparent_encoding or r.encoding or "utf-8"
            out["body"] = r.content[:2_000_000]
            out["text"] = r.text[:2_000_000] if r.text else ""
    except Exception as e:
        out["error"] = f"{type(e).__name__}: {e}"
    return out


def parse_link_tags(html: str, base: str) -> list[str]:
    found: list[str] = []
    for m in LINK_RE.finditer(html):
        attrs = {}
        for am in ATTR_RE.finditer(m.group(1)):
            key = am.group(1).lower()
            val = am.group(2) if am.group(2) is not None else am.group(3)
            attrs[key] = unescape(val or "")
        rel = (attrs.get("rel") or "").lower()
        typ = (attrs.get("type") or "").lower()
        href = attrs.get("href") or ""
        if not href:
            continue
        is_alt = "alternate" in rel.split()
        is_feed_type = any(x in typ for x in ("rss", "atom", "xml"))
        if is_alt and (is_feed_type or "feed" in href.lower() or "rss" in href.lower() or "atom" in href.lower()):
            found.append(urljoin(base, href))
        elif typ in ("application/rss+xml", "application/atom+xml", "application/rdf+xml"):
            found.append(urljoin(base, href))
    for m in HREF_FEED_RE.finditer(html):
        href = unescape(m.group(1))
        if href.startswith("data:"):
            continue
        if any(x in href.lower() for x in ("rss", "atom", "feed.xml", "/feed", "feeds/")):
            found.append(urljoin(base, href))
    for m in JSON_FEED_RE.finditer(html):
        found.append(urljoin(base, unescape(m.group(1))))
    return found


def conventional_candidates(page_url: str) -> list[str]:
    p = urlparse(page_url)
    origin = f"{p.scheme}://{p.netloc}"
    path = p.path.rstrip("/")
    cands = []
    for suffix in (
        "/feed",
        "/feed/",
        "/rss",
        "/rss.xml",
        "/feed.xml",
        "/atom.xml",
        "/index.xml",
        "/rss/index.xml",
        "/feeds/posts/default",
    ):
        cands.append(origin + suffix)
    if path:
        for suffix in ("/feed", "/feed/", "/rss", "/rss.xml", "/feed.xml", "/atom.xml"):
            cands.append(origin + path + suffix)
        # WordPress category/tag convention
        if "/category/" in path or "/tag/" in path or "/blog/" in path or "/topics/" in path:
            cands.append(origin + path + "/feed")
    # Substack-style
    cands.append(origin + "/feed")
    return cands


def extra_known_candidates(src: dict[str, Any]) -> list[str]:
    """Well-known public feed paths to try (still must probe successfully)."""
    name = src["name"]
    extra: list[str] = []
    mapping = {
        "SEC — Press releases": [
            "https://www.sec.gov/news/pressreleases.rss",
            "https://www.sec.gov/news/press-release.rss",
            "https://www.sec.gov/rss/news/press.xml",
            "https://www.sec.gov/news/pressreleases.xml",
        ],
        "SEC — Speeches and statements": [
            "https://www.sec.gov/news/speeches-statements.rss",
            "https://www.sec.gov/news/speech.rss",
            "https://www.sec.gov/rss/news/speech.xml",
            "https://www.sec.gov/news/speeches.rss",
        ],
        "FINRA — Regulatory Notices": [
            "https://www.finra.org/rss/finra-headlines.xml",
            "https://www.finra.org/about/web-syndication",
            "https://www.finra.org/rules-guidance/notices/rss",
            "https://www.finra.org/feeds/rss/news.xml",
        ],
        "Federal Reserve": [
            "https://www.federalreserve.gov/feeds/press_all.xml",
            "https://www.federalreserve.gov/feeds/press_monetary.xml",
            "https://www.federalreserve.gov/feeds/press_enforcement.xml",
            "https://www.federalreserve.gov/feeds/speeches.xml",
        ],
        "OCC": [
            "https://www.occ.gov/rss/occ_news.xml",
            "https://www.occ.gov/news-issuances/news-releases/rss.xml",
            "https://occ.gov/static/news-issuances/rss/news-releases.xml",
        ],
        "FDIC": [
            "https://www.fdic.gov/news/news/press/press.rss",
            "https://www.fdic.gov/news/press-releases/rss.xml",
            "https://www.fdic.gov/news/rss.xml",
        ],
        "CFTC": [
            "https://www.cftc.gov/RSS",
            "https://www.cftc.gov/PressRoom/PressReleases/rss.xml",
            "https://www.cftc.gov/news-center/rss",
        ],
        "NASAA": [
            "https://www.nasaa.org/feed/",
            "https://www.nasaa.org/feed",
        ],
        "NY DFS": [
            "https://www.dfs.ny.gov/rss.xml",
            "https://www.dfs.ny.gov/reports_and_publications/press_releases/rss",
            "https://dfs.ny.gov/reports_and_publications/press_releases.xml",
        ],
        "TechCrunch AI": [
            "https://techcrunch.com/category/artificial-intelligence/feed/",
            "https://techcrunch.com/feed/",
        ],
        "Ars Technica AI": [
            "https://feeds.arstechnica.com/arstechnica/index",
            "https://arstechnica.com/ai/feed/",
            "https://feeds.arstechnica.com/arstechnica/technology-lab",
        ],
        "The Verge AI": [
            "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
            "https://www.theverge.com/rss/index.xml",
            "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
        ],
        "Axios AI+": [
            "https://api.axios.com/feed/",
            "https://www.axios.com/feeds/feed.rss",
        ],
        "MIT Technology Review": [
            "https://www.technologyreview.com/feed/",
            "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
        ],
        "Nvidia Newsroom": [
            "https://nvidianews.nvidia.com/rss",
            "https://nvidianews.nvidia.com/releases.xml",
        ],
        "Microsoft AI Blog": [
            "https://blogs.microsoft.com/ai/feed/",
            "https://blogs.microsoft.com/feed/",
        ],
        "Kitces — Technology & Advisor FinTech": [
            "https://www.kitces.com/blog/category/19-technology-advisor-fintech/feed/",
            "https://www.kitces.com/feed/",
        ],
        "Reuters — Technology / AI": [
            "https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best",
            "https://www.reuters.com/technology/rss",
        ],
        "Reuters — Wealth / Business": [
            "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
        ],
        "Business Wire": [
            "https://feed.businesswire.com/rss/home/?rss=G1QFDERJXkJeEFpQWg==",
        ],
        "PR Newswire": [
            "https://www.prnewswire.com/rss/news-releases-list.rss",
        ],
        "GlobeNewswire": [
            "https://www.globenewswire.com/RssFeed/orgclass/1/feedTitle/GlobeNewswire",
        ],
        "Import AI": ["https://importai.substack.com/feed"],
        "Robert Huebscher Substack": ["https://roberthuebscher.substack.com/feed"],
        "Fintech Business Weekly": ["https://fintechbusinessweekly.substack.com/feed"],
        "AI Advisor Stack": [
            "https://newsletter.aiadvisorstack.com/feed",
            "https://newsletter.aiadvisorstack.com/feed/",
        ],
        "Stratechery": ["https://stratechery.com/feed/"],
        "Exponential View": [
            "https://www.exponentialview.co/feed",
            "https://www.exponentialview.co/feed/",
        ],
        "Citrini Research": [
            "https://www.citriniresearch.com/feed",
            "https://www.citriniresearch.com/feed/",
        ],
        "SemiAnalysis": [
            "https://semianalysis.com/feed",
            "https://www.semianalysis.com/feed",
        ],
    }
    extra.extend(mapping.get(name, []))
    return extra


def looks_like_xml(body: bytes, content_type: Optional[str]) -> bool:
    if not body:
        return False
    head = body.lstrip()[:200].lower()
    if head.startswith(b"<?xml") or head.startswith(b"<rss") or head.startswith(b"<feed") or head.startswith(b"<rdf"):
        return True
    if content_type and any(x in content_type for x in ("xml", "rss", "atom", "rdf")):
        return True
    return False


def localname(tag: str) -> str:
    return tag.split("}", 1)[-1].lower()


def parse_date(text: Optional[str]) -> Optional[datetime]:
    if not text:
        return None
    text = text.strip()
    if not text:
        return None
    try:
        dt = parsedate_to_datetime(text)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        pass
    for fmt in (
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%S",
    ):
        try:
            cleaned = text.replace("Z", "+0000") if fmt.endswith("%z") and text.endswith("Z") else text
            if fmt.endswith("Z"):
                cleaned = text
            dt = datetime.strptime(cleaned.replace("Z", ""), fmt.replace("Z", "").replace("%z", "")) if "Z" in fmt and text.endswith("Z") else datetime.strptime(text.replace("Z", "+0000") if text.endswith("Z") and "%z" in fmt else text, fmt if not text.endswith("Z") or "Z" not in fmt else fmt)
        except Exception:
            continue
        else:
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
    # last resort: fromisoformat
    try:
        t = text.replace("Z", "+00:00")
        dt = datetime.fromisoformat(t)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return None


def parse_feed(body: bytes) -> dict[str, Any]:
    result = {
        "is_feed": False,
        "kind": None,
        "title": None,
        "item_count": 0,
        "newest": None,
        "newest_iso": None,
        "error": None,
    }
    if not body:
        result["error"] = "empty body"
        return result
    text = body.lstrip()
    # strip BOM / encoding declaration issues
    if text.startswith(b"\xef\xbb\xbf"):
        text = text[3:]
    try:
        root = ET.fromstring(text)
    except ET.ParseError as e:
        # try repairing truncated or html-wrapped
        try:
            root = ET.fromstring(text.split(b"<html", 1)[0] or text)
        except Exception:
            result["error"] = f"XML parse error: {e}"
            return result
    tag = localname(root.tag)
    dates: list[datetime] = []
    items = []
    if tag == "rss" or tag == "rdf":
        result["kind"] = "rss"
        channel = None
        for child in list(root):
            if localname(child.tag) == "channel":
                channel = child
                break
        parent = channel if channel is not None else root
        for child in parent:
            if localname(child.tag) == "title" and result["title"] is None:
                result["title"] = (child.text or "").strip()
            if localname(child.tag) in ("item", "entry"):
                items.append(child)
        if channel is None:
            items = [c for c in root.iter() if localname(c.tag) == "item"]
    elif tag == "feed":
        result["kind"] = "atom"
        for child in list(root):
            if localname(child.tag) == "title" and result["title"] is None:
                result["title"] = (child.text or "").strip()
            if localname(child.tag) == "entry":
                items.append(child)
    else:
        # maybe it's a feed with unexpected root
        items = [c for c in root.iter() if localname(c.tag) in ("item", "entry")]
        if items:
            result["kind"] = "rss-like"
        else:
            result["error"] = f"not RSS/Atom (root={tag})"
            return result

    result["item_count"] = len(items)
    result["is_feed"] = result["item_count"] > 0 or result["kind"] in ("rss", "atom")
    for item in items:
        for child in list(item):
            ln = localname(child.tag)
            if ln in ("pubdate", "published", "updated", "date", "dc:date") or ln == "date":
                dt = parse_date((child.text or "").strip())
                if dt:
                    dates.append(dt)
    if dates:
        newest = max(dates)
        result["newest"] = newest
        result["newest_iso"] = newest.date().isoformat()
    return result


def itunes_feed(apple_id: str) -> Optional[str]:
    url = f"https://itunes.apple.com/lookup?id={apple_id}&entity=podcast"
    r = fetch(url, "GET")
    if r.get("status") != 200 or not r.get("text"):
        return None
    try:
        data = json.loads(r["text"])
        results = data.get("results") or []
        if results:
            return results[0].get("feedUrl")
    except Exception:
        return None
    return None


def collect_candidates(src: dict[str, Any]) -> tuple[list[str], list[dict[str, Any]]]:
    pages = [src["page"]] + list(src.get("extra_pages") or [])
    discovered: list[str] = []
    page_fetches: list[dict[str, Any]] = []
    for page in pages:
        r = fetch(page, "GET")
        page_fetches.append(
            {
                "url": page,
                "status": r.get("status"),
                "content_type": r.get("content_type"),
                "error": r.get("error"),
                "final_url": r.get("final_url"),
            }
        )
        html = r.get("text") or ""
        if html:
            discovered.extend(parse_link_tags(html, r.get("final_url") or page))
        discovered.extend(conventional_candidates(page))
    discovered.extend(extra_known_candidates(src))
    if src.get("apple_id"):
        fu = itunes_feed(src["apple_id"])
        if fu:
            discovered.append(fu)
    # unique preserve order
    seen = set()
    uniq = []
    for u in discovered:
        if not u or not u.startswith("http"):
            continue
        # skip obvious non-feeds
        low = u.lower()
        if any(x in low for x in ("javascript:", "mailto:", ".css", ".js?", ".png", ".jpg", ".woff")):
            continue
        key = normalize_url(u)
        if key in seen:
            continue
        seen.add(key)
        uniq.append(u)
    return uniq, page_fetches


_probe_cache: dict[str, dict[str, Any]] = {}


def probe_feed_url(url: str) -> dict[str, Any]:
    key = normalize_url(url)
    if key in _probe_cache:
        return _probe_cache[key]
    rec: dict[str, Any] = {
        "url": url,
        "status": None,
        "content_type": None,
        "is_feed": False,
        "kind": None,
        "newest_iso": None,
        "item_count": 0,
        "title": None,
        "error": None,
        "final_url": None,
    }
    head = fetch(url, "HEAD")
    rec["status"] = head.get("status")
    rec["content_type"] = head.get("content_type")
    rec["final_url"] = head.get("final_url")
    need_get = True
    if head.get("status") in (404, 410):
        need_get = False
        rec["error"] = f"HEAD {head.get('status')}"
    # many servers 405 HEAD
    if need_get:
        g = fetch(url, "GET")
        rec["status"] = g.get("status") or rec["status"]
        rec["content_type"] = g.get("content_type") or rec["content_type"]
        rec["final_url"] = g.get("final_url") or rec["final_url"]
        rec["error"] = g.get("error")
        body = g.get("body") or b""
        ct = rec["content_type"]
        if g.get("status") and g["status"] < 400 and looks_like_xml(body, ct):
            parsed = parse_feed(body)
            rec.update(
                {
                    "is_feed": parsed["is_feed"],
                    "kind": parsed["kind"],
                    "newest_iso": parsed["newest_iso"],
                    "item_count": parsed["item_count"],
                    "title": parsed["title"],
                    "error": parsed["error"],
                }
            )
        elif g.get("status") and g["status"] < 400:
            # maybe xml served as text/html
            if looks_like_xml(body, "application/xml"):
                parsed = parse_feed(body)
                rec.update(
                    {
                        "is_feed": parsed["is_feed"],
                        "kind": parsed["kind"],
                        "newest_iso": parsed["newest_iso"],
                        "item_count": parsed["item_count"],
                        "title": parsed["title"],
                        "error": parsed["error"],
                    }
                )
            else:
                rec["error"] = rec["error"] or f"not XML ({ct})"
        else:
            rec["error"] = rec["error"] or f"HTTP {rec['status']}"
    _probe_cache[key] = rec
    if rec.get("final_url"):
        _probe_cache[normalize_url(rec["final_url"])] = rec
    return rec


def is_regulator(src: dict[str, Any]) -> bool:
    if src.get("regulator"):
        return True
    return any(src["name"].startswith(r) or r in src["name"] for r in REGULATORS)


def priority_for(src: dict[str, Any]) -> str:
    if src.get("vendor"):
        return "low"
    critical_names = ("SEC", "FINRA", "Federal Reserve", "OCC", "FDIC", "CFTC", "Treasury")
    if any(n in src["name"] for n in critical_names):
        return "critical"
    if src["tier"] in (1, 2):
        return "high"
    return "medium"


def require_any_for(src: dict[str, Any]) -> Optional[list[str]]:
    if src["tier"] in (3, 5, 6, 7, 8):
        return list(AI_FINANCE_KEYWORDS)
    return None


def best_probe(probes: list[dict[str, Any]]) -> Optional[dict[str, Any]]:
    goods = [p for p in probes if p.get("is_feed") and p.get("status") and p["status"] < 400]
    if not goods:
        return None

    def score(p: dict[str, Any]) -> tuple:
        newest = p.get("newest_iso") or "0000-00-00"
        # prefer more specific paths (longer path) slightly, and more items
        path_len = len(urlparse(p.get("final_url") or p["url"]).path)
        return (newest, p.get("item_count") or 0, path_len)

    goods.sort(key=score, reverse=True)
    return goods[0]


def process_source(src: dict[str, Any]) -> dict[str, Any]:
    print(f"[discover] {src['name']}", flush=True)
    cands, page_fetches = collect_candidates(src)
    # limit candidates per source to keep runtime sane
    if len(cands) > 24:
        cands = cands[:24]
    probes = []
    for u in cands:
        probes.append(probe_feed_url(u))
    best = best_probe(probes)
    return {
        "source": src,
        "page_fetches": page_fetches,
        "candidates": cands,
        "probes": probes,
        "best": best,
    }


def main() -> None:
    t0 = time.time()
    results = []
    with ThreadPoolExecutor(max_workers=6) as ex:
        futs = {ex.submit(process_source, s): s["name"] for s in SOURCES}
        for fut in as_completed(futs):
            name = futs[fut]
            try:
                results.append(fut.result())
            except Exception as e:
                print(f"[error] {name}: {e}", flush=True)
                src = next(s for s in SOURCES if s["name"] == name)
                results.append(
                    {
                        "source": src,
                        "page_fetches": [],
                        "candidates": [],
                        "probes": [],
                        "best": None,
                        "fatal": str(e),
                    }
                )

    # preserve source order
    order = {s["name"]: i for i, s in enumerate(SOURCES)}
    results.sort(key=lambda r: order[r["source"]["name"]])

    raw_path = "/Users/paulnelson/Documents/Development/RIA-AI-Drudge/scripts/_probe_work/raw_results.json"
    serializable = []
    for r in results:
        serializable.append(
            {
                "name": r["source"]["name"],
                "page": r["source"]["page"],
                "tier": r["source"]["tier"],
                "homeCategory": r["source"]["homeCategory"],
                "vendor": r["source"]["vendor"],
                "page_fetches": r.get("page_fetches"),
                "candidates": r.get("candidates"),
                "fatal": r.get("fatal"),
                "best": r.get("best"),
                "good_probes": [
                    {
                        "url": p["url"],
                        "final_url": p.get("final_url"),
                        "status": p.get("status"),
                        "content_type": p.get("content_type"),
                        "kind": p.get("kind"),
                        "newest_iso": p.get("newest_iso"),
                        "item_count": p.get("item_count"),
                        "title": p.get("title"),
                    }
                    for p in r.get("probes") or []
                    if p.get("is_feed")
                ],
                "failed_sample": [
                    {
                        "url": p["url"],
                        "status": p.get("status"),
                        "error": p.get("error"),
                        "content_type": p.get("content_type"),
                    }
                    for p in (r.get("probes") or [])[:8]
                    if not p.get("is_feed")
                ],
            }
        )
    with open(raw_path, "w") as f:
        json.dump(serializable, f, indent=2)
    print(f"Wrote raw results ({len(results)} sources) in {time.time()-t0:.1f}s -> {raw_path}", flush=True)


if __name__ == "__main__":
    main()
