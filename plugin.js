// @description converts a simple glob pattern into a regex
// @example globToRegex("bg-*") => /^bg-(.*?)$/
const globToRegex = (glob = "") => {
    const escaped = glob.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&");
    return new RegExp(`^${escaped.replace(/\*/g, "(.*?)")}$`);
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

// @description replace the parent selector with the provided replacement in the rule and its children
// @param {object} rule - rule to replace the parent selector in
// @param {string} replacement - replacement string
// @return {object} rule - rule with the parent selector replaced
const replaceParentSelector = (rule, replacement) => {
    if (rule.type === "rule" && rule.selector) {
        rule.selector = rule.selector.replaceAll("&", replacement);
    }
    if (rule.nodes) {
        rule.nodes.forEach(node => {
            return replaceParentSelector(node, replacement);
        });
    }
    return rule;
};

// @description get the selector for the specified pseudo variant
// @param {string} variant - variant to get the selector for
// @return {string} selector - selector to replace
const getPseudoSelector = (variant = "", selector = "&") => {
    // 1. check if the variant is a group variant
    if (variant.startsWith("group-")) {
        return `.group:${variant.replace("group-", "")} .${variant}\\:${selector}`;
    }
    // 2. check if the variant is a peer variant
    else if (variant.startsWith("peer-")) {
        return `.peer:${variant.replace("peer-", "")}~.${variant}\\:${selector}`;
    }
    // 3. otherwise, return it as a simple variant (hover, focus, etc.)
    return `.${variant}\\:${selector}:${variant}`;
};

// @description parse the utility params
// @param {string} params - params to parse
const parseUtilityParams = (params = "") => {
    let name = params.trim(), variants = ["default"];
    const match = name.match(/(.*?):variant\((.*?)\)/);
    if (match && !!match[1] && !!match[2]) {
        name = match[1].trim();
        variants = match[2].split(",").map(v => v.trim()).filter(Boolean);
    }
    // return the touple [utilityName, utilityVariants]
    return [name, variants];
};

// @description compile the nodes into a postcss rule
// @param {array} nodes - array of nodes to compile
// @param {object} options.formatValue - function to format the value of the declaration
// @param {object} options.postcss - postcss instance to use
// @return {array} result - array of postcss rules
const compile = (nodes = [], options = {}, result = []) => {
    // 1. compile the declaration nodes
    const declarationNodes = nodes.filter(node => node.type === "decl");
    if (declarationNodes.length > 0) {
        const newRule = new options.postcss.Rule({selector: "&"});
        declarationNodes.forEach(declaration => {
            return newRule.append({
                prop: declaration.prop.trim(),
                value: typeof options?.formatValue === "function" ? options.formatValue(declaration.value) : declaration.value,
            });
        });
        result.push(newRule);
    }
    // 2. compile nested rules
    const nestedRules = nodes.filter(node => node.type === "rule" && node.selector);
    nestedRules.forEach(node => {
        compile(node.nodes, options).forEach(rule => {
            result.push(replaceParentSelector(rule, node.selector));
        });
    });
    return result;
};

// @description compile utility
const compileFunctionalUtility = (rule, themeFields = {}, postcss) => {
    const [utilityName, variants] = parseUtilityParams(rule.params);
    // 1. get the values that we have to iterate
    const context = new Map();
    const declarationNodes = findDeclarationNodes(rule.nodes, node => node.value.includes("value(--"));
    declarationNodes.forEach(node => {
        const pattern = node.value.match(/value\((.*?)\)/)[1];
        const patternRegex = globToRegex(pattern);
        Object.keys(themeFields).forEach(key => {
            if (patternRegex.test(key)) {
                const field = themeFields[key];
                if (!context.has(key) && (field.type === "global" || field.type === "static")) {
                    context.set(key, {
                        key: key.match(patternRegex)[1],
                        value: field.type === "global" ? `var(${key})` : field.value,
                        replace: `value(${pattern})`,
                    });
                }
            }
        });
    });
    // 2. insert a single item to make sure that the utility is generated once
    if (context.size === 0) {
        context.set("default", {key: "", value: "", replace: ""});
    }
    // 3. get breakpoints from global variables
    const breakpoints = {}, breakpointRegex = globToRegex("--breakpoint-*");
    Object.keys(themeFields).forEach(key => {
        if (breakpointRegex.test(key)) {
            breakpoints[key.match(breakpointRegex)[1]] = themeFields[key].value;
        }
    });
    // 4. generate utilities classes
    return variants.map(variant => {
        return Array.from(context.values()).map(ctx => {
            const selector = utilityName.replace("*", ctx.key);
            const compileOptions = {
                postcss: postcss,
                formatValue: value => {
                    return value.replaceAll(ctx.replace, ctx.value).replace(/value\((.*?)\)/g, (match, p1) => {
                        if (themeFields[p1]) {
                            return themeFields[p1].type === "global" ? `var(${p1})` : themeFields[p1].value;
                        }
                        return match;
                    });
                },
            };
            return compile(rule.nodes, compileOptions).map(utilityRule => {
                // 1. default variant
                if (variant === "default") {
                    return replaceParentSelector(utilityRule, "." + selector);
                }
                // 2. responsive variant
                else if (variant === "responsive") {
                    return Object.keys(breakpoints).map(key => {
                        const mediaRule = new postcss.AtRule({
                            name: "media",
                            params: `screen and (min-width: ${breakpoints[key]})`,
                        });
                        mediaRule.append(replaceParentSelector(utilityRule.clone(), `.${key}\\:${selector}`));
                        return mediaRule;
                    });
                }
                // 3: pseudo variant (hover, focus, etc.)
                else if (variant) {
                    return replaceParentSelector(utilityRule, getPseudoSelector(variant, selector));
                }
            }).flat();
        }).flat();
    }).flat();
};

// @description plugin to generate lowcss styles
const lowCssPlugin = () => {
    const globalThemeFields = {};
    return {
        postcssPlugin: "lowcss",
        Once: (root, postcss) => {
            const localThemeFields = {};
            [...(root.nodes || [])].forEach(rule => {
                // 1. check if the rule is a theme rule to extract the variables
                if (rule.type === "atrule" && rule.name === "theme") {
                    const rootRule = new postcss.Rule({selector: ":root"});
                    (rule.nodes || []).forEach(declaration => {
                        if (declaration.type === "decl") {
                            localThemeFields[declaration.prop] = {
                                type: rule.params || "global",
                                key: declaration.prop.trim(),
                                value: declaration.value.trim(),
                            };
                            // insert the css variable in the root rule?
                            if (localThemeFields[declaration.prop].type === "global") {
                                rootRule.append({
                                    prop: declaration.prop.trim(),
                                    value: declaration.value.trim(),
                                });
                            }
                        }
                    });
                    // add the root rule to the root
                    if (rootRule.nodes.length > 0) {
                        root.first.before(rootRule);
                    }
                    rule.remove();
                }
                // 2. check if the rule is an utility rule to generate the utility classes
                else if (rule.type === "atrule" && rule.name === "utility") {
                    const themeFields = {...globalThemeFields, ...localThemeFields};
                    compileFunctionalUtility(rule, themeFields, postcss).forEach(utilityRule => {
                        rule.before(utilityRule);
                    });
                    rule.remove();
                }
            });
            // 3. merge the local theme fields with the global theme fields
            Object.keys(localThemeFields).forEach(key => {
                if (localThemeFields[key].type === "global") {
                    globalThemeFields[key] = localThemeFields[key]; // save in the global theme fields
                }
            });
        },
    };
};

// mark the plugin as a postcss plugin
lowCssPlugin.postcss = true;

// export the plugin
export default lowCssPlugin;
