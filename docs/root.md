---
title: "Root CSS Variables"
layout: "docs"
sidebar: "default"
permalink: "/docs/root.html"
prevPage: "usage"
nextPage: "theming"
---

# Root CSS Variables

LowCSS provides CSS variables generated from your custom configuration, making it even easier to maintain a consistent color scheme across your project.

The following CSS variables are available, derived from the default configuration of LowCSS.

## Colors Variables

The colors variables are generated from values in `low.$colors`:

<table>
    <thead>
        <tr>
            <th>Variable name</th>
            <th>Value</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {{#each site.data.variables.colors}}
        <tr>
            <td><code>--low-{{@key}}</code></td>
            <td><code>{{@value}}</code></td>
            <td>
                <div class="bg-{{@key}} border border-neutral-200 rounded-lg h-4 w-16 mx-auto"></div>
            </td>
        </tr>
        {{/each}}
    </tbody>
</table>

## Font Family Variables

The font family variables are generated from values in `low.$font-families`;

<table>
    <thead>
        <tr>
            <th>Variable name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {{#each site.data.variables.font-families}}
        <tr>
            <td><code>--low-font-{{@key}}</code></td>
            <td><code>{{@value}}</code></td>
        </tr>
        {{/each}}
    </tbody>
</table>

## Font Size Variables

> Font sizes variables were added in **v0.23.0**.

The font size variables are generated from values in `low.$font-sizes`;

<table>
    <thead>
        <tr>
            <th>Variable name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {{#each site.data.variables.font-sizes}}
        <tr>
            <td><code>--low-font-{{@key}}</code></td>
            <td><code>{{@value}}</code></td>
        </tr>
        {{/each}}
    </tbody>
</table>

## Font Weight Variables

> Font weights variables were added in **v0.23.0**.

The font weight variables are generated from values in `low.$font-weights`;

<table>
    <thead>
        <tr>
            <th>Variable name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {{#each site.data.variables.font-weights}}
        <tr>
            <td><code>--low-font-{{@key}}</code></td>
            <td><code>{{@value}}</code></td>
        </tr>
        {{/each}}
    </tbody>
</table>

## Tracking Variables

> Tracking variables were added in **v0.23.0**.

The tracking variables (used for `letter-spacing`) are generated from values in `low.$trackings`;

<table>
    <thead>
        <tr>
            <th>Variable name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {{#each site.data.variables.trackings}}
        <tr>
            <td><code>--low-tracking-{{@key}}</code></td>
            <td><code>{{@value}}</code></td>
        </tr>
        {{/each}}
    </tbody>
</table>

## Leading Variables

> Leading variables were added in **v0.23.0**.

The leading variables (used for `line-height`) are generated from values in `low.$leadings`;

<table>
    <thead>
        <tr>
            <th>Variable name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {{#each site.data.variables.leadings}}
        <tr>
            <td><code>--low-leading-{{@key}}</code></td>
            <td><code>{{@value}}</code></td>
        </tr>
        {{/each}}
    </tbody>
</table>

## Spacing Variables

> Spacing variables were added in **v0.23.0**.

The spacing variables are generated from values in `low.$spacing`;

<table>
    <thead>
        <tr>
            <th>Variable name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {{#each site.data.variables.spacing}}
        <tr>
            <td><code>--low-space-{{@key}}</code></td>
            <td><code>{{@value}}</code></td>
        </tr>
        {{/each}}
    </tbody>
</table>




## Using CSS Variables

You can access the CSS variables in your CSS or SASS code. For example:

```css
.my-element {
    background-color: var(--low-blue-600);
    color: var(--low-white);
}
```
