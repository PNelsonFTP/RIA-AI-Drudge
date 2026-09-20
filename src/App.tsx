import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { StockTicker } from "./components/StockTicker";
import { DailyBrief } from "./components/DailyBrief";
import { LeadStory } from "./components/LeadStory";
import { Trending } from "./components/Trending";
import { LatestStrip } from "./components/LatestStrip";
import { CategoryColumn } from "./components/CategoryColumn";
import { HoverCard as HoverCardContent, useHoverCard } from "./components/HoverCard";
import { Headline } from "./components/Headline";
import { ManageMutes } from "./components/ManageMutes";
import { FeedHealth } from "./components/FeedHealth";
import { useHeadlines } from "./hooks/useHeadlines";
import { useTheme } from "./hooks/useTheme";
import {
  useBookmarks,
  useReadLater,
  useMutedSources,
  useMutedCategories,
  useArticleSnapshots,
} from "./hooks/useLocalStorageSet";
import { ReadStateContext, useReadStateProvider } from "./hooks/useReadState";
import type { Article, CategoryBucket, GroupedArticle } from "./lib/types";

type View = "home" | "bookmarks" | "queue";

// #13: data considered stale if last refreshed more than this many hours ago.
const STALE_DATA_HOURS = 6;

function matchesSearch(
  a: GroupedArticle,
  searchLc: string,
  categoryLabel?: string,
): boolean {
  if (!searchLc) return true;
  return (
    a.title.toLowerCase().includes(searchLc) ||
    a.source.toLowerCase().includes(searchLc) ||
    (categoryLabel ?? "").toLowerCase().includes(searchLc) ||
    (a.summary ?? "").toLowerCase().includes(searchLc) ||
    a.related.some((r: Article) => r.source.toLowerCase().includes(searchLc))
  );
}

function dataIsStale(generatedAt: string | null): boolean {
  if (!generatedAt) return false;
  const then = new Date(generatedAt).getTime();
  if (isNaN(then)) return false;
  return (Date.now() - then) / 3_600_000 > STALE_DATA_HOURS;
}

// "N new since your last visit" (#2 from the roadmap). Reads the previous
// visit time once, then records this visit. Uses publishedAt (not
// collectedAt — that resets on every hourly rebuild).
const LAST_VISIT_KEY = "ria-ai-report:last-visit";

function useLastVisit(loaded: boolean): number | null {
  const [prev] = useState<number | null>(() => {
    try {
      const raw = localStorage.getItem(LAST_VISIT_KEY);
      const t = raw ? new Date(raw).getTime() : NaN;
      return isNaN(t) ? null : t;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
    } catch {
      /* best-effort */
    }
  }, [loaded]);
  return prev;
}

