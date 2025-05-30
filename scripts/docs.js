import * as fs from "node:fs";
import * as path from "node:path";
import mikel from "mikel";
import press from "mikel-press";
import markdown from "mikel-markdown";
import hljs from "highlight.js";
import pkg from "../package.json" with {type: "json"};
import websiteConfig from "../website.config.json" with {type: "json"};
import low from "../low.json" with {type: "json"};

// @description render the provided icon
const renderIcon = icon => {
    return `<svg width="1em" height="1em"><use xlink:href="/vendor/icons.svg#${icon}"></use></svg>`;
};

// @description get examples
const getExamples = () => {
    const examplesPath = path.join(process.cwd(), "docs", "examples");
    const examples = fs.readdirSync(examplesPath).filter(file => {
        return file.endsWith(".html");
    });
    return examples.map(file => {
        const content = fs.readFileSync(path.join(examplesPath, file), "utf-8");
        const {body, attributes} = press.utils.frontmatter(content);
        return {
            name: path.basename(file, ".html"),
            content: mikel(body, attributes, {
                functions: {
                    icon: params => renderIcon(params.opt.icon),
                },
            }),
            attributes: attributes,
        };
    });
};

const MarkdownPlugin = () => ({
    name: "MarkdownPlugin",
    beforeTransform: context => {
        context.template.use(markdown({
            classNames: {
                link: "font-medium underline",
                code: "bg-gray-100 rounded-md py-1 px-2 text-xs font-mono font-medium",
                table: "w-full mb-6",
                tableColumn: "p-3 border-b-1 border-gray-200",
                tableHead: "font-bold",
            },
        }));
    },
    transform: () => {
        return null;
    },
});

// @description plugin to inject utilities in the table of contents
const UtilitiesTableOfContentsPlugin = () => ({
    name: "UtilitiesSidebarPlugin",
    transform: (context, node) => {
        if (node.label === press.LABEL_PAGE && node.attributes?.tableOfContents === "@utilities") {
            const categories = new Map();
            low.utilities.forEach(u => {
                if (u.category && !categories.has(u.category)) {
                    categories.set(u.category, {
                        category: u.category,
                        items: [],
                    });
                }
                categories.get(u.category).items.push({
                    text: u.name,
                    link: `#${u.name}`,
                });
            });
            node.attributes.tableOfContents = Array.from(categories.values());
        }
    },
});

press({
    source: path.join(process.cwd(), "docs"),
    destination: path.join(process.cwd(), "www"),
    version: pkg.version,
    repository: pkg.repository,
    low: {
        breakpoints: low.breakpoints,
        theme: low.theme,
        utilities: low.utilities,
    },
    examples: getExamples(),
    ...websiteConfig,
    mikelOptions: {
        helpers: {
            withPage: params => {
                const p = params?.data?.site?.pages?.find(p => p.path === params.args[0]);
                return p ? params.fn(p) : "";
            },
            withUtility: params => {
                const u = low.utilities.find(u => u.name === params.args[0]);
                return u ? params.fn(u) : "";
            },
        },
        functions: {
            icon: params => renderIcon(params.opt.icon),
            highlight: params => {
                return hljs.highlight((params?.opt?.code || "").trim(), {language: params.opt.language || "html"}).value;
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
        MarkdownPlugin(),
        press.FrontmatterPlugin(),
        UtilitiesTableOfContentsPlugin(),
        press.ContentPagePlugin(),
    ],
});
