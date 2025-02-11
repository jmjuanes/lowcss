const fs = require("node:fs");
const sass = require("sass");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const {minify} = require("csso");

// output modules to compile
const outputModules = Object.values({
    "low.css": {
        output: "low.css",
        enabledModules: [
            "root",
            "reset",
            "starter",
            "markup",
            "themes",
            "utilities",
        ],
    },
    "low.utilities.css": {
        output: "low.utilities.css",
        enabledModules: [
            "root",
            "utilities",
        ],
    },
    "low.base.css": {
        output: "low.base.css",
        enabledModules: [
            "reset",
            "starter",
        ],
    },
    "low.extensions.css": {
        output: "low.extensions.css",
        enabledModules: [
            "root",
            "markup",
            "themes",
        ],
    },
});

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
        return minify(result.css, {
            sourceMap: false,
        });
    });
};

const build = () => {
    const template = fs.readFileSync("main.scss", "utf8");
    console.log(`[build:css] generating ${outputModules.length} modules...`);
    // generate each module
    const allPromises = outputModules.map(item => {
        const enabledModulesStr = JSON.stringify(item.enabledModules);
        const code = template.replace("$enabled-modules: ();", `$enabled-modules: (${enabledModulesStr});`);
        return buildScss(code).then(result => {
            fs.writeFileSync(item.output, result.css);
            console.log(`[build:css] saved '${item.output}'`);
        });
    });
    // when all promises are finised
    Promise.all(allPromises).then(() => {
        console.log(`[build:css] build finished`);
    });
};

// Build lowcss
build();
