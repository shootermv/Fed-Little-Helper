class Proxy {
    constructor(){
        this.filter = { urls: ["<all_urls>"] };
        this.opt_extraInfoSpec = ["blocking"];
        this.storage = {};
    }


    add(url , json){
        localStorage.setItem(url.toLowerCase(),JSON.stringify(json));

    }

    startListen(){
        chrome.webRequest.onBeforeRequest.addListener(this._onBeforeRequest.bind(this),this.filter, this.opt_extraInfoSpec);

    }
    stopListen(){

    }

    _onBeforeRequest(details){
        let url = details.url.toLowerCase();
        if (localStorage.hasOwnProperty(url)){
            //return { redirectUrl: `data:application/json,${localStorage.getItem(url)}` };
            return { redirectUrl: `data:application/json,{"val":4}` };
        }


    }
}

// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
// 
// Can use:
// chrome.tabs.*
// chrome.extension.*
const proxy = new Proxy();
proxy.startListen();
chrome.extension.onConnect.addListener(function(port) {

    var extensionListener = function(message, sender, sendResponse) {

        if (message.tabId && message.content) {

            //Evaluate script in inspectedPage
            if (message.action === 'code') {
                chrome.tabs.executeScript(message.tabId, { code: message.content });

                //Attach script to inspectedPage
            } else if (message.action === 'script') {
                chrome.tabs.executeScript(message.tabId, { file: message.content });

                //Pass message to inspectedPage
            } else {
                //chrome.tabs.sendMessage(message.tabId, message, sendResponse);
                console.log('message.content',message.content);
                message.content.forEach(function(request){
                    proxy.add(request.request.url, request.json);
                })
            }

            // This accepts messages from the inspectedPage and 
            // sends them to the panel
        } else {
            port.postMessage(message);
        }
        sendResponse(message);
    }

    // Listens to messages sent from the panel
    chrome.extension.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function(port) {
        chrome.extension.onMessage.removeListener(extensionListener);
    });

    // port.onMessage.addListener(function (message) {
    //     port.postMessage(message);
    // });

});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    return true;
});

