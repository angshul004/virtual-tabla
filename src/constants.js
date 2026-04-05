const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const STROKES = [
  { id: "na", label: "Na", key: "M", drum: "dayan", hand: "Right", file: assetUrl("assets/audio/na.wav"), glow: "#f7b267" },
  { id: "tin", label: "Tin", key: "J", drum: "dayan", hand: "Right", file: assetUrl("assets/audio/tin.wav"), glow: "#9cc5a1" },
  { id: "te", label: "Te", key: "L", drum: "dayan", hand: "Right", file: assetUrl("assets/audio/te.wav"), glow: "#7fb7be" },
  { id: "tte", label: "Tte", key: "K", drum: "dayan", hand: "Right", file: assetUrl("assets/audio/tte.wav"), glow: "#f6bd60" },
  { id: "ge", label: "Ge", key: "X", drum: "bayan", hand: "Left", file: assetUrl("assets/audio/ge.wav"), glow: "#d8a7ca" },
  { id: "ghe", label: "Ghe", key: "S", drum: "bayan", hand: "Left", file: assetUrl("assets/audio/ghe.wav"), glow: "#b8c0ff" },
  { id: "ke", label: "Ke", key: "A", drum: "bayan", hand: "Left", file: assetUrl("assets/audio/ke.wav"), glow: "#f4845f" }
];

const DEFAULT_BINDINGS = STROKES.reduce((map, stroke) => {
  map[stroke.id] = stroke.key;
  return map;
}, {});

const MOBILE_LEFT_ZONES = [
  { id: "ke", className: "left-top" },
  { id: "ge", className: "left-middle" },
  { id: "ghe", className: "left-bottom" }
];

const MOBILE_RIGHT_ZONES = [
  { id: "tte", className: "right-tip" },
  { id: "te", className: "right-top" },
  { id: "na", className: "right-middle" },
  { id: "tin", className: "right-bottom" }
];

export { assetUrl, STROKES, DEFAULT_BINDINGS, MOBILE_LEFT_ZONES, MOBILE_RIGHT_ZONES };
