# Colors

LowCSS comes equipped with a carefully curated default color palette designed to streamline your design process and enhance the visual appeal of your web projects. This palette serves as a foundation for consistent and harmonious color choices, allowing you to effortlessly create stunning user interfaces.

## Available colors

Here are the colors available in the default palette:

<div class="">
    {{#colors}}
    <div class="mb-4">
        <div class="text-lg font-bold mb-1">{{name}}</div>
        <div class="w-full grid grid-cols-3 md:grid-cols-11 gap-2">
            {{#shades}}
            <div class="w-full">
                <div class="bg-{{name}} rounded w-full h-10 mb-2"></div>
                <div class="text-xs text-gray-700 font-bold">{{shade}}</div>
                <div class="text-3xs text-gray-600 font-medium">{{value}}</div>
            </div>
            {{/shades}}
        </div>
    </div>
    {{/colors}}
</div>

## Basic usage

For convenience and rapid development, you can apply color classes directly to your HTML elements using background, border and text utilities:

```html
<div class="bg-yellow-200 text-gray-800">
    This element has a yellow background color and dark text.
</div>
```
