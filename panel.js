// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*
function isJsonReq(request){
    let contentType = request.response.headers.find(header => header.name === "Content-Type")
    return contentType && /application\/json/.test(contentType.value);
}

angular.module('devLittlehelper',[]).controller('requestList', requestList);
function requestList($scope){
    $scope.requests = [];
    $scope.reisterRequests = function(){
        //sendObjectToInspectedPage({action: "script", content: "inserted-script.js"});
         $scope.routerCode = 
         `
            'use strict';
             let router = require('koa-router')();
         
         `;

         $scope.requests.forEach(request => {
            $scope.routerCode +=
            ` 
                router.get('${request.request.url.replace('http://localhost:9000','')}', function*() {                
                    this.body =  ${JSON.stringify(request.json, null, '\t').replace(']','\t\t\t]')};                   
                });
            `;
         })
         $scope.routerCode += 
         `
             module.exports = router;
         `;
         $('#modal1').openModal();
    }

    $scope.removeRequest = function(req, $event) {
          $event.preventDefault();
          $scope.requests.splice($scope.requests.indexOf(req), 1);
    }

    
    chrome.devtools && chrome.devtools.network.onRequestFinished.addListener(request => {        
        var status = document.querySelector("#status");
        console.log(JSON.stringify(request, null, 5))
        if(isJsonReq(request)){
            request.getContent(function(content, encoding) {
                request.json = angular.fromJson(content);
                $scope.requests.push(request);
                $scope.$apply();
            });
            
        }
    });

}

