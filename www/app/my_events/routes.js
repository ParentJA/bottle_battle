(function (window, angular, undefined) {

  "use strict";

  function EventsRouterConfig($stateProvider) {
    $stateProvider.state("my.events", {
      url: "/events",
      templateUrl: "/static/my_events/views/events/events.html",
      controller: "EventsController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", EventsRouterConfig]);

})(window, window.angular);