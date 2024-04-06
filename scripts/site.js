const fs = require("node:fs/promises");
const path = require("node:path");
const pkg = require("../package.json");

const getData = () => {
    return {
        site: {
            version: pkg.version,
            title: pkg.title,
            description: pkg.description,
            repository: pkg.repository,
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

const build = async () => {
    const m = (await import("mikel")).default;
    const template = await fs.readFile(path.join(process.cwd(), "index.mustache"), "utf8");
    const result = m(template, getData());
    await fs.writeFile(path.join(process.cwd(), "public", "index.html"), result, "utf8");
};

build();
