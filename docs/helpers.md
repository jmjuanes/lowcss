---
title: "Helpers"
sidebar: true
permalink: "/docs/helpers.html"
prevPage: "keyframes"
nextPage: "markup"
---

# Helpers

LowCSS introduces a set of helper styles to assist you in common layout and text formatting tasks. These helpers are designed to simplify your development process and enhance the visual presentation of your web projects.

## Clearfix

The `clearfix` helper is used to clear floated elements within a container. It ensures that the container expands to encompass all floated child elements, preventing layout issues and maintaining the desired flow of content.

To apply the `clearfix` helper, simply add the `clearfix` class to the parent container:

```html
<div class="clearfix">
    <!-- Floated child elements go here -->
</div>
```

## Text Truncation

The `truncate` helper provides a straightforward way to truncate text that overflows its container. This is particularly useful for avoiding text overflow issues in limited space scenarios.

To truncate text, add the `truncate` class to the element:

```html
<p class="truncate">
    This is a long text that will be truncated if it overflows its container.
</p>
```

## Fix Elements to Top/Bottom

The `fixed-top` and `fixex-bottom` helpers allow you to fix elements in position at the top or bottom of the viewport. This is commonly used for navigation menus, banners, or other content that should remain visible as the user scrolls.

To fix an element to the top, add the `fixed-top` class:

```html
<div class="fixed-top">
    <!-- Content to be fixed at the top -->
</div>
```

To fix an element to the bottom, use the `fixed-bottom` class:

```html
<div class="fix-to-bottom">
    <!-- Content to be fixed at the bottom -->
</div>
```

## Sticky Elements to Top/Bottom

The `sticky-top` and `sticky-bottom` helpers allow you to make elements sticky, ensuring they remain in their natural flow until scrolling pushes them off-screen. At that point, they become fixed to the top or bottom of the viewport.

### Sticky to top

Use the `sticky-top` class to make an element sticky at the top of the viewport. This is ideal for navigation menus, headers, or other elements that you want to stay visible as users scroll down the page.

```html
<div class="sticky-top">
    <!-- Content to be sticky at the top -->
</div>
```

#### Responsive Sticky to top

In responsive web design, you may want to apply sticky behavior differently on various screen sizes. LowCSS provides responsive classes that allow you to control the sticky behavior based on your breakpoints. For example, you can make an element sticky on medium and larger screens but not on smaller ones.

```html
<div class="md:sticky-top">
    <!-- Sticky on medium and larger screens, not sticky on smaller screens -->
</div>
```

In this example, the element will be sticky for `md` (medium) and larger screen sizes, but it won't be sticky on smaller screens.

### Sticky to Bottom

Use the `sticky-bottom` class to make an element sticky at the bottom of the viewport. This is often used for footers, call-to-action buttons, or other content that should remain visible as users scroll.

```html
<div class="sticky-bottom">
    <!-- Content to be sticky at the bottom -->
</div>
```

#### Responsive Sticky to bottom

Just like with the `sticky-top` class, you can make the `sticky-bottom` element responsive by using the provided responsive classes. For instance, you might want an element to be sticky at the bottom only on medium or larger screens.

```html
<div class="md:sticky-bottom">
    <!-- Sticky at the bottom on medium or large and larger screens, not sticky on smaller screens -->
</div>
```
