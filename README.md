# Joshua Cher — Portfolio Prototype

A character-select portfolio that combines three interactive concepts on a fully
decoupled, token-driven architecture.

## The three concepts

1. **Select Your Character dashboard** (`js/home.js`) — three persona cards filter
   the project feed; matches rise to the top, others collapse. State lives in
   `js/store.js` so it survives theme changes and page navigation.
2. **Progress-Bar Reading Quest** (`js/quest.js`) — each case study is mapped to a
   4-phase project lifecycle. A sticky sidebar checks off milestones as you scroll;
   100% unlocks confetti + the "Download Full Project PDF" button.
3. **4-Theme Cheat-Code Toggle** (`js/theme.js`) — type `/cyber`, `/cosmic`,
   `/arcade` (or `/matrix`, `/space`, `/8bit`) in the footer terminal. `/exit`,
   `/default`, `/reset`, or the Reset button restores the Enterprise theme.

## Architecture (decoupled by design)

```
css/tokens.css   → THEME layer   (all colours/fonts/borders, per data-theme)
css/styles.css   → STRUCTURE     (theme-blind components; consumes var() only)
js/data.js       → CONTENT       (the only file you edit to update the site)
js/store.js      → STATE         (theme + filter, persisted to localStorage)
js/theme.js      → Concept 3 engine
js/home.js       → Concept 1 controller (index.html)
js/quest.js      → Concept 2 controller (project.html?p=<id>)
```

Switching themes only swaps `data-theme` on `<html>`; the HTML and layout never
change — only tokens do.

## Edit your content

Everything lives in **`js/data.js`**: `PROFILE`, the three `PERSONAS`, and the
`PROJECTS` array (each tagged to personas and carrying its 4 quest phases).
See the comments at the top of that file.

## Run locally

Needs a static server (ES modules + fetch-free, but `localStorage`/observers want
`http://`, not `file://`):

```bash
# any of these from the project root
python -m http.server 8080
# then open http://localhost:8080
```

## Accessibility

- Pinned header with About / Projects / Contact + Resume on every page.
- All persona cards, theme pills, quest nodes, and the terminal are real
  `<button>`/`<input>` elements — keyboard focusable, `Tab` + `Enter` operable.
- Visible focus rings, a skip link, `aria-pressed` on toggles, `aria-live` status.
- Respects `prefers-reduced-motion`.
