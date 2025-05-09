import * as fs from "node:fs";
import * as path from "node:path";
import postcss from "postcss";
import postcssImport from "postcss-import";
import autoprefixer from "autoprefixer";
import {minify} from "csso";
import lowPlugin from "../plugin.js";

const main = () => {
    console.log(`[build:css] generating 'low.css'...`);
    const input = fs.readFileSync("index.css", "utf8");
    return postcss([autoprefixer, postcssImport, lowPlugin])
        .process(input)
        .then(result => {
            // print all warnings (if any)
            result.warnings().forEach(warn => {
                console.warn(warn.toString());
            });
            // return minify(result.css, {
            //     sourceMap: false,
            // });
            return result;
        })
        .then(result => {
            fs.writeFileSync("low.css", result.css);
            console.log(`[build:css] build finished`);
        });
};

// build css
main();
