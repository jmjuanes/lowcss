const fs = require("node:fs/promises");
const path = require("node:path");
const React = require("react");
const {renderToStaticMarkup} = require("react-dom/server");
const runtime = require("react/jsx-runtime");
const matter = require("gray-matter");
const mochicons = require("@mochicons/node");

const pkg = require("../package.json");
const data = require("../dist/low.json");

const docsFolder = path.join(process.cwd(), "docs");
const publicFolder = path.join(process.cwd(), "public");
const log = msg => console.log(`[docs] ${msg}`);

const importPackages = () => {
    return Promise.all([
        import("@mdx-js/mdx"),
    ]);
};

const Icon = props => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path d={mochicons[props.icon].path} fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const pageComponents = {
    "h1": props => <h1 className="mt:0 mb:4 text:5xl font:black">{props.children}</h1>,
    "h2": props => <h2 className="mt:0 mb:4 text:4xl font:black">{props.children}</h2>,
    "h3": props => <h3 className="mt:0 mb:4 text:3xl font:black">{props.children}</h3>,
    "h4": props => <h4 className="mt:8 mb:4 text:2xl font:black">{props.children}</h4>,
    "h5": props => <h5 className="mt:8 mb:4 text:xl font:bold">{props.children}</h5>,
    "h6": props => <h6 className="mt:8 mb:4 text:lg font:bold">{props.children}</h6>,
    "p": props => <p className="mt:6 mb:6">{props.children}</p>,
    "code": props => <code className="font:mono text:sm">{props.children}</code>,
    "pre": props => (
        <pre className="p:6 r:md bg:gray-800 text:white overflow:auto mb:8">
            {props.children}
        </pre>
    ),
    "a": props => <a {...props} className="text:no-underline text:blue-500 text:blue-600:hover">{props.children}</a>,
    Icon: props => <Icon {...props} />,
    Separator: () => <div className="my:16 b:2 b:dashed b:gray-300" />,
    ExampleCode: props => (
        <div className={`${props.className || ""} bg:gray-100 p:8 r:md mb:4 mt:6`}>
            {props.children}
        </div>
    ),
};

const getSections = () => {
    return Object.keys(data.utilities).reduce((prevGroups, key) => ({
        ...prevGroups,
        [data.utilities[key].group]: [...(prevGroups[data.utilities[key].group] || []), key],
    }), {});
};

const MenuSection = props => (
    <div className="text:gray-800 mb:6">{props.children}</div>
);

const MenuGroup = props => (
    <div className="font:bold mb:1 text:capitalize">{props.text}</div>
);

const MenuLink = props => (
    <a href={props.href} className="d:block text:gray-800 text:blue-700:hover text:no-underline py:2">
        <span className="text:sm">{props.text}</span>
    </a>
);

