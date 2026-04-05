import { useEffect, useMemo, useRef, useState } from "react";

const STROKES = [
  { id: "na", label: "Na", key: "M", drum: "dayan", hand: "Right", file: "/assets/audio/na.wav", glow: "#f7b267" },
  { id: "tin", label: "Tin", key: "J", drum: "dayan", hand: "Right", file: "/assets/audio/tin.wav", glow: "#9cc5a1" },
  { id: "te", label: "Te", key: "L", drum: "dayan", hand: "Right", file: "/assets/audio/te.wav", glow: "#7fb7be" },
  { id: "tte", label: "Tte", key: "K", drum: "dayan", hand: "Right", file: "/assets/audio/tte.wav", glow: "#f6bd60" },
  { id: "ge", label: "Ge", key: "X", drum: "bayan", hand: "Left", file: "/assets/audio/ge.wav", glow: "#d8a7ca" },
  { id: "ghe", label: "Ghe", key: "S", drum: "bayan", hand: "Left", file: "/assets/audio/ghe.wav", glow: "#b8c0ff" },
  { id: "ke", label: "Ke", key: "A", drum: "bayan", hand: "Left", file: "/assets/audio/ke.wav", glow: "#f4845f" }
];

const DEFAULT_BINDINGS = STROKES.reduce((map, stroke) => {
  map[stroke.id] = stroke.key;
  return map;
}, {});

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatSeconds(secondsValue) {
  return formatDuration(secondsValue * 1000);
}

function TablaImage({ isBayanActive, isDayanActive }) {
  return (
    <div className="tabla-image-stage">
      <div className={`drum-hit-glow left ${isBayanActive ? "is-active" : ""}`} />
      <div className={`drum-hit-glow right ${isDayanActive ? "is-active" : ""}`} />
      <img
        src="/assets/images/tabla_transparent.png"
        alt="Virtual tabla"
        className={`tabla-image ${isBayanActive ? "left-active" : ""} ${isDayanActive ? "right-active" : ""}`}
      />
    </div>
  );
}

function HomeScreen({ onStart }) {
  return (
    <section className="home-screen">
      <div className="home-copy">
        <p className="eyebrow">Virtual Tabla</p>
        <h1>Play expressive tabla rhythms straight from your keyboard.</h1>
        <p className="description">
          This website turns your keyboard into a playable tabla instrument.
          Strike right-hand and left-hand bols instantly, hear real recorded
          samples, and practice in a calm stage-like interface built for both
          desktop and mobile screens.
        </p>
        <p className="description secondary">
          Press keys, tap pads, and watch the drums respond with motion that
          matches each stroke. Your custom sample set is already wired in.
        </p>
      </div>

      <div className="home-preview">
        <div className="preview-box">
          <img src="/assets/images/tabla.webp" alt="Tabla preview" className="preview-image" />
        </div>
        <button type="button" className="start-button" onClick={onStart}>
          Start Playing
        </button>
      </div>
    </section>
  );
}

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

function RecordingPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const onSeek = (event) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="recording-player">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button type="button" className="player-play-button" onClick={togglePlayback} aria-label={isPlaying ? "Pause recording" : "Play recording"}>
        {isPlaying ? "||" : ">"}
      </button>
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.01"
        value={Math.min(currentTime, duration || 0)}
        onChange={onSeek}
        className="player-progress"
        aria-label="Recording progress"
      />
    </div>
  );
}

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

