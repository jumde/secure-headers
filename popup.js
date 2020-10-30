var i=0;

function addOriginToList(url) {
    h1 = document.createElement("H3");
    i++;
    origin = document.createTextNode(i + ". " + url);
    h1.appendChild(origin);
    document.body.appendChild(h1);
}

chrome.tabs.getSelected(null, function(tab){ 
    currentTabId = tab.id;
    console.log("tab id in getselected "+currentTabId);
    chrome.webRequest.onHeadersReceived.addListener(
        function(details) {
            addOriginToList(details.url);
            return {responseHeaders: details.responseHeaders};
        },
        // filters
        {urls: ["<all_urls>"]},
        // extraInfoSpec
        ['responseHeaders', 'extraHeaders']);
});
