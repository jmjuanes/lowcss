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
            "utilities",
        ],
    },
    "low.themes.css": {
        output: "low.themes.css",
        enabledModules: [
            "themes",
        ],
    },
    "low.base.css": {
        output: "low.base.css",
        enabledModules: [
            "root",
            "reset",
            "starter",
        ],
    },
    "low.markup.css": {
        output: "low.markup.css",
        enabledModules: [
            "markup",
        ],
    },
    "low.root.css": {
        output: "low.root.css",
        enabledModules: [
            "root",
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

const build = async () => {
    const template = fs.readFileSync("main.scss", "utf8");
    console.log(`[build:css] generating ${outputModules.length} modules...`);
    // generate each module
    for (let i = 0; i < outputModules.length; i++) {
        const item = outputModules[i];
        const enabledModulesStr = JSON.stringify(item.enabledModules);
        const code = template.replace("$enabled-modules: ();", `$enabled-modules: (${enabledModulesStr});`);
        const result = await buildScss(code);
        fs.writeFileSync(item.output, result.css);
        console.log(`[build:css] saved '${item.output}'`);
    }
    // build finished
    console.log(`[build:css] build finished`);
};

// Build lowcss
build();
