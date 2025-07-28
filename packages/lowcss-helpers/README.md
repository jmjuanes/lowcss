# lowcss-helpers

A collection of essential CSS helper utilities for layout, positioning, and common UI patterns. This module provides utility classes that complement LowCSS or work as standalone helpers in any project.

## Installation

You can install lowcss-helpers via **npm** or **yarn**:

```bash
# using npm
$ npm install lowcss-helpers

# using yarn
$ yarn add lowcss-helpers
```

## Usage

Import the helpers in your project using either CSS imports or by linking the CSS file directly in your HTML:

```css
@import "lowcss-helpers";
```

```html
<!-- Or reference it in your HTML -->
<link rel="stylesheet" href="node_modules/lowcss-helpers/index.css">
```

## Available Utilities

### Layout & Flexbox

#### Horizontal Stack (.hstack)
Creates a horizontal flex container with centered items:

```html
<div class="hstack">
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
</div>
```

#### Vertical Stack (.vstack)
Creates a vertical flex container:

```html
<div class="vstack">
    <div>Section 1</div>
    <div>Section 2</div>
    <div>Section 3</div>
</div>
```

#### Vertical Rule (.vr)
Adds a vertical divider between elements:

```html
<div class="hstack">
    <span>Home</span>
    <span class="vr"></span>
    <span>About</span>
    <span class="vr"></span>
    <span>Contact</span>
</div>
```

### Positioning

#### Fixed Positioning
Position elements fixed to the viewport:

```html
<!-- Fixed to top -->
<header class="fixed-top">Top Navigation</header>

<!-- Fixed to bottom -->
<footer class="fixed-bottom">Bottom Bar</footer>
```

#### Sticky Positioning
Make elements stick when scrolling:

```html
<!-- Sticky to top -->
<nav class="sticky-top">Sticky Navigation</nav>

<!-- Sticky to bottom -->
<div class="sticky-bottom">Sticky Footer</div>
```

### Text Utilities

#### Text Truncation (.truncate)
Truncate overflowing text with ellipsis:

```html
<div class="truncate" style="width: 200px;">
    This is a very long text that will be truncated with ellipsis
</div>
```

#### Clearfix (.clearfix)
Clear floated elements:

```html
<div class="clearfix">
    <div class="float-left">Floated content</div>
    <!-- Clearfix ensures parent contains floated children -->
</div>
```

### Typography

Additional font family utilities for common web fonts:

```html
<h1 class="font-inter">Heading with Inter font</h1>
<p class="font-lato">Paragraph with Lato font</p>
<h2 class="font-poppins">Heading with Poppins font</h2>
<blockquote class="font-crimson">Quote with Crimson Pro font</blockquote>
<span class="font-nunito">Text with Nunito font</span>
```

## Customization

Customize the appearance by overriding CSS variables:

```css
:root {
    /* Vertical rule customization */
    --helpers-vr-opacity: 0.5;        /* Default: 0.25 */
    --helpers-vr-width: 2px;           /* Default: 1px */
}
```

## Examples

### Navigation with Vertical Rules

```html
<nav class="hstack fixed-top bg-white p-3 shadow">
    <a href="#" class="font-poppins font-weight-bold">Logo</a>
    <span class="vr mx-3"></span>
    <a href="#">Home</a>
    <span class="vr mx-2"></span>
    <a href="#">About</a>
    <span class="vr mx-2"></span>
    <a href="#">Contact</a>
</nav>
```

### Card Layout with Stacks

```html
<div class="card">
    <div class="vstack p-4">
        <h3 class="font-inter">Card Title</h3>
        <p class="truncate">This description will be truncated if too long...</p>
        <div class="hstack mt-auto">
            <button class="btn btn-primary">Action</button>
            <span class="vr mx-2"></span>
            <button class="btn btn-secondary">Cancel</button>
        </div>
    </div>
</div>
```

### Sticky Sidebar Layout

```html
<div class="relative">
    <div class="sticky-top">
        Sticky content
    </div>
    <main class="col-md-9">
        <!-- Main content -->
    </main>
</div>
```

## Integration with LowCSS

When using with LowCSS, combine helper classes with utility classes:

```html
<div class="hstack bg-gray-100 p-4 rounded">
    <img src="avatar.jpg" class="w-12 h-12 rounded-full">
    <span class="vr mx-3"></span>
    <div class="vstack">
        <h4 class="font-inter text-lg font-semibold">John Doe</h4>
        <p class="text-gray-600 truncate">Software Developer at Company</p>
    </div>
</div>
```

## License

This package is licensed under the [MIT License](../../LICENSE).
