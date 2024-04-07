const fs = require("node:fs/promises");
const path = require("node:path");
const marked = require("marked");
const pkg = require("../package.json");

const getData = () => {
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
                    ],
                },
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
    await fs.writeFile(path.join(process.cwd(), "public", "index.html"), result, "utf8");
};

build();
