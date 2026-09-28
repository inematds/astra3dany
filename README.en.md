# astra3dany — a 3D world for teaching anything

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

[![astra3dany](guia/assets/banner.jpg)](https://inematds.github.io/astra3dany/guia/en/)

**Live:** https://inematds.github.io/astra3dany/app/ · **User guide:** https://inematds.github.io/astra3dany/guia/en/

A miniature “learning world” in the browser: three stations, a guide mascot, a paced World Tour, and free exploration.
Each station shows **an idea in action** (before → after) with a card explaining what you see, what’s happening, and what to remember.

The first world teaches **“AI in everyday life: three habits that prevent problems”**, in Portuguese, for adults who are starting to use AI at work:

| # | Station | Habit | What happens |
|---|---|---|---|
| 01 | The gate | Confirm before acting | A request is blocked and sent for review; the second passes the check, the gate opens, and the action runs |
| 02 | The drawers | Give context where the AI reads | The instruction card goes into the project drawer, and the two colleagues become connected |
| 03 | The audit | Check the source | The format passes; the audit corrects the total from 100 to 90 and leaves the date open |

It follows the **Build a Learning World** field guide recipe (Mark Kashef, Early AI Adopters community): six parts, camera pacing *arrive → approach → demonstrate → hold*, synchronized cards, and an acceptance checklist. The study material is in [`docs/`](docs/00-INDICE.md); the summary is in [`docs/05-sintese.md`](docs/05-sintese.md); the plan is in [`PLANO.md`](PLANO.md); the inspection evidence is in [`evidence/revisao.md`](evidence/revisao.md).

## 📖 User guide

Complete guide (landing page + walkthrough): **https://inematds.github.io/astra3dany/guia/en/**

## Installation

Prerequisites:

- **Node.js 20 or newer** (developed and tested with Node 24.13) and **npm**.
- A browser with **WebGL2** (Chrome, Edge, Firefox, Safari 15+). A dedicated GPU isn’t required, but it helps.
- No backend, API key, database, or Blender required: the site is 100% static.

```bash
git clone https://github.com/inematds/astra3dany.git
cd astra3dany/game
npm ci                 # installs exactly the versions in package-lock (Vite 8.2.2, Babylon.js 9.25.0)
npm run dev            # development server at http://127.0.0.1:43220
```

Other commands, always from inside `game/`:

| Command | What it does |
|---|---|
| `npm test` | 7 tests for the tour timeline and captions (`node --test`, no browser) |
| `npm run build` | generates the static site in **`../app/`** (relative paths, serves from any folder) |
| `npm run preview` | serves the build from `../app/` at http://127.0.0.1:43221 to inspect what will be published |

`npm run dev` works normally offline after `npm ci`; no assets come from a CDN.

## Usage

**Open:** https://inematds.github.io/astra3dany/app/ (or run `npm run dev`). Add `?diagnostics` to the URL to see fps, p95, and render resolution in the corner of the stage.

**World Tour** (orange button): ~60 guided seconds. For each station: arrival (3 s) → approach (3 s) → demonstration (6 s) → static result (5 s); at the end, a recap of the three habits.
- *Pause / Resume* freezes the camera and demonstration (also available with the space bar or the “Pause to read” link on the card).
- *Restart* returns to the beginning; *0,75× / 1×* changes the speed; *Exit* or `Esc` returns to the overview.
- On desktop, the card is on the right and the scene is rendered beside it; on mobile, the card is below. The card never covers the demonstration.

**Explore at your own pace:** click a pedestal (or buttons 01/02/03).
- *Get a closer look and run* moves the camera closer and runs the demonstration; *Repeat the demonstration* runs it again; *Wide view* pulls back; *Next station* advances; the third takes you to the recap.
- The card’s sentence changes along with what’s happening in the scene; at station 3, the values (total and date) also appear as text.

**Free camera** (outside the tour):

| Action | Mouse | Keyboard | Touch |
|---|---|---|---|
| Orbit | drag | arrow keys | one finger |
| Zoom in / out | wheel, + and − buttons | `+` / `-` | pinch |
| Pan | shift + drag, right or middle button | — | two fingers |
| Return to framing | *Reset* button | `R` | *Reset* button |

**Reduce motion:** respects the system’s `prefers-reduced-motion` setting and can be toggled at the top. When enabled, the camera jumps directly to each pose instead of animating; the demonstrations continue.

**Sources and credits:** link in the sidebar footer.

## Change the subject (teach something else)

1. Edit **`game/src/mundo.config.js`**: title, intro, audience, mascot, and the three stations (name, principle, explanation, sequence, timed demo observations, takeaway, camera poses). All site text comes from there.
2. If a station’s mechanics are different, create a module in `game/src/estacoes/` with the interface `{ reset(), update(demoTime), foco, pick }` and register it in `DEMOS` in `main.js`. The three existing modules are examples: they use physical metaphors that have already proven legible in close-up.
3. Run `npm test` (the tests read the config: duration, 5 s holds, phrases by phase) and inspect in the browser: wide view, close-up, demo, result, desktop, and mobile.

The guide’s rule: *change the subject, keep the recipe*. One station = one principle = one physical metaphor = one visible change.

## Known limitations

- **Procedural mascot.** Blender wasn’t available on the build machine (aarch64), so the Any mascot is generated in code (`game/src/mascote.js`). To use a Blender asset, export a GLB to `game/public/assets/`, point to `mascote.glb` in the config, and name the legs `Perna1..4` (or `Leg1..4`) to enable walking.
- **Size.** The main bundle is ~5.8 MB (1.2 MB gzip) because of Babylon.js; the first load on 4G takes a few seconds. There’s no code splitting yet.
- **Performance.** It was only measured in headless Chromium with software WebGL (25–35 fps), which doesn’t represent a real device. Expect 60 fps on a typical GPU; on older phones, reduce `hardwareScalingLevel` in `main.js` or turn off shadows in `palco.js`.
- **Not tested** on a physical device, Safari, or Firefox, or with real touch gestures (pinch was tested only in code).
- **No audio, no quiz, no live AI.** The demonstrations are deterministic animations; voice/music are planned for a future version.
- **One language.** Text is in Portuguese in the config; there’s no i18n.
- **Partial accessibility.** Buttons and panels are keyboard-navigable, and the tour card is `aria-live`, but the 3D scene itself has no alternative description beyond the cards.

## Publish

`npm run build` generates `app/` (static, relative paths). The repository is served by **GitHub Pages from the root of the `main` branch**, so just commit `app/` and `guia/` and push:

- App: `https://inematds.github.io/astra3dany/app/`
- Guide: `https://inematds.github.io/astra3dany/guia/en/`

It also works on Vercel, Netlify, or Here.Now by pointing to the `app/` folder. Always publish the build that was inspected with `npm run preview`.

## Structure

```
app/                          published static build (generated by npm run build)
guia/index.html               landing page + user guide (GitHub Pages)
game/index.html               layout, panels, and controls
game/src/main.js              engine, scene, state machine, tour, UI
game/src/mundo.config.js      WORLD DATA (subject, stations, text, camera)
game/src/tour.js              World Tour timeline and cues (no Babylon, tested)
game/src/palco.js             ground, pedestals, lights, shadows, text signs
game/src/mascote.js           procedural mascot / GLB loader
game/src/camera-controls.js   orbit, pan, zoom, keyboard, touch
game/src/estacoes/*.js        the three mechanics
game/tests/tour.test.mjs      7 timing and narration tests
evidence/                     screenshots and inspection review
docs/                         post, guide, prompt, transcript, summary
```

## Credits

Recipe, pacing, and checklist: [Build a Learning World](https://build-a-learning-world.markkashef.chatgpt.site/) and the [promptadvisers/early-ai-dopters](https://github.com/promptadvisers/early-ai-dopters) repo by Mark Kashef. This project reimplements the recipe with its own subject, text, mascot, and code. MIT License.
