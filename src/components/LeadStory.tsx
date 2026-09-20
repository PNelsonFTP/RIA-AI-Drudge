import type { GroupedArticle } from "../lib/types";
import { timeAgoDisplay } from "../lib/timeAgo";

interface LeadStoryProps {
  article: GroupedArticle;
  onHover: (article: GroupedArticle, e: React.MouseEvent) => void;
  onHoverEnd: () => void;
}

export function LeadStory({ article, onHover, onHoverEnd }: LeadStoryProps) {
  return (
    <section
      id="lead-story"
      className="panel"
      onMouseEnter={(e) => onHover(article, e)}
      onMouseLeave={onHoverEnd}
    >
      <div className="section-head gold">
        <h2 className="section-title">Lead story</h2>
        <span className="section-meta">{article.source} · {timeAgoDisplay(article.publishedAt)}</span>
      </div>
      <h3 className={`lead-title ${article.priority === "critical" ? "headline-critical" : ""}`}>
        <a href={article.url} target="_blank" rel="noreferrer noopener">
          {article.title}
        </a>
      </h3>
      {article.summary && (
        <p className="lead-snippet">{article.summary}</p>
      )}
      {article.related.length > 0 && (
        <p className="also-covered">
          Also covered by:{" "}
          {article.related.map((r, i) => (
            <span key={r.url}>
              {i > 0 && " · "}
              <a href={r.url} target="_blank" rel="noreferrer noopener">{r.source}</a>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
