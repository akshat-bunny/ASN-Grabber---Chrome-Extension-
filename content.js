console.log("ASN Grabber content script loaded.");

// Regex pattern to match ASN numbers (AS12345 format)
const asnRegex = /\bAS\d{1,6}\b/g;

// Function to extract ASN numbers from the page
function extractASN() {
    let matches = [];

    // Loop through all visible elements to extract ASN numbers
    document.querySelectorAll("body, div, span, p, a").forEach(el => {
        const found = el.innerText.match(asnRegex);
        if (found) matches.push(...found);
    });

    matches = [...new Set(matches)]; // Remove duplicates

    console.log("Extracted ASNs:", matches);

    if (matches.length > 0) {
        chrome.storage.local.get({ asnNumbers: [] }, (data) => {
            const updatedASNs = [...new Set([...data.asnNumbers, ...matches])];
            chrome.storage.local.set({ asnNumbers: updatedASNs });
        });
    }
}

// Initial Extraction
setTimeout(extractASN, 2000); // Delay for Google page load

// Detect changes in search results and extract ASNs dynamically
const observer = new MutationObserver(() => {
    console.log("Page updated, extracting ASNs...");
    extractASN();
});
observer.observe(document.body, { childList: true, subtree: true });
