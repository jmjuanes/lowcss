// @return {string} value - parsed value
const parseValue = (value = "") => {
    return /^".*"$/.test(value) ? value.replace(/^"/, "").replace(/"$/, "") : value;
};

// @description convert rule object to a JSON
// @param {object} rule - rule to parse - https://postcss.org/api/#rule
// @return {object} rule - parsed rule
const parseRule = (rule, result = {}) => {
    rule.nodes.forEach(node => {
        // 1. simple declaration: add it to the result object
        if (node.type === "decl") {
            result[node.prop] = parseValue(node.value.trim());
        }
        // 2. nested rule: parse it recursively
        else if (node.type === "rule") {
            const key = node.selector.replace(":", "").trim();
            result[key] = {};
            parseRule(node, result[key]);
        }
    });
    return result;
};

// @description build css styles
// @param {Object} styles - styles to build
export const css = (styles = {}, result = []) => {
    Object.keys(styles).map(key => {
        // 1. check for at rule (media or keyframes)
        if (/^@(media|keyframes)/.test(key.trim())) {
            return result.push(`${key} { ${css(styles[key])} }`);
        }
        // 2. other value, parse as a css declaration
        const rule = [];
        Object.entries(styles[key]).forEach(([prop, value]) => {
            // 2.1. check for nested styles
            if (value && typeof value === "object") {
                const selector = prop.replace(/&/g, key);
                return result.push(css({[selector]: value}));
            }
            // 2.2. add as a simple css rule
            rule.push(`${prop}:${value};`);
        });
        if (rule.length > 0) {
            result.push(`${key} { ${rule.join("")} }`);
        }
    });
    return result.flat().join("\n");
};

// @description generate the theme configuration from rule
// @param {object} rule - rule to parse - https://postcss.org/api/#rule
// @return {object} config - theme configuration
const parseThemeRule = (rule) => {
    const entries = rule.nodes
        .filter(node => node.type === "rule" && node.selector.endsWith(":"))
        .map(node => {
            const key = node.selector.replace(":", "").trim();
            const values = node.nodes.map(item => {
                return [item.prop, item.value.trim()];
            });
            return [key, Object.fromEntries(values)];
        });
    return Object.fromEntries(entries);
};

// @description generate the utility configuration from rule
// @param {object} rule - rule to parse - https://postcss.org/api/#rule
// @param {object} theme - theme configuration to use
// @return {object} config - utility configuration
// @return {string} config.classname - classname of the utility
// @return {array} config.variants - variants to apply (default, hover, focus, responsive)
// @return {array} config.properties - list of css properties to apply
// @return {string|object} config.value - values of the css property
const parseUtilityRule = (rule, theme) => {
    const utility = parseRule(rule);
    if (utility.configuration) {
        // fix list fields in the utility object
        ["variants", "properties"].forEach(field => {
            utility.configuration[field] = utility.configuration[field]?.split?.(",") || ["default"];
        });
        // check if the utility value is a theme reference
        if (typeof utility.configuration.values === "string" && utility.configuration.values.startsWith("theme.")) {
            const themeKey = utility.configuration.values.replace("theme.", "");
            utility.configuration.values = theme[themeKey] || {};
        }
    }
    return utility;
};

// @description generate the utility styles
// @param {object} utility - utility configuration
const generateUtilityStyles = (utility = {}, breakpoints) => {
    return utility.variants.map(variant => {
        return Object.keys(utility.values).map(key => {
            const styles = {};
            const selector = [utility.classname, key].filter(Boolean).join("-");
            const properties = Object.fromEntries(utility.properties.map(property => {
                return [property, utility.values[key]];
            }));
            // default variant (aka no variant to apply)
            if (variant === "default") {
                styles["." + selector] = properties;
            }
            // responsive variant
            else if (variant === "responsive") {
                Object.keys(breakpoints).forEach(breakpoint => {
                    const media = `@media screen and (min-width: ${breakpoints[breakpoint]})`;
                    const mediaSelector = `.${breakpoint}\\:${selector}`;
                    styles[media] = {
                        [mediaSelector]: properties,
                    };
                });
            }
            // other pseudo variant (hover, focus, etc.)
            else {
                const pseudoSelector = `.${variant}\\:${selector}:${variant}`;
                styles[pseudoSelector] = properties;
            }
            return css(styles);
        });
    });
};

