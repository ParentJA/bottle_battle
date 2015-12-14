(function (window, angular, undefined) {

  "use strict";

  function eventsModel() {
    var events = [];
    var hosts = [];
    var attendees = [];
    var bottles = [];

    var service = {
      getAttendees: function getAttendees() {
        return attendees;
      },
      getBottles: function getBottles() {
        return bottles;
      },
      getEvents: function getEvents() {
        return events;
      },
      getHosts: function getHosts() {
        return hosts;
      },
      update: function update(data) {
        var users = data.users;

        bottles = data.bottles;

        // Update events...
        _.forEach(data.events, function (event) {
          event._hosts = [];
          event._attendees = [];
          event._bottles = [];

          var userMap = _.indexBy(users, "id");

          _.forEach(event.hosts, function (hostId) {
            event._hosts.push(userMap[hostId]);
          });

          _.forEach(event.attendees, function (attendeeId) {
            event._attendees.push(userMap[attendeeId]);
          });

          var bottleMap = _.indexBy(bottles, "id");

          _.forEach(event.bottles, function (bottleId) {
            event._bottles.push(bottleMap[bottleId]);
          });
        });

        events = data.events;
      }
    };

    return service;
  }

  angular.module("app")
    .factory("eventsModel", [eventsModel]);

})(window, window.angular);