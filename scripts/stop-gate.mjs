// Claude Code "Stop" hook: when Claude is about to finish a turn, make sure the
// uncommitted work passes `npm run verify`. If it doesn't, Claude is sent back
// to fix it instead of finishing. This is the ONLY place the full verify runs
// locally (CI runs it again on the pull request), so Claude must not run it itself.
//
// Skips instantly when nothing code-related changed (a question, a docs-only edit).
//
// Exit codes (Claude Code hook protocol): 0 = allow stop, 2 = block with the message on stderr.

import { execSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  // no/invalid stdin: treat as a first-time stop
}

const changed = execSync("git -c core.quotepath=off status --porcelain", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .map((line) => line.slice(3).replace(/^"|"$/g, ""));

const needsVerify = changed.some(
  (f) =>
    /^(src|cypress|scripts|styles)\//.test(f) ||
    /^(package(-lock)?\.json|vite\.config\.js|cypress\.config\.ts|tsconfig\.json|index\.html)$/.test(f),
);
if (!needsVerify) process.exit(0);

const run = spawnSync("npm run --silent verify", { encoding: "utf8", shell: true, maxBuffer: 64 * 1024 * 1024 });
const tail = `${run.stdout ?? ""}${run.stderr ?? ""}`.split("\n").slice(-80).join("\n");

if (run.status === 0) {
  console.log(JSON.stringify({ systemMessage: "verify passed (unit tests, type-check, build, e2e + accessibility)." }));
  process.exit(0);
}

// Already sent back once this turn: don't trap Claude in a loop. Surface it to the user instead.
if (input.stop_hook_active) {
  console.log(JSON.stringify({ systemMessage: `WARNING: verify is still failing. This work is NOT done.\n${tail}` }));
  process.exit(0);
}

console.error(
  `Not done yet: \`npm run verify\` failed. Fix the root cause (do not weaken, skip or delete tests), then finish again.\n\n${tail}`,
);
process.exit(2);
