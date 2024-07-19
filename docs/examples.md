---
title: "Examples"
layout: "default"
---

<div class="flex justify-between pt-16 pb-12 md:pt-20 md:pb-16">
    <div class="w-full">
        <div class="max-w-3xl font-crimson text-6xl md:text-7xl leading-none mb-4">
            <span class="font-medium tracking-tight text-neutral-950">Explore our examples.</span>
        </div>
        <div class="max-w-xl mt-0 mb-8 text-xl leading-relaxed">
            <span class="text-neutral-700">Some examples of common UI interfaces built using our utilities. Use them as a base for building your own.</span>
        </div>
        <div class="flex items-center gap-2">
            <a href="/docs/installation" class="flex items-center px-4 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-950 text-white no-underline cursor-pointer">
                <span class="font-medium text-sm">Get Started</span>
            </a>
        </div>
    </div>
</div>

<div class="">
{{#each site.data.examples}}
    <a name="{{name}}" class=""></a>
    <div data-role="example" data-example-name="{{name}}" class="mb-16">
        <div class="flex items-center mb-3">
            <div class="text-lg font-medium">
                <a href="#{{name}}" class="hover:underline">{{data.title}}</a>
            </div>
            <div class="ml-auto">
                <div data-role="example:tabs" class="p-1 bg-neutral-100 rounded-lg text-sm flex gap-1 font-medium">
                    <div data-tab="preview" class="bg-white shadow-sm rounded-md px-2 py-1 cursor-pointer">Preview</div>
                    <div data-tab="code" class="rounded-md px-2 py-1 cursor-pointer">Code</div>
                </div>
            </div>
        </div>
        <div class="block w-full border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            <div data-example-mode="preview" class="hidden" style="display:block;">{{!content}}</div>
            <div data-example-mode="code" class="hidden">
                <pre class="w-full bg-neutral-950 font-mono text-xs leading-relaxed text-white overflow-x-auto p-4">{{content}}</pre>
            </div>
        </div>
    </div>
{{/each}}
</div>

<script type="text/javascript">
    Array.from(document.querySelectorAll(`div[data-role="example"]`)).forEach(parent => {
        Array.from(parent.querySelectorAll(`div[data-tab]`)).forEach(tabElement => {
            tabElement.addEventListener("click", () => {
                Array.from(tabElement.parentElement.children).forEach(tab => tab.classList.remove("bg-white", "shadow-sm"));
                Array.from(parent.querySelectorAll(`div[data-example-mode]`)).forEach(el => el.style.display = "");
                tabElement.classList.add("bg-white", "shadow-sm");
                parent.querySelector(`div[data-example-mode="${tabElement.dataset.tab}"]`).style.display = "block";
            });
        });
    });
</script>
