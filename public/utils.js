// Low utility library
const utils = {
    // @description copy text to the clipboard
    // @todo implement the fallback method for the websites that do not support 'navigator.clipboard'
    copyTextToClipboard: text => {
        // TODO
        if (!navigator.clipboard) {
            return Promise.reject("");
        }
        // Copy to clipboard using navigator API
        return navigator.clipboard.writeText(text);
    },

    // @description render the provided HTML content
    renderHtml: html => {
        return (document.createRange().createContextualFragment(html.trim())).firstChild;
    },

    // @description display a confirmation toast
    showToast: (message, timeout = 5000) => {
        const parent = document.querySelector(`div[data-role="toaster"]`);
        const element = utils.renderHtml(`
            <div data-role="toast" class="flex gap-2 bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-sm">
                <div class="flex items-center text-lg text-neutral-950">
                    <svg width="1em" height="1em"><use xlink:href="sprite.svg#check-circle"></use></svg>
                </div>
                <div class="font-medium">${message}</div>
            </div>
        `);
        parent.appendChild(element);
        window.setTimeout(() => parent.removeChild(element), timeout);
    },
};
