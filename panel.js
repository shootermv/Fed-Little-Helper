// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*

//Helpers
function isJsonReq(request) {
    let contentType = request.response.headers.find(header => header.name === "Content-Type")
    return contentType && /application\/json/.test(contentType.value);
}
function addTabsAtTheEnd(stringified) {
    let last = stringified[stringified.length - 1];
    stringified = stringified.slice(0, -1) + '\t\t' + last;
    return stringified;
}

function removeReferer(request) {
    let host = request.request.headers.find(header => header.name === "Referer");
    request.request._url = request.request.url.replace(host.value, '/');
}

angular.module('devLittlehelper', []).controller('requestList', requestList);
function requestList($scope) {
    $scope.requests = [];


    $scope.init = function() {
        addRequestHandler();
    }


    $scope.reisterRequests = function () {
        //sendObjectToInspectedPage({action: "script", content: "inserted-script.js"});
        $scope.routerCode =
            `
            'use strict';
             let router = require('koa-router')();
         
         `;

        $scope.requests.forEach(request => {
            removeReferer(request)
            let stringified = addTabsAtTheEnd(JSON.stringify(request.json, null, '\t\t\t'));
            $scope.routerCode +=
                ` 
                router.get('${request.request._url}', function*() {                
                    this.body =  ${stringified};                   
                });
            `;
        });
        $scope.routerCode +=
            `
             module.exports = router;
         `;
        $('#modal1').openModal();
    };

    $scope.stop = function(){
        addRequestHandler();
        $scope.isPlaying = false;
        sendObjectToInspectedPage({action: 'pause'});        
    }

    $scope.play = function () {     
        $scope.isPlaying = true;
        removeRequestHandler(); 
        sendObjectToInspectedPage({content: $scope.requests});
    }

    $scope.removeRequest = function (req, $event) {
        $event.preventDefault();
        $scope.requests.splice($scope.requests.indexOf(req), 1);
    };

    $scope.addNewRequest = function () {
        let requestt = {
            request: {
                method: 'GET',
                url: '/new-request'
            },
            json: []
        };
        $scope.requests.push(requestt);
    };


    if (!chrome.devtools) {//for run app inside browser (not as extension)
        let requestt = {
            request: {
                method: 'GET',
                url: 'posts/Angular2'
            },
            json: {"name": "vasya", "family": "petrov"}
        };
        $scope.requests.push(requestt);
    }



    //inner methods:
    function requestHandler(request) {
            var status = document.querySelector("#status");
            //sendObjectToInspectedPage({action: "code", content: "console.log("+JSON.stringify(request, null, 5)+")"});
            if (isJsonReq(request)) {
                request.getContent(function (content, encoding) {
                   // removeReferer(request);
                    request.json = angular.fromJson(content);
                    $scope.requests.push(request);
                    $scope.$apply();
                });

            }
    }
    function addRequestHandler() {
            chrome.devtools && chrome.devtools.network.onRequestFinished.addListener(requestHandler);
    } 
    function removeRequestHandler() {
            chrome.devtools && chrome.devtools.network.onRequestFinished.removeListener(requestHandler); 
    }


}