// @description utility method to find all declaration nodes that matches the provided
// condition as a function
const findDeclarationNodes = (nodes, condition, result = []) => {
    for (let i = 0; i < nodes.length; i++) {
        // 1. check if the condition is satisfied in declaration nodes
        if (nodes[i].type === "decl" && condition(nodes[i])) {
            result.push(nodes[i]);
        }
        // 2. check if the condition is satisfied in nested rules
        else if (nodes[i].type === "rule" || nodes[i].type === "atrule") {
            findDeclarationNodes(nodes[i].nodes, condition, result);
        }
    }
    return result;
};

// @description get keys that match a pattern
// @param {string} pattern - pattern to match
// @param {object} object - object to search
// @return {array} keys - array of keys that match the pattern
const getKeysMatchingPattern = (pattern, keys) => {
    const [start, end] = pattern.split("*"); // split the pattern into start and end
    return keys.filter(key => {
        return key.startsWith(start) && key.endsWith(end);
    });
};

// @description compile utility
const compileUtility = (rule, theme) => {
    const isFunctionalUtility = rule.params.includes("*"); // example: @utility bg-*
    const utilityName = rule.params.trim();
    let variants = new Set(["default"]);
    let utilityDeclarations = rule.nodes;
    // if the first node is an '@variant' rule, it means that we have to generate variants for this utility
    if (rule.nodes[0].type === "atrule" && rule.nodes[0].name === "variant") {
        rule.nodes[0].params.split(",").forEach(variant => {
            variants.add(variant.trim());
        });
        utilityDeclarations = rule.nodes[0].nodes;
    }
    // prepare the keys to generate the utilities
    let keys = [""], values = [""], patterns = [""]; // default key is an empty key, just for non functional utilities
    if (isFunctionalUtility) {
        const functionalNodes = findDeclarationNodes(utilityDeclarations, node => {
            return node.value.includes("value(") && node.value.includes("*");
        });
        // TODO: throw an error if functional nodes is empty?
        if (functionalNodes.length > 0) {
            keys = [], values = [], patterns = []; // reset lists
            functionalNodes.forEach((node, index) => {
                // 1. 


            pattern = functionalNode.value.match(/value\(--(.*?)\)/)[1];
            keys = getKeysMatchingPattern(pattern, Object.keys(theme));
            values = keys.map(key => {
                return theme[key];
            });
        }
    }
    // generate style for each variant defined
    const styles = Array.from(variants).map(variant => {
        return keys.map((key, index) => {
            const selector = utilityName.replaceAll("*", key);
            const declarations = utilityDeclarations
                .filter(node => node.type === "decl")
                .map(node => {
                    const value = node.value.replace(`value(--${patterns[index]})`, values[index] || "");
                    return `${node.prop}: ${value};`;
                });
            // 1. check for default variant (aka no variant to apply)
            if (variant === "default" || !variant) {
                return `.${selector} { ${declarations.join("")} }`;
            }
            // 2. check for responsive variant
            else if (variant === "responsive") {
                return Object.keys(theme)
                    .filter(key => key.startsWith("breakpoint-"))
                    .map(key => {
                        const breakpoint = key.replace("breakpoint-", "");
                        return `@media screen and (min-width: ${theme[key]}) { .${breakpoint}\\:${selector} { ${declarations.join("")} } }`;
                    });
            }
            // 3: other case, we have a basic pseudo variant (hover, focus, etc.)
            else {
                return `.${variant}\\:${selector}:${variant} { ${declarations.join("")} }`;
            }
        });
    });
    // return joined styles
    return styles.flat(2).join("\n");
};

// @description plugin to generate lowcss styles
const lowCssPlugin = (options = {}) => {
    return {
        postcssPlugin: "lowcss",
        prepare: () => {
            const theme = {
                "breakpoint-sm": "640px",
                "breakpoint-md": "768px",
                "color-gray": "#333",
                "color-gray-light": "#666",
            };
            return {
                Once: root => {
                    root.walkAtRules("theme", rule => {
                        Object.assign(theme, parseThemeRule(rule));
                        rule.remove();
                    });
                    root.walkAtRules("utility", rule => {
                        rule.replaceWith(compileUtility(rule.toJSON(), theme));
                    });
                },
                OnceExit: () => {
                    // console.log(theme);
                },
            };
        },
    };
};

// mark the plugin as a postcss plugin
lowCssPlugin.postcss = true;

// export the plugin
export default lowCssPlugin;
