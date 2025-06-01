import * as fs from "node:fs";
import * as path from "node:path";
import postcss from "postcss";
import {parseTheme, parseUtility} from "../plugin.js";
import pkg from "../package.json" with {type: "json"};

// map theme variables with their categories
const themeKeys = {
    "colors": "--color-",
    "fonts": "--font-family-",
    "fontSizes": "--font-size-",
    "fontWeights": "--font-weight-",
    "lineHeights": "--leading-",
    "letterSpacing": "--tracking-",
    "radius": "--radius-",
    "borders": "--border-width-",
    "shadows": "--shadow-",
    "spacing": "--spacing-",
    "gap": "--gap-",
    "container": "--container-",
    "opacities": "--opacity-",
    "animations": "--animate-",
    "zIndex": "--z-index-",
};

const themeJsonPlugin = (options = {}) => ({
    postcssPlugin: "low-theme-json",
    Once: root => {
        [...(root.nodes || [])].forEach(rule => {
            if (rule.type === "atrule" && rule.name === "theme") {
                return parseTheme(rule).forEach(item => {
                    options.theme.push(item);
                });
            }
        });
    },
});

const utilitiesJsonPlugin = (options = {}) => ({
    postcssPlugin: "low-utilities-json",
    Once: root => {
        const current = {
            utility: null,
        };
        [...(root.nodes || [])].forEach(rule => {
            if (rule.type === "comment" && !!rule.text.trim()) {
                if (!current.utility) {
                    current.utility = {};
                    options.utilities.push(current.utility);
                }
                // parse comment to stract key-value
                const match = rule.text.trim().match(/^@(\w+) (.*)$/);
                if (match) {
                    current.utility[match[1]] = match[2].trim();
                }
            }
            if (rule.type === "atrule" && rule.name === "utility") {
                Object.assign(current.utility, parseUtility(rule));
                current.utility = null; // reset current utility
            }
        });
    },
});

const main = () => {
    const themeInput = fs.readFileSync("theme.css", "utf8");
    const utilitiesInput = fs.readFileSync("utilities.css", "utf8");
    const state = {
        theme: [],
        utilities: [],
    };
    const postCssPromises = [
        postcss([themeJsonPlugin(state)]).process(themeInput),
        postcss([utilitiesJsonPlugin(state)]).process(utilitiesInput),
    ];
    return Promise.all(postCssPromises).then(() => {
        const breakpointsKeys = state.theme.filter(item => {
            return item.key.startsWith("--breakpoint-");
        });
        const data = {
            version: pkg.version,
            breakpoints: Object.fromEntries(breakpointsKeys.map(item => {
                return [item.key.replace("--breakpoint-", ""), item.value];
            })),
            theme: Object.fromEntries(Object.keys(themeKeys).map(key => {
                const field = themeKeys[key];
                const variables = state.theme
                    .filter(item => item.key.startsWith(field))
                    .map(item => {
                        return [item.key.replace(field, ""), item.value];
                    });
                return [key, Object.fromEntries(variables)];
            })),
            utilities: state.utilities,
        };
        const outputPath = path.resolve(process.cwd(), "./low.json");
        console.log(`Saving ${data.utilities.length} utilities to ${outputPath}`);
        fs.writeFileSync(outputPath, JSON.stringify(data, null, "    "), "utf-8");
    });
};

// build json
main();
