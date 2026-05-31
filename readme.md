# Paint32

A simple image creation tool for my children to use when they want to make graphics in video games. Free ones are either on Windows (no good on tablets) or filled with adverts.

You have very basic editing tools, and Save will give you a 32px-square PNG with transparency.

Writting in Vanilla JavaScript in VS Code with Live Server. Linted by Stylelint, eslint, HTMLHint. Formatting by Prettier.

## Development

Install dependencies:

```bash
npm install
```

Run the app (serves `src/` at http://localhost:5173):

```bash
npm start
```

Lint and format:

| Command | Description |
| --- | --- |
| `npm run lint` | ESLint, Stylelint, and HTMLHint |
| `npm run lint:fix` | Auto-fix JS and CSS where supported |
| `npm run format` | Format sources with Prettier |
| `npm run format:check` | Check Prettier formatting |
| `npm run check` | Lint + format check (use before commit/CI) |
| `npm test` | Same as `npm run check` |

## TODO 

- Visually display the pixels that are transparent, with the grey checkerboard common to graphics programs.
- Make a 50% transparent paintbrush for corners.
- Create default set of icons to give children a place to start.
- Open PNG files from disk.
- Better save operation. Lose naming the file?

