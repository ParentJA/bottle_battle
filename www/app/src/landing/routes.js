(function (window, angular, undefined) {

  "use strict";

  function LandingRouterConfig($stateProvider) {
    $stateProvider.state("landing", {
      url: "/",
      templateUrl: "landing/views/landing/landing.html",
      data: {
        loginRequired: false
      },
      controller: "LandingController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", LandingRouterConfig]);

})(window, window.angular);