// Writes the Android waitlist to waitlist.csv (email, lang, created_at).
// Usage: npm run waitlist:csv
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const out = execFileSync(
  "npx",
  ["wrangler", "d1", "execute", "river-waitlist", "--remote", "--json",
   "--command", "SELECT email, lang, created_at FROM waitlist ORDER BY created_at"],
  { encoding: "utf8" },
);
const rows = JSON.parse(out)[0].results;
const cell = (v) => `"${String(v).replace(/"/g, '""')}"`;
const csv = ["email,lang,created_at", ...rows.map((r) => [r.email, r.lang, r.created_at].map(cell).join(","))].join("\n");
writeFileSync("waitlist.csv", csv + "\n");
console.log(`Wrote ${rows.length} signups to waitlist.csv`);
