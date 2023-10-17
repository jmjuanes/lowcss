const React = require("react");
const classnames = require("classnames");
const hljs = require("highlight.js/lib/common");
const {renderIcon} = require("@josemi-icons/react/cjs");

const pkg = require("./package.json");
const low = require("./dist/low.json");

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
    "blockquote": props => <blockquote className="border-l-2 border-gray-700 text-gray-700 pl-3">{props.children}</blockquote>,
    "h1": props => <h1 className="mt-8 mb-4 text-gray-950 text-2xl font-bold">{props.children}</h1>,
    "h2": props => <h2 className="mt-8 mb-4 text-gray-950 text-xl font-bold">{props.children}</h2>,
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
        <a {...props} className={`underline text-gray-950 font-medium ${props.className || ""}`}>
            {props.children}
        </a>
    ),
    Icon: props => renderIcon(props.icon),
    Separator: () => <div className="my-8 h-px w-full bg-gray-100" />,
    ExampleCode: props => (
        <div className={`${props.className || ""} bg-white border border-solid border-gray-300 p-6 rounded-md mb-4 mt-6`}>
            {props.children}
        </div>
    ),
    CodeBlock: CodeBlock,
    Fragment: React.Fragment,
};

const MenuSection = props => (
    <div className="text-gray-900">{props.children}</div>
);

const MenuGroup = props => (
    <div className="font-bold mb-1 capitalize px-3">{props.text}</div>
);

const MenuLink = props => {
    const classList = classnames({
        "block py-2 px-3 rounded-md no-underline": true,
        "bg-gray-100 font-bold text-gray-900": props.active,
        "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-800": !props.active,
    });
    return (
        <a href={props.href} className={classList}>
            <span className="text-sm">{props.text}</span>
        </a>
    );
};

const NavbarLink = props => (
    <a href={props.href} className="flex items-center gap-2 text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 no-underline">
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
    const prevPage = props.pages.find(p => p.path === props.page.data.prev);
    const nextPage = props.pages.find(p => p.path === props.page.data.next);
    return (
        <div className="mt-12 w-full grid grid-cols-2 gap-4">
            <div className="w-full">
                {prevPage && (
                    <a href={prevPage.url} className="no-underline text-gray-900 block p-4 rounded-md border border-solid border-gray-200 hover:border-gray-300">
                        <div className="text-xs text-gray-700">Previous page</div>
                        <div className="font-medium">{prevPage.data.title}</div>
                    </a>
                )}
            </div>
            <div className="w-full">
                {nextPage && (
                    <a href={nextPage.url} className="no-underline text-gray-900 block p-4 rounded-md border border-solid border-gray-200 hover:border-gray-400">
                        <div className="text-xs text-gray-700 text-right">Next page</div>
                        <div className="font-medium text-right">{nextPage.data.title}</div>
                    </a>
                )}
            </div>
        </div>
    );
};