const HomeLayout = props => (
    <div className="maxw:screen-xl mx:auto">
        {props.page.element}
        {props.page.data.features && (
            <div className="w:full d:grid gap:8 cols:2@md cols:1">
                {props.page.data.features.map(feature => (
                    <div className="bg:gray-100 r:md p:8" key={feature.title}>
                        <div className="mb:4 text:2xl">
                            {React.createElement(pageComponents.Icon, {icon: feature.icon})}
                        </div>
                        <div className="font:bold text:lg mb:4">{feature.title}</div>
                        <div className="">{feature.description}</div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const DocsLayout = props => (
    <React.Fragment>
        <div className="d:none d:block@lg w:64 flex:shrink-0">
            <div className="w:full position:sticky top:0 px:6 py:8 h:screen overflow-y:auto text:gray-300 scrollbar">
                <MenuSection>
                    <MenuGroup text="Getting Started" />
                    <MenuLink href="introduction.html" text="Introduction" />
                    <MenuLink href="installation.html" text="Installation" />
                    <MenuLink href="naming.html" text="Naming Utilities" />
                </MenuSection>
                <MenuSection>
                    <MenuGroup text="Basics" />
                    <MenuLink href="state.html" text="State Variants" />
                    <MenuLink href="responsive.html" text="Responsive Variants" />
                    <MenuLink href="colors.html" text="Colors" />
                </MenuSection>
                {Object.entries(getSections()).map(section => (
                    <MenuSection key={section[0]}>
                        <MenuGroup text={section[0]} />
                        {section[1].map(item => (
                            <MenuLink key={item} href={`utilities.html#${item}`} text={item} />
                        ))}
                    </MenuSection>
                ))}
            </div>
        </div>
        <div className="w:full maxw:screen-md mx:auto px:6 px:0@lg py:8">
            <h1 className="mt:0 mb:0 text:5xl font:black">
                {props.page.data.title}
            </h1>
            <div className="mt:0 mb:10 text:xl text:gray-500 font:medium lh:relaxed">{props.page.data.description}</div>
            {props.page.element}
        </div>
    </React.Fragment>
);

const PageWrapper = props => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" />
            <meta name="description" content="" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" />
            <link rel="stylesheet" href="./low.css" />
            <title>LowCSS {props.version}</title>
        </head>
        <body className="bg:white m:0 p:0 font:inter text:gray-800 lh:normal">
            {/* Header */}
            <div className="w:full maxw:screen-2xl h:16 px:6 mx:auto d:flex items:center justify:between">
                <a href="./index.html" className="d:flex items:center gap:1 text:gray-800 text:no-underline">
                    <div className="text:2xl">
                        <Icon icon="arrow-square-down" />
                    </div>
                    <div className="font:bold text:lg">LowCSS.</div>
                </a>
                <div className="d:flex gap:4 text:sm">
                    <a href="./utilities.html" className="text:gray-800 font:bold text:no-underline">Utilities</a>
                    <a href={pkg.repository} className="text:gray-800 font:bold text:no-underline">GitHub</a>
                </div>
            </div>
            {/* Main content */}
            <div className="d:flex w:full maxw:screen-2xl mx:auto gap:4 pt:8">
                {props.page.data?.layout === "home" && (
                    <HomeLayout {...props} />
                )}
                {props.page.data?.layout === "docs" && (
                    <DocsLayout {...props} />
                )}
            </div>
            {/* Footer */}
            <div className="py:20 w:full maxw:screen-2xl mx:auto">
                <div className="mb:12 b:1 b:dashed b:gray-200" />
                <div className="text:center text:sm">
                    Designed by <a href="https://josemi.xyz" className="text:no-underline text:gray-800 text:gray-700:hover font:bold">Josemi</a>. 
                    Released under the <b>MIT</b> License.
                </div>
            </div>
        </body>
    </html>
);

importPackages().then(pkgs => {
    const [mdx] = pkgs;
    log("Starting build...");
    log("Reading .mdx files from 'docs/' folder.");
    fs.readdir(docsFolder)
        .then(files => files.filter(file => path.extname(file) === ".mdx"))
        .then(files => {
            log(`Processing ${files.length} files.`);
            const filesIterator = files.map(file => {
                const outputFile = path.basename(file, ".mdx") + ".html";
                const pageData = {};
                return fs.readFile(path.join(docsFolder, file), "utf8")
                    .then(fileContent => {
                        const {data, content} = matter(fileContent);
                        Object.assign(pageData, data);
                        return content;
                    })
                    .then(fileContent => mdx.evaluate(fileContent, {...runtime}))
                    .then(page => {
                        const pageContent = React.createElement(PageWrapper, {
                            version: pkg.version,
                            data: data,
                            page: {
                                data: pageData,
                                element: React.createElement(page.default, {
                                    page: pageData,
                                    data: data,
                                    components: pageComponents,
                                }),
                            },
                        });
                        return renderToStaticMarkup(pageContent);
                    })
                    .then(content => fs.writeFile(path.join(publicFolder, outputFile), content, "utf8"))
                    .then(() => {
                        log(`Saved file 'public/${outputFile}'.`);
                    });
            });
            return Promise.all(filesIterator);
        })
        .then(() => log("Build finished."));
});
