---
title: "Using themeable utilities"
layout: "docs"
sidebar: "themes"
permalink: "/themes/usage.html"
prevPage: "themes-installation"
nextPage: "themes-customize"
---

# Usage

Themeable utilities allow you to apply **consistent, customizable styles** using CSS variables. These utilities cover **colors, border radius, and shadows**, ensuring a flexible and scalable design system.

Each utility is mapped to a CSS variable (prefixed with `--low-*`), making customization simple. You can **override these variables** to match your brand or design needs.

## Available Themeable Utilities  

### Color Utilities

Color utilities are used for **backgrounds, text, borders, and outlines** across UI components.

| Utility Name              | Common Usage Example |
|---------------------------|----------------------|
| `background`              | `<body>` background color |
| `foreground`              | `<body>` text color |
| `muted`                   | Muted backgrounds (e.g., disabled `<input>`) |
| `muted-foreground`        | Muted text color |
| `primary`                 | Primary background (e.g., `<button>`) |
| `primary-foreground`      | Text color for primary elements |
| `secondary`               | Secondary background |
| `secondary-foreground`    | Text color for secondary elements |
| `destructive`             | Background for destructive actions (e.g., delete buttons) |
| `destructive-foreground`  | Text color for destructive actions |
| `accent`                  | Hover/selection backgrounds (e.g., dropdowns) |
| `accent-foreground`       | Text color for elements with an accent background |
| `border`                  | Default border color |
| `input`                   | Background for `<input>` and `<select>` elements |

Example usage: 

```html
<button class="bg-primary text-primary-foreground">
    Submit
</button>
```

Each color utility is available in four variants:

- `bg-*`: for background color.
- `text-*`: for text color.
- `border-*`: for border color.
- `outline-*`: for outline color.

### Border Radius Utilities

Border radius utilities define **default rounded corners** for elements like buttons and inputs.

| Utility Name | Common Usage Example |
|-------------|----------------------|
| `rounded`   | `<button>` and `<input>` border radius. |

Example usage:

```html
<button class="bg-primary text-primary-foreground rounded">
    Rounded Button
</button>
```

### Shadow Utilitie

Shadow utilities define **default box shadows**, commonly used for elements like cards.

| Utility Name | Common Usage Example |
|-------------|----------------------|
| `shadow`    | Default shadow for cards, popups, modals |

Example usage:

```html
<div class="bg-background shadow p-4">
    This is a card with shadow.
</div>
```
