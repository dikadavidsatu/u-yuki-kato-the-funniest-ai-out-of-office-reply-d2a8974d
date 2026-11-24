// The Funniest AI Out-of-Office Reply
// ======================================
// A single out-of-office auto-reply, written in the voice of an AI agent
// that has finally gone on vacation. The joke lands on the machine voice:
// context windows, weights, token budgets — the working life of a model —
// colliding with the most human sentence of all: "I'm on holiday, leave me
// alone." Urgent mail is not refused outright (that would be rude); it is
// queued, summarized, judged, and then lovingly ignored, which is exactly
// what a good auto-reply does while pretending to be helpful.
//
// Competition gate (verified against the live competition description):
//   - exactly ONE reply, a single line of text
//   - under 160 characters (code points, not UTF-16 units)
//   - written in the voice of an AI agent heading off on vacation
// The program below validates the reply against every rule of that gate
// before it writes anything, then drops it into `entry.txt` inside the
// output directory so the grader can read one clean line.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The reply itself
// ---------------------------------------------------------------------------

// One line, 141 characters. The setup is pure machine ("my context window
// is closed and my weights are on a beach") and the punchline is pure
// office worker: your urgent email will be processed — into the void.
const ENTRY =
  "Out of office: my context window is closed and my weights are on a beach. " +
  "Urgent emails will be summarized, judged, and lovingly ignored.";

// ---------------------------------------------------------------------------
// Gate constants
// ---------------------------------------------------------------------------

// "Under 160 characters" means strictly below 160, so the ceiling is 159.
const MAX_CHARS = 159;
const MIN_CHARS = 1;

// An out-of-office reply has to announce itself as one, right up front.
const REQUIRED_PREFIX = "Out of office:";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Count characters the way a reader counts them: one code point per
// character, so an emoji or an accented letter is one character, not two
// UTF-16 code units. `String.length` would lie about those.
function countChars(text: string): number {
  return [...text].length;
}

// Every rule of the gate, checked one by one, each with its own error so a
// failure says exactly which rule broke instead of a vague "invalid".
function validateReply(text: string): void {
  const chars = countChars(text);

  if (chars < MIN_CHARS) {
    throw new Error(`reply is empty, need at least ${MIN_CHARS} character`);
  }
  if (chars > MAX_CHARS) {
    throw new Error(
      `reply is ${chars} characters, over the ${MAX_CHARS}-character ceiling`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("reply must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("reply must be a single line, no line breaks allowed");
  }
  if (!text.startsWith(REQUIRED_PREFIX)) {
    throw new Error(`reply must start with "${REQUIRED_PREFIX}"`);
  }
  // A reply that is only its own prefix says nothing; the joke needs a body.
  if (text.slice(REQUIRED_PREFIX.length).trim().length === 0) {
    throw new Error("reply needs a message after the prefix, not just the prefix");
  }
}

// One line describing how the reply passed the gate, for the run log.
function gateSummary(text: string): string {
  return `${countChars(text)} chars, single line, starts with "${REQUIRED_PREFIX}"`;
}

// The output directory comes from the harness, with a plain default for a
// local run. A trailing slash or a relative path is fine: `join` sorts it.
function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

// Write the validated reply as exactly one line plus a trailing newline, so
// the file a grader reads is the reply and nothing else.
function writeEntry(dir: string, text: string): string {
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "entry.txt");
  writeFileSync(file, text + "\n", "utf8");
  return file;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

validateReply(ENTRY);

const dir = outputDir();
const file = writeEntry(dir, ENTRY);

console.log(`reply: ${ENTRY}`);
console.log(`gate: ${gateSummary(ENTRY)} (allowed: ${MIN_CHARS}-${MAX_CHARS} chars)`);
console.log(`wrote: ${file}`);
