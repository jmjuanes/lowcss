---
title: "Theming"
layout: "docs"
permalink: "/docs/theming.html"
prevPage: "root"
nextPage: "reset"
---

# Theming

LowCSS ships with a collection of themeable utilities that brings the power of **CSS variables** to your utility-based styling, making it easier than ever to customize UI components dynamically. Instead of using fixed color values, these utilities leverage CSS variables, allowing you to **define themes, switch styles effortlessly, and create a consistent design system**.

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

## Usage

Themeable utilities allow you to apply **consistent, customizable styles** using CSS variables. These utilities cover **colors, border-1 radius, and shadows**, ensuring a flexible and scalable design system.

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
| `border`                  | Default border-1 color |
| `input`                   | Background for `<input>` and `<select>` elements |

Example usage: 

```html
<button class="bg-primary text-primary-foreground">Submit</button>
```

### border-1 Radius Utilities

border-1 radius utilities define **default rounded corners** for elements like buttons and inputs.

| Utility Name | Common Usage Example |
|-------------|----------------------|
| `rounded`   | `<button>` and `<input>` border-1 radius. |

Example usage:

```html
<button class="bg-primary text-primary-foreground rounded">Message</button>
```

### Shadow Utilities

Shadow utilities define **default box shadows**, commonly used for elements like cards.

| Utility Name | Common Usage Example |
|-------------|----------------------|
| `shadow`    | Default shadow for cards, popups, modals |

Example usage:

```html
<div class="bg-background shadow p-4">Card</div>
```

## Customization

Each theme utility is mapped to a CSS variable (prefixed with `--low-*`), making customization simple. You can **override these variables** to match your brand or design needs.

- Customize utilities to set the background and text color of the `<body>`:

```css
:root {
    --low-background: var(--low-white);
    --low-foreground: var(--low-neutral-950);
}
```

- Customize utilities to set the background and text color of muted elements (e.g. disabled inputs):

```css
:root {
    --low-muted: var(--low-neutral-100);
    --low-muted-foreground: var(--low-neutral-500);
}
```

- To customize the primary background and text color (e.g. a primary button):

```css
:root {
    --low-primary: var(--low-neutral-900);
    --low-primary-foreground: var(--low-white);
}
``` 

- To customize the secondary background and text color (e.g. a secondary button):

```css
:root {
    --low-secondary: var(--low-neutral-100);
    --low-secondary-foreground: var(--low-neutral-900);
}
```

- To customize the destructive background ad text color (e.g. a button used to remove your account):

```css
:root {
    --low-destructive: var(--low-red-500);
    --low-destructive-foreground: var(--low-white);
}
```

- To customize the accent background and text color (e.g. for hover or selection):

```css
:root {
    --low-accent: var(--low-neutral-100);
    --low-accent-foreground: var(--low-neutral-900);
}
```

- To customize the default border-1 color:

```css
:root {
    --low-border: var(--low-neutral-200);
}
```

- To customize the color used in `<input>` or `<select>` elements:

```css
:root {
    --low-input: var(--low-neutral-200);
}
```

- To customize the default border-1 radius:

```css
:root {
    --low-radius: var(--low-radius-lg);
}
```

- To customize the default shadow:

```css
:root {
    --low-shadow: var(--low-shadow-sm);
}
```
