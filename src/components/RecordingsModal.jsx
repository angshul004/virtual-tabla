import RecordingPlayer from "./RecordingPlayer";
import { formatDuration } from "../formatDuration";

function RecordingsModal({ recordings, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="recordings-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header recordings-header">
          <div>
            <p className="eyebrow modal-eyebrow">Session Recordings</p>
            <h2>Captured takes</h2>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="recordings-list">
          {recordings.length ? (
            recordings.map((recording) => (
              <div key={recording.id} className="recording-row">
                <div>
                  <strong>{recording.name}</strong>
                  <p>{formatDuration(recording.durationMs)}</p>
                </div>
                <div className="recording-actions">
                  <RecordingPlayer src={recording.url} />
                  <a href={recording.url} download={recording.fileName} className="ghost-button recording-download">
                    Download
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="recordings-empty">
              <p>No recordings yet in this session.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecordingsModal;
