import type { TrendingStory } from "../lib/types";
import { timeAgoDisplay } from "../lib/timeAgo";

interface TrendingProps {
  stories: TrendingStory[];
  onHover: (article: TrendingStory["lead"], e: React.MouseEvent) => void;
  onHoverEnd: () => void;
}

export function Trending({ stories, onHover, onHoverEnd }: TrendingProps) {
  if (stories.length === 0) return null;

  return (
    <section className="panel" id="trending">
      <div className="section-head siren">
        <h2 className="section-title">Trending — covered by multiple outlets</h2>
        <span className="section-meta">{stories.length} stories</span>
      </div>
      <ol className="trending-list">
        {stories.map((s, i) => (
          <li
            key={s.lead.url}
            onMouseEnter={(e) => onHover(s.lead, e)}
            onMouseLeave={onHoverEnd}
          >
            <span className="trending-num">{i + 1}</span>
            <div>
              <a href={s.lead.url} target="_blank" rel="noreferrer noopener">
                {s.lead.title}
              </a>
              <div className="hl-meta" style={{ marginTop: 2 }}>
                <span className="src-badge">{s.sourceCount} sources</span>
                <span>{timeAgoDisplay(s.lead.publishedAt)}</span>
                <span>{s.sources.join(" · ")}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
