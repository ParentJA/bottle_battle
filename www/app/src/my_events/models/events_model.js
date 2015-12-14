(function (window, angular, undefined) {

  function eventsModel() {
    var events = [];
    var guests = [];
    var hosts = [];

    this.getEvents = function getEvents() {
      return events;
    };

    this.getGuests = function getGuests() {
      return guests;
    };

    this.getHosts = function getHosts() {
      return hosts;
    };

    this.update = function update(data) {
      var users = data.users;

      // Update events...
      _.forEach(data.events, function (event) {
        event._guests = [];
        event._hosts = [];

        var userMap = _.indexBy(users, "id");

        _.forEach(event.hosts, function (hostId) {
          event._hosts.push(userMap[hostId]);
        });

        _.forEach(event.guests, function (attendeeId) {
          event._guests.push(userMap[attendeeId]);
        });
      });

      events = data.events;
    };

    this.updateOne = function updateOne(data) {};
  }

  angular.module("app")
    .service("eventsModel", [eventsModel]);

})(window, window.angular);