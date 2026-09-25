//
// Reads theme.json + utilities.json (plain data, no invented syntax) and
// writes plain, valid theme.css + utilities.css. No PostCSS, no custom
// parser: this file IS the whole "compiler", and it's short enough to
// read top to bottom.
//

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import theme from "../theme.json" with { type: "json" };
import utilities from "../utilities.json" with { type: "json" };

const ROOT = process.cwd(); // path.join(__dirname, "..");

// -----------------------------------------------------------------------
// 1. theme.css — just dump every group/key pair as a CSS custom property.
// -----------------------------------------------------------------------
const buildTheme = () => {
    const lines = [":root {"];
    for (const group of Object.keys(theme)) {
        for (const key of Object.keys(theme[group])) {
            const varName = key === "DEFAULT" ? `--${group}` : `--${group}-${key}`;
            lines.push(`    ${varName}: ${theme[group][key]};`);
        }
    }
    lines.push("}");
    return lines.join("\n") + "\n";
};

// -----------------------------------------------------------------------
// 2. utilities.css — one rule per (utility x entry x variant).
// -----------------------------------------------------------------------

// same pseudo-class mapping used before, kept only because it's cheap to
// keep and some utilities still want hover/focus/etc. Add more here only
// when a utility actually asks for them via its "variants" list.
const pseudos = {
    "hover": "hover",
    "focus": "focus",
    "focus-within": "focus-within",
    "active": "active",
    "visited": "visited",
    "checked": "checked",
    "disabled": "disabled",
    "first": "first-child",
    "last": "last-child",
    "odd": "nth-child(odd)",
    "even": "nth-child(even)",
};

// escapes ":" in class selectors, e.g. ".hover:bg-red-500" -> ".hover\:bg-red-500"
const escapeSelector = selector => selector.replace(/:/g, "\\:");

// resolves the list of {key, value} entries for a single utility definition.
const resolveEntries = utility => {
    const entries = [];
    // "theme": "spacing"  -> single group
    // "themes": ["spacing", "container"] -> merge several groups (e.g. max-width
    // resolves both from the spacing scale and from named container sizes)
    const themeGroups = utility.themes || (utility.theme ? [utility.theme] : []);
    for (const themeName of themeGroups) {
        const group = theme[themeName];
        if (!group) {
            throw new Error(`Unknown theme group "${themeName}" referenced by utility "${utility.name}"`);
        }
        for (const key of Object.keys(group)) {
            entries.push({
                key: key === "DEFAULT" ? "" : key,
                value: `var(--${themeName}${key === "DEFAULT" ? "" : "-" + key})`,
            });
        }
    }
    if (utility.values) {
        for (const key of Object.keys(utility.values)) {
            entries.push({ key, value: utility.values[key] });
        }
    }
    return entries;
};

// builds the base (no-variant) selector + declaration block for one entry.
const buildRule = (selector, properties, value) => {
    const decls = properties.map(prop => `    ${prop}: ${value};`).join("\n");
    return `.${escapeSelector(selector)} {\n${decls}\n}`;
};

const buildUtility = utility => {
    const variants = ["default", ...(utility.variants || [])];
    const entries = resolveEntries(utility);
    const blocks = [];

    for (const variant of variants) {
        for (const entry of entries) {
            const className = utility.className.replace("{key}", entry.key).replace(/-$/, "");

            // default: plain class, no pseudo/media wrapping
            if (variant === "default") {
                blocks.push(buildRule(className, utility.properties, entry.value));
                continue;
            }

            // responsive: wrap in @media, prefix class with breakpoint id
            if (variant === "responsive") {
                for (const bp of Object.keys(theme.breakpoint)) {
                    const selector = `${bp}:${className}`;
                    const rule = buildRule(selector, utility.properties, entry.value);
                    blocks.push(`@media screen and (min-width: ${theme.breakpoint[bp]}) {\n${rule}\n}`);
                }
                continue;
            }

            // group-*/peer-* variants need a relational selector instead of a plain pseudo-class
            if (variant.startsWith("group-")) {
                const state = variant.replace("group-", "");
                const pseudo = pseudos[state] || state;
                const selector = `.group:${pseudo} .${escapeSelector(`${variant}:${className}`)}`;
                blocks.push(`${selector} {\n${utility.properties.map(p => `    ${p}: ${entry.value};`).join("\n")}\n}`);
                continue;
            }
            if (variant.startsWith("peer-")) {
                const state = variant.replace("peer-", "");
                const pseudo = pseudos[state] || state;
                const selector = `.peer:${pseudo} ~ .${escapeSelector(`${variant}:${className}`)}`;
                blocks.push(`${selector} {\n${utility.properties.map(p => `    ${p}: ${entry.value};`).join("\n")}\n}`);
                continue;
            }

            // plain pseudo-class variant (hover, focus, first, odd...)
            const pseudo = pseudos[variant];
            if (!pseudo) {
                throw new Error(`Unknown variant "${variant}" used by utility "${utility.name}"`);
            }
            const selector = `${variant}:${className}`;
            blocks.push(buildRule(selector, utility.properties, entry.value) + "".replace(/\}$/, "") /* noop, keep shape */);
            // rebuild with pseudo appended to the selector (buildRule doesn't know about pseudo)
            blocks[blocks.length - 1] = `.${escapeSelector(selector)}:${pseudo} {\n${utility.properties.map(p => `    ${p}: ${entry.value};`).join("\n")}\n}`;
        }
    }

    return blocks.join("\n");
};

const buildUtilities = () => {
    return utilities.map(utility => {
        const header = `/* ${utility.name} */`;
        return `${header}\n${buildUtility(utility)}`;
    }).join("\n\n") + "\n";
};

// -----------------------------------------------------------------------
// 3. write output
// -----------------------------------------------------------------------
writeFileSync(join(ROOT, "theme.css"), buildTheme());
writeFileSync(join(ROOT, "utilities.css"), buildUtilities());

console.log("✓ built theme.css and utilities.css");
