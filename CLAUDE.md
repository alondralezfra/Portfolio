# Portfolio: how to work in this repo

A single-page portfolio themed as a panadería-café. Projects are breads on a tray, job experience is the drinks menu, "Our Story" is a corkboard about me. Design and decisions: `docs/design-spec.md`, `docs/decisions/`.

## The loop: follow it for EVERY change

1. **Understand.** Read `docs/design-spec.md` and the code you will touch. If the request conflicts with the spec or an open question is involved, ask before building.
2. **Ask first.** For anything beyond a trivial fix, think the change through *before* writing code, then ask the questions that are genuinely mine to answer (look and feel, copy, scope, trade-offs) with AskUserQuestion: 2-4 focused questions, recommended option first, each saying what it changes. Don't ask what the spec already answers or things with a conventional default: decide those yourself and list them as assumptions in your reply. Skip this for small bug fixes, refactors with no behaviour change, and doc edits.
3. **Decide small.** For a real technical choice (library, data shape, pattern), add a decision record in `docs/decisions/` (next number, template in its README).
4. **Tests with the code.** New logic: unit tests (Vitest) including edge and empty cases. New or changed UI: a Cypress test in `cypress/e2e/` for any user flow, and keep the axe accessibility checks passing. A bug: write the failing regression test first, watch it fail, then fix.
5. **Implement** within the rules below.
6. **Update docs in the same change:** `docs/design-spec.md` if behaviour or a decision changed, `CHANGELOG.md` under **Unreleased**, `README.md` if the feature list changed. Docs describe what the site does *now*; never leave stale statements.
7. **Verify.** While working, run `npm run verify:quick` and targeted tests (`npx vitest run <file>`). **Do not run the full `npm run verify` or `npm run test:e2e` yourself**: the Stop hook (`scripts/stop-gate.mjs`) runs the full gate when you finish a turn and will not let the turn end while it fails, so fix the root cause and finish again. CI runs it a second time on the pull request. The full suite runs exactly twice: once by the hook, once in CI.
8. **Look at it.** For UI changes, say plainly whether you actually looked at it at phone (390px) and desktop width, in light and dark mode. Passing tests don't prove it looks right. If you couldn't look, say so.
9. **Review your own diff** against the checklist below.
10. **Report honestly:** what changed, tests added, docs updated, assumptions made without asking, and anything you couldn't verify. Never say "done" while a quick check or targeted test fails, and say that the full `verify` runs when the turn ends.

## Branches and commits

- **Start each piece of work on a fresh branch from an up-to-date `main`**: `git checkout main && git pull --ff-only`, then `git checkout -b <type>/<what>` with type `feature/`, `fix/`, `refactor/`, `docs/` or `chore/`. Do this *before* the first edit, and run `git branch --show-current` at the start of every task: if the branch is merged, unrelated or named for something else, don't continue on it.
- **One branch = one logical change** that can be reviewed, merged and reverted on its own. If scope grows, stop and split it. An unrelated finding gets its own branch, not a drive-by edit.
- **Commit small, focused steps**, staging only the files of that change. **Commits only happen when I ask**, so say when a unit of work is verified and ready.
- **I open and merge pull requests** (`gh` is not installed). When a branch is ready, push it only if asked, and give me a PR title, a description and the link `https://github.com/alondralezfra/Portfolio/compare/main...<branch>?expand=1`. Merge with a merge commit (not squash). CI runs on pull requests and on pushes to `main`; pushes to `main` also deploy to GitHub Pages.
- **After a merge:** `git checkout main && git pull --ff-only`, confirm the merge is there, delete the merged local branch with `git branch -d`, then start the next branch. Ask before deleting anything on the remote.

## Never

- Never weaken, skip (`.skip`, `.only`), loosen or delete a test to make something pass. Remove a test only when the behaviour it covers is deliberately removed, and say so in the changelog.
- Never disable the Stop hook, or edit `scripts/` or `.claude/settings.json` to dodge a check (change them only when deliberately changing the process, and tell me).
- Never commit unless I ask. When committing: one logical change, imperative subject line, body explains why.
- Never push to `main`, force-push, merge a pull request, or delete a remote branch unless I explicitly ask. Pushing a feature branch also waits for me to ask.
- Never leave placeholder content looking real: every placeholder is marked `TODO` in the data so it is easy to find (`grep -r TODO src/data`).

## Architecture rules

- **Accessibility is a hard rule, not polish.** The plain list view is the real content. The illustrated tray is a presentation layer over the same data, never a separate source of content.
  - Everything works by keyboard with visible focus; interactive targets are at least 40px.
  - Contrast is WCAG AA or better in both themes. Never use color alone to carry meaning.
  - Every non-decorative image has alt text (from the data); decorative ones are `aria-hidden`.
  - Respect `prefers-reduced-motion`: no animation without a way to switch it off.
  - Use native elements and the WAI-ARIA patterns (tabs, radio group, `details`, dialog); don't invent widgets.
  - Cypress runs axe on every section.
- **Content lives in `src/data/*.json`**, typed in `src/model.ts`. Components never hardcode copy. Each project or job has `summary` (light), `description` (medium) and `details` (deep).
- **Pure logic goes in `src/menu.ts`** (no React, no DOM) with unit tests; components stay thin.
- **Colors only through the tokens in `styles/styles.css`** (`--color-*`). Never hex values in components. The palette and its contrast ratios are documented in the stylesheet header and `docs/design-spec.md`.
- **Components:** reuse before writing new markup. Add a *prop or variant* to an existing component rather than a near-duplicate; add a new component when a pattern appears a second time or has accessibility rules worth solving once. Don't use raw symbols (✕ ▾) as icons.
- **Good habits:** one source of truth for any value or rule; derive state instead of storing it twice; no premature abstraction (extract on the second use); no dead code or leftover debugging.

## Self-review checklist (step 9)

- Does every new behaviour have a test that would fail without it, including empty and error states?
- Accessible names on every control? Keyboard works, focus sensible, tab order sane (hidden panels out of the tab order)?
- Works at 390px wide and at desktop? No horizontal scroll?
- Light and dark theme both fine (tokens only)?
- Reused existing components and tokens? No copied class strings or markup?
- Any new copy or art that is a placeholder is marked `TODO`?
- Docs, changelog and README updated and accurate?
- No leftover debugging, dead code or unrelated edits.

## Commands

`npm run dev` (app on :5173) · `npm run verify:quick` (unit tests + type-check + build) · `npm test` (Vitest) · `npm run typecheck` · `npm run build` · `npm run verify` and `npm run test:e2e` (full gate, run by the Stop hook and CI, not by Claude).

## Environment notes

Windows + Git Bash/PowerShell. If Vitest fails with "Cannot read properties of undefined (reading 'config')", the working directory has a lower-case drive letter: run through `npm run verify:quick` (it normalizes the path) or start the shell from `C:\...`. E2E serves the production build with `vite preview` on port 4173 (don't leave something else on that port). Put scratch files in the session scratchpad, not the repo.
