// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*

/*
document.querySelector('#executescript').addEventListener('click', function() {
    sendObjectToInspectedPage({action: "code", content: "console.log('Inline script executed')"});
}, false);

document.querySelector('#insertscript').addEventListener('click', function() {
    sendObjectToInspectedPage({action: "script", content: "inserted-script.js"});
    
}, false);

document.querySelector('#insertmessagebutton').addEventListener('click', function() {
    sendObjectToInspectedPage({action: "code", content: "document.body.innerHTML='<button>Send message to DevTools</button>'"});
    sendObjectToInspectedPage({action: "script", content: "messageback-script.js"});
}, false);
*/

function isJsonReq(request){
    let contentType = request.response.headers.find(header => header.name === "Content-Type")
    return contentType && /application\/json/.test(contentType.value);
}

angular.module('devLittlehelper',[]).controller('requestList', requestList);
function requestList($scope){
    $scope.requests = [];
    $scope.reisterRequests = function(){
        sendObjectToInspectedPage({action: "script", content: "inserted-script.js"});
         $('#modal1').openModal();
    }

    chrome.devtools.network.onRequestFinished.addListener(request => {        
        var status = document.querySelector("#status");
        console.log(JSON.stringify(request, null, 5))
        if(isJsonReq(request)){
             
            //store in localstorage
            request.getContent(function(content, encoding) {
                request.json = angular.fromJson(content);
                $scope.requests.push(request);
                $scope.$apply();
                localStorage.setItem(request.request.url, content);
            });
            
        }
    });

}

