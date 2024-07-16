---
title: "Utilities"
layout: "docs"
permalink: "/docs/utilities.html"
prevPage: "markup"
---

# Utilities

<div class="">
    {{#each site.data.utilities}}
    <div class="mb-16">
        <a name="{{name}}" class=""></a>
        <h2 class="mb-3">{{name}}</h2>
        <div class="mb-2">{{description}}</div>
        <div class="mb-4 flex items-center gap-2">
            <a href="{{url}}" target="_blank" class="flex items-center gap-1 no-underline hover:underline text-neutral-700 cursor-pointer">
                <div class="flex items-center text-base">
                    <svg width="1em" height="1em"><use xlink:href="/sprite.svg#external-link"></use></svg>
                </div>
                <div class="text-sm">MDN Reference</div>
            </a>
        </div>
        <div class="mb-4 flex gap-2 flex-wrap">
            {{#if hasDefaultVariant}}
            <div class="py-1 px-2 bg-gray-900 text-white text-xs rounded-lg">
                <span class="font-bold">default</span>
            </div>
            {{/if}}
            {{#if hasResponsiveVariant}}
            <div class="py-1 px-2 bg-gray-700 text-white text-xs rounded-lg">
                <span class="font-bold">responsive</span>
            </div>
            {{/if}}
            {{#each pseudos}}
            <div class="py-1 px-2 bg-gray-200 text-xs rounded-lg">
                <span>pseudo: <span class="font-bold">{{.}}</span></span>
            </div>
            {{/each}}
        </div>
        <div class="max-h-96 overflow-auto text-gray-500">
            <table class="w-full mt-0 mb-0">
                {{#each values}}
                <tr class="border border-gray-200 text-xs">
                    <td class="p-4 font-mono bg-gray-100 text-blue-600">
                        <span>{{name}}</span>
                    </td>
                    <td class="p-4 font-mono text-gray-800">
                        {{#each values}}
                        <div class="mb-1">
                            <span class="text-indigo-700">{{key}}</span>: {{value}};
                        </div>
                        {{/each}}
                    </td>
                </tr>
                {{/each}}
            </table>
        </div>
    </div>
    {{/each}}
</div>
