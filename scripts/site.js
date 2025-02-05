const fs = require("node:fs");
const path = require("node:path");
const marked = require("marked");
const frontMatter = require("front-matter");
const hljs = require("highlight.js/lib/common");
const pkg = require("../package.json");
const low = require("../low.json");
const colors = require("../colors.json");

const endl = "\n";

// @private capitalize the provided string
const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// @private remove empty lines in code
const removeEmptyLines = code => {
    return code.split(endl).filter(line => !!line.trim()).join(endl);
};

// @description Generate utilities data
const getUtilities = () => {
    return Object.keys(low.utilities).map(utilityName => {
        const config = low.utilities[utilityName];
        return {
            name: utilityName,
            groupName: config.attributes.group,
            description: config.attributes.description,
            url: config.attributes.url,
            variants: config.variants,
            hasDefaultVariant: config.variants.includes("default"),
            // hasResponsiveVariant: config.variants.includes("responsive"),
            // hasPrintVariant: config.variants.includes("print"),
            media: config.variants.filter(v => v === "responsive" || v === "print"),
            pseudos: config.variants.filter(v => v !== "default" && v !== "responsive" && v !== "print"),
            values: Object.keys(config.values).map(key => ({
                name: [config.classname || "", (key !== "DEFAULT" ? key : "")].filter(Boolean).join("-"),
                values: config.properties.map(prop => {
                    return {key: prop, value: config.values[key]};
                }),
            })),
        };
    });
};

// @description build utilities menu
const getUtilitiesMenu = utilities => {
    const menu = {};
    utilities.forEach(item => {
        if (!menu[item.groupName]) {
            menu[item.groupName] = {
                title: capitalize(item.groupName),
                items: [],
            };
        }
        menu[item.groupName].items.push({
            title: item.name,
            link: `/docs/utilities#${item.name}`,
            description: item.description,
            keywords: item.name.split("-"),
        });
    });
    return menu;
};

// read partials
const getPartials = baseFolder => {
    const result = {data: {}, code: {}};
    const readdir = (folderPaths, data) => {
        const folder = path.join(baseFolder, ...folderPaths);
        return fs.readdirSync(folder, "utf8").forEach(file => {
            // 1. check if file is a directory
            if (fs.statSync(path.join(folder, file)).isDirectory()) {
                data[file] = {}; // initialize slot for data
                return readdir([...folderPaths, file], data[file]);
            }
            // 2. read file content
            if (path.extname(file) === ".html") {
                const content = frontMatter(fs.readFileSync(path.join(folder, file), "utf8"));
                const name = path.basename(file, ".html").replace(/-/g, "_");
                data[name] = content.attributes; // save data
                result.code[[...folderPaths, name].join(".")] = content.body; // save code
            }
        });
    };
    readdir([], result.data);
    return result;
};

const getData = () => {
    // const colors = getColorNames();
    const utilities = getUtilities();
    return {
        site: {
            version: pkg.version,
            title: pkg.title,
            description: pkg.description,
            repository: pkg.repository,
            sidenav: Object.values({
                gettingStarted: {
                    title: "Getting Started",
                    items: [
                        {title: "Introduction", link: "/docs/"},
                        {title: "Installation", link: "/docs/installation"},
                        {title: "Usage", link: "/docs/usage"},
                    ],
                },
                globals: {
                    title: "Globals",
                    items: [
                        {title: "Root CSS Variables", link: "/docs/root"},
                    ],
                },
                base: {
                    title: "Base Styles",
                    items: [
                        {title: "Reset", link: "/docs/reset"},
                        {title: "Keyframes", link: "/docs/keyframes"},
                        {title: "Helpers", link: "/docs/helpers"},
                        {title: "Markup", link: "/docs/markup", version: "v0.22.0"},
                    ],
                },
                ...getUtilitiesMenu(utilities),
            }),
            navbar: [
                {title: "Documentation", link: "/docs"},
                {title: "Colors", link: "/colors"},
                {title: "Themes", link: "/themes"},
                {title: "Examples", link: "/examples"},
                {title: "Playground", link: "/playground"},
            ],
            data: {
                utilities: utilities,
                colors: colors,
                variables: low.variables,
                examples: [],
            },
            pages: [],
            partials: {},
        },
        page: null,
    };
};

// @description read a markdown file
const readMarkdownFile = file => {
    const fileContent = fs.readFileSync(file, "utf8");
    const page = frontMatter(fileContent);
    return {
        name: path.basename(file, ".md"),
        content: marked.parse(page.body || ""),
        data: page.attributes || {},
        url: page.attributes?.permalink || path.join("/", path.basename(file, ".md") + ".html"),
    };
};

// @description build site
const build = async () => {
    const input = path.join(process.cwd(), "docs");
    const output = path.join(process.cwd(), "www");
    const examplesFolder = path.join(process.cwd(), "examples");
    const m = (await import("mikel")).default;
    const template = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
    const partials = getPartials(path.join(process.cwd(), "partials"));
    const data = getData();
    data.partials = partials.data;
    // Initialize examples data
    data.site.data.examples = fs.readdirSync(examplesFolder, "utf8")
        .filter(file => path.extname(file) === ".html")
        .map(file => {
            const fileContent = fs.readFileSync(path.join(examplesFolder, file), "utf8");
            const example = frontMatter(fileContent);
            return {
                name: path.basename(file, ".html"),
                content: m(example.body || "", example.attributes || {}),
                data: example.attributes || {},
            };
        });
    // 1. Process pages files
    data.site.pages = fs.readdirSync(input, "utf8")
        .filter(file => path.extname(file) === ".md" && !file.startsWith("_"))
        .map(file => readMarkdownFile(path.join(input, file)));
    // 2. Generate documentation pages
    data.site.pages.forEach(page => {
        const content = m(template, {...data, page}, {
            helpers: {
                withPage: (pageName, opt) => {
                    const p = data.site.pages.find(p => p.name === pageName);
                    return p ? opt.fn(p) : "";
                },
            },
            partials: {
                ...partials.code,
                content: page.content,
            },
            functions: {
                contrastColor: color => {
                    // https://www.w3.org/TR/AERT/#color-contrast
                    // Source: https://stackoverflow.com/a/72595895 
                    const lum = [0.299, 0.587, 0.114].reduce((result, value, index) => {
                        return parseInt(color.substr(index * 2 + 1, 2), 16) * value + result;
                    }, 0);
                    return lum < 128 ? "#fff" : "#000";
                },
                cleanUrl: pageUrl => {
                    return path.join("/", path.dirname(pageUrl), path.basename(pageUrl, ".html"));
                },
                highlight: code => {
                    return hljs.highlight(removeEmptyLines(code), {language: "html"}).value;
                },
                icon: name => {
                    return `<svg width="1em" height="1em"><use xlink:href="/sprite.svg#${name}"></use></svg>`;
                },
            },
        });
        const pageFolder = path.join(output, path.dirname(page.url));
        if (!fs.existsSync(pageFolder)) {
            fs.mkdirSync(pageFolder, {recursive: true});
        }
        console.log(`[build:site] saving file to www${page.url}`);
        fs.writeFileSync(path.join(output, page.url), content, "utf8");
    });
    // await fs.writeFile(path.join(cwd, "www/index.html"), result, "utf8");
    // await fs.writeFile(path.join(cwd, "www/navigation.json"), JSON.stringify(data.site.sidenav), "utf8");
};

build();
