import { assetUrl } from "../constants";

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
          <img src={assetUrl("assets/images/tabla.webp")} alt="Tabla preview" className="preview-image" />
        </div>
        <button type="button" className="start-button" onClick={onStart}>
          Start Playing
        </button>
      </div>
    </section>
  );
}

export default HomeScreen;
