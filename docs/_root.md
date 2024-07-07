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
        {{#variables.colors}}
        <tr>
            <td><code>--low-{{key}}</code></td>
            <td><code>{{value}}</code></td>
            <td>
                <div class="bg-{{key}} border border-neutral-200 rounded-lg h-4 w-16 mx-auto"></div>
            </td>
        </tr>
        {{/variables.colors}}
    </tbody>
</table>

## Fonts Variables

The fonts variables are generated from values in `low.$fonts`;

<table>
    <thead>
        <tr>
            <th>Variable name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {{#variables.fonts}}
        <tr>
            <td><code>--low-font-{{key}}</code></td>
            <td><code>{{value}}</code></td>
        </tr>
        {{/variables.fonts}}
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
