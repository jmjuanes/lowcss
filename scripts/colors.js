const fs = require("node:fs");

const jsonStr = data => {
    return JSON.stringify(data, null, "    ");
};

const main = args => {
    const low = JSON.parse(fs.readFileSync("low.json", "utf8"));
    // const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const colors = {}; // Output colors object
    Object.keys(low.variables.colors).forEach(name => {
        // Check if this color has a shace defined
        if (name.indexOf("-") > -1) {
            const [key, shade] = name.split("-");
            if (typeof colors[key] === "undefined") {
                colors[key] = {};
            }
            colors[key][shade] = low.variables.colors[name];
        }
        // Other case, just save the color name and value
        // else {
        //     colors[name] = low.colors[name];
        // }
    });
    // save file
    fs.writeFileSync(args[0], jsonStr(colors), "utf8");
    console.log(`[build:colors] saved '${args[0]}'`);
};

main(process.argv.slice(2));
