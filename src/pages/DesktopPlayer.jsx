import TablaImage from "../components/TablaImage";
import { formatDuration } from "../formatDuration";

function DesktopPlayer({
  activeStrokeIds,
  isBayanActive,
  isDayanActive,
  sparkleBursts,
  leftStrokes,
  rightStrokes,
  isRecording,
  recordingMs,
  supportsRecording,
  recordings,
  recordingError,
  onBack,
  onOpenEditor,
  onToggleRecording,
  onOpenRecordings,
  onStrike
}) {
  return (
    <section className="player-screen">
      <div className="player-topbar">
        <div className="topbar-brand">
          <button type="button" className="ghost-button back-icon-button" onClick={onBack}>
            &lt;
          </button>
          <span className="brand-mark">Virtual Tabla</span>
        </div>
        <button type="button" className="ghost-button edit-keys-button" onClick={onOpenEditor}>
          Edit Keys
        </button>
      </div>

      <div className="player-layout">
        <div className="stroke-column left-column">
          <h2>Left Hand</h2>
          <p>Bayan on the left</p>
          <div className="stroke-list">
            {leftStrokes.map((stroke) => (
              <button
                key={stroke.id}
                type="button"
                className={`key-pill ${activeStrokeIds.includes(stroke.id) ? "pressed" : ""}`}
                onMouseDown={() => onStrike(stroke)}
                onTouchStart={() => onStrike(stroke)}
              >
                <span className="keycap">{stroke.key}</span>
                <span className="stroke-meta">
                  <strong>{stroke.label}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="instrument-stage">
          <div className={`stage-surface ${activeStrokeIds.length ? "pulse" : ""}`}>
            <TablaImage
              isBayanActive={isBayanActive}
              isDayanActive={isDayanActive}
              sparkleBursts={sparkleBursts}
            />
          </div>
        </div>

        <div className="stroke-column right-column">
          <h2>Right Hand</h2>
          <p>Dayan on the right</p>
          <div className="stroke-list">
            {rightStrokes.map((stroke) => (
              <button
                key={stroke.id}
                type="button"
                className={`key-pill ${activeStrokeIds.includes(stroke.id) ? "pressed" : ""}`}
                onMouseDown={() => onStrike(stroke)}
                onTouchStart={() => onStrike(stroke)}
              >
                <span className="keycap">{stroke.key}</span>
                <span className="stroke-meta">
                  <strong>{stroke.label}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="player-footer">
        <p className="play-tip">Tip: press ge + na together to play dha.</p>

        <div className="player-actions">
          <button
            type="button"
            className={`session-button record-button ${isRecording ? "is-recording" : ""}`}
            onClick={onToggleRecording}
            disabled={!supportsRecording}
          >
            <span className="record-main">
              <span className="record-icon" />
              <span>{isRecording ? "Stop" : "Record"}</span>
            </span>
            {isRecording ? <span className="record-timer">{formatDuration(recordingMs)}</span> : null}
          </button>

          <button
            type="button"
            className="session-button view-recordings-button"
            onClick={onOpenRecordings}
          >
            <span>View Recordings</span>
            <span className="recordings-count">{recordings.length}</span>
          </button>
        </div>

        <p className="made-by">made by Angshul</p>
      </div>

      {recordingError ? <p className="recording-error">{recordingError}</p> : null}
    </section>
  );
}

export default DesktopPlayer;
