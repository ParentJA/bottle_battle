(function (window, angular, undefined) {

  "use strict";

  function HomeController($scope, accountsService) {
    $scope.hasUser = function hasUser() {
      return accountsService.hasUser();
    };
  }

  angular.module("app")
    .controller("HomeController", ["$scope", "accountsService", HomeController]);

})(window, window.angular);