const fs = require("node:fs/promises");
const path = require("node:path");
const React = require("react");
const {renderToStaticMarkup} = require("react-dom/server");
const runtime = require("react/jsx-runtime");
const matter = require("gray-matter");
const mochicons = require("@mochicons/node");

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

const Icon = props => (
    <svg xmlns="http-//www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path d={mochicons[props.icon].path} fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const pageComponents = {
    "h1": props => <h1 className="mt-8 mb-4 text-gray-800 text-xl font-bold">{props.children}</h1>,
    "h2": props => <h2 className="mt-8 mb-4 text-gray-800 text-lg font-bold">{props.children}</h2>,
    "p": props => <p className="mt-6 mb-6 text-justify">{props.children}</p>,
    "li": props => <li className="mb-3">{props.children}</li>,
    "code": props => <code className="font-mono text-sm">{props.children}</code>,
    "pre": props => (
        <pre className="p-6 r-md bg-gray-800 text-white overflow-auto mb-8">
            {props.children}
        </pre>
    ),
    "a": props => (
        <a {...props} className={`no-underline hover:underline text-blue-500 hover:text-blue-600 ${props.className || ""}`}>
            {props.children}
        </a>
    ),
    Icon: props => <Icon {...props} />,
    Separator: () => <div className="my-12 b-1 b-dashed b-gray-100" />,
    ExampleCode: props => (
        <div className={`${props.className || ""} bg-gray-100 p-8 r-md mb-4 mt-6`}>
            {props.children}
        </div>
    ),
    Fragment: React.Fragment,
};

const MenuSection = props => (
    <div className="text-gray-800 mb-6">{props.children}</div>
);

const MenuGroup = props => (
    <div className="font-bold mb-1 text-capitalize">{props.text}</div>
);

const MenuLink = props => (
    <a href={props.href} className="block text-gray-800 hover:text-blue-700 no-underline hover:underline py-2">
        <span className="text-sm">{props.text}</span>
    </a>
);

const PageNavigation = props => {
    const prevPage = props.pages.find(p => p.fileName === props.page.data.prev);
    const nextPage = props.pages.find(p => p.fileName === props.page.data.next);

    return (
        <div className="mt-12 w-full grid cols-2 gap-4">
            <div className="w-full">
                {prevPage && (
                    <a href={prevPage.fileName} className="no-underline text-gray-800 block p-4 r-md b-1 b-solid b-gray-300 hover:b-gray-400">
                        <div className="text-xs text-gray-500">Previous page</div>
                        <div className="font-medium">{prevPage.data.title}</div>
                    </a>
                )}
            </div>
            <div className="w-full">
                {nextPage && (
                    <a href={nextPage.fileName} className="no-underline text-gray-800 block p-4 r-md b-1 b-solid b-gray-300 hover:b-gray-400">
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
            <div className="w-full grid gap-8 md:cols-2 cols-1">
                {props.page.data.features.map(feature => (
                    <div className="bg-gray-100 r-md p-8" key={feature.title}>
                        <div className="mb-4 text-2xl">
                            {React.createElement(pageComponents.Icon, {icon: feature.icon})}
                        </div>
                        <div className="font-bold text-lg mb-4">{feature.title}</div>
                        <div className="">{feature.description}</div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const DocsLayout = props => (
    <React.Fragment>
        <div className="hidden lg:block w-56 shrink-0">
            <div className="w-full sticky top-0 px-0 py-4 h-screen overflow-y-auto text-gray-300 scrollbar">
                <MenuSection>
                    <MenuGroup text="Getting Started" />
                    <MenuLink href="installation.html" text="Installation" />
                    <MenuLink href="syntax.html" text="Syntax Guide" />
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
        <div className="w-full maxw-screen-md mx-auto">
            <h1 className="mt-0 mb-0 text-3xl md:text-4xl text-gray-800 font-black">
                {props.page.data.title}
            </h1>
            <div className="mt-0 mb-10 text-xl text-gray-500 font-medium lh-relaxed">{props.page.data.description}</div>
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
            <title>{props.page.data.title ? `${props.page.data.title} - ` : ""}LowCSS {pkg.version}</title>
            <style dangerouslySetInnerHTML={{__html: `
                :not(pre) > code {
                    color: #034096 !important;
                    font-weight: bold !important;
                }
            `}} />
        </head>
        <body className="bg-white m-0 p-0 font-inter text-gray-700 lh-normal">
            {/* Header */}
            <div className="w-full maxw-screen-xl h-20 px-6 mx-auto flex items-center justify-between">
                <a href="./index.html" className="flex items-center gap-1 text-gray-800 no-underline">
                    <div className="font-black font-crimson text-xl tracking-tight">
                        low<span className="text-gray-500">CSS</span>.
                    </div>
                </a>
                <div className="flex gap-6">
                    <a href="./installation.html" className="font-medium text-gray-700 hover:text-gray-900 no-underline">Installation</a>
                    <a href="./utilities.html" className="font-medium text-gray-700 hover:text-gray-900 no-underline">Utilities</a>
                    <a href={pkg.repository} className="font-medium text-gray-700 hover:text-gray-900 no-underline">GitHub</a>
                </div>
            </div>
            {/* Main content */}
            <div className="flex w-full maxw-screen-xl mx-auto gap-4 p-6">
                {props.page.data?.layout === "home" && (
                    <HomeLayout {...props} />
                )}
                {props.page.data?.layout === "docs" && (
                    <DocsLayout {...props} />
                )}
            </div>
            {/* Footer */}
            <div className="w-full maxw-screen-xl mx-auto px-6 pt-10 pb-20">
                <div className="mb-12 b-1 b-dashed b-gray-200" />
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
