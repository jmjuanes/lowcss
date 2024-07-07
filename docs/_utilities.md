# Utilities

<div class="">
    {{#utilities}}
    <div class="mb-16">
        <a name="{{name}}" class=""></a>
        <h3>{{name}}</h3>
        <div class="mb-4">{{description}}</div>
        <div class="mb-4 flex gap-2 flex-wrap">
            {{#hasDefaultVariant}}
            <div class="py-1 px-2 bg-gray-900 text-white text-xs rounded-lg">
                <span class="font-bold">default</span>
            </div>
            {{/hasDefaultVariant}}
            {{#hasResponsiveVariant}}
            <div class="py-1 px-2 bg-gray-700 text-white text-xs rounded-lg">
                <span class="font-bold">responsive</span>
            </div>
            {{/hasResponsiveVariant}}
            {{#pseudos}}
            <div class="py-1 px-2 bg-gray-200 text-xs rounded-lg">
                <span>pseudo: <span class="font-bold">{{.}}</span></span>
            </div>
            {{/pseudos}}
        </div>
        <div class="max-h-96 overflow-auto text-gray-500">
            <table class="w-full">
                {{#values}}
                <tr class="border border-gray-200 text-xs">
                    <td class="p-4 font-mono bg-gray-100 text-blue-600">
                        <span>{{name}}</span>
                    </td>
                    <td class="p-4 font-mono text-gray-800">
                        {{#values}}
                        <div class="mb-1">
                            <span class="text-indigo-700">{{key}}</span>: {{value}};
                        </div>
                        {{/values}}
                    </td>
                </tr>
                {{/values}}
            </table>
        </div>
    </div>
    {{/utilities}}
</div>