const DocsLayout = props => {
    const current = props.page.path;
    return (
        <React.Fragment>
            <div className="hidden lg:block w-56 shrink-0">
                <div className="w-full py-12 flex flex-col gap-6 sticky top-0">
                    <MenuSection>
                        <MenuGroup text="Getting Started" />
                        <MenuLink active={current === "introduction.html"} href="./introduction" text="Introduction" />
                        <MenuLink active={current === "installation.html"} href="./installation" text="Installation" />
                        <MenuLink active={current === "usage.html"} href="./usage" text="Usage" />
                    </MenuSection>
                    <MenuSection>
                        <MenuGroup text="Customization" />
                        <MenuLink active={current === "customize.html"} href="./customize" text="Customize" />
                        <MenuLink active={current === "variables.html"} href="./variables" text="Variables" />
                        <MenuLink active={current === "colors.html"} href="./colors" text="Colors" />
                    </MenuSection>
                    <MenuSection>
                        <MenuGroup text="Globals" />
                        <MenuLink active={current === "root.html"} href="./root" text="Root CSS Variables" />
                    </MenuSection>
                    <MenuSection>
                        <MenuGroup text="Base styles" />
                        <MenuLink active={current === "reset.html"} href="./reset" text="Reset CSS" />
                        <MenuLink active={current === "keyframes.html"} href="./keyframes" text="Keyframes" />
                        <MenuLink active={current === "helpers.html"} href="./helpers" text="Helpers" />
                    </MenuSection>
                    <MenuSection>
                        <MenuGroup text="Utilities" />
                        <MenuLink active={current === "utilities.html"} href="./utilities" text="Utilities API" />
                    </MenuSection>
                </div>
            </div>
            <div className="w-full max-w-3xl mx-auto py-10">
                <div className="mb-10">
                    <div className="text-4xl font-bold mb-1">{props.page.data.title}</div>
                    <div className="text-lg text-gray-800 font-medium leading-relaxed">
                        <span>{props.page.data.description}</span>
                    </div>
                </div>
                {props.element}
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
            <meta name="title" content={props.site.title} />
            <meta name="description" content={props.site.description} />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" />
            <link rel="stylesheet" href="./low.css" />
            <link rel="stylesheet" href="./highlight.css" />
            <title>{`${props.page.data.title ? `${props.page.data.title} - ` : ""}LowCSS ${props.site.version}`}</title>
            <style dangerouslySetInnerHTML={{__html: `
                :not(pre) > code {
                    color: #101623 !important;
                    font-weight: bold !important;
                }
            `}} />
        </head>
        <body className="bg-white m-0 p-0 font-inter text-gray-900 leading-normal">
            {/* Header */}
            <div className="border-b-1 border-gray-200 relative">
                <div className="w-full max-w-7xl h-16 px-6 mx-auto flex items-center justify-between">
                    <a href="./" className="flex items-center gap-2 text-gray-900 no-underline">
                        <div className="font-black text-xl">
                            <span>lowCSS.</span>
                        </div>
                        <div className="flex items-center font-bold text-2xs bg-gray-100 px-2 py-1 rounded-lg">
                            <span>{props.site.version}</span>
                        </div>
                    </a>
                    <div className="group peer" tabIndex="0">
                        <div className="flex md:hidden text-xl p-2 border border-gray-200 rounded-md cursor-pointer">
                            {renderIcon("bars")}
                        </div>
                        <div className="fixed md:initial top-0 right-0 p-6 md:p-0 hidden md:block group-focus-within:block z-5">
                            <div className="flex flex-col md:flex-row gap-3 md:items-center rounded-md bg-white p-4 md:p-0 w-72 md:w-auto">
                                <div className="pr-12 md:pr-0 md:flex md:gap-1">
                                    <NavbarLink href="./introduction" text="Getting Started" icon="rocket" />
                                    <NavbarLink href="./usage" text="Usage" icon="book" />
                                    <NavbarLink href="./customize" text="Customize" icon="color-swatch" />
                                    <NavbarLink href="./utilities" text="Utilities" icon="list" />
                                </div>
                                <div className="h-px w-full md:h-8 md:w-px bg-gray-200" />
                                <div className="flex">
                                    <a href={props.site.repository} className="no-underline o-70 hover:o-100">
                                        <img className="w-6 h-6" src="./github.svg" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed top-0 left-0 w-full h-full md:h-0 peer-focus-within:block hidden md:hidden bg-gray-900 o-70 z-2" />
                </div>
            </div>
            {/* Main content */}
            <div className="flex w-full max-w-7xl mx-auto gap-4 px-6 pb-16">
                {props.page.data?.layout === "default" && (
                    <div className="w-full">
                        {props.element}
                    </div>
                )}
                {props.page.data?.layout === "docs" && (
                    <DocsLayout {...props} />
                )}
            </div>
            {/* Footer */}
            <div className="w-full border-t-1 border-gray-200">
                <div className="w-full max-w-7xl mx-auto px-6 pt-10 pb-20 text-sm">
                    Designed by <a href="https://josemi.xyz" className="underline text-gray-900 hover:text-gray-950 font-medium">Josemi</a>. 
                    Source code available on <a href={props.site.repository} className="underline text-gray-900 hover:text-gray-950 font-medium">GitHub</a>. 
                </div>
            </div>
        </body>
    </html>
);

module.exports = {
    input: "docs",
    output: "public",
    siteMetadata: {
        title: "LowCSS",
        description: "A low-level functional CSS toolkit",
        version: pkg.version,
        repository: pkg.repository,
        low: low,
    },
    pageComponents: pageComponents,
    pageWrapper: PageWrapper,
};
