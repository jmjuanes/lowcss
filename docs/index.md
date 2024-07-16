---
title: "A low-level CSS utility framework"
layout: "default"
features: 
  - title: "Lightning-fast development"
    description: "Prototype and develop at an accelerated pace, focusing on the functionality and design."
    icon: "bolt"
  - title: "Keep your CSS organized"
    description: "Utility classes are easy to understand and maintain, and reduces the risk of CSS bloat and specificity issues."
    icon: "grid"
  - title: "Responsive design made easy"
    description: "Effortlessly create layouts that adapt to different screen sizes and devices."
    icon: "mobile"
---

<div class="flex justify-between py-16 md:py-20 md:gap-12">
    <div class="w-full">
        <div class="max-w-lg font-crimson text-6xl md:text-7xl leading-none mb-4 md:mb-6">
            <span class="font-medium tracking-tight text-neutral-950">Start building your next idea.</span>
        </div>
        <div class="max-w-xl mt-0 mb-8 text-xl leading-relaxed">
            <span class="text-neutral-700">A low-level CSS utility framework for building elegant and responsive user interfaces. No dependencies. No configuration. Just import it and go!</span>
        </div>
        <div class="flex">
            <a href="/docs" class="flex items-center px-4 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-950 text-white no-underline cursor-pointer">
                <strong class="text-lg">Getting started</strong>
                <div class="text-xl ml-2">
                    <svg width="1em" height="1em"><use xlink:href="/sprite.svg#arrow-right"></use></svg>
                </div>
            </a>
        </div>
    </div>
    <div class="hidden md:flex flex-col items-center justify-center w-full max-w-md">
        <div class="rounded-xl bg-neutral-900 text-white w-full"> 
            <div class="flex items-center gap-2 p-4 border-b border-neutral-600">
                <div class="w-4 h-4 rounded-full bg-neutral-100"></div>
                <div class="w-4 h-4 rounded-full bg-neutral-100"></div>
                <div class="w-4 h-4 rounded-full bg-neutral-100"></div>
            </div>
            <div class="px-4 py-6 font-mono">
                <div class="opacity-40 select-none">## Install using Yarn</div>
                <div class="mb-4">$ yarn add lowcss</div>
                <div class="opacity-40 select-none">## Or Install using Npm</div>
                <div class="">$ npm install --save lowcss</div>
            </div>
        </div>
        <div class="mt-4 text-neutral-800 text-sm">
            <span>Read more in the <a href="/docs/installation" class="text-neutral-900 font-medium underline">Installation</a> section.</span>
        </div>
    </div>
</div>
<div class="w-full grid gap-8 md:grid-cols-3 grid-cols-1">
    {{#each page.data.features}}
    <div class="bg-neutral-100 rounded-lg p-8">
        <div class="mb-4 text-4xl text-neutral-800">
            <svg width="1em" height="1em"><use xlink:href="/sprite.svg#{{icon}}"></use></svg>
        </div>
        <div class="font-bold text-lg mb-2 text-neutral-800">{{title}}</div>
        <div class="text-sm">{{description}}</div>
    </div>
    {{/each}}
</div>
