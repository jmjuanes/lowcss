const fs = require("node:fs");
const path = require("node:path");

// Import low configuration
const low = require("../low.json");

const run = args => {
    // const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const colors = {}; // Output colors object
    Object.keys(low.colors).forEach(name => {
        // Check if this color has a shace defined
        if (name.indexOf("-") > -1) {
            const [key, shade] = name.split("-");
            if (typeof colors[key] === "undefined") {
                colors[key] = {};
            }
            colors[key][shade] = low.colors[name];
        }
        // Other case, just save the color name and value
        // else {
        //     colors[name] = low.colors[name];
        // }
    });
    const filePath = path.join(process.cwd(), args[1]);
    fs.writeFileSync(filePath, JSON.stringify(colors, null, "    "), "utf8");
};

run(process.argv.slice(2));
