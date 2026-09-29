# LowCSS Forms Addon

A simple CSS reset for form elements that makes them easy to style with LowCSS utility classes.

## Features

- Normalizes form elements across browsers.
- Makes form elements more consistent and easier to style.
- Removes browser-specific styling for a clean base.
- Designed to work seamlessly with LowCSS utility classes.
- Lightweight and focused on the most common form elements.

## Usage

Import the reset in your project by linking the CSS file directly in your HTML:

```html
<link rel="stylesheet" href="node_modules/lowcss/addons/forms/index.css">
```

After importing, form elements will have consistent base styling that you can customize using LowCSS utility classes:

```html
<input type="text" class="border-1 border-gray-200 rounded-md focus:border-blue-500 w-full">

<select class="border-1 border-gray-200 rounded-md bg-white">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

## Reset Elements

This section provides detailed explanations of how each CSS block in lowcss-forms resets and normalizes form elements.

### Text Inputs

Text inputs are normalized to provide consistent styling across browsers. The reset removes the default browser appearance using `appearance: none`, which helps eliminate inconsistencies. A standard font size of 1rem with a comfortable line-height of 1.5 ensures readability across all text inputs. The uniform padding (0.5rem vertical, 0.75rem horizontal) creates consistent dimensions that work well with LowCSS utility classes for further customization.

```css
[type="text"],
[type="email"],
[type="url"],
[type="password"],
[type="number"],
[type="date"],
[type="datetime"],
[type="datetime-local"],
[type="month"],
[type="tel"],
[type="time"],
[type="week"],
select,
textarea {
    appearance: none;
    font-size: 1rem;
    line-height: 1.5;
    padding: 0.5rem 0.75rem;
}
```

### Placeholder Styling

Placeholders are styled to maintain consistency with your design system. The reset uses the current text color for placeholders via `currentColor` and sets their opacity to 50%, creating a subtle, recognizable appearance. This approach ensures placeholders have a consistent look across different browsers while still being visually distinct from actual input text.

```css
input::placeholder,
textarea::placeholder {
    color: currentColor;
    opacity: 0.5;
}
```

### Checkboxes and Radio Buttons

Checkboxes and radio buttons are completely redesigned to provide a clean slate for styling. The reset removes default browser styling and establishes consistent dimensions (1rem × 1rem) for both elements. They're properly aligned with text using `vertical-align: middle` and prevent text selection with `user-select: none`. Radio buttons are made perfectly round with a large border-radius, distinguishing them from checkboxes while maintaining stylistic harmony.

```css
[type="checkbox"],
[type="radio"] {
    appearance: none;
    background-origin: border-box;
    display: inline-block;
    height: 1rem;
    margin: 0;
    padding: 0;
    user-select: none;
    vertical-align: middle;
    width: 1rem;
}
[type="radio"] {
    border-radius: 999px;
}
```

### Checked States

When checkboxes and radio buttons are checked or indeterminate, this CSS creates a consistent visual indicator. The reset uses `currentColor` for the background, inheriting from the text color property and making it easy to customize with LowCSS color utilities. The CSS centers the background image for the indicator and makes borders transparent when elements are checked, preparing the element for custom SVG indicators that follow.

```css
[type="checkbox"]:checked,
[type="checkbox"]:indeterminate,
[type="radio"]:checked {
    background-color: currentColor;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-color: transparent;
}
```

It also adds specific SVG backgrounds for different states: a checkmark icon for checked checkboxes, a horizontal line for indeterminate checkboxes, and a circle indicator for checked radio buttons. These SVG backgrounds are embedded directly in the CSS for performance and simplicity.

```css
[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,...");
}
[type="checkbox"]:indeterminate {
    background-image: url("data:image/svg+xml,...");
}
[type="radio"]:checked {
    background-image: url("data:image/svg+xml,...");
}
```

### Range Inputs

Range inputs (sliders) are normalized to provide a consistent appearance across browsers. The reset removes default browser styling and creates a smooth, rounded track with `border-radius: 1rem`. The slider thumb is styled with consistent dimensions (1rem × 1rem) and uses `currentColor`, making it automatically match your design system's colors. The CSS handles vendor-specific selectors for cross-browser compatibility, ensuring consistent appearance in all modern browsers.

```css
[type="range"] {
    appearance: none;
    border-radius: 1rem;
    display: block;
    margin: 0;
    min-width: 0;
    outline: none;
}
[type="range"]:-webkit-slider-thumb,
[type="range"]:-moz-range-thumb {
    background-color: currentColor;
    border: none;
    border-radius: 999px;
    height: 1rem;
    width: 1rem;
}
```

### Select Elements

Select elements are restyled to maintain visual harmony with other form elements. The reset adds a custom dropdown caret icon via SVG background, positioned consistently on the right side of the element. The CSS applies appropriate padding to prevent text from overlapping with the caret icon. This approach maintains the native select behavior while providing a consistent visual appearance that integrates well with other form elements in your LowCSS design system.

```css
select {
    background-image: url("data:image/svg+xml,...");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 16px 12px;
    padding-right: 2.5rem;
}
```
