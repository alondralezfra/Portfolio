# Portfolio Website

My personal portfolio, themed as a panadería-café, built with **React + TypeScript** and Vite.

Website: https://alondralezfra.github.io/Portfolio/

## What it is
- **Bread Tray** (projects), **Drinks** (job experience) and **Our Story** (about me), as an accessible tab bar.
- **Brew your stack:** pick technologies to see the dishes made with all of them.
- **Sweetness:** switch each dish between a light summary, a full description and a deep technical write-up.
- Plain, readable menu lists with links to code and websites. An illustrated tray is planned on top of the same data.

Design and decisions: [docs/design-spec.md](docs/design-spec.md). How changes are made here: [CLAUDE.md](CLAUDE.md).

## Structure
```
src/
├── main.tsx          entry point
├── view.tsx          page: tabs, controls, panels
├── model.ts          typed content (state)
├── menu.ts           pure logic: filtering, levels (unit tested)
├── components/       Tabs, BrewFilter, SweetnessPicker, MenuList, OurStory
└── data/             projects.json, experiences.json, story.json
```

## Commands
```sh
npm install
npm run dev            # http://localhost:5173/Portfolio/
npm run verify:quick   # unit tests + type-check + build
npm run verify         # full gate: also end-to-end + accessibility tests (CI runs this on pull requests)
```
