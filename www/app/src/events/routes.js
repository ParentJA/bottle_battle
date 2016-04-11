(function (window, angular, undefined) {

  "use strict";

  function EventsRouterConfig($stateProvider) {
    $stateProvider.state("app.events", {
      url: "/events",
      templateUrl: "events/views/events/events.html",
      data: {
        loginRequired: true
      },
      resolve: {
        events: function (EventResource) {
          return EventResource.list();
        }
      },
      controller: "EventsController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", EventsRouterConfig]);

})(window, window.angular);