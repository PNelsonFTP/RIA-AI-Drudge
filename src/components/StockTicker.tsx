import type { StockQuote } from "../lib/types";

const ORDER = ["BLK", "SCHW", "MS", "JPM", "AMP", "LPLA", "NVDA", "MSFT"];

function TickerSeq({
  entries,
  hidden,
}: {
  entries: StockQuote[];
  hidden?: boolean;
}) {
  return (
    <span className="ticker-seq" aria-hidden={hidden ? "true" : undefined}>
      <span className="ticker-item">
        <span className="ticker-label">Markets</span>
      </span>
      {entries.map((q) => {
        const dir = q.changePct == null ? "flat" : q.changePct > 0 ? "up" : q.changePct < 0 ? "down" : "flat";
        const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "■";
        const pct = q.changePct == null ? "—" : `${Math.abs(q.changePct).toFixed(2)}%`;
        const price = q.price == null ? "—" : `$${q.price.toFixed(2)}`;
        return (
          <span key={`${hidden ? "dup-" : ""}${q.symbol}`} className="ticker-item">
            <span className="ticker-sym">{q.symbol}</span>
            <span>{price}</span>
            <span className={`ticker-${dir}`}>{arrow}{pct}</span>
          </span>
        );
      })}
    </span>
  );
}

export function StockTicker({ stocks }: { stocks: Record<string, StockQuote> | null }) {
  if (!stocks) return null;
  const entries = ORDER.map((s) => stocks[s]).filter(Boolean);
  if (entries.length === 0) return null;

  return (
    <div className="ticker-bar" aria-label="Market quotes">
      <div className="ticker-track">
        <TickerSeq entries={entries} />
        <TickerSeq entries={entries} hidden />
      </div>
    </div>
  );
}
