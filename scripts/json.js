const printJson = content => {
    return JSON.stringify(content, null, "    ");
};

const run = () => {
    const data = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => data.push(chunk));
    process.stdin.on("end", () => {
        const content = JSON.parse(data.join(""));
        Object.keys(content.utilities).forEach(utility => {
            // Fix variants and properties fields of json
            // If those lists only contains one item, it is saved as a string instead of as an array
            ["variants", "properties"].forEach(key => {
                content.utilities[utility][key] = [content.utilities[utility][key]].flat();
            });
            // Fix values: convert arrays to joined strings
            Object.keys(content.utilities[utility].values).forEach(key => {
                const value = content.utilities[utility].values[key];
                if (Array.isArray(value)) {
                    const delimiter = utility === "font-family" ? ", " : " ";
                    content.utilities[utility].values[key] = value.join(delimiter);
                }
            });
        });
        // Print output json
        process.stdout.write(printJson(content) + "\n");
    });
};

run();
