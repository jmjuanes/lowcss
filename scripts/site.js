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
    };
};

const build = async () => {
    const m = (await import("mikel")).default;
    const template = await fs.readFile(path.join(process.cwd(), "index.mustache"), "utf8");
    const result = m(template, getData());
    await fs.writeFile(path.join(process.cwd(), "public", "index.html"), result, "utf8");
};

build();
