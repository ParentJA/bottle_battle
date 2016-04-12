(function (window, angular, undefined) {

  "use strict";

  function EventDashboardController($scope, events, eventService) {
    $scope.models = {
      hosting: eventService.getEventsHosting(),
      attending: eventService.getEventsAttending()
    };
  }

  angular.module("app")
    .controller("EventDashboardController", [
      "$scope", "events", "eventService", EventDashboardController
    ]);

})(window, window.angular);