---
title: "Markup"
layout: "docs"
sidebar: "default"
permalink: "/docs/markup.html"
prevPage: "helpers"
nextPage: "extensions-themes"
---

# Markup

> Markup styles was added in **v0.22.0**.

Achieving consistent and visually appealing typography is essential for creating engaging and readable web content. The **Markup** styles streamlines this process by providing predefined styles and configurations that you can easily apply to any vanilla HTML, regardless of its source (for example, from a Markdown parser).

```html
<div class="markup">
    <h1>Welcome to Our Blog</h1>
    <p>
        At XYZ Corp, we are dedicated to providing you with the latest news, 
        insights, and updates from the world of technology. Whether you are a 
        seasoned developer or just getting started, our blog is your go-to 
        resource for informative articles, tutorials, and industry trends.
    </p>
    <p>
        From tips and tricks for mastering popular programming languages to 
        in-depth analyses of emerging technologies, our team of experts is here 
        to help you stay informed and inspired. Join us on our journey as we 
        explore the ever-evolving landscape of technology together.
    </p>
    <blockquote>
        "The only way to do great work is to love what you do." - Steve Jobs
    </blockquote>
    <p>
        So dive in, explore our blog, and discover the knowledge and inspiration 
        you need to thrive in the fast-paced world of technology. Happy reading!
    </p>
    <!-- ... -->
</div>
```

In this example, the `markup` class is applied to a container element, which automatically applies typographic defaults to the nested HTML elements within it, including headings, paragraphs, blockquotes, and more. 
