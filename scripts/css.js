import fs from "node:fs/promises";
import postcss from "postcss";
import postcssImport from "postcss-import";
import autoprefixer from "autoprefixer";
import { minify } from "csso";
import lowPlugin from "../plugin.js";

const INPUT_FILE = "index.css";
const OUTPUT_FILE = "low.css";

const build = () => {
    console.log(`[build:css] generating '${OUTPUT_FILE}'...`);
    const plugins = [
        postcssImport(),
        lowPlugin(),
        autoprefixer(),
    ];
    return fs.readFile(INPUT_FILE, "utf8")
        .then(input => {
            return postcss(plugins).process(input, {
                from: INPUT_FILE,
                to: OUTPUT_FILE,
                map: false,
            });
        })
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
            return fs.writeFile(OUTPUT_FILE, result.css);
        })
        .then(() => {
            console.log(`[build:css] build finished`);
        });
};

// build css
build().catch(console.error);
