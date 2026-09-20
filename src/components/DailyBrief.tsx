import type { Brief } from "../lib/types";

export function DailyBrief({ brief }: { brief: Brief | null }) {
  if (!brief) return null;

  const generated = new Date(brief.generatedAt).toLocaleString(undefined, {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <section className="panel" id="daily-brief">
      <div className="section-head">
        <h2 className="section-title">Daily brief</h2>
        <span className="section-meta">
          {brief.source === "claude" ? "AI-generated" : "Top headlines"} · {generated}
        </span>
      </div>
      <p className="brief-headline">{brief.headline}</p>
      <ul className="brief-bullets">
        {brief.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      {brief.citedArticles.length > 0 && (
        <p className="also-covered">
          Cited:{" "}
          {brief.citedArticles.slice(0, 5).map((c, i) => (
            <span key={c.url}>
              {i > 0 && " · "}
              <a href={c.url} target="_blank" rel="noreferrer noopener">{c.source}</a>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
