# lowcss-forms

A simple CSS reset for form elements that makes them easy to style with LowCSS utility classes.

## Installation

You can install lowcss-forms via **npm** or **yarn**:

```bash
# using npm
$ npm install lowcss-forms

# using yarn
$ yarn add lowcss-forms
```

## Features

- Normalizes form elements across browsers.
- Makes form elements more consistent and easier to style.
- Removes browser-specific styling for a clean base.
- Designed to work seamlessly with LowCSS utility classes.
- Lightweight and focused on the most common form elements.

## Usage

Import the reset in your project using either ES modules or by linking the CSS file directly in your HTML:

```js
// Using ES modules
import "lowcss-forms";
```

```html
<!-- Or reference it in your HTML -->
<link rel="stylesheet" href="node_modules/lowcss-forms/index.css">
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

This package includes resets for the following form elements:

### Text inputs
- Input types: text, email, url, password, number, date, datetime, datetime-local, month, tel, time, week.
- Removes default appearances.
- Standardizes sizing and padding.
- Normalizes placeholder styling.

### Checkboxes and radio buttons
- Removes default appearance.
- Sets consistent sizing.
- Provides clean checked/indeterminate states with SVG backgrounds.
- Makes them easy to customize with color utilities.

### Range inputs
- Removes browser-specific styling.
- Provides consistent slider thumb appearance.
- Enables easy customization.

### Select elements
- Removes default appearance.
- Adds custom caret icon.
- Standardizes padding and appearance.

### Textareas
- Normalizes appearance.
- Standardizes placeholder styling.

## License

Licensed under the [MIT License](../../LICENSE).
