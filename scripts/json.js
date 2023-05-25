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
        content.utilities = content.utilities.map(utility => {
            // Fix pseudos and properties fields of json
            // If those lists only contains one item, it is saved as a string instead of as an array
            utility.properties = [utility.properties].flat();
            utility.pseudos = (Array.isArray(utility.pseudos) ? utility.pseudos : [utility.pseudos]).flat();
            // Fix values: convert arrays to joined strings
            Object.keys(utility.values).forEach(key => {
                const value = utility.values[key];
                if (Array.isArray(value)) {
                    const delimiter = utility === "font-family" ? ", " : " ";
                    utility.values[key] = value.join(delimiter);
                }
            });
            return utility;
        });
        // Print output json
        process.stdout.write(printJson(content) + "\n");
    });
};

run();