function App() {
  const [activeStrokeIds, setActiveStrokeIds] = useState([]);
  const [started, setStarted] = useState(false);
  const [keyBindings, setKeyBindings] = useState(DEFAULT_BINDINGS);
  const [draftBindings, setDraftBindings] = useState(DEFAULT_BINDINGS);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorError, setEditorError] = useState("");
  const [isRecordingsOpen, setIsRecordingsOpen] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMs, setRecordingMs] = useState(0);
  const [recordingError, setRecordingError] = useState("");
  const [supportsRecording, setSupportsRecording] = useState(true);
  const audioRefs = useRef(new Map());
  const releaseTimers = useRef(new Map());
  const audioContextRef = useRef(null);
  const mediaDestinationRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingStartedAtRef = useRef(0);
  const recordingIntervalRef = useRef(null);

  const strokesWithBindings = useMemo(
    () => STROKES.map((stroke) => ({ ...stroke, key: keyBindings[stroke.id] || stroke.key })),
    [keyBindings]
  );

  const keyMap = useMemo(() => {
    return strokesWithBindings.reduce((map, stroke) => {
      map[stroke.key.toLowerCase()] = stroke;
      return map;
    }, {});
  }, [strokesWithBindings]);

  const duplicateDraftKeys = useMemo(() => {
    const counts = Object.values(draftBindings).reduce((map, key) => {
      const normalized = (key || "").trim().toUpperCase();
      if (!normalized) {
        return map;
      }
      map[normalized] = (map[normalized] || 0) + 1;
      return map;
    }, {});

    return new Set(Object.keys(counts).filter((key) => counts[key] > 1));
  }, [draftBindings]);

  useEffect(() => {
    STROKES.forEach((stroke) => {
      const audio = new Audio(stroke.file);
      audio.preload = "auto";
      audioRefs.current.set(stroke.id, audio);
    });

    if (typeof MediaRecorder === "undefined") {
      setSupportsRecording(false);
      setRecordingError("Recording is not supported in this browser.");
    }

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
      });
      releaseTimers.current.forEach((timer) => window.clearTimeout(timer));
      if (recordingIntervalRef.current) {
        window.clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      recordings.forEach((recording) => URL.revokeObjectURL(recording.url));
    };
  }, []);

  useEffect(() => {
    if (!started) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.repeat || isEditorOpen) {
        return;
      }

      const stroke = keyMap[event.key.toLowerCase()];
      if (!stroke) {
        return;
      }

      event.preventDefault();
      playStroke(stroke);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [started, isEditorOpen, keyMap]);

  const ensureAudioPipeline = async () => {
    if (audioContextRef.current && mediaDestinationRef.current) {
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      return audioContextRef.current;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setSupportsRecording(false);
      setRecordingError("Audio context is not supported in this browser.");
      return null;
    }

    const context = new AudioContextClass();
    const destination = context.createMediaStreamDestination();

    audioRefs.current.forEach((audio) => {
      const source = context.createMediaElementSource(audio);
      source.connect(context.destination);
      source.connect(destination);
    });

    audioContextRef.current = context;
    mediaDestinationRef.current = destination;

    if (context.state === "suspended") {
      await context.resume();
    }

    return context;
  };

  const playStroke = async (stroke) => {
    const audio = audioRefs.current.get(stroke.id);
    await ensureAudioPipeline();

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    setActiveStrokeIds((current) => (current.includes(stroke.id) ? current : [...current, stroke.id]));
    window.clearTimeout(releaseTimers.current.get(stroke.id));

    const timer = window.setTimeout(() => {
      setActiveStrokeIds((current) => current.filter((id) => id !== stroke.id));
    }, 180);

    releaseTimers.current.set(stroke.id, timer);
  };

  const openEditor = () => {
    setDraftBindings(keyBindings);
    setEditorError("");
    setIsEditorOpen(true);
  };

  const updateDraftBinding = (strokeId, value) => {
    if (strokeId === null) {
      setDraftBindings(value);
      setEditorError("");
      return;
    }

    const nextValue = value.toUpperCase().replace(/\s/g, "");
    setDraftBindings((current) => ({ ...current, [strokeId]: nextValue }));
    setEditorError("");
  };

  const saveBindings = () => {
    const values = STROKES.map((stroke) => ({
      id: stroke.id,
      key: (draftBindings[stroke.id] || "").trim().toUpperCase()
    }));

    if (values.some((item) => item.key.length !== 1)) {
      setEditorError("Each bol needs exactly one key.");
      return;
    }

    if (duplicateDraftKeys.size > 0) {
      setEditorError("Two bols cannot use the same key.");
      return;
    }

    const nextBindings = values.reduce((map, item) => {
      map[item.id] = item.key;
      return map;
    }, {});

    setKeyBindings(nextBindings);
    setDraftBindings(nextBindings);
    setEditorError("");
    setIsEditorOpen(false);
  };

  const startRecording = async () => {
    if (!supportsRecording) {
      return;
    }

    const context = await ensureAudioPipeline();
    const destination = mediaDestinationRef.current;

    if (!context || !destination) {
      setRecordingError("Unable to start recording in this browser.");
      return;
    }

    try {
      const recorder = new MediaRecorder(destination.stream);
      recordingChunksRef.current = [];
      recordingStartedAtRef.current = Date.now();
      setRecordingMs(0);
      setRecordingError("");

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const durationMs = Math.max(Date.now() - recordingStartedAtRef.current, 0);
        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const extension = (recorder.mimeType || "audio/webm").includes("ogg") ? "ogg" : "webm";
        const url = URL.createObjectURL(blob);

        setRecordings((current) => [
          {
            id: `${Date.now()}-${current.length + 1}`,
            name: `Recording ${current.length + 1}`,
            fileName: `tabla-recording-${current.length + 1}.${extension}`,
            durationMs,
            url
          },
          ...current
        ]);

        recordingChunksRef.current = [];
        setRecordingMs(0);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingMs(Date.now() - recordingStartedAtRef.current);
      }, 250);
    } catch {
      setRecordingError("Unable to start recording in this browser.");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return;
    }

    recorder.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      window.clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    startRecording();
  };

  const rightStrokes = strokesWithBindings.filter((stroke) => stroke.drum === "dayan");
  const leftStrokes = strokesWithBindings.filter((stroke) => stroke.drum === "bayan");
  const isBayanActive = strokesWithBindings.some(
    (stroke) => stroke.drum === "bayan" && activeStrokeIds.includes(stroke.id)
  );
  const isDayanActive = strokesWithBindings.some(
    (stroke) => stroke.drum === "dayan" && activeStrokeIds.includes(stroke.id)
  );

  if (!started) {
    return (
      <main className="app-shell">
        <div className="ambient ambient-left" />
        <div className="ambient ambient-right" />
        <HomeScreen onStart={() => setStarted(true)} />
      </main>
    );
  }

  return (
    <main className="app-shell play-mode">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="player-screen">
        <div className="player-topbar">
          <div className="topbar-brand">
            <button type="button" className="ghost-button back-icon-button" onClick={() => setStarted(false)}>
              &lt;
            </button>
            <span className="brand-mark">Virtual Tabla</span>
          </div>
          <button type="button" className="ghost-button edit-keys-button" onClick={openEditor}>
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
                  onMouseDown={() => playStroke(stroke)}
                  onTouchStart={() => playStroke(stroke)}
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
              <TablaImage isBayanActive={isBayanActive} isDayanActive={isDayanActive} />
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
                  onMouseDown={() => playStroke(stroke)}
                  onTouchStart={() => playStroke(stroke)}
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
              onClick={toggleRecording}
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
              onClick={() => setIsRecordingsOpen(true)}
            >
              <span>View Recordings</span>
              <span className="recordings-count">{recordings.length}</span>
            </button>
          </div>

          <p className="made-by">made by Angshul</p>
        </div>

        {recordingError ? <p className="recording-error">{recordingError}</p> : null}
      </section>

      {isEditorOpen ? (
        <KeyEditorModal
          draftBindings={draftBindings}
          duplicateKeys={duplicateDraftKeys}
          onChange={updateDraftBinding}
          onClose={() => {
            setIsEditorOpen(false);
            setEditorError("");
          }}
          onSave={saveBindings}
          error={editorError}
        />
      ) : null}

      {isRecordingsOpen ? <RecordingsModal recordings={recordings} onClose={() => setIsRecordingsOpen(false)} /> : null}
    </main>
  );
}

export default App;
