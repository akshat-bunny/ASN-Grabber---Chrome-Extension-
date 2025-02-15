document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("search-box");
    const searchBtn = document.getElementById("search-btn");
    const asnList = document.getElementById("asn-list");
    const copyBtn = document.getElementById("copy-btn");
    const clearBtn = document.getElementById("clear-btn");

    // Search functionality
    searchBtn.addEventListener("click", () => {
        const query = searchBox.value.trim();
        if (query) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}+Ip+Info`;
            chrome.tabs.create({ url: searchUrl });
        }
    });

    // Load stored ASN numbers
    function loadASNs(filter = "") {
        asnList.innerHTML = "";
        chrome.storage.local.get("asnNumbers", (data) => {
            if (data.asnNumbers && data.asnNumbers.length > 0) {
                const filteredASNs = filter
                    ? data.asnNumbers.filter(asn => asn.toLowerCase().includes(filter.toLowerCase()))
                    : data.asnNumbers;

                if (filteredASNs.length > 0) {
                    filteredASNs.forEach(asn => {
                        const li = document.createElement("li");
                        li.textContent = asn;
                        asnList.appendChild(li);
                    });
                } else {
                    asnList.innerHTML = "<li>No matching ASNs found</li>";
                }
            } else {
                asnList.innerHTML = "<li>No ASN numbers found</li>";
            }
        });
    }

    // Load ASNs on popup open
    loadASNs();

    // Copy ASN numbers to clipboard
    copyBtn.addEventListener("click", () => {
        chrome.storage.local.get("asnNumbers", (data) => {
            if (data.asnNumbers && data.asnNumbers.length > 0) {
                const textToCopy = data.asnNumbers.join("\n");
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert("ASN numbers copied!");
                });
            } else {
                alert("No ASN numbers to copy.");
            }
        });
    });

    // Clear stored ASN numbers
    clearBtn.addEventListener("click", () => {
        chrome.storage.local.set({ asnNumbers: [] }, () => {
            asnList.innerHTML = "<li>No ASN numbers found</li>";
            alert("ASN list cleared.");
        });
    });

    // Filter ASNs on search input
    searchBox.addEventListener("input", () => {
        loadASNs(searchBox.value);
    });
});
