# Virtual Tabla

A browser-based virtual tabla instrument built with React and Vite.

Users can:
- Play tabla bols with keyboard keys
- Use real tabla audio samples
- Edit key mappings in the UI
- Record performances in the current session
- View and download session recordings

## Features

- Responsive homepage and play screen
- Transparent tabla artwork with hit animation
- Keyboard mapping editor with duplicate-key protection
- Session-only recording support
- Custom styled recordings modal

## Default Keys

Right hand:
- J = Tin
- K = Tte
- L = Te
- M = Na

Left hand:
- A = Ke
- S = Ghe
- X = Ge

Tip:
- Press Ge + Na together to play Dha

## Audio Files

Place your audio files in:

```text
public/assets/audio
```

Expected filenames:

```text
na.wav
tin.wav
te.wav
tte.wav
ge.wav
ghe.wav
ke.wav
```

## Images

Image assets are stored in:

```text
public/assets/images
```

Current project images:
- `tabla.webp`
- `tabla_transparent.png`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deploy To GitHub Pages With GitHub Actions

This project is configured to deploy with GitHub Actions, so you do not need to commit a `docs` folder or any copied build assets.

Published URL:

```text
https://angshul004.github.io/virtual-tabla/
```

### One-time GitHub setup

1. Push this project to your `main` branch.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, set:
   - `Source`: `GitHub Actions`
5. Save.

### How publishing works

- Every push to `main` triggers the workflow in `.github/workflows/deploy.yml`.
- GitHub installs dependencies, builds the app, and deploys the generated `dist` folder.
- Your source assets remain only in the normal project folders.

### Publish updates

```bash
git add .
git commit -m "Update site"
git push origin main
```

After the workflow finishes, your site will update automatically.

## Tech Stack

- React
- Vite
- HTML/CSS
- Web Audio / MediaRecorder browser APIs

## Notes

- Recordings are stored only for the current browser session.
- Refreshing the page clears session recordings.
- Recording support depends on browser support for `MediaRecorder`.

## Project Structure

```text
src/
  App.jsx
  main.jsx
  styles.css
public/
  assets/
    audio/
    images/
.github/
  workflows/
    deploy.yml
index.html
package.json
vite.config.js
```
