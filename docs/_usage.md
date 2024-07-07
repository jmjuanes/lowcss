# Usage

LowCSS adopts a familiar and intuitive utility class naming convention, inspired by [Tailwind CSS](https://www.tailwindcss.com). This syntax allows you to apply a wide range of styles to your HTML elements by adding class attributes directly in your markup.

## Basic Usage

The basic naming pattern for our utility classes is as follows:

```
[{prefix}]{property}-{value}
```

Let's break down each component of the naming pattern:

- `{prefix}` (optional): you can configure LowCSS for adding a custom prefix to all utilities.
- `{property}`: specifies the CSS property that the utility class modifies. Examples of properties include `bg` for background, `text` for text-related styles, `p` for padding, `m` for margin, and so on. This component is not always present and depends on the utility class.
- `{value}`: indicates the specific value or variation for the CSS property. 

For example, to set the text color to red, use the following class:

```html
<p class="text-red-500">Hello, world!</p>
```

This will apply the specified style to the element, resulting in red-colored text.

## Responsive Design

LowCSS makes it easy to create responsive designs using the following utility syntax: 

```
{breakpoint}:[{prefix}]{property}-{value}
```

- `{prefix}`, `{property}`, and `{value}` follow the same structure as mentioned above.
- `{breakpoint}`: represents a specific breakpoint where the utility class should apply. 

The following breakpoints are defined by default in LowCSS:

| Breakpoint | Name | Minimum width | Rule |
|------------|------|---------------|------|
| Small | `sm` | `640px` | `@media (min-width: 640px) { ... }` |
| Medium | `md` | `768px` | `@media (min-width: 768px) { ... }` |
| Large | `lg` | `1024px` | `@media (min-width: 1024px) { ... }` |
| Extra Large | `xl` | `1280px` | `@media (min-width: 1280px) { ... }` |

You can apply different styles at different breakpoints:

```html
<div class="hidden md:block [...]">
    Content
</div>
```

In ths example, the content text will be hidden at screens sizes lower than the medium breakpoint, and visible is screens sizes upper than the medium breakpoint.

## State Modifiers

LowCSS includes a range of utility classes for working with state modifiers, allowing you to easily style elements in specific states. We use the following syntax:

```
{modifier}:[{prefix}]{property}-{value}
```

### Pseudo modifiers

Pseudo modifiers allows you to conditionally apply an utility class based on the pseudo state, such as `hover` or `focus`.

```html
<div class="bg-blue-500 hover:bg-blue-800 [...]">
    Hover me
</div>
```

This is the list of available pseudo modifiers:

| Modifier | Description |
|----------|-------------|
| `hover` | Applied when the user hovers the element. |
| `focus` | Applied to the element when it has focus. |
| `focus-within` | Applied to the element when it or one of its descendants has focus. |
| `active` | Applied to the element when it is being pressed. |
| `visited` | Applied to the element when it has already visited. |
| `checked` | Applied to the element when it is checked (only for radio or checkbox). |
| `disabled` | Applied to the element when it is disabled. |
| `required` | Applied to the element when it is required. |
| `first` | Applied to the element when it is the first child. |
| `last` | Applied to the element when it is the last child. |
| `odd` | Applied to the whose numeric position in a series of siblings is odd. |
| `even` | Applied to the whose numeric position in a series of siblings is even. |

### Style based on a parent state

You can conditionally style an element based on the state of a parent element. Add a `group` class to the parent element and use one of the `group-*` modifiers to style the target element.

```html
<div class="group [...]">
    <!-- button content -->
    <div class="hidden group-hover:block [...]">
        <!-- dropdown items -->
    </div>
</div>
```

This is a list of all `group-*` modifiers available:

| Modifier | Description |
|----------|-------------|
| `group-hover` | Applied when the parent element is hovered. |
| `group-focus` | Applied when the parent element is focussed. |
| `group-focus-within` | Applied when the parent element or one of its descendants are focussed. |

### Style based on a sibling state

> This feature was added in **v0.13.0**.

You can conditionally style an element based on the state of a sibling element. Add a `peer` class to the sibling element, and use any of the `peer-*` modifiers to style the target element.

```html
<input type="checkbox" class="peer [...]" >
<!-- This message will be only visible when checkbox is checked -->
<label class="hidden peer-checked:block [...]">
    You checked it!
</label>
```

This is a list of all `peer-*` modifiers available:

| Modifier | Description |
|----------|-------------|
| `peer-hover` | Applied when the sibling element is hovered. |
| `peer-focus` | Applied when the sibling element is focussed. |
| `peer-checked` | Applied when the sibling element is checked. |
| `peer-active` | Applied when the sibling element has an <b>active</b> state. |
