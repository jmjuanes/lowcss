const fs = require("node:fs/promises");
const path = require("node:path");
const React = require("react");
const {renderToStaticMarkup} = require("react-dom/server");
const runtime = require("react/jsx-runtime");
const matter = require("gray-matter");
const hljs = require("highlight.js/lib/common");
const {renderIcon} = require("@josemi-icons/react/index.cjs.js");

const pkg = require("../package.json");
const lowData = require("../dist/low.json");

const docsFolder = path.join(process.cwd(), "docs");
const publicFolder = path.join(process.cwd(), "public");
const log = msg => console.log(`[docs] ${msg}`);

// Generate utilities map
const utilitiesMap = Object.keys(lowData.utilities).reduce((prevUtilities, key) => {
    const utility = lowData.utilities[key];
    const prevItems = prevUtilities[utility.attributes.group] || [];
    return {
        ...prevUtilities,
        [utility.attributes.group]: [...prevItems, key],
    };
}, {});

const importPackages = () => {
    return Promise.all([
        import("@mdx-js/mdx"),
    ]);
};

const Icon = props => {
    return renderIcon(props.icon);
};

const CodeBlock = props => {
    const className = "p-4 rounded-md bg-gray-100 overflow-auto mb-8";
    if (props.language) {
        return React.createElement("pre", {
            className: className,
            dangerouslySetInnerHTML: {
                __html: hljs.highlight(props.children, {language: props.language}).value,
            },
        });
    }
    // Default: render without code highlight
    return (
        <pre className={className}>{props.children}</pre>
    );
};

const pageComponents = {
    "blockquote": props => <blockquote className="border-l-2 border-gray-500 text-gray-500 pl-3">{props.children}</blockquote>,
    "h1": props => <h1 className="mt-8 mb-4 text-gray-800 text-2xl font-bold">{props.children}</h1>,
    "h2": props => <h2 className="mt-8 mb-4 text-gray-800 text-xl font-bold">{props.children}</h2>,
    "p": props => <p className="mt-6 mb-6">{props.children}</p>,
    "ul": props => <ul style={{listStylePosition: "inside"}}>{props.children}</ul>,
    "ol": props => <ol style={{listStylePosition: "inside"}}>{props.children}</ol>,
    "li": props => <li className="mb-3">{props.children}</li>,
    "code": props => <code className="font-mono text-sm">{props.children}</code>,
    "pre": props => {
        const items = React.Children.toArray(props.children);
        const code = items[0].props.children;
        const language = (items[0].props.className || "").replace("language-", "");
        return (
            <CodeBlock language={language}>{code}</CodeBlock>
        );
    },
    "a": props => (
        <a {...props} className={`underline text-gray-900 font-medium ${props.className || ""}`}>
            {props.children}
        </a>
    ),
    Icon: props => <Icon {...props} />,
    Separator: () => <div className="my-12 h-px w-full bg-gray-300" />,
    ExampleCode: props => (
        <div className={`${props.className || ""} bg-white border border-solid border-gray-300 p-6 rounded-md mb-4 mt-6`}>
            {props.children}
        </div>
    ),
    CodeBlock: CodeBlock,
    Fragment: React.Fragment,
};

const MenuSection = props => (
    <div className="text-gray-800">{props.children}</div>
);

const MenuGroup = props => (
    <div className="font-bold mb-1 capitalize">{props.text}</div>
);

const MenuLink = props => (
    <a href={props.href} className="block text-gray-800 no-underline py-2 px-3 hover:bg-gray-200 rounded-md">
        <span className="text-sm">{props.text}</span>
    </a>
);

const NavbarLink = props => (
    <a href={props.href} className="flex font-medium text-sm text-gray-800 px-3 py-2 rounded-md hover:bg-gray-200 no-underline">
        {props.text}
    </a>
);

const PageNavigation = props => {
    const prevPage = props.pages.find(p => p.fileName === props.page.data.prev);
    const nextPage = props.pages.find(p => p.fileName === props.page.data.next);

    return (
        <div className="mt-12 w-full grid grid-cols-2 gap-4">
            <div className="w-full">
                {prevPage && (
                    <a href={prevPage.fileName} className="no-underline text-gray-800 block p-4 rounded-md border border-solid border-gray-300 hover:border-gray-400">
                        <div className="text-xs text-gray-500">Previous page</div>
                        <div className="font-medium">{prevPage.data.title}</div>
                    </a>
                )}
            </div>
            <div className="w-full">
                {nextPage && (
                    <a href={nextPage.fileName} className="no-underline text-gray-800 block p-4 rounded-md border border-solid border-gray-300 hover:border-gray-400">
                        <div className="text-xs text-gray-500 text-right">Next page</div>
                        <div className="font-medium text-right">{nextPage.data.title}</div>
                    </a>
                )}
            </div>
        </div>
    );
};

