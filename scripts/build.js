const fs = require("node:fs");
const path = require("node:path");
const sass = require("sass");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const {minify} = require("csso");

// output modules to compile
const outputModules = {
    "low.css": {
        modules: ["themes", "utilities"],
    },
    "low.utilities.css": {
        modules: ["utilities"],
    },
    "low.themes.css": {
        modules: ["themes"],
    },
};

// @description build scss
const buildScss = code => {
    const {css} = sass.compileString(code, {
        loadPaths: [
            process.cwd(),
        ],
    });
    return postcss([autoprefixer]).process(css).then(result => {
        result.warnings().forEach(warn => {
            console.warn(warn.toString());
        });
        return minify(result.css);
    });
};

const build = () => {
    const template = fs.readFileSync("main.scss", "utf8");
    const allPromises = Object.keys(outputModules).map(output => {
        const code = template.replace("$enabled-modules: ();", `$enabled-modules: (${JSON.stringify(outputModules[output].modules)});`);
        return buildScss(code).then(result => {
            return fs.writeFileSync(output, result.css);
        });
    });
    Promise.all(allPromises).then(() => {
        console.log("Build complete");
    });
};

// Build lowcss
build();
