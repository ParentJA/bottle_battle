(function (window, angular, undefined) {

  "use strict";

  function EventStep1Controller($scope, $state, EventResource) {
    $scope.error = {};
    $scope.form = "";
    $scope.models = {
      name: null,
      description: null
    };

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      EventResource.create($scope.models).then(function () {
        $state.go("app.events.step2");
      }, function (response) {
        $scope.error = response;
      });
    };
  }

  angular.module("app")
    .controller("EventStep1Controller", ["$scope", "$state", "EventResource", EventStep1Controller]);

})(window, window.angular);