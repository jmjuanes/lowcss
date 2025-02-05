---
title: "Keyframes"
layout: "docs"
sidebar: "default"
permalink: "/docs/keyframes.html"
prevPage: "reset"
nextPage: "helpers"
---

# Keyframes

We provide a collection of keyframes animation styles that can be used in conjunction with the animation utilities to create engaging and dynamic animations in your web projects. These predefined keyframes styles provide a quick and convenient way to add commonly used animations without the need to write complex CSS animations from scratch.

## Bounce

The **bounce** animation creates a bouncing effect, giving an element a playful and dynamic appearance. Use the `animation-bounce` utility for applying a bounce animation to the element.

```css
@keyframes bounce {
    0%,
    100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}
``` 

## Fade In

The `fadein` animation gradually fades an element in, smoothly transitioning it from transparent to fully visible. Use the `animation-fadein` utility for applying a fade in animation to the element.

```css
@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
```

## Fade Out

The `fadeout` animation gradually fades an element out, smoothly transitioning it from fully visible to transparent. Use the `animation-fadeout` utility for applying a fade out animation to the element.

```css
@keyframes fadeout {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
```

## Ping

The `ping` animation creates a pulsating effect, making an element quickly fade in and out to draw attention. Use the `animation-ping` utility for applying a ping animation to the element.

```css
@keyframes ping {
    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}
```

## Pulse

The `pulse` animation creates a subtle pulsating effect, giving an element a gentle breathing-like animation. Use the `animation-pulse` utility for applying a pulse animation to the element.

```css
@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
```

## Spin

The `spin` animation rotates an element continuously, creating a spinning effect. Use the `animation-spin` utility for applying a spin animation to the element.

```css
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
```
