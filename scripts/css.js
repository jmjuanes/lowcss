const fs = require("node:fs");
const sass = require("sass");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const {minify} = require("csso");

// output modules to compile
const outputModules = {
    "low.css": {
        output: "low.css",
        enabledModules: [
            "root",
            "reset",
            "starter",
            "markup",
            "theming",
            "utilities",
        ],
    },
};

const main = args => {
    console.log(`[build:css] generating '${args.join(", ")}'...`);
    const template = fs.readFileSync("main.scss", "utf8");
    // generate each module
    const allPromises = args.map(moduleName => {
        const item = outputModules[moduleName];
        const enabledModulesStr = JSON.stringify(item.enabledModules);
        const code = template.replace("$enabled-modules: ();", `$enabled-modules: (${enabledModulesStr});`);
        const {css} = sass.compileString(code, {
            loadPaths: [
                process.cwd(),
            ],
        });
        return postcss([autoprefixer])
            .process(css)
            .then(result => {
                // print all warnings (if any)
                result.warnings().forEach(warn => {
                    console.warn(warn.toString());
                });
                return minify(result.css, {
                    sourceMap: false,
                });
            })
            .then(result => {
                fs.writeFileSync(item.output, result.css);
                console.log(`[build:css] saved '${item.output}'`);
            });
    });
    // when all promises are finised
    Promise.all(allPromises).then(() => {
        console.log(`[build:css] build finished`);
    });
};

// Build css
main(process.argv.slice(2));
