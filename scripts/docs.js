import * as path from "node:path";
import press from "mikel-press";
import hljs from "highlight.js";
import pkg from "../package.json" with {type: "json"};
import websiteConfig from "../website.config.json" with {type: "json"};

press({
    source: path.join(process.cwd(), "docs"),
    destination: path.join(process.cwd(), "www"),
    version: pkg.version,
    repository: pkg.repository,
    ...websiteConfig,
    mikelOptions: {
        helpers: {
            withPage: params => {
                const p = params?.data?.site?.pages?.find(p => p.name === args[0]);
                return p ? params.fn(p) : "";
            },
        },
        functions: {
            icon: args => {
                return `<svg width="1em" height="1em"><use xlink:href="/vendor/icons.svg#${args.opt.icon}"></use></svg>`;
            },
            highlight: params => {
                return hljs.highlight(params.opt.code.trim(), {language: params.opt.language}).value;
            },
        },
    },
    plugins: [
        press.PartialsPlugin(),
        press.CopyAssetsPlugin({
            patterns: [
                {from: "low.css"},
            ],
        }),
        press.CopyAssetsPlugin({
            basePath: "vendor",
            patterns: [
                {from: "node_modules/@josemi-icons/svg/sprite.svg", to: "icons.svg"},
                {from: "node_modules/codecake/codecake.js"},
                {from: "node_modules/codecake/codecake.css"},
                {from: "node_modules/highlight.js/styles/nord.css", to: "highlight.css"},
                {from: "node_modules/lz-string/libs/lz-string.min.js"},
            ],
        }),
        press.FrontmatterPlugin(),
        press.ContentPagePlugin(),
    ],
});
