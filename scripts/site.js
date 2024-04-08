const fs = require("node:fs/promises");
const path = require("node:path");
const marked = require("marked");
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
            groupName: capitalize(config.attributes.group),
            description: config.attributes.description,
            variants: config.variants,
            hasDefaultVariant: config.variants.includes("default"),
            hasResponsiveVariant: config.variants.includes("responsive"),
            pseudos: config.variants.filter(v => v !== "default" && v !== "responsive"),
            values: Object.keys(config.values).map(key => ({
                name: `${config.classname}${key !== "DEFAULT" ? "-" + key : ""}`,
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
                title: item.groupName,
                items: [],
            };
        }
        menu[item.groupName].items.push({
            title: item.name,
            link: `#${item.name}`,
        });
    });
    return menu;
};

const getData = () => {
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
                customization: {
                    title: "Customize",
                    items: [
                        {title: "Colors", link: "#colors"},
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
                    ],
                },
                ...getUtilitiesMenu(utilities),
            }),
        },
        features: [
            {
                title: "Lightning-fast development",
                description: "Prototype and develop at an accelerated pace, focusing on the functionality and design.",
                icon: "bolt",
            },
            {
                title: "Customizable to your brand",
                description: "Tailor the framework to match your brand's aesthetic seamlessly.",
                icon: "color-swatch",
            },
            {
                title: "Responsive design made easy",
                description: "Effortlessly create layouts that adapt to different screen sizes and devices.",
                icon: "mobile",
            },
        ],
        colors: getColorNames().map(color => {
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
        utilities: utilities,
    };
};

// @description get partials
const getPartials = async () => {
    const partials = {};
    const docsPath = path.join(process.cwd(), "docs");
    const markdownFiles = await fs.readdir(docsPath, "utf8");
    for (let i = 0; i < markdownFiles.length; i++) {
        const file = markdownFiles[i];
        if (path.extname(file) === ".md") {
            const content = await fs.readFile(path.join(docsPath, file), "utf8");
            partials[path.basename(file, ".md")] = marked.parse(content);
        }
    }
    return partials;
};

const build = async () => {
    const m = (await import("mikel")).default;
    const template = await fs.readFile(path.join(process.cwd(), "index.mustache"), "utf8");
    const partials = await getPartials();
    const result = m(template, getData(), {partials});
    await fs.writeFile(path.join(process.cwd(), "www", "index.html"), result, "utf8");
};

build();