const HomeLayout = props => (
    <div className="w-full">
        {props.page.element}
        {props.page.data.features && (
            <div className="w-full grid gap-8 md:grid-cols-3 grid-cols-1">
                {props.page.data.features.map(feature => (
                    <div className="bg-gray-100 rounded-md p-8" key={feature.title}>
                        <div className="mb-4 text-4xl">
                            {React.createElement(pageComponents.Icon, {icon: feature.icon})}
                        </div>
                        <div className="font-bold text-lg mb-4">{feature.title}</div>
                        <div className="text-sm">{feature.description}</div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const DocsLayout = props => (
    <React.Fragment>
        <div className="hidden lg:block w-56 shrink-0">
            <div className="w-full sticky top-0 py-12 h-screen overflow-y-auto text-gray-300 flex flex-col gap-6 scrollbar">
                <MenuSection>
                    <MenuGroup text="Getting Started" />
                    <MenuLink href="installation.html" text="Installation" />
                    <MenuLink href="usage.html" text="Usage" />
                    <MenuLink href="base.html" text="Base styles" />
                    <MenuLink href="customize.html" text="Customize" />
                </MenuSection>
                {Object.entries(utilitiesMap).map(section => (
                    <MenuSection key={section[0]}>
                        <MenuGroup text={section[0]} />
                        {section[1].map(item => (
                            <MenuLink key={item} href={`utilities.html#${item}`} text={item} />
                        ))}
                    </MenuSection>
                ))}
            </div>
        </div>
        <div className="w-full maxw-3xl mx-auto py-10">
            <h1 className="mt-0 mb-0 text-5xl text-gray-800 font-bold">
                {props.page.data.title}
            </h1>
            <div className="mt-0 mb-10 text-xl text-gray-500 font-medium leading-relaxed">{props.page.data.description}</div>
            {props.page.element}
            <PageNavigation {...props} />
        </div>
    </React.Fragment>
);

const PageWrapper = props => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" />
            <meta name="title" content="lowCSS" />
            <meta name="description" content="A low-level functional CSS toolkit" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" />
            <link rel="stylesheet" href="./low.css" />
            <link rel="stylesheet" href="./highlight.css" />
            <title>{`${props.page.data.title ? `${props.page.data.title} - ` : ""}LowCSS ${pkg.version}`}</title>
            <style dangerouslySetInnerHTML={{__html: `
                :not(pre) > code {
                    color: #101623 !important;
                    font-weight: bold !important;
                }
            `}} />
        </head>
        <body className="bg-white m-0 p-0 font-inter text-gray-800 leading-normal">
            {/* Header */}
            <div className="border-b-1 border-gray-300 relative">
                <div className="w-full maxw-7xl h-16 px-6 mx-auto flex items-center justify-between">
                    <a href="./index.html" className="flex items-center gap-2 text-gray-800 no-underline">
                        <div className="font-bold text-xl">
                            <span>lowCSS.</span>
                        </div>
                        <div className="flex items-center font-bold text-2xs bg-gray-200 px-2 py-1 rounded-lg">
                            <span>{pkg.version}</span>
                        </div>
                    </a>
                    <div className="group peer" tabIndex="0">
                        <div className="flex sm:hidden text-xl p-2 border border-gray-300 rounded-md cursor-pointer">
                            <Icon icon="bars" />
                        </div>
                        <div className="fixed sm:initial top-0 right-0 p-6 sm:p-0 hidden sm:block group-focus-within:block z-5">
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center rounded-md bg-white p-4 sm:p-0 w-72 sm:w-auto">
                                <div className="pr-12 sm:pr-0 sm:flex sm:gap-3">
                                    <NavbarLink href="installation.html" text="Installation" />
                                    <NavbarLink href="usage.html" text="Usage" />
                                    <NavbarLink href="customize.html" text="Customize" />
                                    <NavbarLink href="utilities.html" text="Utilities" />
                                </div>
                                <div className="h-px w-full sm:h-8 sm:w-px bg-gray-300" />
                                <div className="flex">
                                    <a href={pkg.repository} className="no-underline o-70 hover:o-100">
                                        <img className="w-6 h-6" src="./github.svg" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed top-0 left-0 w-full h-full sm:h-0 peer-focus-within:block hidden sm:hidden bg-gray-900 o-60 z-2" />
                </div>
            </div>
            {/* Main content */}
            <div className="flex w-full maxw-7xl mx-auto gap-4 px-6">
                {props.page.data?.layout === "home" && (
                    <HomeLayout {...props} />
                )}
                {props.page.data?.layout === "docs" && (
                    <DocsLayout {...props} />
                )}
            </div>
            {/* Footer */}
            <div className="w-full maxw-7xl mx-auto px-6 pt-10 pb-20">
                <div className="mb-12 border-t-1 border-gray-300" />
                <div className="text-center text-sm">
                    Designed by <a href="https://josemi.xyz" className="no-underline text-gray-800 hover:text-gray-700 font-bold">Josemi</a>. 
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
            return Promise.all(files.map(file => {
                return fs.readFile(path.join(docsFolder, file), "utf8")
                    .then(fileContent => {
                        const {data, content} = matter(fileContent);
                        return {
                            data: data,
                            content: content,
                            fileName: path.basename(file, ".mdx") + ".html",
                        };
                    });
            }));
        })
        .then(pages => {
            return Promise.all(pages.map(page => {
                return mdx.evaluate(page.content, {...runtime})
                    .then(pageComponent => {
                        const pageContent = React.createElement(PageWrapper, {
                            page: {
                                ...page,
                                element: React.createElement(pageComponent.default, {
                                    page: page,
                                    utilities: lowData.utilities,
                                    utilitiesMap: utilitiesMap,
                                    colors: lowData.colors,
                                    breakpoints: lowData.breakpoints,
                                    components: pageComponents,
                                }),
                            },
                            pages: pages,
                        });
                        return renderToStaticMarkup(pageContent);
                    })
                    .then(content => fs.writeFile(path.join(publicFolder, page.fileName), content, "utf8"))
                    .then(() => {
                        log(`Saved file 'public/${page.fileName}'.`);
                    });
            }));
        })
        .then(() => log("Build finished."));
});
