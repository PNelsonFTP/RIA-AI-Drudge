import type { GroupedArticle } from "../lib/types";
import { timeAgoDisplay, isNew } from "../lib/timeAgo";

interface LatestStripProps {
  articles: GroupedArticle[];
  onHover: (a: GroupedArticle, e: React.MouseEvent) => void;
  onHoverEnd: () => void;
}

const LIMIT = 12;

export function LatestStrip({ articles, onHover, onHoverEnd }: LatestStripProps) {
  if (articles.length === 0) return null;

  const sorted = [...articles]
    .filter((a) => a.publishedAt)
    .sort((a, b) => {
      const ta = new Date(a.publishedAt!).getTime();
      const tb = new Date(b.publishedAt!).getTime();
      return tb - ta;
    })
    .slice(0, LIMIT);

  if (sorted.length === 0) return null;

  return (
    <section className="panel" id="latest">
      <div className="section-head">
        <h2 className="section-title">Latest</h2>
        <span className="section-meta">reverse-chronological</span>
      </div>
      <ul className="latest-list">
        {sorted.map((a) => {
          const fresh = isNew(a.publishedAt);
          return (
            <li
              key={a.id}
              onMouseEnter={(e) => onHover(a, e)}
              onMouseLeave={onHoverEnd}
            >
              <span className="latest-ago">{timeAgoDisplay(a.publishedAt)}</span>
              <span>
                <a href={a.url} target="_blank" rel="noreferrer noopener">
                  {a.title}
                </a>
                {fresh && <span className="new-badge">NEW</span>}
                <span className="source-badge" style={{ marginLeft: 6 }}>{a.source}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
