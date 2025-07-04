# LowCSS

A low-level functional CSS toolkit.

[![NPM Version](https://badgen.net/npm/v/lowcss?labelColor=1d2734&color=21bf81)](https://npm.im/lowcss)
[![MIT License](https://badgen.net/github/license/jmjuanes/lowcss?labelColor=1d2734&color=21bf81)](https://github.com//jmjuanes/lowcss)
[![PRs welcome](https://badgen.net/badge/PR/Welcome/green?labelColor=1d2734&color=21bf81)](https://github.com/jmjuanes/lowcss)

## About LowCSS

**LowCSS** is a powerful CSS utility framework, designed to streamline your CSS development process and enable you to create beautiful, responsive web interfaces with ease. 

## Features

- **Intuitive Utility Classes**: Use utility classes to apply styles directly to HTML elements, avoiding repetitive CSS coding.
- **Responsive Design**: Create responsive layouts effortlessly with built-in responsive utility classes.
- **Lightweight**: Keep your page load times low with optimized and minimal CSS file sizes.
- **Pseudo-Class Modifiers**: Apply styles to elements in specific states like hover, focus, and active.

## Installation

To install LowCSS in your project, use one of the following methods:

### Install LowCSS using a package manager

Run the following command in your terminal:

```bash
## Install using npm
$ npm install --save lowcss

## Install using yarn
$ yarn add lowcss
```

### Using LowCSS on a static site

LowCSS includes a compiled CSS version, so you do not need to install any modules for using it on a static site. Just download the compiled CSS from [unpkg](https://unpkg.com/lowcss/low.css), or include the following link to the CDN in your HTML file:

```html
<link href="https://unpkg.com/lowcss/low.css" rel="stylesheet" />
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

Refer to the [Utility Classes Documentation](https://low.josemi.xyz/utilities.html) for a complete list of available utility classes and their usage.

## Documentation

Access the LowCSS documentation at [low.josemi.xyz](https://low.josemi.xyz/docs.html).

## Examples

This section showcases various use cases and implementations of the utility classes to inspire and guide your development process. Explore our examples at [low.josemi.xyz/examples](https://low.josemi.xyz/examples.html).

## Acknowledgements

LowCSS is inspired by the amazing work of the Tailwind CSS community. We extend our gratitude to the Tailwind CSS team and contributors for their contributions to the web development community.

## License

LowCSS is released under the [MIT License](https://github.com/jmjuanes/lowcss/blob/main/LICENSE). Feel free to use, modify, and distribute it as per the terms of the license.
