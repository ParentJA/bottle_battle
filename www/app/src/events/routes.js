(function (window, angular, undefined) {

  "use strict";

  function EventsRouterConfig($stateProvider) {
    $stateProvider
      .state("app.events", {
        url: "/events",
        template: "<div ui-view></div>",
        data: {
          loginRequired: true
        },
        abstract: true
      })

      // Shows the user's relevant events (events he is hosting or attending).
      .state("app.events.dashboard", {
        url: "/dashboard",
        templateUrl: "events/views/dashboard/dashboard.html",
        data: {
          loginRequired: true
        },
        resolve: {
          events: function (EventResource) {
            return EventResource.list();
          }
        },
        controller: "EventDashboardController"
      })

      // Shows the event creation step 1 (event registration).
      .state("app.events.step1", {
        url: "/step1",
        templateUrl: "events/views/step1/step1.html",
        data: {
          loginRequired: true
        },
        controller: "EventStep1Controller"
      })

      // Shows the event creation step 2 (bottle registration).
      .state("app.events.step2", {
        url: "/step2",
        templateUrl: "events/views/step2/step2.html",
        data: {
          loginRequired: true
        },
        controller: "EventStep2Controller"
      })

      // Shows the event creation step 3 (guest registration).
      .state("app.events.step3", {
        url: "/step3",
        templateUrl: "events/views/step3/step3.html",
        data: {
          loginRequired: true
        },
        controller: "EventStep3Controller"
      });
  }

  angular.module("app")
    .config(["$stateProvider", EventsRouterConfig]);

})(window, window.angular);