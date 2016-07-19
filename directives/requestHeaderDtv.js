angular.module('devLittlehelper')
.directive('requestHeader', function(){

    return {
      restrict:'E',
      replace:true,
      templateUrl:'/directives/requestHeaderTpl.html',
      scope:{
         request:'=' ,
         removeRequest:'&'
      },
      link: function(scope, elem ,sttr){
      // alert()
        scope.onClick=function($event){
           $event.stopPropagation();    
          scope.removeRequest({$event:$event, request:scope.request});
        }
      }

    }
})