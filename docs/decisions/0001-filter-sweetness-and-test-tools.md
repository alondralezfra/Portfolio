# 0001: Filter semantics, sweetness control and test tools

## Context
The remake needs a technology filter, a level-of-detail control and automated tests that run on every change.

## Decision
- **Filter:** a dish matches when it uses *all* selected ingredients (AND). It narrows as you add ingredients, matching the "ingredients" metaphor. Pure function `filterByStack` in `src/menu.ts`.
- **Sweetness:** a radio group (three labelled options), not a range slider: native keyboard and screen-reader support, and each level has a text label.
- **Tests:** Vitest for pure logic; Cypress (already used) for flows, with `cypress-axe` for accessibility. e2e runs against the production build served by `vite preview` (`start-server-and-test`).
- **Gate:** `npm run verify` runs unit tests, type-check + build, then e2e. A Stop hook runs it when Claude finishes a turn; CI runs it on pull requests.

## Consequences
AND can return no dishes; an explicit message and a clear button cover that. No linter yet; add one in its own change.
