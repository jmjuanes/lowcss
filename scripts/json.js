const fs = require("node:fs");
const sass = require("sass");
const pkg = require("../package.json");

const jsonStr = data => {
    return JSON.stringify(data, null, "    ");
};

const main = args => {
    const endl = "\n";
    const template = fs.readFileSync("main.scss", "utf8");
    console.log(`[build:json] generating '${args[0]}' ...`);
    // change output mode to JSON
    const code = template.replace(`$output-mode: "css";`, `$output-mode: "json";`);
    const {css} = sass.compileString(code, {
        loadPaths: [
            process.cwd(),
        ],
    });
    // fix values and set version
    const content = JSON.parse(css.split(endl).slice(1, -2).join(endl));
    content.version = pkg.version;
    Object.keys(content.utilities).forEach(key => {
        const utility = content.utilities[key];
        // Fix values: convert arrays to joined strings
        Object.keys(utility.values).forEach(key => {
            const value = utility.values[key];
            if (Array.isArray(value)) {
                const delimiter = utility === "font-family" ? ", " : " ";
                utility.values[key] = value.join(delimiter);
            }
        });
    });
    // save json file
    fs.writeFileSync(args[0], jsonStr(content) + endl, "utf8");
    console.log(`[build:json] saved '${args[0]}'`);
};

// build json
main(process.argv.slice(2));
