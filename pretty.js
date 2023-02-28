let data = "";
process.stdin.setEncoding("utf8");

// Print JSON
const printJson = content => {
    // return JSON.stringify(content);
    return JSON.stringify(content, null, "    ");
};

// Read chunks from stdin
process.stdin.on("data", chunk => {
    data = data + chunk;
});

// Read completed
process.stdin.on("end", () => {
    const content = JSON.parse(data);
    Object.keys(content).forEach(utility => {
        // Fix variants and properties fields of json
        // If those lists only contains one item, it is saved as a string instead of as an array
        ["variants", "properties"].forEach(key => {
            content[utility][key] = [content[utility][key]].flat();
        });
        // Fix values: convert arrays to joined strings
        Object.keys(content[utility].values).forEach(key => {
            const value = content[utility].values[key];
            if (Array.isArray(value)) {
                const delimiter = utility === "font-family" ? ", " : " ";
                content[utility].values[key] = value.join(delimiter);
            }
        });
    });
    // Print output json
    process.stdout.write(printJson(content) + "\n");
});