export default function App() {
  const { headlines, stocks, brief, error, loadFull } = useHeadlines();
  const { theme, toggle: toggleTheme } = useTheme();
  const { bookmarks, toggle: toggleBookmark } = useBookmarks();
  const { queue, toggle: toggleQueue, remove: removeFromQueue } = useReadLater();
  const { muted: mutedSources, toggle: toggleMuteSource } = useMutedSources();
  const { muted: mutedCategories, toggle: toggleMuteCategory } = useMutedCategories();
  const { active: hover, show: showHover, hide: hideHover } = useHoverCard();
  const { snapshots, sync: syncSnapshots } = useArticleSnapshots();
  const readState = useReadStateProvider();

  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("home");
  const [manageOpen, setManageOpen] = useState(false);
  const [feedHealthOpen, setFeedHealthOpen] = useState(false);
  const [newBannerDismissed, setNewBannerDismissed] = useState(false);

  const searchLc = search.trim().toLowerCase();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      document.querySelector<HTMLInputElement>("input.search-input")?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Search and View All need the full payload; preview omits View-All tails.
  useEffect(() => {
    if (searchLc) loadFull();
  }, [searchLc, loadFull]);

  // ID -> live article, for snapshotting bookmarks/queue items before they
  // age out of the payload.
  const articleById = useMemo<Map<string, Article>>(() => {
    const m = new Map<string, Article>();
    if (!headlines) return m;
    for (const c of headlines.categories) {
      const pool = c.articlesAll.length > 0 ? c.articlesAll : c.articles;
      for (const a of pool) {
        if (!m.has(a.id)) {
          const { related: _related, ...plain } = a;
          m.set(a.id, plain);
        }
      }
    }
    return m;
  }, [headlines]);

  // Persist snapshots for everything bookmarked/queued; GC the rest.
  useEffect(() => {
    if (!headlines) return;
    syncSnapshots(new Set([...bookmarks, ...queue]), articleById);
  }, [headlines, bookmarks, queue, articleById, syncSnapshots]);

  const prevVisit = useLastVisit(!!headlines);
  const newSinceLastVisit = useMemo(() => {
    if (!headlines || prevVisit == null) return 0;
    const seen = new Set<string>();
    let n = 0;
    for (const c of headlines.categories) {
      const pool = c.articlesAll.length > 0 ? c.articlesAll : c.articles;
      for (const a of pool) {
        if (seen.has(a.url)) continue;
        seen.add(a.url);
        if (a.publishedAt && new Date(a.publishedAt).getTime() > prevVisit) n++;
      }
    }
    return n;
  }, [headlines, prevVisit]);

  // Map category id -> label for the ManageMutes panel.
  const categoryLabelsById = useMemo<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    if (!headlines) return m;
    for (const c of headlines.categories) m[c.id] = c.label;
    return m;
  }, [headlines]);

  // Apply user mutes: drop muted categories entirely; drop muted sources from
  // the remaining categories' article lists. Also apply search filter.
  // Empty-after-search-or-source-mute buckets stay in the grid so i % 3
  // column placement does not slide.
  const filteredCategories = useMemo<CategoryBucket[]>(() => {
    if (!headlines) return [];
    return headlines.categories
      .filter((c) => !mutedCategories.has(c.id))
      .map((c) => {
        const filterFn = (a: GroupedArticle) => {
          if (mutedSources.has(a.source)) return false;
          return matchesSearch(a, searchLc, c.label);
        };
        return {
          ...c,
          articles: c.articles.filter(filterFn),
          articlesAll: c.articlesAll.filter(filterFn),
        };
      });
  }, [headlines, mutedCategories, mutedSources, searchLc]);

  // Bookmarks/queue views: prefer the live payload article (it has related
  // coverage), fall back to the localStorage snapshot once the article has
  // aged out of headlines.json — saved items never silently disappear.
  const collectSaved = (ids: Set<string>): GroupedArticle[] => {
    if (ids.size === 0) return [];
    const seen = new Set<string>();
    const out: GroupedArticle[] = [];
    if (headlines) {
      for (const c of headlines.categories) {
        for (const a of (c.articlesAll.length > 0 ? c.articlesAll : c.articles)) {
          if (ids.has(a.id) && !seen.has(a.id)) {
            seen.add(a.id);
            out.push(a);
          }
        }
      }
    }
    for (const id of ids) {
      if (!seen.has(id) && snapshots[id]) {
        seen.add(id);
        out.push({ ...snapshots[id], related: [] });
      }
    }
    out.sort((a, b) => {
      const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return tb - ta;
    });
    return out;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bookmarkArticles = useMemo(() => collectSaved(bookmarks), [headlines, bookmarks, snapshots]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queueArticles = useMemo(() => collectSaved(queue), [headlines, queue, snapshots]);

  // Lead story = the chosen lead URL if present (#7, always <72h at build time),
  // otherwise the first article from the highest-priority category present.
  // Preview payloads leave articlesAll empty, so scan articles first.
  const lead = useMemo<GroupedArticle | null>(() => {
    if (!headlines) return null;

    const visible = (a: GroupedArticle, categoryLabel?: string) => {
      if (mutedSources.has(a.source)) return false;
      if (mutedCategories.has(a.category)) return false;
      return matchesSearch(a, searchLc, categoryLabel);
    };

    if (headlines.leadUrl) {
      for (const c of headlines.categories) {
        for (const a of c.articles) {
          if (a.url === headlines.leadUrl && visible(a, c.label)) return a;
        }
      }
      for (const c of headlines.categories) {
        for (const a of c.articlesAll) {
          if (a.url === headlines.leadUrl && visible(a, c.label)) return a;
        }
      }
    }
    const order = ["regulation", "advisor_tech", "wealthtech", "practice", "compliance", "industry"];
    for (const id of order) {
      const cat = headlines.categories.find((c) => c.id === id);
      const first = cat?.articles.find((a) => visible(a, cat.label));
      if (first) return first;
    }
    for (const c of headlines.categories) {
      const first = c.articles.find((a) => visible(a, c.label));
      if (first) return first;
    }
    return null;
  }, [headlines, mutedSources, mutedCategories, searchLc]);

  const filteredTrending = useMemo(() => {
    if (!headlines) return [];
    return headlines.trending.flatMap((s) => {
      const members = [s.lead, ...s.lead.related];
      const visibleMembers = members.filter((a) => {
        if (mutedSources.has(a.source)) return false;
        if (mutedCategories.has(a.category)) return false;
        return true;
      });
      if (visibleMembers.length === 0) return [];
      const leadArt = visibleMembers[0];
      const lead: GroupedArticle = {
        ...leadArt,
        related: visibleMembers.slice(1),
      };
      if (mutedCategories.has(lead.category)) return [];
      const sources = s.sources.filter((src) => !mutedSources.has(src));
      if (!searchLc) {
        return [{ ...s, lead, sources, sourceCount: sources.length }];
      }
      const labels = s.categoryIds
        .map((id) => categoryLabelsById[id] ?? id)
        .join(" ");
      const hit =
        matchesSearch(lead, searchLc, labels) ||
        sources.some((src) => src.toLowerCase().includes(searchLc));
      return hit ? [{ ...s, lead, sources, sourceCount: sources.length }] : [];
    });
  }, [headlines, mutedSources, mutedCategories, searchLc, categoryLabelsById]);

  const filteredBrief = useMemo(() => {
    if (!brief) return null;
    if (brief.citedArticles.length === 0) return brief;
    const cited = brief.citedArticles.filter((c) => !mutedSources.has(c.source));
    if (cited.length === 0) return null;
    const mutedTitles = brief.citedArticles
      .filter((c) => mutedSources.has(c.source))
      .map((c) => c.title.toLowerCase());
    const bullets = brief.bullets.filter(
      (b) => !mutedTitles.some((t) => b.toLowerCase().includes(t)),
    );
    let headline = brief.headline;
    if (mutedTitles.some((t) => headline.toLowerCase().includes(t))) {
      headline = `Today's top CFP AI story: ${cited[0].title}`;
    }
    return { ...brief, headline, bullets, citedArticles: cited };
  }, [brief, mutedSources]);

  // #14: flatten filtered categories for the LATEST strip.
  const latestArticles = useMemo<GroupedArticle[]>(() => {
    const seen = new Set<string>();
    const out: GroupedArticle[] = [];
    for (const c of filteredCategories) {
      const pool = c.articlesAll.length > 0 ? c.articlesAll : c.articles;
      for (const a of pool) {
        if (!seen.has(a.url)) {
          seen.add(a.url);
          out.push(a);
        }
      }
    }
    return out;
  }, [filteredCategories]);

  const staleData = dataIsStale(headlines?.generatedAt ?? null);

  // Three-column layout for the home view.
  const columns = useMemo<CategoryBucket[][]>(() => {
    const cols: CategoryBucket[][] = [[], [], []];
    filteredCategories.forEach((c, i) => cols[i % 3].push(c));
    return cols;
  }, [filteredCategories]);

  const mutedCount = mutedSources.size + mutedCategories.size;
  const hasVisibleArticles = filteredCategories.some((c) => c.articles.length > 0);

  return (
    <ReadStateContext.Provider value={readState}>
    <div className="min-h-full" id="top">
      <a href="#main" className="skip-link">Skip to headlines</a>
      <div className="sticky-top">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          generatedAt={headlines?.generatedAt ?? null}
          totalCount={headlines?.totalCount ?? 0}
          bookmarksCount={bookmarks.size}
          queueCount={queue.size}
          mutedCount={mutedCount}
          view={view}
          onSetView={setView}
          onOpenManageMutes={() => setManageOpen(true)}
          search={search}
          onSearchChange={setSearch}
        />
        <StockTicker stocks={stocks} />
        {headlines && view === "home" && filteredCategories.length > 0 && (
          <nav className="index-strip" aria-label="Jump to section">
            {filteredCategories.map((c) => (
              <a key={c.id} className="index-chip" href={`#cat-${c.id}`}>
                {c.label}
              </a>
            ))}
          </nav>
        )}
      </div>

      <main id="main" className="main">
        {error && (
          <div className="banner">
            {error} — the site will retry on next visit.
          </div>
        )}

        {!headlines && !error && (
          <p className="status">Loading headlines…</p>
        )}

        {/* HOME VIEW */}
        {headlines && view === "home" && (
          <>
            {staleData && (
              <div className="banner">
                Headlines may be delayed — last refresh was more than {STALE_DATA_HOURS} hours ago.
              </div>
            )}

            {newSinceLastVisit > 0 && !newBannerDismissed && (
              <div className="banner info">
                <span>
                  <strong>{newSinceLastVisit}</strong> new {newSinceLastVisit === 1 ? "story" : "stories"} since your last visit.
                </span>
                <button onClick={() => setNewBannerDismissed(true)} aria-label="Dismiss">
                  dismiss
                </button>
              </div>
            )}

            <div className="top-grid">
              <div className="top-main">
                {lead && (
                  <LeadStory article={lead} onHover={showHover} onHoverEnd={hideHover} />
                )}
                {filteredTrending.length > 0 && (
                  <Trending stories={filteredTrending} onHover={showHover} onHoverEnd={hideHover} />
                )}
              </div>
              <div className="top-side">
                {filteredBrief && <DailyBrief brief={filteredBrief} />}
                <LatestStrip articles={latestArticles} onHover={showHover} onHoverEnd={hideHover} />
              </div>
            </div>

            {filteredCategories.length === 0 || !hasVisibleArticles ? (
              <p className="status">
                {search
                  ? "No headlines match your search."
                  : mutedCategories.size > 0 || mutedSources.size > 0
                    ? "All sections hidden — click Mutes in the header to restore."
                    : "No headlines available right now."}
              </p>
            ) : (
              <div className="columns">
                {columns.map((col, i) => (
                  <div key={i} className="col">
                    {col.map((bucket) => (
                      <CategoryColumn
                        key={bucket.id}
                        bucket={bucket}
                        bookmarkSet={bookmarks}
                        queueSet={queue}
                        mutedSources={mutedSources}
                        onToggleBookmark={toggleBookmark}
                        onToggleQueue={toggleQueue}
                        onMuteSource={toggleMuteSource}
                        onMuteCategory={toggleMuteCategory}
                        onHover={showHover}
                        onHoverEnd={hideHover}
                        onRequestFull={loadFull}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* BOOKMARKS VIEW */}
        {headlines && view === "bookmarks" && (
          <Section
            title="BOOKMARKS"
            subtitle="Saved permanently. Click ★ again to remove."
            articles={bookmarkArticles}
            emptyMessage="No bookmarks yet — click ☆ next to any headline to save it."
            bookmarkSet={bookmarks}
            queueSet={queue}
            mutedSources={mutedSources}
            onToggleBookmark={toggleBookmark}
            onToggleQueue={toggleQueue}
            onMuteSource={toggleMuteSource}
            onHover={showHover}
            onHoverEnd={hideHover}
          />
        )}

        {/* QUEUE VIEW */}
        {headlines && view === "queue" && (
          <Section
            title="READ LATER"
            subtitle="Click a headline to open & clear it from the queue."
            articles={queueArticles}
            emptyMessage="Queue empty — click ○ next to any headline to save it for later."
            bookmarkSet={bookmarks}
            queueSet={queue}
            mutedSources={mutedSources}
            onToggleBookmark={toggleBookmark}
            onToggleQueue={toggleQueue}
            onMuteSource={toggleMuteSource}
            onHover={showHover}
            onHoverEnd={hideHover}
            consumeOnOpen
            onConsume={removeFromQueue}
          />
        )}

      </main>

      <footer className="site-footer">
        <span>
          CFP AI REPORT — aggregator, no affiliation with Drudge Report or First Trust.{" "}
          <a href={`${import.meta.env.BASE_URL}feed.xml`}>RSS</a>
        </span>
        {headlines?.feedStats && (
          <button
            onClick={() => setFeedHealthOpen(true)}
            title="Per-feed fetch status from the last build"
          >
            {headlines.feedStats.filter((f: { ok: boolean }) => f.ok).length}/{headlines.feedStats.length} feeds OK
          </button>
        )}
      </footer>

      {hover && (
        <HoverCardContent article={hover.article} anchor={hover.anchor} />
      )}

      {manageOpen && (
        <ManageMutes
          mutedSources={[...mutedSources]}
          mutedCategories={[...mutedCategories]}
          categoryLabelsById={categoryLabelsById}
          onUnmuteSource={toggleMuteSource}
          onUnmuteCategory={toggleMuteCategory}
          onClose={() => setManageOpen(false)}
        />
      )}

      {feedHealthOpen && headlines?.feedStats && (
        <FeedHealth
          stats={headlines.feedStats}
          generatedAt={headlines.generatedAt}
          onClose={() => setFeedHealthOpen(false)}
        />
      )}
    </div>
    </ReadStateContext.Provider>
  );
}

// Helper component for the bookmarks & queue single-column views.
interface SectionProps {
  title: string;
  subtitle: string;
  articles: GroupedArticle[];
  emptyMessage: string;
  bookmarkSet: Set<string>;
  queueSet: Set<string>;
  mutedSources: Set<string>;
  onToggleBookmark: (id: string) => void;
  onToggleQueue: (id: string) => void;
  onMuteSource: (s: string) => void;
  onHover: (a: GroupedArticle, e: React.MouseEvent) => void;
  onHoverEnd: () => void;
  consumeOnOpen?: boolean;
  onConsume?: (id: string) => void;
}

function Section({
  title, subtitle, articles, emptyMessage,
  bookmarkSet, queueSet, mutedSources,
  onToggleBookmark, onToggleQueue, onMuteSource,
  onHover, onHoverEnd, consumeOnOpen, onConsume,
}: SectionProps) {
  return (
    <section className="list-view-wrap">
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
      </div>
      <p className="list-sub">{subtitle}</p>
      {articles.length === 0 ? (
        <p className="status">{emptyMessage}</p>
      ) : (
        <div>
          {articles.map((a) => (
            <Headline
              key={a.id}
              article={a}
              isBookmark={bookmarkSet.has(a.id)}
              isInQueue={queueSet.has(a.id)}
              isSourceMuted={false}
              onToggleBookmark={onToggleBookmark}
              onToggleQueue={onToggleQueue}
              onMuteSource={onMuteSource}
              onHover={onHover}
              onHoverEnd={onHoverEnd}
              consumeOnOpen={consumeOnOpen}
              onConsume={onConsume}
            />
          ))}
        </div>
      )}
    </section>
  );
}
