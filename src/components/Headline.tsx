import { useState } from "react";
import type { GroupedArticle } from "../lib/types";
import { isNew, isStale, timeAgoDisplay } from "../lib/timeAgo";
import { useReadState } from "../hooks/useReadState";

interface HeadlineProps {
  article: GroupedArticle;
  isBookmark: boolean;
  isInQueue: boolean;
  isSourceMuted: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleQueue: (id: string) => void;
  onMuteSource: (source: string) => void;
  onHover: (article: GroupedArticle, e: React.MouseEvent) => void;
  onHoverEnd: () => void;
  consumeOnOpen?: boolean;
  onConsume?: (id: string) => void;
}

const PRIORITY_CLASS: Record<string, string> = {
  critical: "headline-critical",
  high: "headline-high",
  medium: "headline-medium",
  low: "headline-low",
};

export function Headline({
  article,
  isBookmark,
  isInQueue,
  isSourceMuted,
  onToggleBookmark,
  onToggleQueue,
  onMuteSource,
  onHover,
  onHoverEnd,
  consumeOnOpen,
  onConsume,
}: HeadlineProps) {
  const [showActions, setShowActions] = useState(false);
  const { wasSeen, observe } = useReadState();

  const handleTitleClick = () => {
    if (consumeOnOpen && onConsume) onConsume(article.id);
  };

  const fresh = isNew(article.publishedAt);
  const stale = isStale(article.publishedAt);
  const seen = wasSeen(article.id) && !fresh;

  return (
    <div
      ref={(el) => observe(el, article.id)}
      className={`headline-row group ${stale || seen ? "stale" : ""}`}
      onMouseEnter={(e) => { onHover(article, e); setShowActions(true); }}
      onMouseLeave={() => { onHoverEnd(); setShowActions(false); }}
    >
      <div className="hl-actions">
        <button
          onClick={() => onToggleBookmark(article.id)}
          className={isBookmark ? "on-star" : undefined}
          title={isBookmark ? "Remove bookmark" : "Bookmark (save permanently)"}
          aria-label={isBookmark ? "Remove bookmark" : "Bookmark"}
        >
          {isBookmark ? "★" : "☆"}
        </button>
        <button
          onClick={() => onToggleQueue(article.id)}
          className={isInQueue ? "on-queue" : undefined}
          title={isInQueue ? "Remove from read-later" : "Add to read-later (clears on open)"}
          aria-label={isInQueue ? "Remove from read-later" : "Add to read-later"}
        >
          {isInQueue ? "◷" : "○"}
        </button>
      </div>
      <div className={`hl-body ${isSourceMuted ? "stale" : ""}`}>
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={handleTitleClick}
          className={PRIORITY_CLASS[article.priority] ?? "headline-medium"}
        >
          {article.title}
        </a>
        {fresh && (
          <span className="new-badge" title="Posted in the last 6 hours">NEW</span>
        )}
        {article.related.length > 0 && (
          <span className="related-badge" title={`${article.related.length} more source(s) covering this story`}>
            +{article.related.length}
          </span>
        )}
        <div className="hl-meta">
          <span className="source-badge">{article.source}</span>
          {(article.vendor === true ||
            article.source.includes("(vendor)") ||
            article.category === "vendors") && (
            <span className="vendor-badge">VENDOR</span>
          )}
          <span>{timeAgoDisplay(article.publishedAt)}</span>
          {!isSourceMuted && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMuteSource(article.source); }}
              className="mute-btn"
              title={`Hide all stories from ${article.source}`}
            >
              mute
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
