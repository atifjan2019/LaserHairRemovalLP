(function () {
    function initDKI() {
        console.log("DKI: Initializing...");
        const urlParams = new URLSearchParams(window.location.search);
        const locId = urlParams.get('loc');

        console.log("DKI: locId =", locId);

        const defaultCityName = 'Marylebone';
        const hasLocations = (typeof LOCATIONS !== 'undefined');
        const cityName = (locId && hasLocations && LOCATIONS[locId]) ? LOCATIONS[locId] : defaultCityName;
        if (!locId) {
            console.log("DKI: No locId provided; defaulting to", cityName);
        } else if (!hasLocations) {
            console.log("DKI: Missing LOCATIONS data; defaulting to", cityName);
        } else if (!LOCATIONS[locId]) {
            console.log("DKI: No city found for ID", locId, "- defaulting to", cityName);
        }

        console.log("DKI: Target city =", cityName);
        const upperName = cityName.toUpperCase();

        // 1. Update Document Title
        document.title = document.title.replace(/Hornchurch/g, cityName);
        document.title = document.title.replace(/HORNCHURCH/g, upperName);

        // 2. Update Body Text
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
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
            if (node.textContent.includes('Hornchurch') || node.textContent.includes('HORNCHURCH')) {
                nodesToUpdate.push(node);
            }
        }

        console.log("DKI: Found", nodesToUpdate.length, "text nodes to update.");

        nodesToUpdate.forEach(node => {
            node.textContent = node.textContent.replace(/Hornchurch/g, cityName);
            node.textContent = node.textContent.replace(/HORNCHURCH/g, upperName);
        });

        // 3. Update Social Proof Data
        if (window.js_socialproof_vars && window.js_socialproof_vars.popup_data) {
            window.js_socialproof_vars.popup_data.forEach(item => {
                if (item.location && item.location.city === 'Hornchurch') {
                    item.location.city = cityName;
                }
            });
        }

        console.log("DKI: Finished replacement.");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDKI);
    } else {
        initDKI();
    }
})();
