---
title: "Installing Themes"
layout: "docs"
sidebar: "themes"
permalink: "/themes/installation.html"
prevPage: "themes-introduction"
nextPage: "themes-usage"
---

# Installing

There are **two ways** to include themeable utilities in your project:  

## Using the Full Framework (`low.css`)  

The **themeable utilities are included by default** in the main CSS bundle of the **lowCSS** framework. Simply include `low.css` in your project:

```html
<link rel="stylesheet" href="node_modules/lowcss/low.css">
```

You can now use themeable utilities like:

```html
<button class="bg-primary text-primary-foreground">
    Click Me
</button>
```

## Using Themeable Utilities Only (`low.themes.css`)  

If you **only want the themeable utilities** (without other framework utilities), you can include `low.themes.css` instead:

```html
<link rel="stylesheet" href="node_modules/lowcss/low.themes.css">
```

This is perfect for projects where you already have a utility framework but want **theme-based styling** without the extra utilities.
