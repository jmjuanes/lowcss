import { writeFileSync } from "node:fs";
import { join } from "node:path";
import utilities from "../config/utilities.json" with { type: "json" };

// group utilities by category, preserving first-seen order
const byCategory = new Map();
for (const u of utilities) {
    const cat = u.category || "uncategorized";
    if (!byCategory.has(cat)) {
        byCategory.set(cat, []);
    }
    byCategory.get(cat).push(u);
}

// initialize output lines
const lines = [
    "# Utilities reference",
    "",
    "_Auto-generated from `utilities.json` — do not edit by hand._",
    "",
];

for (const [category, items] of byCategory) {
    lines.push(`## ${category}`, "");
    for (const u of items) {
        const example = u.className.replace("{key}", Object.keys(u.values || {})[0] || "1");
        lines.push(`### \`${example}\``);
        lines.push("");
        lines.push(u.description || "");
        lines.push("");
        lines.push(`- **CSS properties:** \`${u.properties.join("`, `")}\``);
        if (u.variants && u.variants.length) {
            lines.push(`- **Variants:** \`${u.variants.join("`, `")}\``);
        }
        if (u.url) {
            lines.push(`- **MDN:** ${u.url}`);
        }
        lines.push("");
    }
}

const OUTPUT = join(process.cwd(), "UTILITIES.md");
writeFileSync(OUTPUT, lines.join("\n"));
console.log(`✓ built UTILITIES.md`);
