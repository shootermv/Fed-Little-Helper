/**
 * Created by Alexanderc on 7/19/2016.
 */
angular.module('devLittlehelper')
    .directive('requestBody', function () {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/requestBody.html',
            scope: {
                request: '='
            },
            link: function ($scope, elem, sttr) {
                // alert()
                $scope.editJson = function($event){
                    var target = $event.target;
                    var $parent = $(target).closest('.card-content');
                    $parent.find('pre').hide();
                    $parent.find('textarea').show();
                }
                $scope.onEdit = function ($event) {

                    $scope.request.json = JSON.stringify($scope.request.json);
                    $scope.editing = true;
                };
                $scope.onDone = function ($event) {

                    try{
                        $scope.request.json = JSON.parse($scope.request.json);
                    }catch(e){console.log("invalid json");}


                    $scope.editing = false;
                };


            }

        }
    })