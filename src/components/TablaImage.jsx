import { assetUrl } from "../constants";

function TablaImage({ isBayanActive, isDayanActive, sparkleBursts }) {
  return (
    <div className="tabla-image-stage">
      <div className={`drum-hit-glow left ${isBayanActive ? "is-active" : ""}`} />
      <div className={`drum-hit-glow right ${isDayanActive ? "is-active" : ""}`} />
      <div className="sparkle-layer" aria-hidden="true">
        {sparkleBursts.map((sparkle) => (
          <span
            key={sparkle.id}
            className={`sparkle-bol ${sparkle.side}`}
            style={{
              "--sparkle-x": `${sparkle.xOffset}px`,
              "--sparkle-delay": `${sparkle.delay}ms`,
              "--sparkle-rotate": `${sparkle.rotate}deg`,
              "--sparkle-glow": sparkle.color
            }}
          >
            <span className="sparkle-dot" />
            <span className="sparkle-label">{sparkle.label}</span>
          </span>
        ))}
      </div>
      <img
        src={assetUrl("assets/images/tabla_transparent.png")}
        alt="Virtual tabla"
        className={`tabla-image ${isBayanActive ? "left-active" : ""} ${isDayanActive ? "right-active" : ""}`}
      />
    </div>
  );
}

export default TablaImage;
