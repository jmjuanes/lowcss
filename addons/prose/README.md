# lowcss-prose

A simple, customizable CSS module for styling markdown/prose content in your web projects. It's designed to work seamlessly with LowCSS utility classes or as a standalone styling solution.

## Installation

You can install lowcss-prose via **npm** or **yarn**:

```bash
# using npm
$ npm install lowcss-prose

# using yarn
$ yarn add lowcss-prose
```

## Features

- Clean, readable typography for content-heavy pages.
- Consistent styling for headings, paragraphs, lists, and tables.
- Properly styled code blocks and inline code.
- Easy customization through CSS variables.
- Works with HTML generated from markdown.

## Usage

Import the reset in your project using either CSS imports or by linking the CSS file directly in your HTML:

```css
@import "lowcss-prose";
```

```html
<!-- Or reference it in your HTML -->
<link rel="stylesheet" href="node_modules/lowcss-prose/index.css">
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

You can customize the appearance by overriding the CSS variables. For example:

```css
:root {
    /* Change heading colors */
    --prose-h1-font-size: 2.5rem;
    --prose-h2-font-weight: 700;

    /* Adjust code block colors */
    --prose-pre-bg: #1e293b;
    --prose-pre-color: #e2e8f0;

    /* Modify link styling */
    --prose-link-color: #3b82f6;
    --prose-link-font-weight: 600;
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

## License

This package is licensed under the [../../LICENSE](MIT LICENSE).
