(function (window, angular, undefined) {

  "use strict";

  function EventsController($scope, events, eventService) {
    $scope.models = {
      hosting: eventService.getEventsHosting(),
      attending: eventService.getEventsAttending()
    };
  }

  angular.module("app")
    .controller("EventsController", [
      "$scope", "events", "eventService", EventsController
    ]);

})(window, window.angular);