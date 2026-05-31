# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

**Paint32** is a client-only static web app for drawing 32×32 pixel sprites and exporting transparent PNGs. There is no backend, database, or build step.

### Services

| Service | Required? | Notes |
|---------|-----------|--------|
| Static HTTP server on `src/` | **Yes** | Do not open `index.html` via `file://`; Save/download needs HTTP. |
| Apache `.htaccess` | No | Private-hosting only (`src/.htaccess`); ignored on GitHub Pages. |
| GitHub Pages | Optional | Deploy workflow publishes `src/`; see `readme.md`. |
| Service worker | No | `src/service-worker.js` exists but is not registered in the app. |

### Dependency refresh

From repo root: `npm install` (dev tools only: ESLint, Stylelint, HTMLHint, Prettier).

### Lint / format

Run from repo root (see `readme.md`):

- `npx eslint src/paint.js src/service-worker.js`
- `npx stylelint "src/**/*.css"`
- `npx htmlhint src/index.html`
- `npx prettier --check src/`

**Note:** ESLint may report `no-unused-vars` for functions like `New`, `Save`, and `SetColour` that are invoked from HTML `onclick` handlers in `src/index.html` — this is expected for this codebase.

### Tests

`npm test` is a placeholder and exits with an error (`no test specified`). There is no automated test suite.

### Run the app (development)

Serve the `src/` directory over HTTP, for example:

```bash
npx --yes serve /workspace/src -l 5173
```

Then open `http://127.0.0.1:5173/`. VS Code Live Server on `src/` is the workflow documented in `readme.md`.

Use **tmux** for long-running dev servers in Cloud Agent VMs (see environment setup conventions).

### Hello-world verification

1. Open the app in a browser.
2. Pick a palette color and paint a few pixels on the grid.
3. Click **Save** and confirm a PNG download (default name from the name field, e.g. `Sprite.png`).
