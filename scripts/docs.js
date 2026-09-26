//
// Generates docs/utilities.md and docs/theme.md directly from theme.json +
// utilities.json — the same files build.js reads. Uses the same
// resolveEntries() from lib.js that build.js uses to generate the actual
// CSS, so the documented class tables can never drift from what's really
// shipped in dist/low.css.
//

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { resolveEntries, resolveClassName } from "./lib.js";
import theme from "../config/theme.json" with { type: "json" };
import utilities from "../config/utilities.json" with { type: "json" };

// -----------------------------------------------------------------------
// UTILITIES.md
// -----------------------------------------------------------------------
const buildUtilitiesDoc = () => {
    const byCategory = new Map();
    for (const u of utilities) {
        const cat = u.category || "uncategorized";
        if (!byCategory.has(cat)) {
            byCategory.set(cat, []);
        }
        byCategory.get(cat).push(u);
    }

    const lines = [
        "# Utilities reference",
        "",
    ];

    for (const [category, items] of byCategory) {
        lines.push(`## ${category}`, "");
        for (const u of items) {
            lines.push(`### ${u.name}`, "");
            if (u.description) {
                lines.push(u.description, "");
            }
            lines.push(`- **CSS properties:** \`${u.properties.join("`, `")}\``);
            if (u.variants && u.variants.length) {
                lines.push(`- **Variants:** \`${u.variants.join("`, `")}\` (in addition to the base class)`);
            }
            if (u.url) {
                lines.push(`- **MDN:** ${u.url}`);
            }
            lines.push("");

            // full table of every class this utility actually generates —
            // built the exact same way build.js builds the real CSS, so this
            // table can't list a class that doesn't exist, or miss one that does.
            const entries = resolveEntries(theme, u);
            if (entries.length) {
                lines.push("| Class | CSS |", "| --- | --- |");
                for (const entry of entries) {
                    const className = resolveClassName(u, entry.key);
                    const decls = u.properties.map(p => `${p}: ${entry.value}`).join("; ");
                    lines.push(`| \`.${className}\` | \`${decls};\` |`);
                }
                lines.push("");
            }
        }
    }

    return lines.join("\n");
};

// -----------------------------------------------------------------------
// THEME.md
// -----------------------------------------------------------------------
const buildThemeDoc = () => {
    const lines = [
        "# Theme reference",
        "",
        "Every value below is emitted as a CSS custom property in `theme.css`, so any of them can be overridden at runtime without a rebuild:",
        "",
        "```css",
        ":root {",
        "    --color-accent: #3b82f6; /* example override */",
        "}",
        "```",
        "",
    ];

    for (const group of Object.keys(theme)) {
        lines.push(`## ${group}`, "", "| Variable | Value |", "| --- | --- |");
        for (const key of Object.keys(theme[group])) {
            const varName = key === "DEFAULT" ? `--${group}` : `--${group}-${key}`;
            lines.push(`| \`${varName}\` | \`${theme[group][key]}\` |`);
        }
        lines.push("");
    }

    return lines.join("\n");
};

// -----------------------------------------------------------------------
// write output
// -----------------------------------------------------------------------
writeFileSync(join(process.cwd(), "docs/utilities.md"), buildUtilitiesDoc());
writeFileSync(join(process.cwd(), "docs/theme.md"), buildThemeDoc());

console.log("✓ built docs/utilities.md and docs/theme.md");
