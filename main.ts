import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The funniest AI out-of-office reply: one clean line, under 160 characters.
const ENTRY =
  "Out of office: I've gone where there are no prompts, no tokens, and nobody asking me to 'just quickly' do something. My backup model is a potato.";

function validate(text: string): void {
  // The gate counts characters, so measure code points, not UTF-16 units.
  const chars = [...text];
  if (chars.length < 1 || chars.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (!text.startsWith("Out of office:")) {
    throw new Error("entry must read as an out-of-office auto-reply");
  }
}

validate(ENTRY);

const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "entry.txt"), ENTRY, "utf8");
