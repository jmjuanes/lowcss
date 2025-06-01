// @description map pseudo-variants to pseudo selector
const pseudos = {
    "active": "active",
    "focus": "focus",
    "focus-within": "focus-within",
    "hover": "hover",
    "visited": "visited",
    "checked": "checked",
    "disabled": "disabled",
    "required": "required",
    "first": "first-child",
    "last": "last-child",
    "odd": "nth-child(odd)",
    "even": "nth-child(even)",
    "group-hover": "hover",
    "group-focus": "focus",
    "group-focus-within": "focus-within",
    "peer-hover": "hover",
    "peer-focus": "focus",
    "peer-focus-within": "focus-within",
};

// @description converts a simple glob pattern into a regex
// @example globToRegex("bg-*") => /^bg-(.*?)$/
const globToRegex = (glob = "") => {
    const escaped = glob.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&");
    return new RegExp(`^${escaped.replace(/\*/g, "(.*?)")}$`);
};

// @description get the selector for the specified pseudo variant
// @param {string} variant - variant to get the selector for
// @return {string} selector - selector to replace
export const getPseudoSelector = (variant = "", selector = "&") => {
    const variantSelector = pseudos[variant] || variant;
    // 1. check if the variant is a group variant
    if (variant.startsWith("group-")) {
        return `.group:${variantSelector.replace("group-", "")} .${variant}\\:${selector}`;
    }
    // 2. check if the variant is a peer variant
    else if (variant.startsWith("peer-")) {
        return `.peer:${variantSelector.replace("peer-", "")}~.${variant}\\:${selector}`;
    }
    // 3. otherwise, return it as a simple variant (hover, focus, etc.)
    return `.${variant}\\:${selector}:${variantSelector}`;
};

const compile = (selector, properties, options) => {
    const rule = new options.postcss.Rule({selector: "." + selector});
    properties.forEach(property => {
        rule.append({
            prop: property.prop,
            value: options.formatValue(property.value),
        });
    });
    return rule;
};

const getContextForUtilityRule = (rule, theme) => {
    const context = new Map();
    // 1. if the rule selector includes an '*', we have a dynamic utility rule
    if (rule.selector.includes("*")) {
        rule.properties.forEach(property => {
            if (property.value.includes("value(--")) {
                const pattern = property.value.match(/value\((.*?)\)/)[1];
                const patternRegex = globToRegex(pattern);
                theme.forEach(item => {
                    if (patternRegex.test(item.key) && !context.has(item.key)) {
                        context.set(key, {
                            key: item.key.match(patternRegex)[1],
                            value: `var(${item.key})`,
                            replace: `value(${pattern})`,
                        });
                    }
                });
            }
        });
    }
    // 2. insert a single item to make sure that the utility is generated once
    if (context.size === 0) {
        context.set("default", {key: "", value: "", replace: ""});
    }
    // 3. return the context as a simple array
    return Array.from(context.values());
};

// @description get breakpoints in provided theme object
const getBreakpoints = (theme, breakpoints = {}) => {
    const breakpointRegex = globToRegex("--breakpoint-*");
    theme.forEach(item => {
        const match = item.key.match(breakpointRegex);
        if (match) {
            breakpoints[match[1]] = item.value;
        }
    });
    return breakpoints;
};

