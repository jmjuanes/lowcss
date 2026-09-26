//
// Reads theme.json + utilities.json (plain data, no invented syntax) and
// writes plain, valid theme.css + utilities.css. No PostCSS, no custom
// parser: this file IS the whole "compiler", and it's short enough to
// read top to bottom.
//

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { resolveEntries, resolveClassName, getPseudoSelector, escapeSelector } from "./lib.js";
import theme from "../config/theme.json" with { type: "json" };
import utilities from "../config/utilities.json" with { type: "json" };

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

// builds the base (no-variant) selector + declaration block for one entry.
const buildRule = (selector, properties, value) => {
    const decls = properties.map(prop => `    ${prop}: ${value};`).join("\n");
    return `.${escapeSelector(selector)} {\n${decls}\n}`;
};

const buildUtility = utility => {
    const variants = ["default", ...(utility.variants || [])];
    const entries = resolveEntries(theme, utility);
    const blocks = [];

    for (const variant of variants) {
        for (const entry of entries) {
            const className = resolveClassName(utility, entry.key);

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
                const pseudo = getPseudoSelector(state);
                const selector = `.group:${pseudo} .${escapeSelector(`${variant}:${className}`)}`;
                blocks.push(`${selector} {\n${utility.properties.map(p => `    ${p}: ${entry.value};`).join("\n")}\n}`);
                continue;
            }
            if (variant.startsWith("peer-")) {
                const state = variant.replace("peer-", "");
                const pseudo = getPseudoSelector(state);
                const selector = `.peer:${pseudo} ~ .${escapeSelector(`${variant}:${className}`)}`;
                blocks.push(`${selector} {\n${utility.properties.map(p => `    ${p}: ${entry.value};`).join("\n")}\n}`);
                continue;
            }

            // plain pseudo-class variant (hover, focus, first, odd...)
            const pseudo = getPseudoSelector(variant);
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
writeFileSync(join(process.cwd(), "theme.css"), buildTheme());
writeFileSync(join(process.cwd(), "utilities.css"), buildUtilities());

console.log("✓ built theme.css and utilities.css");
