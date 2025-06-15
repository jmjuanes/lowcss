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

// @description default variant order
const variantOrder = [
    "default",
    "responsive",
    "print",
    "first",
    "last",
    "odd",
    "even",
    "visited",
    "required",
    "group-hover",
    "group-focus",
    "group-focus-within",
    "peer-hover",
    "peer-focus",
    "peer-focus-within",
    "hover",
    "focus",
    "focus-within",
    "checked",
    "active",
    "disabled",
];

// @description converts a simple glob pattern into a regex
// @example globToRegex("bg-*") => /^bg-(.*?)$/
const globToRegex = (glob = "") => {
    const escaped = glob.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&");
    return new RegExp(`^${escaped.replace(/\*/g, "(.*?)")}$`);
};

// @description get the selector for the specified variant
// @param {string} variant - variant to get the selector for
// @return {string} selector - selector to replace
export const getSelector = (variant = "", selector = "&") => {
    // 0. default variant or variant not defined
    if (variant === "default" || !variant) {
        return `.${selector}`;
    }
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

// @description get the rules associated with a utility node
// @param {Array} nodes - nodes to parse
// @return {Array} rules - parsed utility rules
const getUtilityRules = (nodes, rules = [], nestedVariant = false) => {
    nodes.forEach(node => {
        // 1. @variant node --> parse the variants and recursively get the utility rules
        if (node.type === "atrule" && node.name === "variant") {
            if (nestedVariant) {
                throw new Error("Nested '@variant' rules are not supported.");
            }
            const variants = (node.params || "default").trim()
                .split(",")
                .map(variant => variant.trim())
                .filter(variant => !!variant);
            getUtilityRules(node.nodes, [], true).forEach(rule => {
                return rules.push({
                    ...rule,
                    variants: Array.from(new Set(variants)),
                });
            });
        }
        // 2. basic utility rule node --> parse the selector and properties
        else if (node.type === "rule" && !!node.selector && node.nodes.length > 0) {
            // 2.1. get declarations defined on this rule
            const declarations = node.nodes.filter(item => item.type === "decl");
            if (declarations.length > 0) {
                rules.push({
                    selector: node.selector.trim(),
                    variants: ["default"],
                    properties: declarations.map(item => ({
                        prop: item.prop.trim(),
                        value: item.value.trim(),
                    })),
                });
            }
            // 2.2. nested rules? convert them into a flat list of rules
            const nestedRules = node.nodes.filter(item => item.type === "rule" || item.type === "atrule");
            getUtilityRules(nestedRules, [], nestedVariant).forEach(nestedRule => {
                rules.push({
                    ...nestedRule,
                    selector: nestedRule.selector.replace(/&/g, node.selector.trim()),
                });
            });
        }
    });
    return rules;
};

// @description compile a utility rule into postcss rules
// @param {string} selector - selector to compile
// @param {Array} properties - properties to compile
// @param {object} ctx - context for the utility rule
// @param {Array} theme - theme object to use for compilation
// @param {object} postcss - postcss instance to use for compilation
const compile = (selector, properties, ctx, theme, postcss) => {
    const rule = new postcss.Rule({selector: selector});
    properties.forEach(property => {
        rule.append({
            prop: property.prop,
            value: property.value.replaceAll(ctx.replace, ctx.value).replace(/value\((.*?)\)/g, (match, p1) => {
                const themeItem = theme.find(themeItem => themeItem.key === p1);
                return themeItem ? `var(${p1})` : match;
            }),
        });
    });
    return rule;
};

// @description get the context for a utility rule
// @param {object} rule - utility rule to get the context for
// @param {Array} theme - theme object to use for context
const getUtilityContext = (rule, theme) => {
    const context = new Map();
    // 1. if the rule selector includes an '*', we have a dynamic utility rule
    if (rule.selector.includes("*")) {
        rule.properties.forEach(property => {
            if (property.value.includes("value(--")) {
                const pattern = property.value.match(/value\((.*?)\)/)[1];
                const patternRegex = globToRegex(pattern);
                theme.forEach(item => {
                    if (patternRegex.test(item.key) && !context.has(item.key)) {
                        context.set(item.key, {
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
    else {
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

// @description compile utility into postcss rules
// @param {object} utility - utility object to compile
// @param {object} theme - theme object to use for compilation
// @param {object} postcss - postcss instance to use for compilation
export const compileUtility = (utility, theme = {}, postcss, options = {}) => {
    const breakpoints = getBreakpoints(theme);
    const variants = (options.variantOrder || variantOrder).filter(variant => {
        return utility.variants.includes(variant);
    });
    return variants.map(variant => {
        const utilityVariants = new Set(utility.variants);
        return utility.rules.map(rule => {
            if (!utilityVariants.has(variant)) {
                return [];
            }
            return getUtilityContext(rule, theme).map(ctx => {
                const selector = rule.selector.replace("*", ctx.key);
                // responsive variant
                if (variant === "responsive") {
                    return Object.keys(breakpoints).map(key => {
                        const mediaRule = new postcss.AtRule({
                            name: "media",
                            params: `screen and (min-width: ${breakpoints[key]})`,
                        });
                        mediaRule.append(compile(`.${key}\\:${selector}`, rule.properties, ctx, theme, postcss));
                        return mediaRule;
                    });
                }
                // print variant
                if (variant === "print") {
                    const printRule = new postcss.AtRule({
                        name: "media",
                        params: "print",
                    });
                    printRule.append(compile(`.print\\:${selector}`, rule.properties, ctx, theme, postcss));
                    return printRule;
                }
                // pseudo variant or default variant
                return compile(getSelector(variant, selector), rule.properties, ctx, theme, postcss);
            }).flat();
        }).flat();
    }).flat();
};

// @description parse theme rule
// @param {object} rule - theme rule
// @return {Array} theme - parsed theme variables
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

// @description parse utility rule
// @param {object} rule - utility rule
// @return {object} parsed utility rule
export const parseUtility = rule => {
    const utilityVariants = new Set([]);
    const utiltyRules = getUtilityRules(rule.nodes);
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
                        prop: item.key,
                        value: item.value,
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
                const themeValues = Array.from(theme.values());
                compileUtility(utility, themeValues, postcss, options).forEach(utilityRule => {
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
