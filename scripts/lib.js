// Shared between build.js (generates CSS) and docs.js (generates Markdown).
// Both need the exact same "which classes does this utility produce"
// logic — pulling it out here means docs.js can never describe a class
// that build.js doesn't actually generate, or vice versa.

export const DEFAULT_PSEUDOS = {
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

// get the pseudo selector for the guiven variant
export const getPseudoSelector = state => {
    return DEFAULT_PSEUDOS[state] || state;
};

// resolves the list of {key, value} entries for a single utility definition,
// against a given theme object (so callers don't have to re-read theme.json).
export const resolveEntries = (theme, utility) => {
    const entries = [];
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
                // the raw theme value too (e.g. "0.25rem"), useful for docs
                raw: group[key],
            });
        }
    }
    if (utility.values) {
        for (const key of Object.keys(utility.values)) {
            entries.push({ key, value: utility.values[key], raw: utility.values[key] });
        }
    }
    return entries;
};

// resolves the final class name (no variant prefix) for one entry.
export const resolveClassName = (utility, key) => {
    return utility.className.replace("{key}", key).replace(/-$/, "");
};

export const escapeSelector = selector => {
    return selector.replace(/:/g, "\\:");
};
