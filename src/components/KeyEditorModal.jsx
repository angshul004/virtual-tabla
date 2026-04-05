import { DEFAULT_BINDINGS, STROKES } from "../constants";

function KeyEditorModal({ draftBindings, duplicateKeys, onChange, onClose, onSave, error }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="key-editor-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-scroll-area">
          <div className="modal-header">
            <div>
              <p className="eyebrow modal-eyebrow">Edit Keys</p>
              <h2>Customize your keyboard mapping</h2>
            </div>
            <button type="button" className="ghost-button" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="modal-grid">
            {STROKES.map((stroke) => {
              const currentKey = draftBindings[stroke.id] || "";
              const hasDuplicate = currentKey && duplicateKeys.has(currentKey);

              return (
                <label key={stroke.id} className={`key-editor-row ${hasDuplicate ? "has-duplicate" : ""}`}>
                  <span className="editor-stroke-meta">
                    <strong>{stroke.label}</strong>
                    <small>{stroke.hand} hand</small>
                  </span>
                  <input
                    className={`key-input ${hasDuplicate ? "is-duplicate" : ""}`}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={currentKey}
                    onChange={(event) => onChange(stroke.id, event.target.value)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          {error ? <p className="modal-error">{error}</p> : <div />}
          <div className="modal-actions">
            <button type="button" className="ghost-button" onClick={() => onChange(null, DEFAULT_BINDINGS)}>
              Reset
            </button>
            <button type="button" className="start-button modal-save" onClick={onSave}>
              Save Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyEditorModal;
