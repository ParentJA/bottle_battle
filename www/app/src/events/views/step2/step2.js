(function (window, angular, undefined) {

  "use strict";

  function EventStep2Controller($scope, $state, EventBottleResource) {
    $scope.error = {};
    $scope.form = "";
    $scope.models = {
      bottle1: null,
      bottle2: null,
      bottle3: null,
      bottle4: null
    };

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      EventBottleResource.create($scope.models).then(function () {
        $state.go("app.events.step3");
      }, function (response) {
        $scope.error = response;
      });
    };
  }

  angular.module("app")
    .controller("EventStep2Controller", ["$scope", "$state", "EventBottleResource", EventStep2Controller]);

})(window, window.angular);