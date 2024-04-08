# Root

LowCSS provides CSS variables generated from your custom configuration, making it even easier to maintain a consistent color scheme across your project.

The following CSS variables are available, derived from the default configuration of LowCSS.

## Colors Variables

The colors variables are generated from values in `low.$colors`:

<table className="w-full leading-normal text-sm">
    <thead>
        <tr className="">
            <td className="p-4 font-medium text-gray-700">Variable name</td>
            <td className="p-4 font-medium text-gray-700">Value</td>
            <td className="p-4 font-medium text-gray-700"></td>
        </tr>
    </thead>
    <tbody>
        {Object.keys(props.site.low.colors).map(key => (
        <tr key={key} className="border-t border-gray-200 hover:bg-gray-50">
            <td className="p-4 font-bold font-mono text-gray-900">--low-{key}</td>
            <td className="p-4 font-mono text-indigo-600">{props.site.low.colors[key].toLowerCase()}</td>
            <td className="p-4">
                <div className={`bg-${key} rounded-lg h-8 w-20`} />
            </td>
        </tr>
        ))}
    </tbody>
</table>

## Fonts Variables

The fonts variables are generated from values in `low.$fonts`;

<table className="w-full leading-normal text-sm">
    <thead>
        <tr className="">
            <td className="p-4 font-medium text-gray-700">Variable name</td>
            <td className="p-4 font-medium text-gray-700">Value</td>
        </tr>
    </thead>
    <tbody>
        {Object.keys(props.site.low.fonts).map(key => (
        <tr key={key} className="border-t border-gray-200 hover:bg-gray-50">
            <td className="p-4 font-bold font-mono text-gray-900">--low-font-{key}</td>
            <td className="p-4 font-mono text-indigo-600">{props.site.low.fonts[key].join(", ")}</td>
        </tr>
        ))}
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
