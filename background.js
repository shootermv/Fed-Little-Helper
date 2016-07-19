class Proxy {
    constructor() {
        this.filter = {urls: ["<all_urls>"]};
        this.opt_extraInfoSpec = ["blocking"];
        this.storage = {};
        this.enabled = false;
        this.listening = false;
    }


    add(url, json) {
        localStorage.setItem(url.toLowerCase(), (typeof json === 'string') ? json : JSON.stringify(json));

    }

    startListen() {
        if (!this.listening) {
            chrome.webRequest.onBeforeRequest.addListener(this._onBeforeRequest.bind(this), this.filter, this.opt_extraInfoSpec);
            this.listening = true;
        }
        this.enabled = true;
    }

    stopListen() {
        this.enabled = false;
    }

    _onBeforeRequest(details) {
        if (!this.enabled) return;
        let url = details.url.toLowerCase();
        var json = localStorage.getItem(url);
        json = (typeof json === 'string') ? json : JSON.stringify(json);
        if (localStorage.hasOwnProperty(url)) {
            return { redirectUrl: `data:application/json,${json}` };
            // return {redirectUrl: `data:application/json,{"val":4}`};
        }


    }
}

var proxy = new Proxy();
// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
// 
// Can use:
// chrome.tabs.*
// chrome.extension.*
chrome.extension.onConnect.addListener(function (port) {
    var extensionListener = function (message, sender, sendResponse) {

        if (message.tabId && message.content) {

            //Evaluate script in inspectedPage
            if (message.action === 'code') {
                chrome.tabs.executeScript(message.tabId, {code: message.content});

                //Attach script to inspectedPage
            } else if (message.action === 'script') {
                chrome.tabs.executeScript(message.tabId, {file: message.content});

                //Pass message to inspectedPage
            } else {
                //chrome.tabs.sendMessage(message.tabId, message, sendResponse);
                console.log('message.content', message.content);
                // var request = message.content[0];
                // proxy.add(request.request.url, request.json);
                message.content.forEach(function (request) {
                    proxy.add(request.request.url, request.json);
                });
                proxy.startListen();
            }

            // This accepts messages from the inspectedPage and 
            // sends them to the panel
        }else if (message.tabId && message.action === 'pause') {
            proxy.stopListen();
            //Pass message to inspectedPage
        } else {
            port.postMessage(message);
        }
        //sendResponse(message);
    };

    // Listens to messages sent from the panel
    chrome.extension.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function (port) {
        chrome.extension.onMessage.removeListener(extensionListener);
    });

    // port.onMessage.addListener(function (message) {
    //     port.postMessage(message);
    // });

});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    return true;
});

