# LowCSS Prose Addon

A simple, customizable CSS module for styling markdown/prose content in your web projects. It's designed to work seamlessly with LowCSS utility classes or as a standalone styling solution.

## Usage

Import the module in your project by linking the CSS file directly in your HTML:

```html
<link rel="stylesheet" href="node_modules/lowcss/addon/prose/index.css">
```

After importing, simply add the `.prose` class to the container of your content:

```html
<article class="prose">
    <h1>Article Title</h1>
    <p>This is a paragraph with some <strong>bold text</strong> and <code>inline code</code>.</p>
    <h2>Section Heading</h2>
    <p>Another paragraph with a <a href="#">link</a>.</p>
    <!-- More content... -->
</article>
```

## Styled Elements

This module styles the following HTML elements when they appear inside a `.prose` container:

- **Typography**: Headings (h1-h4), paragraphs, bold text, links
- **Lists**: Ordered and unordered lists with proper indentation
- **Code**: Both inline code and code blocks (pre > code)
- **Blockquotes**: Styled with a left border and proper spacing
- **Tables**: Clean table styles with alternating row colors
- **Horizontal Rules**: Subtle dividers

## Customization

To customize the prose styles, add your own CSS that overrides the default variables. You can do this globally or scope it to specific containers:

```css
/* Global customization */
:root {
  --prose-color: #334155;
  --prose-link-color: #2563eb;
}

/* Scoped customization */
.dark-theme .prose {
  --prose-color: #f8fafc;
  --prose-link-color: #60a5fa;
  --prose-code-bg: #1e293b;
}
```

### General Typography Variables

These variables control the overall typography of prose content:

```css
:root {
  --prose-color: var(--color-gray-900);      /* Main text color */
  --prose-line-height: 1.75;                 /* Base line height */
}
```

### Paragraphs Variables

```css
:root {
  --prose-paragraph-line-height: 1.75rem;
  --prose-paragraph-margin-top: 0px;
  --prose-paragraph-margin-bottom: 1rem;
  
  /* Lead paragraph (larger intro paragraph) */
  --prose-lead-color: var(--color-gray-700);
  --prose-lead-font-size: 1.25rem;
  --prose-lead-line-height: 1.75rem;
}
```

### Headings Variables

Each heading level (h1-h4) has its own set of variables for fine-grained control:

```css
:root {
  /* h1 styling */
  --prose-h1-font-size: 2.25rem;
  --prose-h1-font-weight: 700;
  --prose-h1-line-height: 2.5rem;
  --prose-h1-margin-bottom: 1.5rem;
  --prose-h1-margin-top: 2.5rem;
  
  /* h2 styling (with bottom border) */
  --prose-h2-font-size: 1.5rem;
  --prose-h2-font-weight: 600;
  --prose-h2-line-height: 2rem;
  --prose-h2-margin-top: 3rem;
  --prose-h2-margin-bottom: 1.5rem;
  --prose-h2-border-bottom-width: 1px;
  --prose-h2-border-bottom-color: var(--color-gray-200);
  --prose-h2-padding-bottom: 0.5rem;
  
  /* h3 styling */
  --prose-h3-font-size: 1.25rem;
  --prose-h3-font-weight: 600;
  --prose-h3-line-height: 1.75rem;
  --prose-h3-margin-top: 2rem;
  --prose-h3-margin-bottom: 1.5rem;
  
  /* h4 styling */
  --prose-h4-font-size: 1.125rem;
  --prose-h4-font-weight: 600;
  --prose-h4-line-height: 1.75rem;
  --prose-h4-margin-top: 2rem;
  --prose-h4-margin-bottom: 1.5rem;
}
```

### Code Blocks Variables

Customize both inline code and code blocks:

```css
:root {
  /* Inline code */
  --prose-code-bg: var(--color-gray-100);
  --prose-code-color: var(--color-gray-900);
  --prose-code-font-size: 0.875rem;
  --prose-code-font-family: var(--font-family-mono);
  --prose-code-font-weight: 600;
  --prose-code-line-height: 1.25rem;
  --prose-code-padding-y: 0.2rem;
  --prose-code-padding-x: 0.3rem;
  --prose-code-radius: 0.25rem;
  
  /* Code blocks */
  --prose-pre-bg: var(--color-gray-950);
  --prose-pre-color: var(--color-gray-50);
  --prose-pre-font-size: 0.875rem;
  --prose-pre-font-family: var(--font-family-mono);
  --prose-pre-font-weight: 400;
  --prose-pre-line-height: 1.75rem;
  --prose-pre-padding-y: 1.25rem;
  --prose-pre-padding-x: 1.25rem;
  --prose-pre-radius: 0.375rem;
  --prose-pre-margin-top: 1.5rem;
  --prose-pre-margin-bottom: 1.5rem;
}
```

### Lists Variables

```css
:root {
  --prose-ul-margin-bottom: 1.25rem;
  --prose-ul-margin-top: 1.25rem;
  --prose-ul-padding-left: 1.625rem;
  --prose-li-margin-bottom: 0.5rem;
  --prose-li-margin-top: 0;
}
```

### Links Variables

```css
:root {
  --prose-link-color: var(--color-gray-900);
  --prose-link-font-weight: 500;
  --prose-link-underline-offset: 4px;
}
```

### Blockquotes Variables

```css
:root {
  --prose-blockquote-border-color: var(--color-gray-200);
  --prose-blockquote-border-width: 2px;
  --prose-blockquote-margin-top: 1rem;
  --prose-blockquote-margin-bottom: 1rem;
}
```

### Tables Variables

```css
:root {
  --prose-table-margin-bottom: 1.5rem;
  --prose-table-margin-top: 1.5rem;
  
  /* Table headers */
  --prose-thead-color: var(--color-gray-900);
  --prose-thead-font-weight: 600;
  --prose-thead-border-width: 1px;
  --prose-thead-border-color: var(--color-gray-200);
  --prose-thead-padding-y: 0.5rem;
  --prose-thead-padding-x: 1rem;
  
  /* Table body */
  --prose-tbody-bg: var(--color-gray-100);
  --prose-tbody-border-width: 1px;
  --prose-tbody-border-color: var(--color-gray-200);
  --prose-tbody-padding-y: 0.5rem;
  --prose-tbody-padding-x: 1rem;
}
```

## Example

A markdown blog post rendered with the prose styles:

```html
<article class="prose max-w-3xl mx-auto p-6">
    <h1>Getting Started with LowCSS</h1>

    <p class="lead">A quick introduction to using the LowCSS framework for your next project.</p>

    <h2>Installation</h2>
    <p>Install LowCSS using your favorite package manager:</p>

    <pre><code>npm install lowcss</code></pre>

    <h3>Basic Usage</h3>
    <p>Start using utility classes right away in your HTML:</p>

    <ul>
        <li>Add the <code>bg-blue-500</code> class for a blue background</li>
        <li>Use <code>text-white</code> for white text</li>
        <li>Apply <code>p-4</code> for padding on all sides</li>
    </ul>

    <blockquote>
        <p>LowCSS makes styling your web applications fast and intuitive.</p>
    </blockquote>
</article>
```

## Integration with LowCSS

When using with LowCSS, you can combine prose styling with utility classes:

```html
<div class="prose bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
    <!-- Your markdown content here -->
</div>
```
