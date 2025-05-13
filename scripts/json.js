import * as fs from "node:fs";
import * as path from "node:path";
import pkg from "../package.json" with {type: "json"};

// map theme variables with their categories
const themeKeys = {
    "color": "--color-",
    "fontFamily": "--font-family-",
    "fontSize": "--font-size-",
    "fontWeight": "--font-weight-",
    "lineHeight": "--leading-",
    "letterSpacing": "--tracking-",
    "borderRadius": "--radius-",
    "borderWidth": "--border-width-",
    "shadow": "--shadow-",
    "spacing": "--spacing-",
    "gap": "--gap-",
    "opacity": "--opacity-",
    "animation": "--animation-",
};

const getThemeVariables = (value, theme) => {
    if (value.includes("value(--")) {
        const match = value.match(/value\((.*?)\)/);
        const pattern = match[1].replace("*", "");
        return Object.keys(theme)
            .filter(key => key.startsWith(pattern))
            .map(key => {
                return {
                    key: key,
                    match: key.replace(pattern, ""),
                    replace: match[0],
                };
            });
    }
    // just return a single value
    return [{key: "", match: ""}];
};

const main = () => {
    const theme = {};
    const utilities = [];
    // 1. fill theme variables from 'theme.css' file
    const themePath = path.resolve(process.cwd(), "./theme.css");
    fs.readFileSync(themePath, "utf-8").split("\n").forEach(line => {
        if (line.trim().startsWith("--")) {
            const [key, value] = line.split(":").map(item => item.trim());
            theme[key] = value.replace(";", "");
        }
    });
    // 2. fill utilities from 'utilities.css' file
    const utilitiesPath = path.resolve(process.cwd(), "./utilities.css");
    let currentUtility = null, utilityNamePattern = null;
    fs.readFileSync(utilitiesPath, "utf-8").split("\n").forEach(fullLine => {
        const line = fullLine.trim();
        // 2.0. lines to skip
        if (line.startsWith("@theme") || line.startsWith("}")) {
            return;
        }
        // 2.1. check if the line is a static theme variable
        if (line.startsWith("--")) {
            const [key, value] = line.split(":").map(item => item.trim());
            theme[key] = value.replace(";", "");
        }
        // 2.2. empty line --> clear the current utility
        else if (line.length === 0) {
            // make sure that the variants section is not empty
            if (currentUtility) {
                if (!currentUtility.variants) {
                    currentUtility.variants = ["default"];
                }
                currentUtility.values = Array.from(currentUtility.values.values());
            }
            currentUtility = null;
            utilityNamePattern = null;
        }
        else {
            // initialize a new utility
            if (!currentUtility) {
                currentUtility = {values: new Map()};
                utilities.push(currentUtility);
            }
            // 2.3. check if the line starts with a comment
            if (line.startsWith("/*") && line.endsWith("*/")) {
                const match = line.match(/\/\* @(\w+) (.*) \*\//);
                if (match) {
                    currentUtility[match[1]] = match[2].trim();
                }
            }
            // 2.4. check if the line starts with an '@variant' rule
            else if (line.startsWith("@variant")) {
                if (!currentUtility.variants) {
                    currentUtility.variants = line.replace("@variant", "").replace("{", "").trim().split(",").map(item => item.trim());
                }
            }
            // 2.5. utility name pattern
            else if (line.startsWith("@utility")) {
                utilityNamePattern = line.replace("@utility", "").replace("{", "").trim();
            }
            // 2.6. other value, generate utilities
            else {
                const [prop, value] = line.split(":").map(item => item.trim());
                getThemeVariables(value, theme).forEach(entry => {
                    const selector = "." + utilityNamePattern.replace("*", entry.match);
                    if (!currentUtility.values.has(selector)) {
                        currentUtility.values.set(selector, {
                            selector: selector,
                            nodes: [],
                        });
                    }
                    currentUtility.values.get(selector).nodes.push({
                        prop: prop,
                        value: value.replace(entry.replace, theme[entry.key]).replace(";", ""),
                    });
                });
            }
        }
    });
    // 3. save json file with utilities
    const outputData = {
        version: pkg.version,
        breakoints: Object.fromEntries(Object.keys(theme).filter(item => item.startsWith("--breakpoint-")).map(item => {
            return [item.replace("--breakpoint-", ""), theme[item]];
        })),
        theme: Object.fromEntries(Object.keys(themeKeys).map(key => {
            const field = themeKeys[key];
            const variables = Object.keys(theme).filter(item => item.startsWith(field)).map(item => {
                return [item.replace(field, ""), theme[item]];
            });
            return [key, Object.fromEntries(variables)];
        })),
        utilities: utilities,
    };
    const outputPath = path.resolve(process.cwd(), "./low.json");
    console.log(`Saving ${outputData.utilities.length} utilities to ${outputPath}`);
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, "    "), "utf-8");
};

main();
