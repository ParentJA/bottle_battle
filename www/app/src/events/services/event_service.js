(function (window, angular, undefined) {

  "use strict";

  function eventService(AccountModel, Event) {
    this.getEventsAttending = function getEventsAttending() {
      return _.filter(Event.getEvents(), function (event) {
        return _.includes(event.guests, AccountModel.getUser().username);
      });
    };

    this.getEventsHosting = function getEventsHosting() {
      return _.filter(Event.getEvents(), function (event) {
        return _.includes(event.hosts, AccountModel.getUser().username);
      });
    };
  }

  angular.module("app")
    .service("eventService", ["AccountModel", "Event", eventService]);

})(window, window.angular);