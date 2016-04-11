(function (window, angular, undefined) {

  "use strict";

  function LogInController($scope, $state, logInService) {
    $scope.error = {};
    $scope.form = "";
    $scope.password = null;
    $scope.username = null;

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      logInService($scope.username, $scope.password).then(function () {
        $state.go("app.events");
      }, function (response) {
        $scope.error = response;
        $scope.password = null;
      });
    };
  }

  angular.module("app")
    .controller("LogInController", ["$scope", "$state", "logInService", LogInController]);

})(window, window.angular);