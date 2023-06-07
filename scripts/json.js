const pkg = require("../package.json");

const printJson = content => {
    return JSON.stringify(content, null, "    ");
};

const run = () => {
    const data = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => data.push(chunk));
    process.stdin.on("end", () => {
        const content = JSON.parse(data.join(""));
        content.version = pkg.version;
        Object.keys(content.utilities).forEach(key => {
            const utility = content.utilities[key];
            // Fix values: convert arrays to joined strings
            Object.keys(utility.values).forEach(key => {
                const value = utility.values[key];
                if (Array.isArray(value)) {
                    const delimiter = utility === "font-family" ? ", " : " ";
                    utility.values[key] = value.join(delimiter);
                }
            });
        });
        // Print output json
        process.stdout.write(printJson(content) + "\n");
    });
};

run();
