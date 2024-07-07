const fs = require("node:fs");
const path = require("node:path");
const marked = require("marked");
const frontMatter = require("front-matter");
const pkg = require("../package.json");
const low = require("../low.json");

// Excluded colors
const excludedColors = ["black", "white", "transparent", "current"];

// @private capitalize the provided string
const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// @description get colors names
const getColorNames = () => {
    const colors = Object.keys(low.colors)
        .filter(color => !excludedColors.includes(color))
        .map(color => color.split("-")[0]);
    return Array.from(new Set(colors));
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
            link: `#${item.name}`,
            description: item.description,
            keywords: item.name.split("-"),
        });
    });
    return menu;
};

const getData = () => {
    const colors = getColorNames();
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
                        {title: "Introduction", link: "#introduction"},
                        {title: "Installation", link: "#installation"},
                        {title: "Usage", link: "#usage"},
                    ],
                },
                globals: {
                    title: "Globals",
                    items: [
                        {title: "Root CSS Variables", link: "#root"},
                    ],
                },
                base: {
                    title: "Base Styles",
                    items: [
                        {title: "Reset", link: "#reset"},
                        {title: "Keyframes", link: "#keyframes"},
                        {title: "Helpers", link: "#helpers"},
                        {title: "Markup", link: "#markup", version: "v0.22.0"},
                    ],
                },
                ...getUtilitiesMenu(utilities),
            }),
            data: {
                utilities: utilities,
                colors: colors.map(color => {
                    const shades = Object.keys(low.colors)
                        .filter(key => key.startsWith(color + "-"))
                        .map(key => ({
                            name: key,
                            shade: key.split("-")[1],
                            value: low.colors[key],
                        }));
                    return {
                        name: color,
                        shades: shades,
                    };
                }),
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
    };
};

// @description build site
const build = async () => {
    const input = path.join(process.cwd(), "docs");
    const output = path.join(process.cwd(), "www");
    const m = (await import("mikel")).default;
    const data = getData();
    const template = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
    const files = fs.readdirSync(input, "utf8");
    // 1. Process partials files
    files.filter(file => path.extname(file) === ".md" && file.startsWith("_")).forEach(file => {
        const page = readMarkdownFile(path.join(input, file));
        data.site.partials[page.name.slice(1)] = page.content;
    });
    // 2. Process pages files
    files.filter(file => path.extname(file) === ".md" && !file.startsWith("_")).forEach(file => {
        const page = readMarkdownFile(path.join(input, file));
        page.content = page.content.replaceAll("{{&gt;", "{{>");
        data.site.pages.push(page);
    });
    // 3. Generate documentation pages
    data.site.pages.forEach(page => {
        const content = m(template, {...data, page}, {
            helpers: {},
            partials: {
                ...data.site.partials,
                content: page.content,
            },
        });
        console.log(`[build:site] saving file to www/${page.name}.html`);
        fs.writeFileSync(path.join(output, page.name + ".html"), content, "utf8");
    });
    // await fs.writeFile(path.join(cwd, "www/index.html"), result, "utf8");
    // await fs.writeFile(path.join(cwd, "www/navigation.json"), JSON.stringify(data.site.sidenav), "utf8");
};

build();
