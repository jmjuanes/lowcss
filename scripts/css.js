const fs = require("node:fs");
const sass = require("sass");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const {minify} = require("csso");

const main = args => {
    console.log(`[build:css] generating '${args[0]}'...`);
    const code = fs.readFileSync("main.scss", "utf8");
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
            fs.writeFileSync(args[0], result.css);
            console.log(`[build:css] saved '${args[0]}'`);
        });
};

// Build css
main(process.argv.slice(2));
