function missingSecurityHeaders(headers) {
    var securityHeaders = security_headers;
    console.log("Headers");
    console.log(headers);
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

function updateView(url, headers) {
    document.getElementById('reload-page').hidden = true; 
    document.getElementById('title').hidden = false; 
    console.log("Headers for URL");
    console.log(headers);
        
    div = document.createElement("div");
    origin = document.createTextNode("URL: " + url);
    div.appendChild(origin);
    missingHeaders = missingSecurityHeaders(headers);
    missingHeadersHTML = showHeaders(missingHeaders, 'missing-headers');
    div.appendChild(missingHeadersHTML);
    div.appendChild(document.createElement("br"));
    document.body.appendChild(div);
}

/*
chrome.runtime.onMessage.addListener(presentSecurityWarningsForHeaders);

function presentSecurityWarningsForHeaders(headersForUrl) {
   console.log("Updating View");
   updateView(headersForUrl); 
}*/

chrome.tabs.getSelected(null, function(tab){
    currentTabId = tab.id;
    chrome.webRequest.onHeadersReceived.addListener(
        function(details) {
            if(!details.hasOwnProperty("url")) {
                return;
            }
            url = details.url
            updateView(details.url, details.responseHeaders);
            return {responseHeaders: details.responseHeaders};
        },
        // filters
        {urls: ["<all_urls>"]},
        // extraInfoSpec
        ['responseHeaders', 'extraHeaders']);
});
