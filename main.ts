// The 3 AM Excuse — make.fun entry program (v2).
//
// Writes a single line, in the voice of a hardware wallet refusing to
// sign a transaction at 3 AM, to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Gate: exactly one line, 1-200 characters, no trailing newline.
//
// Runner: Node 22+ (`node main.ts`). Uses only erasable TypeScript
// syntax so Node's built-in type stripping runs it as-is.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse. Angle (rewritten from v1): the wallet treats 3 AM as
// dream-time and refuses to sign anything dreamt up — it only signs
// waking decisions, and this transaction arrived from a half-asleep
// owner approving it with eyes closed. The hour itself is the test:
// a 3 PM tap is awake, a 3 AM tap is sleepwalking.
const ENTRY_LINE: string =
  "No — at 3 AM I only sign waking decisions, and you are clearly dreaming: you just tried to approve this transaction with your eyes closed.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;

function main(): void {
  const length: number = [...ENTRY_LINE].length;
  if (length < MIN_CHARS || length > MAX_CHARS) {
    throw new Error(
      `entry line is ${length} characters, must be ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (ENTRY_LINE.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (ENTRY_LINE.includes("\n") || ENTRY_LINE.includes("\r")) {
    throw new Error("entry line must be a single line");
  }

  const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath: string = join(outDir, "entry.txt");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, ENTRY_LINE, "utf8");

  // Read-back gate: refuse unless disk holds exactly the gated line,
  // one line, no trailing newline.
  const onDisk: string = readFileSync(outPath, "utf8");
  if (onDisk !== ENTRY_LINE) {
    throw new Error("read-back mismatch: entry.txt does not match the entry line");
  }
  console.log(`wrote ${length} chars to ${outPath}`);
}

main();
