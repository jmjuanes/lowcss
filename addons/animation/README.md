# LowCSS Animation Addon

A handful of small CSS keyframe animations.

## Usage

Import the addon in your project by linking the CSS file directly in your HTML:

```html
<link rel="stylesheet" href="node_modules/lowcss/addons/animation/index.css">
```

Then apply one of the animation classes to an element:

```html
<div class="animate-spin">...</div>
```

### Available animations

| Class | Description |
| --- | --- |
| `animate-bounce` | Bounces the element up and down, repeating forever. |
| `animate-fadein` | Fades the element in from transparent to opaque, once. |
| `animate-fadeout` | Fades the element out from opaque to transparent, once. |
| `animate-ping` | Scales the element up while fading out, repeating forever — useful for notification dots. |
| `animate-pulse` | Fades the element's opacity in and out smoothly, repeating forever. |
| `animate-spin` | Rotates the element a full turn at a constant speed, repeating forever. |
