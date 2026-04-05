# Virtual Tabla

A browser-based virtual tabla instrument built with React and Vite.

# Screenshot
<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/c92a8e01-1142-493b-a43b-983072cf2851" />


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


## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```


## Open the app from this link


Published URL:

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
.github/
  workflows/
    deploy.yml
index.html
package.json
vite.config.js
```
