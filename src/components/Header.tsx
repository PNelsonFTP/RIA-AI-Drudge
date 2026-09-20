interface HeaderProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  generatedAt: string | null;
  totalCount: number;
  bookmarksCount: number;
  queueCount: number;
  mutedCount: number;
  view: "home" | "bookmarks" | "queue";
  onSetView: (v: "home" | "bookmarks" | "queue") => void;
  onOpenManageMutes: () => void;
  search: string;
  onSearchChange: (s: string) => void;
}

function relativeUpdated(generatedAt: string | null): { label: string; stale: boolean } {
  if (!generatedAt) return { label: "—", stale: false };
  const then = new Date(generatedAt).getTime();
  if (isNaN(then)) return { label: "—", stale: false };
  const diffH = (Date.now() - then) / 3_600_000;
  const ago = (() => {
    if (diffH < 1) return `${Math.max(0, Math.floor(diffH * 60))}m ago`;
    if (diffH < 24) return `${Math.floor(diffH)}h ago`;
    return `${Math.floor(diffH / 24)}d ago`;
  })();
  return { label: `updated ${ago}`, stale: diffH > 6 };
}

export function Header({
  theme,
  onToggleTheme,
  generatedAt,
  totalCount,
  bookmarksCount,
  queueCount,
  mutedCount,
  view,
  onSetView,
  onOpenManageMutes,
  search,
  onSearchChange,
}: HeaderProps) {
  const { label: updatedLabel, stale: dataStale } = relativeUpdated(generatedAt);

  return (
    <header>
      <div className="header-row">
        <div className="masthead">
          <a href="#top" className="logo" onClick={() => onSetView("home")}>
            CFP AI <span className="siren">REPORT</span>
          </a>
          <p className="tagline">
            AI headlines for advisors, RIAs, and wealth professionals
          </p>
        </div>

        <div className="toolbar">
          <span
            id="refresh-countdown"
            style={{ color: "#c5d3e4", fontSize: "9.5px", marginRight: 4 }}
            className={dataStale ? "siren" : undefined}
          >
            {generatedAt
              ? `${totalCount} ${totalCount === 1 ? "story" : "stories"} · ${updatedLabel}`
              : "loading…"}
          </span>
          <span className="tool-sep" aria-hidden="true" />
          <button
            onClick={() => onSetView(view === "bookmarks" ? "home" : "bookmarks")}
            className={`tool-btn ${view === "bookmarks" ? "active" : ""}`}
            title="Bookmarks (save permanently)"
          >
            ★ Bookmarks {bookmarksCount}
          </button>
          <button
            onClick={() => onSetView(view === "queue" ? "home" : "queue")}
            className={`tool-btn ${view === "queue" ? "active" : ""}`}
            title="Read-later queue (clears on open)"
          >
            Later {queueCount}
          </button>
          <button
            onClick={onOpenManageMutes}
            className="tool-btn"
            title="Manage hidden sources & sections"
          >
            Mutes {mutedCount}
          </button>
          <span className="tool-sep" aria-hidden="true" />
          <button
            onClick={onToggleTheme}
            className="tool-btn"
            title={theme === "dark" ? "Theme: dark. Switch to light." : "Theme: light. Switch to dark."}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      <div className="control-row">
        <input
          type="search"
          className="search-input"
          placeholder="search headlines, sources, categories…  (press /)"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search headlines"
        />
      </div>
    </header>
  );
}
