interface ManageMutesProps {
  mutedSources: string[];
  mutedCategories: string[];
  categoryLabelsById: Record<string, string>;
  onUnmuteSource: (s: string) => void;
  onUnmuteCategory: (c: string) => void;
  onClose: () => void;
}

export function ManageMutes({
  mutedSources,
  mutedCategories,
  categoryLabelsById,
  onUnmuteSource,
  onUnmuteCategory,
  onClose,
}: ManageMutesProps) {
  const empty = mutedSources.length === 0 && mutedCategories.length === 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Hidden sources & sections</h2>
          <button onClick={onClose}>✕ close</button>
        </div>
        <div className="modal-body">
          {empty && (
            <p className="status" style={{ padding: 0, textAlign: "left" }}>
              Nothing hidden yet. Hover any headline and click mute to hide that
              source, or mute a section heading to hide the whole section.
            </p>
          )}

          {mutedCategories.length > 0 && (
            <div className="mute-group">
              <h3 className="section-title" style={{ marginBottom: 6 }}>
                Hidden sections ({mutedCategories.length})
              </h3>
              {mutedCategories.map((c) => (
                <div key={c} className="mute-row">
                  <span>{categoryLabelsById[c] ?? c}</span>
                  <button className="show-more" onClick={() => onUnmuteCategory(c)}>
                    restore
                  </button>
                </div>
              ))}
            </div>
          )}

          {mutedSources.length > 0 && (
            <div className="mute-group">
              <h3 className="section-title" style={{ marginBottom: 6 }}>
                Hidden sources ({mutedSources.length})
              </h3>
              {mutedSources.map((s) => (
                <div key={s} className="mute-row">
                  <span>{s}</span>
                  <button className="show-more" onClick={() => onUnmuteSource(s)}>
                    restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
