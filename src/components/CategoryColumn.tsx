import { useState } from "react";
import type { CategoryBucket, GroupedArticle } from "../lib/types";
import { Headline } from "./Headline";

interface CategoryColumnProps {
  bucket: CategoryBucket;
  bookmarkSet: Set<string>;
  queueSet: Set<string>;
  mutedSources: Set<string>;
  onToggleBookmark: (id: string) => void;
  onToggleQueue: (id: string) => void;
  onMuteSource: (source: string) => void;
  onMuteCategory: (id: string) => void;
  onHover: (article: GroupedArticle, e: React.MouseEvent) => void;
  onHoverEnd: () => void;
  onRequestFull?: () => void;
}

export function CategoryColumn({
  bucket,
  bookmarkSet,
  queueSet,
  mutedSources,
  onToggleBookmark,
  onToggleQueue,
  onMuteSource,
  onMuteCategory,
  onHover,
  onHoverEnd,
  onRequestFull,
}: CategoryColumnProps) {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(true);

  const awaitingFull = expanded && bucket.articlesAll.length === 0 && bucket.articles.length > 0;
  const list = awaitingFull ? bucket.articles : expanded ? bucket.articlesAll : bucket.articles;
  const fullCount = bucket.fullCount ?? bucket.articlesAll.length;
  const hasMore = fullCount > bucket.articles.length;

  return (
    <section className="company" id={`cat-${bucket.id}`}>
      <div className="company-head">
        <h2
          className="company-ticker"
          onClick={() => setOpen((v) => !v)}
          title="Tap to expand/collapse on mobile"
          style={{ cursor: "pointer" }}
        >
          <span className="md:hidden">{open ? "▼ " : "▶ "}</span>
          {bucket.label}
        </h2>
        <span className="company-weight">{bucket.sourceCount} src</span>
        <button
          onClick={() => onMuteCategory(bucket.id)}
          className="mute-btn"
          title={`Hide the ${bucket.label} section`}
        >
          mute
        </button>
      </div>
      <div className={`${open ? "block" : "hidden"} md:block`}>
        {list.map((a) => (
          <Headline
            key={a.id}
            article={a}
            isBookmark={bookmarkSet.has(a.id)}
            isInQueue={queueSet.has(a.id)}
            isSourceMuted={mutedSources.has(a.source)}
            onToggleBookmark={onToggleBookmark}
            onToggleQueue={onToggleQueue}
            onMuteSource={onMuteSource}
            onHover={onHover}
            onHoverEnd={onHoverEnd}
          />
        ))}
        {awaitingFull && (
          <div className="status" style={{ padding: "6px 0" }}>loading…</div>
        )}
        {hasMore && (
          <button
            onClick={() => {
              if (!expanded) onRequestFull?.();
              setExpanded((v) => !v);
            }}
            className="show-more"
          >
            {expanded ? "show less" : `view all ${fullCount}`}
          </button>
        )}
      </div>
    </section>
  );
}
