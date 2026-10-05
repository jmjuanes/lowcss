# Helpers

LowCSS Helpers module is a collection of essential CSS helpers designed to streamline layout and design tasks. These helpers provide utility classes for common styling needs, making it easier to create consistent designs without writing repetitive CSS.

## Usage

Import the addon in your project by linking the CSS file directly in your HTML:

```html
<link rel="stylesheet" href="node_modules/lowcss/helpers.css">
```

## Available Helpers

### Layout Helpers

Layout helpers provide flexbox-based utilities for creating common layout patterns with minimal markup.

#### Horizontal Stack

Use `hstack` to create an horizontal flex container with centered items and stretched alignment. Perfect for creating navigation bars, button groups, or any horizontal layout.

```css
.hstack {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-direction: row;
}
```

Example:

```html
<div class="hstack gap-3 p-4 bg-gray-100 rounded">
    <button class="px-3 py-2 bg-blue-500 text-white rounded">Button 1</button>
    <button class="px-3 py-2 bg-gray-500 text-white rounded">Button 2</button>
    <button class="px-3 py-2 bg-green-500 text-white rounded">Button 3</button>
</div>
```

#### Vertical Stack

Use `vstack` to create a vertical flex container with full stretch and flexible growth. Ideal for sidebar layouts, card content, or any vertical arrangement of elements.

```css
.vstack {
    align-self: stretch;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
}
```

Example:

```html
<div class="vstack gap-3 p-4 bg-gray-100 rounded h-48">
    <div class="p-3 bg-blue-500 text-white rounded">Header</div>
    <div class="p-3 bg-gray-500 text-white rounded flex-1">Content (grows to fill space)</div>
    <div class="p-3 bg-green-500 text-white rounded">Footer</div>
</div>
```

#### Vertical Rule

Use `vr` to create a vertical divider that stretches to fit its container height. Uses `currentColor` for automatic theming and customizable opacity and width via CSS variables.

```css
.vr {
    align-self: stretch;
    background-color: currentcolor;
    display: inline-block;
    min-height: 1em;
    opacity: var(--helpers-vr-opacity);
    width: var(--helpers-vr-width);
}
```

Example:

```html
<div class="hstack gap-3 p-4">
    <span class="text-blue-600">Home</span>
    <span class="vr"></span>
    <span class="text-blue-600">About</span>
    <span class="vr"></span>
    <span class="text-blue-600">Contact</span>
    <span class="vr"></span>
    <span class="text-gray-400">Disabled</span>
</div>
```

### Positioning

Positioning helpers provide convenient classes for fixed and sticky positioning with proper z-index values.

#### Fixed Positioning

The `.fixed-top` and `.fixed-bottom` classes position elements fixed to the viewport with full width and appropriate z-index.

```css
.fixed-top,
.fixed-bottom {
    left: 0;
    position: fixed;
    right: 0;
    z-index: 1100;
}
.fixed-top {
    top: 0;
}
.fixed-bottom {
    bottom: 0;
}
```

#### Sticky Positioning

The `.sticky-top` and `.sticky-bottom` classes create sticky elements that stick to the top or bottom when scrolling.

```css
.sticky-top,
.sticky-bottom {
    position: sticky;
    z-index: 1050;
}
.sticky-top {
    top: 0;
}
.sticky-bottom {
    bottom: 0;
}
```

### Text Helpers

Text utilities provide common text handling and layout clearing functionality.

#### Text Truncation

Use the class `truncate` to truncate overflowing text with an ellipsis, perfect for single-line text that needs to fit within a container.

```css
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

Example: 

```html
<div class="p-4 bg-gray-100 rounded">
    <div class="truncate" style="width: 250px; border: 1px solid #ccc; padding: 8px;">
        This is a very long text that will be truncated with ellipsis when it exceeds the container width
    </div>
</div>
```

#### Clearfix

The class `clearfix` clears floated elements using the after pseudo-element, ensuring parent containers properly contain their floated children.

```css
.clearfix::after {
    clear: both;
    content: "";
    display: block;
}
```

### Typography Extensions

Typography extensions provide additional font family options commonly used in modern web design.

```css
.font-inter {
    font-family: Inter, sans-serif;
}
.font-lato {
    font-family: Lato, sans-serif;
}
.font-poppins {
    font-family: Poppins, sans-serif;
}
.font-crimson {
    font-family: 'Crimson Pro', serif;
}
.font-nunito {
    font-family: Nunito, sans-serif;
}
```

Example:

```html
<div class="vstack gap-3 p-4">
    <div class="font-inter text-lg">Inter Font - A typeface carefully crafted for user interfaces</div>
    <div class="font-lato text-lg">Lato Font - A humanist sans-serif typeface family</div>
    <div class="font-poppins text-lg">Poppins Font - A geometric sans-serif typeface</div>
    <div class="font-crimson text-lg">Crimson Pro Font - A serif font family inspired by classical proportion</div>
    <div class="font-nunito text-lg">Nunito Font - A well balanced sans serif typeface superfamily</div>
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
