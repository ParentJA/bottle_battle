(function (window, angular, undefined) {

  "use strict";

  function EventsController($scope, $state, createEventService) {
    $scope.error = {};
    $scope.form = "";
    $scope.name = "";
    $scope.description = "";

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      createEventService($scope.name, $scope.description).then(function () {
        $state.go("home");
      }, function (response) {
        $scope.error = response.data;
        $scope.name = "";
        $scope.description = "";
      });
    };
  }

  angular.module("app")
    .controller("EventsController", ["$scope", "$state", "createEventService", EventsController]);

})(window, window.angular);