// @description compile utility
export const compileUtility = (utility, theme = {}, postcss) => {
    const breakpoints = getBreakpoints(theme);
    return utility.rules.map(rule => {
        return rule.variants.map(variant => {
            return getContextForUtilityRule(rule, theme).map(ctx => {
                const selector = rule.selector.replace("*", ctx.key);
                const options = {
                    postcss: postcss,
                    formatValue: value => {
                        return value.replaceAll(ctx.replace, ctx.value).replace(/value\((.*?)\)/g, (match, p1) => {
                            const themeItem = theme.find(themeItem => themeItem.key === p1);
                            return themeItem ? `var(${p1})` : match;
                        });
                    },
                };
                // 1. check for default variant
                if (variant === "default") {
                    return compile("." + selector, rule.properties, options);
                }
                // 2. check for responsive variant
                else if (variant === "responsive") {
                    return Object.keys(breakpoints).map(key => {
                        const mediaRule = new postcss.AtRule({
                            name: "media",
                            params: `screen and (min-width: ${breakpoints[key]})`,
                        });
                        mediaRule.append(compile(`.${key}\\:${selector}`, rule.properties, options));
                        return mediaRule;
                    });
                }
                // 3. other case is a pseudo variant
                else {
                    return compile(getPseudoSelector(variant, selector), rule.properties, options);
                }
            }).flat();
        }).flat();
    }).flat();
};

// @description parse theme rule
// @param {object} rule - theme rule
export const parseTheme = (rule, theme = []) => {
    (rule.nodes || []).forEach(declaration => {
        if (declaration.type === "decl" && declaration.prop.startsWith("--")) {
            theme.push({
                type: "global",
                key: declaration.prop.trim(),
                value: declaration.value.trim(),
            });
        }
    });
    return theme;
};

// @description this method parses the utility nodes
const parseUtilityNodes = (nodes, level = 0) => {
    if (level > 1) {
        throw new Error("Too many nested rules in utility to parse.");
    }
    const rules = [];
    nodes.forEach(node => {
        // 1. check for @variant node --> recursive parse
        if (node.type === "atrule" && node.name === "variant") {
            const variants = (node.params || "default").trim()
                .split(",")
                .map(variant => variant.trim())
                .filter(variant => !!variant);
            parseUtilityNodes(node.nodes, level + 1).forEach(rule => {
                rule.variants = Array.from(new Set([...rule.variants, ...variants]));
                rules.push(rule);
            });
        }
        // 2. check for default rule
        else if (node.type === "rule") {
            rules.push({
                selector: node.selector.trim(),
                variants: ["default"],
                properties: node.nodes.map(item => {
                    return {
                        prop: item.prop.trim(),
                        value: item.value.trim(),
                    };
                }),
            });
        }
    });
    return rules;
};

// @description parse utility rule
export const parseUtility = rule => {
    const utilityVariants = new Set(["default"]);
    const utiltyRules = parseUtilityNodes(rule.nodes);
    // fill utility variants set with variants defined in rules
    utiltyRules.forEach(utilityRule => {
        utilityRule.variants.forEach(variant => {
            utilityVariants.add(variant);
        });
    });
    // return the parsed utility rule
    return {
        name: (rule.params || "").trim(),
        variants: Array.from(utilityVariants),
        rules: utiltyRules,
    };
};

// @description plugin to generate lowcss styles
const lowCssPlugin = (options = {}, theme = new Map()) => ({
    postcssPlugin: "lowcss",
    Once: (root, postcss) => {
        [...(root.nodes || [])].forEach(rule => {
            // 1. check if the rule is a theme rule to extract the variables
            if (rule.type === "atrule" && rule.name === "theme") {
                const rootRule = new postcss.Rule({selector: ":root"});
                parseTheme(rule).forEach(item => {
                    theme.set(item.key, item);
                    rootRule.append({
                        prop: declaration.prop.trim(),
                        value: declaration.value.trim(),
                    });
                });
                // add the root rule to the root
                if (rootRule.nodes.length > 0) {
                    root.first.before(rootRule);
                }
                rule.remove();
            }
            // 2. check if the rule is an utility rule to generate the utility classes
            else if (rule.type === "atrule" && rule.name === "utility") {
                const utility = parseUtility(rule);
                const utilityRules = compileUtility(utility, Array.from(theme.values()), postcss);
                utilityRules.forEach(utilityRule => {
                    rule.before(utilityRule);
                });
                rule.remove();
            }
        });
    },
});

// mark the plugin as a postcss plugin
lowCssPlugin.postcss = true;

// export the plugin
export default lowCssPlugin;
