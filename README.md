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

## Deploy To GitHub Pages From Main

This project is configured to deploy using GitHub Pages settings from the `main` branch and the `/docs` folder.

Published URL:

```text
https://angshul004.github.io/virtual-tabla/
```

### One-time GitHub setup

1. Push this project to your `main` branch.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/docs`
5. Save.

### Each time you want to publish updates

1. Build the site:

```bash
npm run build
```

2. Commit the updated `docs` folder and your source changes:

```bash
git add .
git commit -m "Update site"
git push origin main
```

After GitHub finishes publishing, your site will be live at:

```text
https://angshul004.github.io/virtual-tabla/
```

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
docs/
index.html
package.json
vite.config.js
```
