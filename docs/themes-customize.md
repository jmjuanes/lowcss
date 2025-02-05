---
title: "Customize themeable utilities"
layout: "docs"
sidebar: "themes"
permalink: "/themes/customize.html"
prevPage: "themes-usage"
---

# Customize

Themeable utilities rely on **CSS variables**, which you can override in your styles.

### Customizing Theme Colors

Customize colors by redefining the corresponding CSS variables:

```css
:root {
  --low-primary: #ff5722;
  --low-primary-foreground: #ffffff;
  --low-secondary: #03a9f4;
  --low-secondary-foreground: #ffffff;
  --low-border: #e0e0e0;
  --low-input: #f5f5f5;
}
```

### Customizing Border Radius

Set your preferred border radius:

```css
:root {
  --low-rounded: 8px;
}
```

### Customizing Shadows

Modify the default shadow:

```css
:root {
  --low-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Theme Presets  

For projects that require **multiple themes** (e.g., light/dark mode), you can override variables dynamically:

```css
/* Default (Light Mode) */
:root {
  --low-primary: #007bff;
  --low-background: #ffffff;
  --low-foreground: #333333;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --low-primary: #1e88e5;
    --low-background: #222222;
    --low-foreground: #f0f0f0;
  }
}
```

Now, theme colors will **automatically switch** based on the user's system preference.
