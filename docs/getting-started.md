# Getting started

## Installation

### Using a package manager

Install the package using either **npm** or **yarn**:

```bash
npm install lowcss
# or
yarn add lowcss
```

LowCSS ships a precompiled CSS file. Copy `low.css` into your project's assets directory:

```bash
cp ./node_modules/lowcss/low.css ./assets/
```

Then link it from the `<head>` of your HTML file:

```html
<link rel="stylesheet" href="assets/low.css">
```

### Using a hosted version

You can also use a CDN instead of installing the package:

```html
<link rel="stylesheet" href="https://unpkg.com/lowcss/low.css">
```

## Usage

LowCSS uses a utility class naming convention inspired by [Tailwind CSS](https://www.tailwindcss.com). The basic pattern is:

```text
{property}-{value}
```

- `{property}` — the CSS property the class modifies (`bg` for background, `text` for text-related styles, `p` for padding, `m` for margin...). Not every utility has one — some classes are the value on their own (`flex`, `hidden`).
- `{value}` — the specific value for that property.

```html
<button class="bg-blue-500 text-white text-base rounded-lg px-4 py-2 border-0 cursor-pointer">
    Button
</button>
```

## Responsive design

Prefix any utility with a breakpoint name to apply it only from that width upward:

```text
{breakpoint}:{property}-{value}
```

| Breakpoint | Name | Minimum width |
| --- | --- | --- |
| Small | `sm` | `640px` |
| Medium | `md` | `768px` |
| Large | `lg` | `1024px` |
| Extra Large | `xl` | `1280px` |

```html
<div class="hidden md:block">
    Content
</div>
```

## State modifiers

Apply a class only in a specific state with:

```text
{modifier}:{property}-{value}
```

### Pseudo modifiers

| Modifier | Description |
| --- | --- |
| `hover` | Applied when the user hovers the element. |
| `focus` | Applied to the element when it has focus. |
| `focus-within` | Applied to the element when it or one of its descendants has focus. |
| `active` | Applied to the element while it is being activated (e.g. clicked). |
| `visited` | Applied to a visited `<a>` link. |
| `checked` | Applied to the element when it is checked (radio or checkbox). |
| `disabled` | Applied to the element when it is disabled. |
| `first` | Applied to the element when it is the first child. |
| `last` | Applied to the element when it is the last child. |
| `odd` | Applied when the element's position among its siblings is odd. |
| `even` | Applied when the element's position among its siblings is even. |

```html
<button class="bg-blue-500 hover:bg-blue-800 text-white text-base rounded-lg px-4 py-2 border-0 cursor-pointer">
    Hover me
</button>
```

### Style based on a parent's state

Add a `group` class to a parent element, then use a `group-*` modifier on any descendant:

```html
<div class="group">
    <!-- trigger content -->
    <div class="hidden group-hover:block">
        <!-- dropdown items -->
    </div>
</div>
```

| Modifier | Description |
| --- | --- |
| `group-hover` | Applied when the parent element is hovered. |
| `group-focus` | Applied when the parent element is focused. |
| `group-focus-within` | Applied when the parent element or one of its descendants is focused. |

### Style based on a sibling's state

Add a `peer` class to a sibling element, then use a `peer-*` modifier on the element you want to style:

```html
<input type="checkbox" class="peer">
<label class="hidden peer-checked:block">
    You checked it!
</label>
```

| Modifier | Description |
| --- | --- |
| `peer-hover` | Applied when the sibling element is hovered. |
| `peer-focus` | Applied when the sibling element is focused. |
| `peer-checked` | Applied when the sibling element is checked. |
