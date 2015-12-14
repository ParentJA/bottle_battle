(function (window, angular, undefined) {

  "use strict";

  function EventsRouterConfig($stateProvider) {
    $stateProvider.state("my.events", {
      url: "/events",
      templateUrl: "/static/my_events/views/events/events.html",
      controller: "EventsController"
    });

    // Start event (name and description)...
    //$stateProvider.state("my.events.start", {});

    // Add users (hosts and guests)...
    //$stateProvider.state("my.events.users", {});
  }

  angular.module("app")
    .config(["$stateProvider", EventsRouterConfig]);

})(window, window.angular);