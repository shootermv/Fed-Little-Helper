// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
// 
// Can use:
// chrome.tabs.*
// chrome.extension.*

var callback = function(details) {
    if (details.url.indexOf("matan") > -1) {
        return {
            redirectUrl: "https://fed-helper.herokuapp.com?url=" + details.url.split('?')[0] /*Redirection URL*/
        };
    }
};

// var callback = function(details) {
//     alert("hello");
// };
var filter = { urls: ["http://*/*", "https://*/*"] };
var opt_extraInfoSpec = ["blocking"];

chrome.webRequest.onBeforeRequest.addListener(
    callback, filter, opt_extraInfoSpec
);
