const fetchJson = url => {
    return window.fetch(url).then(res => res.json());
};

// @description initialise search
const init = async () => {
    const navigation = await fetchJson("navigation.json");
    const inputElement = document.querySelector(`input[data-role="search-input"]`);
    const resultsElement = document.querySelector(`div[data-role="search-results"]`);
    const displayResults = results => {
        resultsElement.style.display = "block";
        resultsElement.replaceChildren();
        let content = `<div>No matches found</div>`;
        if (results.length > 0) {
            const items = results.map(result => {
                const matches = result.items.map(item => {
                    return `
                        <a href="${item.link}" class="block p-2 rounded bg-neutral-50 hover:neutral-100">
                            <span class="text-sm">${item.title}</span>
                        </a>
                    `;
                });
                return `
                    <div class="mb-2 flex flex-col gap-1">
                        <div class="font-bold text-sm">${result.title}</div>
                        ${matches.join("")}
                    </div>
                `;
            });
            content = items.join("");
        }
        resultsElement.innerHTML = content;
    };
    const hideResults = () => {
        resultsElement.style.display = "none";
    };
    // Handle search
    const handleSearch = () => {
        const value = inputElement.value.trim();
        if (value.length > 2) {
            const results = [];
            navigation.forEach(nav => {
                const items = nav.items.filter(item => {
                    return item.title.toLowerCase().includes(value) || (item.keywords || []).some(k => k.includes(value));
                });
                if (items.length > 0) {
                    results.push({title: nav.title, items: items});
                }
            });
            displayResults(results);
        }
    };
    // Register input keydown
    inputElement.addEventListener("keyup", event => {
        if (event.key === "Escape") {
            return inputElement.blur();
        }
        return handleSearch();
    });
    inputElement.addEventListener("focus", () => handleSearch());
    inputElement.addEventListener("blur", () => {
        inputElement.value = "";
        window.setTimeout(() => hideResults(), 50);
    });
};

init();
