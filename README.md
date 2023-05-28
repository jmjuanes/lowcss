# LowCSS

A low-level functional CSS toolkit.

[![NPM Version](https://badgen.net/npm/v/lowcss)](https://npm.im/lowcss)
[![MIT License](https://badgen.net/github/license/jmjuanes/lowcss)](https://github.com/jmjuanes/lowcss)
[![PRs welcome](https://badgen.net/badge/PR/Welcome/green)](https://github.com/jmjuanes/lowcss)

## About LowCSS

**LowCSS** is a powerful CSS utility framework built with SASS, designed to streamline your CSS development process and enable you to create beautiful, responsive web interfaces with ease. Inspired by the popular [Tailwind CSS](https://www.tailwindcss.com), LowCSS follows a similar structure and syntax, making it familiar and intuitive for developers already familiar with Tailwind CSS.

## Features

- **SASS-based**: Harness the power of SASS to create modular and maintainable CSS code.
- **Intuitive Utility Classes**: Use utility classes to apply styles directly to HTML elements, avoiding repetitive CSS coding.
- **Responsive Design**: Create responsive layouts effortlessly with built-in responsive utility classes.
- **Customizable**: Customize the framework to match your brand's aesthetic by modifying SASS variables.
- **Lightweight**: Keep your page load times low with optimized and minimal CSS file sizes.
- **Pseudo-Class Modifiers**: Apply styles to elements in specific states like hover, focus, and active.

## Installation

To install LowCSS in your project, use one of the following methods:

### Install LowCSS using a package manager

Run the following command in your terminal:

```bash
## Install using NPM
$ npm install --save lowcss

## Install using YARN
$ yarn add lowcss
```

### Using LowCSS on a static site

LowCSS includes a compiled CSS version, so you do not need to install any modules for using it on a static site. Just download the compiled CSS from [unpkg](https://unpkg.com/lowcss/dist/low.css), or include the following link to the CDN in your HTML file:

```html
<link href="https://unpkg.com/lowcss/dist/low.css" rel="stylesheet" />
```

### Download from releases

Alternatively, you can download the CSS file directly from the [releases](https://github.com/jmjuanes/lowcss/releases) page of this repository.


## Usage

Using LowCSS is simple. Add the utility classes directly to your HTML elements to apply styles. Here's an example:

```html
<div class="bg-blue-600 text-white p-4">
    <h1 class="text-2xl">Welcome to LowCSS</h1>
    <p class="mt-2">Start building stunning web interfaces with ease!</p>
</div>
``` 

Refer to the [Utility Classes Documentation](https://www.josemi.xyz/lowcss/utilities.html) for a complete list of available utility classes and their usage.

## Customization

LowCSS is highly customizable to match your project's unique requirements and branding. Modify the SASS variables to adjust colors, typography, spacing, and more. Customize the framework to create a consistent and cohesive design system for your website.

Refer to the [Customization Guide](https://www.josemi.xyz/lowcss/customize.html) for instructions on customizing LowCSS to suit your needs.

## Documentation

Comprehensive documentation is available to guide you through the usage, customization, and advanced features of LowCSS. Whether you're a beginner or an experienced developer, the documentation will provide you with the information you need to get the most out of the framework.

Access the LowCSS documentation at [josemi.xyz/lowcss](https://www.josemi.xyz/lowcss).

## Contributing

We welcome contributions from the community to help improve LowCSS. Whether it's bug fixes, feature enhancements, or new utility classes, your contributions are valuable. Please read our [Contribution Guidelines](./CONTRIBUTING.md) for more information on how to contribute.

## Acknowledgements

LowCSS is inspired by the amazing work of the Tailwind CSS community. We extend our gratitude to the Tailwind CSS team and contributors for their contributions to the web development community.

## License

LowCSS is released under the [MIT License](https://github.com/jmjuanes/lowcss/blob/main/LICENSE). Feel free to use, modify, and distribute it as per the terms of the license.
