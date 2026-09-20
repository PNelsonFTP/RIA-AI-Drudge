interface FeedHealthProps {
  stats: { source: string; ok: boolean; count: number }[];
  generatedAt: string | null;
  onClose: () => void;
}

export function FeedHealth({ stats, generatedAt, onClose }: FeedHealthProps) {
  const failing = stats.filter((f) => !f.ok);
  const zero = stats.filter((f) => f.ok && f.count === 0);
  const healthy = stats.filter((f) => f.ok && f.count > 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Feed health</h2>
          <button onClick={onClose}>✕ close</button>
        </div>
        <div className="modal-body">
          <p className="also-covered" style={{ marginTop: 0 }}>
            {healthy.length + zero.length}/{stats.length} feeds OK at last build
            {generatedAt ? ` (${new Date(generatedAt).toLocaleString()})` : ""}.
          </p>

          {failing.length > 0 && (
            <div className="mute-group">
              <h3 className="section-title siren" style={{ marginBottom: 6, color: "var(--color-siren)" }}>
                Failing ({failing.length})
              </h3>
              {failing.map((f) => (
                <div key={f.source} className="mute-row">
                  <span>{f.source}</span>
                  <span className="siren">fetch failed</span>
                </div>
              ))}
            </div>
          )}

          {zero.length > 0 && (
            <div className="mute-group">
              <h3 className="section-title" style={{ marginBottom: 6 }}>
                OK but zero items ({zero.length})
              </h3>
              {zero.map((f) => (
                <div key={f.source} className="mute-row">
                  <span>{f.source}</span>
                  <span>0 items</span>
                </div>
              ))}
            </div>
          )}

          <div className="mute-group">
            <h3 className="section-title" style={{ marginBottom: 6 }}>
              Healthy ({healthy.length})
            </h3>
            {healthy.map((f) => (
              <div key={f.source} className="mute-row">
                <span>{f.source}</span>
                <span>{f.count} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
