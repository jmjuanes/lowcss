# Installation

## Package Installation

To get started with LowCSS, you can install the package using either **Yarn** or **npm**. Follow the instructions below based on your preferred package manager:

Installation with **Yarn**:

```bash
$ yarn add lowcss
``` 

Installation usin **npm**:

```bash
$ npm install lowcss
```

<Separator />

## Including Precompiled CSS

LowCSS provides precompiled CSS files. To include them in your project, copy the file `low.css` to your project's assets or CSS directory.

```bash
$ cp ./node_modules/lowcss/low.css ./assets/
```

Then, link the CSS file in your HTML file using a `<link>` tag in the `<head>` section:

```html
<link rel="stylesheet" href="assets/low.css">
```

<Separator />

## Generating Custom Version with SASS

To generate a custom version of LowCSS using SASS, follow these steps:

### 1. Install SASS

If you haven't already, install the SASS compiler on your system by following the instructions provided in the official [SASS documentation](https://sass-lang.com).

### 2. Create a SASS file 

Add a new SASS file with `.scss` extension (e.g., `main.scss`) in your project.

```bash
$ touch main.scss
```

### 3. Import and customize LowCSS

Import LowCSS in your SASS file and customize the imported SASS variables and utility classes to match your project's needs. Refer to the [SASS variables](./variables) section for more details on available variables and customization options.

```scss
@use "low" with (
    // custom configuration
);
``` 

Load the modules of LowCSS that you need using the `@include` directive:

```scss
@include low.base();
@include low.utilities();
```

### 4. Compile SASS

Compile SASS file into CSS using the SASS compiler. Run the following command:

```bash
$ sass --load-path=./node_modules/lowcss main.scss output.css
```

Replace `main.scss` with the path to your custom SASS file, and `output.css` with the desired path and filename for the generated CSS file.

### 5. Include the output CSS

Link the generated CSS file in your HTML file using a `<link>` tag in the `<head>` section:

```html
<link rel="stylesheet" href="output.css">
```

<Separator />

## Using Hosted Version from CDN

If you prefer not to install or compile [Framework Name] locally, you can utilize the hosted version from a Content Delivery Network (CDN). Simply include the following `<link>` tag in the `<head>` section of your HTML file:

```html
<link rel="stylesheet" href="https://unpkg.com/lowcss/low.css">
```

**Note**: Using the hosted version means you won't have direct control over customizations. Consider the custom version generation with SASS for more flexibility.
