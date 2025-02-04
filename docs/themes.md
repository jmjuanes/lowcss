---
title: "Themes"
layout: "default"
themes:
  primary:
    - value: "neutral-950"
      name: "Neutral"
    - value: "blue-500"
      name: "Blue"
    - value: "red-500"
      name: "Red"
    - value: "green-500"
      name: "Green"
    - value: "orange-500"
      name: "Orange"
  radius:
    - value: "radius-none"
      name: "0"
    - value: "radius-sm"
      name: "0.125"
    - value: "radius-md"
      name: "0.375"
    - value: "radius-lg"
      name: "0.5"
    - value: "radius-2xl"
      name: "1"
---

<div class="pt-16 pb-12 md:pt-20 md:pb-16">
    <div class="max-w-3xl font-crimson text-6xl md:text-7xl leading-none mb-4">
        <span class="font-medium tracking-tight text-neutral-950">Themeable Utilities.</span>
    </div>
    <div class="max-w-2xl mt-0 mb-8 text-xl leading-relaxed">
        <span class="text-neutral-700">A collection of customizable utilities that you can use for theming your UI components.</span>
    </div>
    <div class="hidden items-center gap-2">
        <a href="/docs/installation" class="flex items-center px-4 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-950 text-white no-underline cursor-pointer">
            <span class="font-medium text-sm">Get Started</span>
        </a>
    </div>
    <div class="w-full flex gap-8 select-none">
        <div class="flex flex-col gap-2">
            <div class="text-sm font-bold leading-none">Primary color</div>
            <div class="flex gap-2">
            {{#each page.data.themes.primary}}
                <div class="rounded-md cursor-pointer border-2 border-border px-2 py-1 flex items-center gap-2" data-low-role="themes:primary:value" data-low-value="{{value}}">
                    <div class="w-5 h-5 bg-{{value}} rounded-full"></div>
                    <div class="text-xs font-medium">{{name}}</div>
                </div>
            {{/each}}
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <div class="text-sm font-bold leading-none">Border radius</div>
            <div class="flex gap-2">
            {{#each page.data.themes.radius}}
                <div class="rounded-md cursor-pointer border-2 border-border px-2 py-1 flex items-center gap-2" data-low-role="themes:radius:value" data-low-value="{{value}}">
                    <div class="text-xs font-medium">{{name}}</div>
                </div>
            {{/each}}
            </div>
        </div>
    </div>
</div>

<style data-low-role="themes:primary:style"></style>
<style data-low-role="themes:radius:style"></style>
<div class="" data-low-role="themes:cards">
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div class="flex flex-col gap-4">
            {{> cards.chat}}
            {{> cards.post}}
        </div>
        <div class="flex flex-col gap-4">
            {{> cards.sign_up}}
            {{> cards.profile}}
        </div>
        <div class="flex flex-col gap-4">
            {{> cards.team}}
            {{> cards.money_track}}
        </div>
    </div>
</div>

<script type="text/javascript">
    ["primary", "radius"].forEach(type => {
        const elements = Array.from(document.querySelectorAll(`div[data-low-role="themes:${type}:value"]`));
        elements.forEach(el => {
            el.addEventListener("click", () => {
                document.querySelector(`style[data-low-role="themes:${type}:style"]`).innerHTML = `:root{--low-${type}: var(--low-${el.dataset.lowValue});}`;
                elements.forEach(otherElement => otherElement.classList.remove("border-neutral-950"));
                el.classList.add("border-neutral-950");
            });
        });
        elements[0].classList.add("border-neutral-950");
    });
</script>
