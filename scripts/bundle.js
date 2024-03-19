const fs = require("node:fs");
const path = require("node:path");

// Global variables
const endl = "\n";
const useRegexp = /@use\s+\"([^"]*)\"(?:\s+as\s+([^;].*))?\s*;/; //For capturing includes

// @description split lines
const splitLines = lines => {
    return lines.replace(/\r/g, "").split(endl);
};

// @description arse a SCSS import line
// index and filePath are used for displaying errors and warnings
const parseSCSSImport = (line, index) => {
    const match = line.match(useRegexp);
    // Check for no match ---> throw error
    if (match === null) {
        console.error(`Unknown @use pattern '${line}' on line '${index}'`);
        process.exit(1);
    }
    // const isLocal = !match[1].startsWith("sass:");
    return {
        name: match[1],
        as: (typeof match[2] === "string") ? match[2] : null, // match[1].replace("sass:", ""),
    };
};

// @description Parse a SCSS file string
const parseScss = (name, content) => {
    const allModules = []; // To store files includes
    let lines = splitLines(content).filter((line, index) => {
        line = line.trim();
        if (line.length === 0 || line.startsWith("//")) {
            return false; // Ignore empty lines or comments
        }
        // Check for include library
        if (line.startsWith("@use")) {
            allModules.push(parseSCSSImport(line, index));
            return false; // Ignore use lines
        }
        return true; // Other ---> include line
    });
    // Get only local modules
    const localModules = allModules.filter(m => !m.name.startsWith("sass:"));
    if (localModules.length > 0) {
        const names = localModules.map(m => m.name).join("|");
        lines = lines.map(line => {
            return line.replace(new RegExp(`(${names})\\.`, "g"), "");
        });
    }
    return {
        name: name,
        content: lines.join(endl),
        modules: allModules,
    };
};

//Convert a SCSS file object to string
const stringifyScss = file => {
    let content = file.content; //Initialize the content
    //Add the modules at the start of the file
    file.modules.forEach(m => {
        let moduleImport = (m.as !== null) ? `@use "${m.name}" as ${m.as};` : `@use "${m.name}";`
        content = moduleImport + endl + content;
    });
    //Add the bundle header
    if (typeof file.header === "string") {
        content = file.header + endl + endl + content;
    }
    //Return the file content
    return content;
};

// @description read and parse the specified input file
const readScssFile = (file, processedFiles = []) => {
    const name = path.basename(file, ".scss");
    const result = parseScss(name, fs.readFileSync(file, "utf8"));
    result.modules.forEach(m => {
        if (!m.name.startsWith("sass:")) {
            if (!processedFiles.find(f => f.name === m.name)) {
                const moduleFile = path.join(path.dirname(file), `${m.name}.scss`);
                readScssFile(moduleFile, processedFiles);
            }
        }
    });
    // Add this file to the list of processed files
    processedFiles.push(result);
    return processedFiles;
};

// @description bundle generator
const bundle = args => {
    const input = path.join(process.cwd(), args[0]);
    const output = path.join(process.cwd(), args[1]);
    const files = readScssFile(input);
    // Generate the list of required sass modules
    const sassModules = new Set();
    const contents = files.map(file => {
        // 1. Get all sass modules
        file.modules.forEach(m => {
            if (m.name.startsWith("sass:")) {
                sassModules.add(m.name);
            }
        });
        // 2. return content
        return file.content;
    });
    const sassImports = Array.from(sassModules).map(name => {
        return `@use "${name}";`;
    });
    const content = sassImports.join(endl) + endl + contents.join(endl);
    // Save file
    fs.writeFile(output, content, "utf8");
};

bundle(process.argv.slice(2));
