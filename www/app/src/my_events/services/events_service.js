(function (window, angular, undefined) {

  "use strict";

  function eventsService(AccountsModel, eventsModel) {
    var service = {
      getAttendedEvents: getAttendedEvents,
      getHostedEvents: getHostedEvents
    };

    function getAttendedEvents() {
      return _.filter(eventsModel.getEvents(), function (event) {
        return _.includes(event.attendees, AccountsModel.getUser().id);
      });
    }

    function getHostedEvents() {
      return _.filter(eventsModel.getEvents(), function (event) {
        return _.includes(event.hosts, AccountsModel.getUser().id);
      });
    }

    return service;
  }

  angular.module("app")
    .service("eventsService", ["AccountsModel", "eventsModel", eventsService]);

})(window, window.angular);