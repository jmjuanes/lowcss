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
const getKeysMatchingPattern = (pattern, keys, results = []) => {
    const [start = "", end = ""] = pattern.split("*"); // split the pattern into start and end
    keys.forEach(key => {
        if (key.startsWith(start) && key.endsWith(end)) {
            results.push({
                key: key,
                match: key.replace(start, "").replace(end, ""),
            });
        }
    });
    return results;
};

const replaceParentSelector = (rule, replacement) => {
    if (rule.type === "rule" && rule.selector) {
        rule.selector = rule.selector.replace("&", replacement);
    }
    if (rule.nodes) {
        rule.nodes.forEach(node => {
            return replaceParentSelector(node, replacement);
        });
    }
    return rule;
};

// compile a css nodes
const compileRule = (nodes, postcss, options = {}, result = []) => {
    // 1. compile the declaration nodes
    const declarations = nodes.filter(node => {
        return node.type === "decl";
    });
    if (declarations.length > 0) {
        const rule = new postcss.Rule({selector: ".&"});
        declarations.forEach(declaration => {
            rule.append({prop: declaration.prop, value: options.formatValue(declaration.value)});
        });
        result.push(rule);
    }
    // 2. compile nested rules
    nodes.forEach(node => {
        // variant rule
        if (node.type === "atrule" && node.name === "variant") {
            node.params.split(",").forEach(variant => {
                if (variant === "default") {
                    compileRule(node.nodes, postcss, options).forEach(rule => {
                        return result.push(rule);
                    });
                }
                // 2. check for responsive variant
                else if (variant === "responsive") {
                    Object.keys(options.breakpoints || {}).forEach(key => {
                        const mediaRule = new postcss.AtRule({
                            name: "media",
                            params: `screen and (min-width: ${options.breakpoints[key]})`,
                        });
                        compileRule(node.nodes, postcss, options).forEach(rule => {
                            replaceParentSelector(rule, `${key}\\:&`);
                            mediaRule.append(rule);
                        });
                        result.push(mediaRule);
                    });
                }
                // 3: other case, we have a basic pseudo variant (hover, focus, etc.)
                else {
                    compileRule(node.nodes, postcss, options).forEach(rule => {
                        result.push(replaceParentSelector(rule, `${variant}\\:&:${variant}`));
                    });
                }
            });
        }
        // nested rule
        else if (node.type === "rule" && node.selector) {
            compileRule(node.nodes, postcss, options).forEach(rule => {
                result.push(replaceParentSelector(rule, node.selector));
            });
        }
    });
    return result;
};

// @description compile utility
const compileUtility = (rule, themeFields = {}, postcss) => {
    const utilityName = rule.params.trim();
    const utilityContext = [];
    // 1. get the values that we have to iterate
    const themeKeys = new Set();
    const declarationNodes = findDeclarationNodes(rule.nodes, node => node.value.includes("value(--"));
    declarationNodes.forEach(node => {
        const pattern = node.value.match(/value\((.*?)\)/)[1];
        getKeysMatchingPattern(pattern, Object.keys(themeFields)).forEach(entry => {
            const themeField = themeFields[entry.key];
            if (!themeKeys.has(entry.key) && (themeField.type === "global" || themeField.type === "static")) {
                themeKeys.add(entry.key)
                return utilityContext.push({
                    key: entry.match,
                    value: themeField.type === "global" ? `var(${entry.key})` : themeField.value,
                    replace: `value(${pattern})`,
                });
            }
        });
    });
    // 2. we insert a single item to make sure that the utility is generated once
    if (utilityContext.length === 0) {
        utilityContext.push({key: "", value: "", replace: ""});
    }
    // 3. get breakpoints from global variables
    const breakpointsKeys = getKeysMatchingPattern("breakpoint-*", Object.keys(themeFields));
    const breakpoints = Object.fromEntries(breakpointsKeys.map(result => {
        return [result.key, themeFields[result.key].value];
    }));
    // 4. generate utilities classes
    return utilityContext.map(context => {
        const selector = utilityName.replace("*", context.key);
        const utilityRules = compileRule(rule.nodes, postcss, {
            breakpoints: breakpoints,
            formatValue: v => v.replace(context.replace, context.value),
        });
        return utilityRules.map(utilityRule => {
            return replaceParentSelector(utilityRule, selector);
        });
    }).flat();
};

// @description plugin to generate lowcss styles
const lowCssPlugin = () => {
    const globalThemeFields = {};
    return {
        postcssPlugin: "lowcss",
        Once: (root, postcss) => {
            const localThemeFields = {};
            // 1. find all '@theme' rules and replace them with variables
            root.walkAtRules("theme", rule => {
                rule.walkDecls(declaration => {
                    localThemeFields[declaration.prop.trim()] = {
                        type: rule.params || "global",
                        key: declaration.prop.trim(),
                        value: declaration.value.trim(),
                    };
                });
                rule.remove();
            });
            // 2. compile all '@utility' rules
            root.walkAtRules("utility", rule => {
                compileUtility(rule, {...globalThemeFields, ...localThemeFields}, postcss).forEach(utilityRule => {
                    rule.after(utilityRule);
                });
                rule.remove();
            });
            // 3. generate css variables for the current file
            if (Object.keys(localThemeFields).length > 0) {
                const cssVariablesRule = new postcss.Rule({selector: ":root"});
                Object.keys(localThemeFields).forEach(key => {
                    if (localThemeFields[key].type === "global") {
                        cssVariablesRule.append({
                            prop: localThemeFields[key].key,
                            value: localThemeFields[key].value,
                        });
                        globalThemeFields[key] = localThemeFields[key]; // save in the global theme fields
                    }
                });
                if (cssVariablesRule.nodes.length > 0) {
                    root.first.before(cssVariablesRule);
                }
            }
        },
    };
};

// mark the plugin as a postcss plugin
lowCssPlugin.postcss = true;

// export the plugin
export default lowCssPlugin;
