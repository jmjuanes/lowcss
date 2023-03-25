const fs = require("fs");
const path = require("path");

const escapedChars = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
};

const escape = str => {
    return str.toString().replace(/[&<>\"']/g, m => escapedChars[m]);
};

const get = (ctx, fullPath) => {
    return fullPath.split(".").reduce((p, k) => p?.[k], ctx) || "";
};

const compile = (tokens, output, ctx, index, section) => {
    let i = index;
    while (i < tokens.length) {
        if (i % 2 === 0) {
            output.push(tokens[i]);
        }
        else if (tokens[i].startsWith("!")) {
            output.push(get(ctx, tokens[i].slice(1).trim()));
        }
        else if (tokens[i].startsWith("#")) {
            const t = tokens[i].slice(1).trim();
            const value = get(ctx, t);
            const j = i + 1;
            if (value && Array.isArray(value)) {
                value.forEach((item, k) => {
                    i = compile(tokens, output, {"@item": item, "@index": k}, j, t);
                });
            }
            else if (value && typeof value === "object") {
                Object.keys(value).forEach(key => {
                    i = compile(tokens, output, {"@key": key, "@value": value[key]}, j, t);
                });
            }
            else {
                i = compile(tokens, !!value ? output : [], ctx, i + 1, t);
            }
        }
        else if (tokens[i].startsWith("/")) {
            if (tokens[i].slice(1).trim() !== section) {
                throw new Error(`Unmatched section end: {{${tokens[i]}}}`);
            }
            break;
        }
        else {
            output.push(escape(get(ctx, tokens[i].trim())));
        }
        i = i + 1;
    }
    return i;
};

// Get argument values
const argv = key => {
    // if (process.argv.includes(`--${key}`)) {
    //     return true;
    // }
    // Find key in arguments list
    const value = process.argv.find(e => e.startsWith(`--${key}=`));
    return !value ? null : value.replace(`--${key}=`, "");
};

const run = () => {
    const chunks = [];
    const data = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), argv("data")), "utf8"));
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => chunks.push(chunk));
    process.stdin.on("end", () => {
        // Compile template
        const tokens = chunks.join("").split(/\{\{|\}\}/);
        const output = [];
        compile(tokens, output, data, 0, "");
        // Print output template
        process.stdout.write(output.join(""));
    });
};

run();
