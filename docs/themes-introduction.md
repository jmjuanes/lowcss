---
title: "Introduction to themeable utilities"
layout: "docs"
sidebar: "themes"
permalink: "/themes/introduction.html"
nextPage: "themes-installation"
---

# Themeable Utilities

Themeable utilities bring the power of **CSS variables** to your utility-based styling, making it easier than ever to customize UI components dynamically. Instead of using fixed color values, these utilities leverage CSS variables, allowing you to **define themes, switch styles effortlessly, and create a consistent design system**.

## Key Features

### Apply theme-based styling

You can use utilities like `bg-primary`, `text-secondary`, and `border-accent` to theme your UI components.

```html
<button class="bg-primary text-primary-foreground">Submit</button>
```

### Easily customize with CSS variables

You can modify your theme dynamically by updating the corresponding CSS variables of the utility.

```css
:root {
  --low-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Support states and pseudo-elements

Just like any other utility, themeable utilities work with hover states and pseudo-elements prefixes.  

```html
<div class="hover:bg-accent">Hover me!</div>
```

## Get Started with Themeable Utilities  

With **themeable utilities**, you can create flexible and maintainable design systems with minimal effort. Themeable utilities give you complete control over your UI's theming.
