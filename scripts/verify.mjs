// The one command that decides whether a change is "done".
//
//   npm run verify         everything (required before a change counts as implemented)
//   npm run verify:quick   skips the browser (e2e) tests; for iterating, NOT for sign-off
//
// Steps run cheapest first and stop at the first failure.
// e2e serves the production build, so the build step runs before it.

import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";

// On Windows a lower-case drive letter (c:\...) can make tools load themselves twice.
// Use the canonical spelling for this process and every step it starts.
try {
  process.chdir(realpathSync.native(process.cwd()));
} catch {
  // keep the directory we were started in
}

const quick = process.argv.slice(2).includes("--quick");

const steps = [
  { name: "Unit tests", cmd: "npm run --silent test" },
  { name: "Type-check + production build", cmd: "npm run --silent build" },
  ...(quick ? [] : [{ name: "End-to-end tests + accessibility (real browser)", cmd: "npm run --silent test:e2e" }]),
];

const results = [];
for (const [i, step] of steps.entries()) {
  console.log(`\n== [${i + 1}/${steps.length}] ${step.name}`);
  const started = Date.now();
  const r = spawnSync(step.cmd, { stdio: "inherit", shell: true });
  results.push({ name: step.name, ok: r.status === 0, seconds: ((Date.now() - started) / 1000).toFixed(1) });
  if (r.status !== 0) break;
}

console.log("\n== verify summary");
for (const r of results) console.log(`  ${r.ok ? "PASS" : "FAIL"}  ${r.name} (${r.seconds}s)`);
if (quick) console.log("  (quick mode: e2e skipped; the full verify runs when Claude finishes a turn, and in CI on the pull request)");

const failed = results.find((r) => !r.ok);
if (failed) {
  console.error(`\nverify FAILED at: ${failed.name}`);
  process.exit(1);
}
console.log("\nverify passed.");
