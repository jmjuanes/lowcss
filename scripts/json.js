import * as fs from "node:fs";
import * as path from "node:path";
import postcss from "postcss";
import postcssImport from "postcss-import";
import lowPlugin from "../plugin.js";
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
    "opacities": "--opacity-",
    "animations": "--animation-",
};

const main = () => {
    const input = fs.readFileSync("index.css", "utf8");
    const state = {
        theme: [],
        utilities: [],
        currentUtility: null,
    };
    const plugin = lowPlugin({
        onThemeVariable: themeVariable => {
            if (themeVariable.type === "global") {
                state.theme.push(themeVariable);
            }
        },
        onComment: comment => {
            if (!state.currentUtility || state.currentUtility?.values?.length > 0) {
                state.currentUtility = {
                    values: [],
                };
                state.utilities.push(state.currentUtility);
            }
            // parse comment to stract key-value
            const match = comment.trim().match(/^@(\w+) (.*)$/);
            if (match) {
                state.currentUtility[match[1]] = match[2].trim();
            }
        },
        onUtility: utility => {
            state.currentUtility.variants = utility.variants || ["default"];
            const currentValues = new Set(state.currentUtility.values.map(item => {
                return item.selector;
            }));
            utility.values.forEach(item => {
                const selector = utility.name.replace("*", item.key);
                if (!currentValues.has(selector)) {
                    state.currentUtility.values.push({
                        selector: selector,
                        nodes: utility.declarations.map(node => {
                            return {
                                prop: node.prop,
                                value: node.value.replace(item.replace, item.value),
                            };
                        }),
                    });
                }
                currentValues.add(selector);
            });
        },
    });
    return postcss([postcssImport, plugin])
        .process(input)
        .then(() => {
            const breakointsKeys = state.theme.filter(item => {
                return item.key.startsWith("--breakpoint-");
            });
            const data = {
                version: pkg.version,
                breakoints: Object.fromEntries(breakointsKeys.map(item => {
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
