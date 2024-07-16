---
title: "Installation"
layout: "docs"
permalink: "/docs/installation.html"
prevPage: "introduction"
nextPage: "usage"
---

# Installation

## Package Installation

To get started with LowCSS, you can install the package using either **Yarn** or **npm**. Follow the instructions below based on your preferred package manager:

Installation with **Yarn**:

```bash
$ yarn add lowcss
``` 

Installation usin **npm**:

```bash
$ npm install lowcss
```

LowCSS provides precompiled CSS files. To include them in your project, copy the file `low.css` to your project's assets or CSS directory.

```bash
$ cp ./node_modules/lowcss/low.css ./assets/
```

Then, link the CSS file in your HTML file using a `<link>` tag in the `<head>` section:

```html
<link rel="stylesheet" href="assets/low.css">
```

## Using Hosted Version from CDN

You can utilize the hosted version from a Content Delivery Network (CDN). Simply include the following `<link>` tag in the `<head>` section of your HTML file:

```html
<link rel="stylesheet" href="https://unpkg.com/lowcss/low.css">
```
