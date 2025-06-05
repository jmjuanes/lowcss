import * as fs from "node:fs";
import * as path from "node:path";
import pkg from "../package.json" with {type: "json"};

// tiny helper to read and write a JSON file
const readJson = file => {
    return JSON.parse(fs.readFileSync(file, "utf8"));
};
const writeJson = (file, data) => {
    return fs.writeFileSync(file, JSON.stringify(data, null, "    "), "utf8");
};

// Fix the version in each package.json of the packages folder
const packagesDir = path.join(process.cwd(), "packages");
fs.readdirSync(packagesDir).forEach(dir => {
    const packageFile = path.join(packagesDir, dir, "package.json");
    writeJson(packageFile, {
        ...readJson(packageFile), 
        version: pkg.version,
    });
});
