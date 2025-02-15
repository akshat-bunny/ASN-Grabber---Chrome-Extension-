chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ asnNumbers: [] });
    console.log("ASN Grabber Installed and Storage Initialized.");
});
