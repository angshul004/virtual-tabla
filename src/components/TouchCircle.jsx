function TouchCircle({ side, zones, strokesById, activeStrokeIds, onStrike }) {
  return (
    <div className={`touch-circle ${side}`}>
      <div className="touch-circle-art" aria-hidden="true" />
      {zones.map((zone) => {
        const stroke = strokesById[zone.id];
        const isActive = activeStrokeIds.includes(zone.id);
        return (
          <button
            key={zone.id}
            type="button"
            className={`touch-zone ${zone.className} ${isActive ? "is-active" : ""}`}
            onPointerDown={(event) => {
              event.preventDefault();
              onStrike(stroke);
            }}
            aria-label={stroke.label}
          >
            <span className="touch-zone-label">{stroke.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TouchCircle;
