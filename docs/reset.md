---
title: "Reset CSS"
layout: "docs"
sidebar: "default"
permalink: "/docs/reset.html"
prevPage: "root"
nextPage: "keyframes"
---

# Reset

**Reset CSS** is a collection of styles that aims to provide a consistent and cross-browser baseline for styling HTML elements. It helps normalize the default styles applied by different browsers, ensuring a more consistent and predictable rendering of web pages across various devices and browsers.

By enabling **Reset CSS**, you can start with a clean slate, eliminating inconsistencies in default styles and reducing the need for excessive CSS overrides.

For a complete list of changes and styles, please refer to the [source stylesheet](https://github.com/jmjuanes/lowcss/blob/main/low/_reset.scss).

## Box-sizing

It changes the `box-sizing` property of all elements to `border-box`. This ensures that the width and height of elements are calculated including padding and border, providing a more intuitive box model.

```css
*,
*:before,
*:after {
    box-sizing: border-box;
}
```

## Borders are removed in all elements

It resets the `border-width` to `0` and initializes the `border-syle` to `solid` in all elements.

```css
*,
*:before,
*:after {
    border-color: currentColor;
    border-style: solid;
    border-width: 0;
}
```

## Margins

It resets the default margin of some elements (including headings and paragraphs) to `0`. This eliminates any inconsistencies in default spacing applied by different browsers.

```css
blockquote,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
pre {
    margin: 0;
}
```

## Headings

It normalizes the font-related properties such as `font-family` and `font-weight` in heading elements to provide a consistent typography baseline.

```css
h1,
h2,
h3,
h4,
h5,
h6 {
    font-size: inherit;
    font-weight: inherit;
}
```

## Links

Sets the default styles for anchor links elements to remove underline and inherit color:

```css
a {
    color: inherit;
    text-decoration: inherit;
}
```

## Lists

It removes the default styles for unordered and ordered lists (`ul` and `ol`) to eliminate any browser-specific list styles.

```css
ul,
ol,
dl {
    margin: 0;
    padding: 0;
}
```

## Tables

It resets the default border styles for tables.

```css
table {
    border-collapse: collapse;
    border-spacing: 0;
}
```

## Form elements

It resets the default typography, padding, and margin properties common form elements:

```css
button,
input,
select,
textarea {
    color: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
    margin: 0;
    padding: 0;
}
```

It also prevents resizing textareas horizontally by default:

```css
textarea {
    resize: vertical;
}
```
