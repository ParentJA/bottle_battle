(function (window, angular, undefined) {

  "use strict";

  function EventsController($scope, events, eventsService) {
    $scope.attendedEvents = [];
    $scope.hostedEvents = [];

    activate();

    function activate() {
      $scope.attendedEvents = eventsService.getAttendedEvents();
      $scope.hostedEvents = eventsService.getHostedEvents();
    }
  }

  angular.module("app")
    .controller("EventsController", ["$scope", "events", "eventsService", EventsController]);

})(window, window.angular);