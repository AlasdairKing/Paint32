# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

**Paint32** is a static vanilla HTML/CSS/JS app under `src/`. There is no build step, backend, or `npm start` script. End-to-end testing only needs a static file server plus a browser.

### Running the app

From the repo root (after `npm install` for dev tools):

```bash
npx --yes serve src -l 3000
```

Then open `http://localhost:3000`. Alternatives: `python3 -m http.server 3000 --directory src`, or VS Code Live Server with `src/` as the web root (see `readme.md`).

Use a **tmux** session for long-running dev servers (e.g. session name `paint32-dev-server`).

### Lint and format

No npm scripts are defined; run tools via `npx`:

| Tool | Command |
|------|---------|
| ESLint | `npx eslint src/paint.js` |
| Stylelint | `npx stylelint "src/**/*.css"` |
| HTMLHint | `npx htmlhint src/index.html` |
| Prettier | `npx prettier --check .` |

**ESLint note:** `SetColour`, `New`, `Save`, and `CheckPictureName` are reported as unused because they are invoked from `index.html` `onclick` / `onkeyup` handlers, not from other JS. Stylelint and HTMLHint pass on a clean checkout.

### Tests

`npm test` is a placeholder and exits with an error. There is no automated test suite in this repo.

### Services

| Service | Required | Notes |
|---------|----------|--------|
| Static HTTP server | Yes | Serves `src/` |
| Browser | Yes | Manual or automation for draw/save flows |
| Node/npm | Optional | Dev dependencies only |

No Docker, database, or API services.
