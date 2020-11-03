function missingSecurityHeaders(headers) {
    var securityHeaders = security_headers;
    console.log(securityHeaders);
    var op = headers.map(function(item) {
        return item.name.toLowerCase();
    });
    var missingHeaders = securityHeaders.filter(function(header) {
        return op.indexOf(header) < 0;
    });
    console.log("All headers: ");
    console.log(op);
    console.log("Missing headers: ");
    console.log(missingHeaders);
    return missingHeaders;
}

function showHeaders(headers, type) {
   p = document.createElement("p");
   p.setAttribute("id", type);
   ui = document.createElement("ui");
   for (var i = 0; i < headers.length; ++i) {
       li = document.createElement("li");
       header = document.createTextNode(headers[i]);
       li.appendChild(header);
       ui.appendChild(li);
   }
   p.appendChild(ui);
   return p;
}

function addOriginToList(url, requestHeaders, responseHeaders) {
    div = document.createElement("div");
    origin = document.createTextNode("URL: " + url);
    div.appendChild(origin);
    missingHeaders = missingSecurityHeaders(responseHeaders);
    missingHeadersHTML = showHeaders(missingHeaders, 'missing-headers');
    div.appendChild(missingHeadersHTML);
    allHeadersButton = document.createElement("button");
    allHeadersButtonText = document.createTextNode("All headers");
    allHeadersButton.appendChild(allHeadersButtonText);
    div.appendChild(document.createElement("br"));
    div.appendChild(allHeadersButton);
    document.body.appendChild(div);
}

chrome.tabs.getSelected(null, function(tab){ 
    currentTabId = tab.id;
    console.log("tab id in getselected "+currentTabId);
    chrome.webRequest.onHeadersReceived.addListener(
        function(details) {
            addOriginToList(details.url, details.requestHeaders, details.responseHeaders);
            return {responseHeaders: details.responseHeaders};
        },
        // filters
        {urls: ["<all_urls>"]},
        // extraInfoSpec
        ['responseHeaders', 'extraHeaders']);
});
