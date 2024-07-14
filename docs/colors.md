---
title: "Colors"
description: ""
sidebar: false
---

<div class="flex justify-between pt-16 pb-12 md:pt-20 md:pb-16">
    <div class="w-full">
        <div class="max-w-3xl font-crimson text-6xl md:text-7xl leading-none mb-4">
            <span class="font-medium tracking-tight text-neutral-950">A palette for every project.</span>
        </div>
        <div class="max-w-lg mt-0 mb-8 text-xl leading-relaxed">
            <span class="text-neutral-700">Easily apply and customize colors to create stunning, cohesive visuals across your project.</span>
        </div>
        <div class="flex items-center gap-2">
            <a href="/docs#root" class="flex items-center px-4 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-950 text-white no-underline cursor-pointer">
                <span class="font-medium text-sm">Documentation</span>
            </a>
            <a href="/colors.json" target="_blank" class="flex items-center px-4 py-3 rounded-lg bg-white hover:bg-neutral-100 text-neutral-950 border border-neutral-200 no-underline cursor-pointer">
                <span class="font-medium text-sm">Download JSON</span>
            </a>
        </div>
    </div>
</div>
<div class="mb-16">
    {{#each site.data.colors}}
    <div class="mb-6 md:mb-8">
        <div class="text-xl font-medium mb-4 capitalize">
            <div class="mb-1">{{@key}}</div>
            <div class="h-px w-full max-w-40 bg-neutral-200"></div>
        </div>
        <div class="w-full grid grid-cols-3 md:grid-cols-11 gap-2">
            {{#each @value}}
            <div class="w-full">
                <div data-color="{{@value}}" class="relative rounded w-full h-20 mb-2 cursor-pointer group" style="background-color:{{@value}};color:{{=contrastColor @value}}">
                    <div class="absolute hidden group-hover:flex pointer-events-none top-0 right-0 mt-2 mr-2 text-lg">
                        <svg width="1em" height="1em"><use xlink:href="sprite.svg#clipboard"></use></svg>
                    </div>
                </div>
                <div class="text-xs text-gray-700 font-bold">{{@key}}</div>
                <div class="text-3xs text-gray-600 font-medium">{{@value}}</div>
            </div>
            {{/each}}
        </div>
    </div>
    {{/each}}
</div>
<script type="text/javascript">
    Array.from(document.querySelectorAll(`div[data-color]`)).forEach(element => {
        element.addEventListener("click", event => {
            utils.copyTextToClipboard(element.dataset.color).then(() => {
                utils.showToast(`Color ${element.dataset.color} copied to clipboard!`);
            });
        });
    });
</script>
