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

// compile a css nodes
const compile = (nodes, options, result = []) => {
    // 1. compile the declaration nodes
    const declarations = nodes
        .filter(node => node.type === "decl")
        .map(node => `${node.prop}: ${options.formatValue(node.value)};`);
    if (declarations.length > 0) {
        result.push(`.& { ${declarations.join("")} }`);
    }
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
                        result.push(`@media screen and (min-width: ${size}) { ${rules.replaceAll("&", `${key}\\:&`)} }`);
                    });
                }
                // 3: other case, we have a basic pseudo variant (hover, focus, etc.)
                else {
                    result.push(rules.replaceAll("&", `${variant}\\:&:${variant}`));
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
    const utilityName = rule.params.trim();
    const utilityContext = [];
    // 1. get the values that we have to iterate
    const declarationNodes = findDeclarationNodes(rule.nodes, node => node.value.includes("value(--"));
    declarationNodes.forEach(node => {
        const pattern = node.value.match(/value\(--(.*?)\)/)[1];
        const availableVars = [
            ["local", localVars, (k, v) => v],
            ["global", globalVars, (k, v) => `var(--${k})`],
        ];
        availableVars.forEach(([type, vars, format]) => {
            const items = getKeysMatchingPattern(pattern, Object.keys(vars));
            items.forEach(entry => {
                return utilityContext.push({
                    type: type,
                    key: entry.match,
                    value: format(entry.key, vars[entry.key]),
                    replace: `value(--${pattern})`,
                });
            });
        });
    });
    // 2. we insert a single item to make sure that the utility is generated once
    if (utilityContext.length === 0) {
        utilityContext.push({key: "", value: "", replace: ""});
    }
    // 3. get breakpoints from global variables
    const breakpointsKeys = getKeysMatchingPattern("breakpoint-*", Object.keys(globalVars));
    const breakpoints = Object.fromEntries(breakpointsKeys.map(result => {
        return [result.key, globalVars[result.key]];
    }));
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
const lowCssPlugin = () => ({
    postcssPlugin: "lowcss",
    prepare: () => {
        const globalVars = {};
        return {
            Once: root => {
                const localVariables = {};
                // 1. find all '@theme' rules and replace them with variables
                root.walkAtRules("theme", rule => {
                    const vars = Object.fromEntries(rule.nodes.map(node => {
                        return [node.prop.trim().replace(/^--/, ""), node.value.trim()];
                    }));
                    if (rule.params === "static" || rule.params === "local") {
                        Object.assign(localVariables, vars);
                        rule.remove();
                    }
                    else {
                        Object.assign(globalVars, vars);
                        rule.replaceWith(`:root { ${Object.entries(vars).map(([k, v]) => `--${k}: ${v};`).join("")} }`);
                    }
                });
                // 2. compile all '@utility' rules
                root.walkAtRules("utility", rule => {
                    rule.replaceWith(compileUtility(rule, localVariables, globalVars));
                });
            },
        };
    },
});

// mark the plugin as a postcss plugin
lowCssPlugin.postcss = true;

// export the plugin
export default lowCssPlugin;
