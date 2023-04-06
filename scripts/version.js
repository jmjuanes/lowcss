const pkg = require("../package.json");

process.stdout.write(`$version: "${pkg.version}";`);
process.stdout.end("");
