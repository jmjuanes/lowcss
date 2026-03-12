# lowcss-colors

[![NPM Version](https://badgen.net/npm/v/lowcss-colors?labelColor=1d2734&color=21bf81)](https://npm.im/lowcss-colors)
[![MIT License](https://badgen.net/github/license/jmjuanes/lowcss?labelColor=1d2734&color=21bf81)](https://github.com//jmjuanes/lowcss)

A modular color extension for LowCSS, offering curated color palettes as functional shades from `50` to `950`. Designed for clarity, flexibility, and emotional resonance.

## What is this?

`lowcss-colors` provides optional color palettes that extend LowCSS via the `@theme` rule, or expose raw CSS variables for direct use. Each palette is a focused set of shades for a single hue - perfect for building consistent, expressive interfaces.

## Installation

You can install `lowcss-colors` via **npm** or **yarn**:

```bash
# using npm
$ npm install lowcss-colors

# using yarn
$ yarn add lowcss-colors
```

## Usage

### 1. Extend LowCSS with a specific palette

If you are using the LowCSS PostCSS plugin, you can include a palette like this:

```css
@include "lowcss-colors/lime.css";
```

This will register the `@theme` block that registers the lime colors, making the shades available to your utilities.

### 2. Include all palettes (optional)

If you want to compile LowCSS with all palettes:

```css
@include "lowcss-colors/index.css";
```

> **Note**: this increases the final CSS size. Prefer importing only the palettes you need.

### 3. Use raw CSS variables directly

For quick prototyping or non-LowCSS setups, you can import all variables:

```html
<link rel="stylesheet" href="lowcss-colors/variables.css" />
```

Use them in your styles as needed:

```css
.btn {
    background-color: var(--color-lime-500);
}
```

## Philosophy

LowCSS is about clarity, control, and emotional coherence. `lowcss-colors` follows that spirit: palettes are modular, minimal, and expressive. You choose what resonates.

## License

Licensed under the [MIT License](../../LICENSE).
