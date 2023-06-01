const fs = require("node:fs/promises");
const path = require("node:path");
const React = require("react");
const {renderToStaticMarkup} = require("react-dom/server");
const runtime = require("react/jsx-runtime");
const matter = require("gray-matter");
const hljs = require("highlight.js/lib/common");

const pkg = require("../package.json");
const lowData = require("../dist/low.json");

const docsFolder = path.join(process.cwd(), "docs");
const publicFolder = path.join(process.cwd(), "public");
const log = msg => console.log(`[docs] ${msg}`);

// Generate utilities map
const utilitiesMap = lowData.utilities.reduce((prevUtilities, utility) => {
    const prevItems = prevUtilities[utility.attributes.group] || [];
    return {
        ...prevUtilities,
        [utility.attributes.group]: [...prevItems, utility.key],
    };
}, {});

const importPackages = () => {
    return Promise.all([
        import("@mdx-js/mdx"),
    ]);
};

const ICONS = {
    "arrow-right": "M4 12L20 12M14 6L20 12L14 18",
    "bars": "M4 6L20 6M4 12L20 12M4 18L20 18",
    "bolt": "M14 3L5 14L11 14L10 21L19 10L13 10L14 3Z",
    "mobile": "M8 3C6 3 6 5 6 5L6 19C6 19 6 21 8 21L16 21C18 21 18 19 18 19L18 5C18 5 18 3 16 3L8 3ZM12 17L12 17M10 4L14 4",
    "palette": "M6 20C4 20 4 18 4 18L4 6C4 6 4 4 6 4L10 4C12 4 12 6 12 6L12 18C12 18 12 20 10 20L6 20ZM10 20L18 20C20 20 20 18 20 18L20 15C20 15 20 13 18 13L17 13M12 8L14 6C15 5 16 5 17 6L19 8C20 9 20 10 19 11L12 18M8 16L8 16",
};

const Icon = props => (
    <svg xmlns="http-//www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path d={ICONS[props.icon]} fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const pageComponents = {
    "h1": props => <h1 className="mt-8 mb-4 text-gray-800 text-2xl font-bold">{props.children}</h1>,
    "h2": props => <h2 className="mt-8 mb-4 text-gray-800 text-xl font-bold">{props.children}</h2>,
    "p": props => <p className="mt-6 mb-6">{props.children}</p>,
    "ul": props => <ul style={{listStylePosition: "inside"}}>{props.children}</ul>,
    "ol": props => <ol style={{listStylePosition: "inside"}}>{props.children}</ol>,
    "li": props => <li className="mb-3">{props.children}</li>,
    "code": props => <code className="font-mono text-sm">{props.children}</code>,
    "pre": props => {
        const className = "p-4 rounded-md bg-gray-100 border border-solid border-gray-300 overflow-auto mb-8";
        const items = React.Children.toArray(props.children);
        const code = items[0].props.children;
        const language = (items[0].props.className || "").replace("language-", "");
        if (language) {
            return React.createElement("pre", {
                className: className,
                dangerouslySetInnerHTML: {
                    __html: hljs.highlight(code, {language: language}).value,
                },
            });
        }
        // Default: render without code highlight
        return (
            <pre className={className}>{code}</pre>
        );
    },
    "a": props => (
        <a {...props} className={`no-underline hover:underline text-blue-500 hover:text-blue-600 ${props.className || ""}`}>
            {props.children}
        </a>
    ),
    Icon: props => <Icon {...props} />,
    Separator: () => <div className="my-12 border-2 border-dashed border-gray-200" />,
    ExampleCode: props => (
        <div className={`${props.className || ""} bg-white border border-solid border-gray-300 p-6 rounded-md mb-4 mt-6`}>
            {props.children}
        </div>
    ),
    Fragment: React.Fragment,
};

const MenuSection = props => (
    <div className="text-gray-800">{props.children}</div>
);

const MenuGroup = props => (
    <div className="font-bold mb-1 capitalize">{props.text}</div>
);

const MenuLink = props => (
    <a href={props.href} className="block text-gray-800 hover:text-blue-700 no-underline hover:underline py-2">
        <span className="text-sm">{props.text}</span>
    </a>
);

const NavbarLink = props => (
    <a href={props.href} className="font-medium text-gray-600 hover:text-gray-800 no-underline">
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
            <div className="w-full sticky top-0 py-12 h-screen overflow-y-auto text-gray-300 flex flex-col gap-6">
                <MenuSection>
                    <MenuGroup text="Getting Started" />
                    <MenuLink href="installation.html" text="Installation" />
                    <MenuLink href="syntax.html" text="Utilities Syntax" />
                    <MenuLink href="customize.html" text="Customize" />
                </MenuSection>
                <MenuSection>
                    <MenuGroup text="Additional Styles" />
                    <MenuLink href="reset.html" text="Reset CSS" />
                    {/* <MenuLink href="keyframes.html" text="Keyframes" /> */}
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
            <h1 className="mt-0 mb-0 text-5xl md:text-6xl text-gray-800 font-black">
                {props.page.data.title}
            </h1>
            <div className="mt-0 mb-10 text-2xl text-gray-500 font-medium leading-relaxed">{props.page.data.description}</div>
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
            <meta name="description" content="" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@700;900&display=swap" />
            <link rel="stylesheet" href="./low.css" />
            <link rel="stylesheet" href="./highlight.css" />
            <title>{props.page.data.title ? `${props.page.data.title} - ` : ""}LowCSS {pkg.version}</title>
            <style dangerouslySetInnerHTML={{__html: `
                :not(pre) > code {
                    color: #034096 !important;
                    font-weight: bold !important;
                }
            `}} />
        </head>
        <body className="bg-white m-0 p-0 font-inter text-gray-700 leading-normal">
            {/* Header */}
            <div className="border-b-1 border-gray-300 relative">
                <div className="w-full maxw-7xl h-20 px-6 mx-auto flex items-center justify-between">
                    <a href="./index.html" className="flex items-center gap-1 text-gray-800 no-underline">
                        <div className="font-black font-crimson text-2xl tracking-tight">
                            <span>lowCSS.</span>
                        </div>
                    </a>
                    <div className="group" tabIndex="0">
                        <div className="flex sm:hidden text-xl p-2 border border-gray-300 rounded-md">
                            <Icon icon="bars" />
                        </div>
                        <div className="absolute sm:initial w-full sm:w-auto top-full left-0 bg-white p-8 sm:p-0 hidden sm:block group-focus-within:block">
                            <div className="flex flex-col sm:flex-row gap-6 items-center">
                                <NavbarLink href="./installation.html" text="Installation" />
                                <NavbarLink href="./syntax.html" text="Syntax" />
                                <NavbarLink href="./customize.html" text="Customize" />
                                <NavbarLink href="./utilities.html" text="Utilities" />
                                <div className="w-px h-6 bg-gray-300 hidden sm:block" />
                                <a href={pkg.repository} className="no-underline o-70 hover:o-100">
                                    <img className="w-6 h-6" src="./github.svg" />
                                </a>
                            </div>
                        </div>
                    </div>
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
