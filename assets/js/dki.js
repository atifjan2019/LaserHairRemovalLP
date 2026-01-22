(function () {
    function initDKI() {
        const urlParams = new URLSearchParams(window.location.search);
        const locId = urlParams.get('loc');

        // If no locId, the page already defaults to Romford (handled via hardcoding)
        if (!locId || typeof LOCATIONS === 'undefined') return;

        const cityName = LOCATIONS[locId];
        if (!cityName) return;

        const upperName = cityName.toUpperCase();

        // 1. Update Document Title
        document.title = document.title.replace(/Romford/g, cityName);
        document.title = document.title.replace(/ROMFORD/g, upperName);

        // 2. Update Body Text
        // We use a TreeWalker to safely replace text only in text nodes
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    // Skip scripts and styles
                    const parent = node.parentElement;
                    if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        const nodesToUpdate = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('Romford') || node.textContent.includes('ROMFORD')) {
                nodesToUpdate.push(node);
            }
        }

        nodesToUpdate.forEach(node => {
            node.textContent = node.textContent.replace(/Romford/g, cityName);
            node.textContent = node.textContent.replace(/ROMFORD/g, upperName);
        });

        // 3. Update Social Proof Data (optional but recommended for consistency)
        if (window.js_socialproof_vars && window.js_socialproof_vars.popup_data) {
            window.js_socialproof_vars.popup_data.forEach(item => {
                if (item.location && item.location.city === 'Romford') {
                    item.location.city = cityName;
                }
            });
        }
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDKI);
    } else {
        initDKI();
    }
})();
