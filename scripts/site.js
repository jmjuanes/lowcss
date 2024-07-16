const fs = require("node:fs");
const path = require("node:path");
const marked = require("marked");
const frontMatter = require("front-matter");
const pkg = require("../package.json");
const low = require("../low.json");
const colors = require("../colors.json");

// @private capitalize the provided string
const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
            hasResponsiveVariant: config.variants.includes("responsive"),
            pseudos: config.variants.filter(v => v !== "default" && v !== "responsive"),
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
                        {title: "Introduction", link: "/docs/introduction"},
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
            ],
            data: {
                utilities: utilities,
                colors: colors,
                variables: {
                    colors: low.colors,
                    fonts: low.fonts,
                },
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
    const m = (await import("mikel")).default;
    const data = getData();
    const template = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
    // const files = fs.readdirSync(input, "utf8");
    // 1. Process partials files
    // files.filter(file => path.extname(file) === ".md" && file.startsWith("_")).forEach(file => {
    //     const page = readMarkdownFile(path.join(input, file));
    //     data.site.partials[page.name.slice(1)] = page.content;
    // });
    // 2. Process pages files
    data.site.pages = fs.readdirSync(input, "utf8")
        .filter(file => path.extname(file) === ".md" && !file.startsWith("_"))
        .map(file => readMarkdownFile(path.join(input, file)));
    // 3. Generate documentation pages
    data.site.pages.forEach(page => {
        const content = m(template, {...data, page}, {
            helpers: {
                withPage: (pageName, opt) => {
                    const p = data.site.pages.find(p => p.name === pageName);
                    return p ? opt.fn(p) : "";
                },
            },
            partials: {
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
