(function (window, angular, undefined) {

  "use strict";

  function EventStep3Controller($scope, $state, EventGuestResource) {
    $scope.error = {};
    $scope.form = "";
    $scope.models = {
      guests: null
    };

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      EventGuestResource.create($scope.models).then(function () {
        $state.go("app.events.dashboard");
      }, function (response) {
        $scope.error = response;
      });
    };
  }

  angular.module("app")
    .controller("EventStep3Controller", ["$scope", "$state", "EventGuestResource", EventStep3Controller]);

})(window, window.angular);