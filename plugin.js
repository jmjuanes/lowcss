// @description extract variables from a '@theme' rule
// @param {object} rule - rule to parse - https://postcss.org/api/#rule
const extractThemeVariables = (rule, entries = []) => {
    rule.nodes.forEach(node => {
        if (node.type === "decl" && node.prop.trim().startsWith("--")) {
            entries.push([
                node.prop.trim().replace(/^--/, ""),
                node.value.trim(),
            ]);
        }
    });
    return Object.fromEntries(entries);
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
const getKeysMatchingPattern = (pattern, keys, results = []) => {
    const [start, end] = pattern.split("*"); // split the pattern into start and end
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

// compile a css nodes
const compile = (nodes, options, result = []) => {
    // 1. compile the declaration nodes
    const declarations = nodes.map(node => {;
        if (node.type === "decl") {
            return `${node.prop}: ${options.formatValue(node.value)};`;
        }
        return "";
    });
    result.push(`.& { ${declarations.filter(Boolean).join("")} }`);
    // 2. compile nested rules
    nodes.forEach(node => {
        // variant rule
        if (node.type === "atrule" && node.name === "variant") {
            const rules = compile(node.nodes, options).join("");
            node.params.split(",").forEach(variant => {
                if (variant === "default") {
                    result.push(rules);
                }
                // 2. check for responsive variant
                else if (variant === "responsive") {
                    Object.entries(options.breakpoints || {}).forEach(([key, size]) => {
                        result.push(`@media screen and (min-width: ${size}) { .${key}\\:& { ${rules} } }`);
                    });
                }
                // 3: other case, we have a basic pseudo variant (hover, focus, etc.)
                else {
                    result.push(`.${variant}\\:&:${variant} { ${rules} }`);
                }
            });
        }
        // nested rule
        else if (node.type === "rule" && node.selector) {
            result.push(compile(node.nodes, options).join("").replaceAll("&", node.selector));
        }
    });
    return result;        
};

// @description compile utility
const compileUtility = (rule, localVars = {}, globalVars = {}) => {
    const isFunctionalUtility = rule.params.includes("*"); // example: @utility bg-*
    const utilityName = rule.params.trim();
    const utilityVars = {...localVars}; // extend document variables
    const utilityContext = [];
    // 1. we have to find all '@theme' rules to update the utility variables
    rule.nodes.forEach(node => {
        if (node.type === "atrule" && node.name === "theme") {
            if (node.params.trim() !== "static") {
                throw new Error(`@theme rules inside utilities must be static.`);
            }
            // extend utility variables
            Object.assign(utilityVars, extractThemeVariables(node));
        }
    });
    // 2. get the values that we have to iterate
    if (isFunctionalUtility) {
        const nodes = findDeclarationNodes(rule.nodes, node => node.value.includes("value(--"));
        nodes.forEach(node => {
            const pattern = node.value.match(/value\(--(.*?)\)/)[1];
            const availableVars = [
                [localVars, v => v],
                [globalVars, v => `var(--${v})`],
            ];
            availableVars.forEach(({vars, format}) => {
                getKeysMatchingPattern(pattern, Object.keys(vars)).forEach(entry => {
                    return utilityContext.push({
                        key: entry.match,
                        value: format(vars[entry.key]),
                        pattern: `value(--${pattern})`,
                        replace: `value(--${pattern.replace("*", entry.match)})`,
                    });
                });
            });
        });
    }
    else {
        // we insert a single item to make sure that the utility is generated once
        utilityContext.push({key: "", value: "", pattern: ""});
    }
    // 3. get breakpoints from global variables
    const breakpointsKeys = getKeysMatchingPattern("breakpoint-*", Object.keys(globalVars));
    const breakpoints = Object.fromEntries(breakpointsKeys).map(result => {
        return [result.key, globalVars[result.key]];
    });
    // 4. generate utilities classes
    const classes = utilityContext.map(context => {
        const selector = utilityName.replace("*", context.key);
        const styles = compile(rule.nodes, {
            breakpoints: breakpoints,
            formatValue: v => v.replace(context.replace, context.value),
        });
        return styles.join("\n").replaceAll("&", selector);
    });
    return classes.join("\n");
};

// @description plugin to generate lowcss styles
const lowCssPlugin = (options = {}) => {
    return {
        postcssPlugin: "lowcss",
        prepare: () => {
            const globalVars = {};
            return {
                Once: root => {
                    root.walkAtRules("theme", rule => {
                        Object.assign(globalVars, extractThemeVariables(rule));
                        rule.remove();
                    });
                    root.walkAtRules("utility", rule => {
                        rule.replaceWith(compileUtility(rule, {}, globalVars));
                    });
                },
            };
        },
    };
};

// mark the plugin as a postcss plugin
lowCssPlugin.postcss = true;

// export the plugin
export default lowCssPlugin;
