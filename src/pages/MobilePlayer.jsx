import TablaImage from "../components/TablaImage";
import RotatePhoneNotice from "../components/RotatePhoneNotice";
import { MOBILE_LEFT_ZONES, MOBILE_RIGHT_ZONES } from "../constants";
import { formatDuration } from "../formatDuration";

function MobilePlayer({
  activeStrokeIds,
  isBayanActive,
  isDayanActive,
  sparkleBursts,
  isRecording,
  recordingMs,
  supportsRecording,
  recordings,
  recordingError,
  isLandscape,
  strokesById,
  onBack,
  onToggleRecording,
  onOpenRecordings,
  onStrike
}) {
  return (
    <section className="mobile-player-screen">
      <div className="mobile-topbar">
        <div className="topbar-brand">
          <button type="button" className="ghost-button back-icon-button" onClick={onBack}>
            &lt;
          </button>
          <span className="brand-mark">Virtual Tabla</span>
        </div>
      </div>

      {isLandscape ? (
        <div className="mobile-player-shell">
          <div className="mobile-bol-cluster mobile-bol-cluster-left">
            {MOBILE_LEFT_ZONES.map((zone) => {
              const stroke = strokesById[zone.id];
              const isActive = activeStrokeIds.includes(zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={`mobile-bol-button ${zone.className} ${isActive ? "is-active" : ""}`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    onStrike(stroke);
                  }}
                >
                  {stroke.label}
                </button>
              );
            })}
          </div>

          <div className="mobile-center-stage">
            <div className={`stage-surface mobile-stage-surface ${activeStrokeIds.length ? "pulse" : ""}`}>
              <TablaImage
                isBayanActive={isBayanActive}
                isDayanActive={isDayanActive}
                sparkleBursts={sparkleBursts}
              />
            </div>

            <div className="mobile-controls">
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
          </div>

          <div className="mobile-bol-cluster mobile-bol-cluster-right">
            {MOBILE_RIGHT_ZONES.map((zone) => {
              const stroke = strokesById[zone.id];
              const isActive = activeStrokeIds.includes(zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={`mobile-bol-button ${zone.className} ${isActive ? "is-active" : ""}`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    onStrike(stroke);
                  }}
                >
                  {stroke.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <RotatePhoneNotice />
      )}

      {recordingError ? <p className="recording-error">{recordingError}</p> : null}
    </section>
  );
}

export default MobilePlayer;
