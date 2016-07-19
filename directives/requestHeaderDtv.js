angular.module('devLittlehelper')
    .directive('requestHeader', function () {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/requestHeaderTpl.html',
            scope: {
                request: '=',
                removeRequest: '&'
            },
            link: function (scope, elem, sttr) {

                elem.find('select').material_select();
                // alert()
                scope.onHeaderClick = function ($event) {
                    if(scope.editing) $event.stopPropagation();
                };
                scope.onDelete = function ($event) {
                    $event.stopPropagation();
                    scope.removeRequest({$event: $event, request: scope.request});
                };
                scope.onEdit = function ($event) {
                    $event.stopPropagation();
                    scope.editing = true;
                };
                scope.onDone = function ($event) {
                    $event.stopPropagation();
                    scope.editing = false;
                };
            }

        }
    })