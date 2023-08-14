const fs = require("node:fs/promises");
const path = require("node:path");
const React = require("react");
const {renderToStaticMarkup} = require("react-dom/server");
const runtime = require("react/jsx-runtime");
const matter = require("gray-matter");
const classnames = require("classnames");
const hljs = require("highlight.js/lib/common");
const {renderIcon} = require("@josemi-icons/react/cjs");

const pkg = require("../package.json");
const lowData = require("../dist/low.json");

const docsFolder = path.join(process.cwd(), "docs");
const publicFolder = path.join(process.cwd(), "public");
const log = msg => console.log(`[docs] ${msg}`);

// Clear urls and remove .html extension
const cleanUrl = p => p.replace(".html", "");

const importPackages = () => {
    return Promise.all([
        import("@mdx-js/mdx"),
    ]);
};

const Icon = props => {
    return renderIcon(props.icon);
};

const CodeBlock = props => {
    const className = "p-4 rounded-md bg-gray-900 text-white overflow-auto mb-8";
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
    Separator: () => <div className="my-10 h-px w-full bg-gray-200" />,
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
    <div className="font-bold mb-1 capitalize px-3">{props.text}</div>
);

const MenuLink = props => {
    const classList = classnames({
        "block py-2 px-3 rounded-md no-underline": true,
        "bg-gray-200 font-bold text-gray-800": props.active,
        "bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-700": !props.active,
    });
    return (
        <a href={cleanUrl(props.href)} className={classList}>
            <span className="text-sm">{props.text}</span>
        </a>
    );
};

const NavbarLink = props => (
    <a href={cleanUrl(props.href)} className="flex items-center gap-2 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-200 no-underline">
        {props.icon && (
            <div className="flex items-center text-lg">
                {renderIcon(props.icon)}
            </div>
        )}
        {props.text && (
            <div className="flex items-center text-sm font-medium">
                <span>{props.text}</span>
            </div>
        )}
    </a>
);

const PageNavigation = props => {
    const prevPage = props.pages.find(p => p.fileName === props.page.data.prev);
    const nextPage = props.pages.find(p => p.fileName === props.page.data.next);

    return (
        <div className="mt-12 w-full grid grid-cols-2 gap-4">
            <div className="w-full">
                {prevPage && (
                    <a href={cleanUrl(prevPage.fileName)} className="no-underline text-gray-800 block p-4 rounded-md border border-solid border-gray-300 hover:border-gray-400">
                        <div className="text-xs text-gray-500">Previous page</div>
                        <div className="font-medium">{prevPage.data.title}</div>
                    </a>
                )}
            </div>
            <div className="w-full">
                {nextPage && (
                    <a href={cleanUrl(nextPage.fileName)} className="no-underline text-gray-800 block p-4 rounded-md border border-solid border-gray-300 hover:border-gray-400">
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

const DocsLayout = props => {
    const current = props.page.fileName;
    return (
        <React.Fragment>
            <div className="hidden lg:block w-56 shrink-0">
                <div className="w-full py-12 text-gray-300 flex flex-col gap-6 sticky top-0">
                    <MenuSection>
                        <MenuGroup text="Getting Started" />
                        <MenuLink active={current === "introduction.html"} href="introduction.html" text="Introduction" />
                        <MenuLink active={current === "installation.html"} href="installation.html" text="Installation" />
                        <MenuLink active={current === "usage.html"} href="usage.html" text="Usage" />
                    </MenuSection>
                    <MenuSection>
                        <MenuGroup text="Customization" />
                        <MenuLink active={current === "customize.html"} href="customize.html" text="Customize" />
                        <MenuLink active={current === "variables.html"} href="variables.html" text="Variables" />
                        <MenuLink active={current === "colors.html"} href="colors.html" text="Colors" />
                    </MenuSection>
                    <MenuSection>
                        <MenuGroup text="Base styles" />
                        <MenuLink active={current === "reset.html"} href="reset.html" text="Reset CSS" />
                        <MenuLink active={current === "keyframes.html"} href="keyframes.html" text="Keyframes" />
                    </MenuSection>
                    <MenuSection>
                        <MenuGroup text="Utilities" />
                        <MenuLink active={current === "utilities.html"} href="utilities.html" text="Utilities API" />
                    </MenuSection>
                </div>
            </div>
            <div className="w-full maxw-3xl mx-auto py-10">
                <div className="mb-10">
                    <div className="text-4xl font-bold mb-1">{props.page.data.title}</div>
                    <div className="text-lg text-gray-500 font-medium leading-relaxed">
                        <span>{props.page.data.description}</span>
                    </div>
                </div>
                {props.page.element}
                <PageNavigation {...props} />
            </div>
        </React.Fragment>
    );
};

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
                    <a href="./" className="flex items-center gap-2 text-gray-800 no-underline">
                        <div className="font-bold text-xl">
                            <span>lowCSS.</span>
                        </div>
                        <div className="flex items-center font-bold text-2xs bg-gray-200 px-2 py-1 rounded-lg">
                            <span>{pkg.version}</span>
                        </div>
                    </a>
                    <div className="group peer" tabIndex="0">
                        <div className="flex md:hidden text-xl p-2 border border-gray-300 rounded-md cursor-pointer">
                            <Icon icon="bars" />
                        </div>
                        <div className="fixed md:initial top-0 right-0 p-6 md:p-0 hidden md:block group-focus-within:block z-5">
                            <div className="flex flex-col md:flex-row gap-3 md:items-center rounded-md bg-white p-4 md:p-0 w-72 md:w-auto">
                                <div className="pr-12 md:pr-0 md:flex md:gap-1">
                                    <NavbarLink href="introduction.html" text="Getting Started" icon="rocket" />
                                    <NavbarLink href="usage.html" text="Usage" icon="book" />
                                    <NavbarLink href="customize.html" text="Customize" icon="color-swatch" />
                                    <NavbarLink href="utilities.html" text="Utilities API" icon="list" />
                                </div>
                                <div className="h-px w-full md:h-8 md:w-px bg-gray-300" />
                                <div className="flex">
                                    <a href={pkg.repository} className="no-underline o-70 hover:o-100">
                                        <img className="w-6 h-6" src="./github.svg" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed top-0 left-0 w-full h-full md:h-0 peer-focus-within:block hidden md:hidden bg-gray-900 o-60 z-2" />
                </div>
            </div>
            {/* Main content */}
            <div className="flex w-full maxw-7xl mx-auto gap-4 px-6 pb-16">
                {props.page.data?.layout === "home" && (
                    <HomeLayout {...props} />
                )}
                {props.page.data?.layout === "docs" && (
                    <DocsLayout {...props} />
                )}
            </div>
            {/* Footer */}
            <div className="w-full border-t-1 border-gray-300">
                <div className="w-full maxw-7xl mx-auto px-6 pt-10 pb-20 text-sm">
                    Designed by <a href="https://josemi.xyz" className="underline text-gray-800 hover:text-gray-900 font-medium">Josemi</a>. 
                    Source code available on <a href={pkg.repository} className="underline text-gray-800 hover:text-gray-900 font-medium">GitHub</a>. 
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
