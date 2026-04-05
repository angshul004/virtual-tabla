import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import KeyEditorModal from "./components/KeyEditorModal";
import RecordingsModal from "./components/RecordingsModal";
import { DEFAULT_BINDINGS, STROKES } from "./constants";

const HomeScreen = lazy(() => import("./pages/HomeScreen"));
const DesktopPlayer = lazy(() => import("./pages/DesktopPlayer"));
const MobilePlayer = lazy(() => import("./pages/MobilePlayer"));

function App() {
  const [activeStrokeIds, setActiveStrokeIds] = useState([]);
  const [sparkleBursts, setSparkleBursts] = useState([]);
  const [started, setStarted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
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
  const sparkleTimersRef = useRef(new Map());
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

  const strokesById = useMemo(
    () => strokesWithBindings.reduce((map, stroke) => {
      map[stroke.id] = stroke;
      return map;
    }, {}),
    [strokesWithBindings]
  );

  const keyMap = useMemo(
    () => strokesWithBindings.reduce((map, stroke) => {
      map[stroke.key.toLowerCase()] = stroke;
      return map;
    }, {}),
    [strokesWithBindings]
  );

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
    const mobileQuery = window.matchMedia("(max-width: 900px), (pointer: coarse)");
    const landscapeQuery = window.matchMedia("(orientation: landscape)");
    const userAgentBlocked = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    const updateDeviceState = () => {
      setIsMobileDevice(mobileQuery.matches || userAgentBlocked);
      setIsLandscape(landscapeQuery.matches);
    };

    updateDeviceState();

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", updateDeviceState);
      landscapeQuery.addEventListener("change", updateDeviceState);
      return () => {
        mobileQuery.removeEventListener("change", updateDeviceState);
        landscapeQuery.removeEventListener("change", updateDeviceState);
      };
    }

    mobileQuery.addListener(updateDeviceState);
    landscapeQuery.addListener(updateDeviceState);
    return () => {
      mobileQuery.removeListener(updateDeviceState);
      landscapeQuery.removeListener(updateDeviceState);
    };
  }, []);

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
      sparkleTimersRef.current.forEach((timer) => window.clearTimeout(timer));
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
    if (!started || isMobileDevice) {
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
  }, [started, isEditorOpen, isMobileDevice, keyMap]);

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

  const spawnSparkleBurst = (stroke) => {
    const burstId = `${stroke.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const sparkle = {
      id: burstId,
      label: stroke.label,
      side: stroke.drum === "bayan" ? "left" : "right",
      color: stroke.glow,
      xOffset: Math.round((Math.random() - 0.5) * 48),
      delay: Math.round(Math.random() * 90),
      rotate: Math.round((Math.random() - 0.5) * 18)
    };

    setSparkleBursts((current) => [...current, sparkle]);
    const timer = window.setTimeout(() => {
      setSparkleBursts((current) => current.filter((item) => item.id !== burstId));
      sparkleTimersRef.current.delete(burstId);
    }, 1050);
    sparkleTimersRef.current.set(burstId, timer);
  };

  const playStroke = async (stroke) => {
    if (!stroke) {
      return;
    }

    const audio = audioRefs.current.get(stroke.id);
    await ensureAudioPipeline();

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    spawnSparkleBurst(stroke);
    setActiveStrokeIds((current) => (current.includes(stroke.id) ? current : [...current, stroke.id]));
    window.clearTimeout(releaseTimers.current.get(stroke.id));

    const timer = window.setTimeout(() => {
      setActiveStrokeIds((current) => current.filter((id) => id !== stroke.id));
    }, 180);

    releaseTimers.current.set(stroke.id, timer);
  };

  const handleStart = async () => {
    setStarted(true);
    if (isMobileDevice && screen.orientation?.lock) {
      try {
        await screen.orientation.lock("landscape");
      } catch {
        // Browsers often block orientation lock unless installed/fullscreen.
      }
    }
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

  return (
    <main className="app-shell play-mode">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <Suspense fallback={<div className="app-loading" />}>
        {!started ? (
          <HomeScreen onStart={handleStart} />
        ) : isMobileDevice ? (
          <MobilePlayer
            activeStrokeIds={activeStrokeIds}
            isBayanActive={isBayanActive}
            isDayanActive={isDayanActive}
            sparkleBursts={sparkleBursts}
            isRecording={isRecording}
            recordingMs={recordingMs}
            supportsRecording={supportsRecording}
            recordings={recordings}
            recordingError={recordingError}
            isLandscape={isLandscape}
            strokesById={strokesById}
            onBack={() => setStarted(false)}
            onToggleRecording={toggleRecording}
            onOpenRecordings={() => setIsRecordingsOpen(true)}
            onStrike={playStroke}
          />
        ) : (
          <DesktopPlayer
            activeStrokeIds={activeStrokeIds}
            isBayanActive={isBayanActive}
            isDayanActive={isDayanActive}
            sparkleBursts={sparkleBursts}
            leftStrokes={leftStrokes}
            rightStrokes={rightStrokes}
            isRecording={isRecording}
            recordingMs={recordingMs}
            supportsRecording={supportsRecording}
            recordings={recordings}
            recordingError={recordingError}
            onBack={() => setStarted(false)}
            onOpenEditor={openEditor}
            onToggleRecording={toggleRecording}
            onOpenRecordings={() => setIsRecordingsOpen(true)}
            onStrike={playStroke}
          />
        )}
      </Suspense>

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
