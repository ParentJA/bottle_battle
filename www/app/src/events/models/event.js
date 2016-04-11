(function (window, angular, undefined) {

  function Event() {
    var events = {};
    var guests = {};
    var hosts = {};

    function build() {
      _.forEach(events, function (event) {
        // Build hosts...
        event._hosts = {};
        _.forEach(event.hosts, function (hostUsername) {
          event._hosts[hostUsername] = hosts[hostUsername];
        });

        // Build guests...
        event._guests = {};
        _.forEach(event.guests, function (guestUsername) {
          event._guests[guestUsername] = guests[guestUsername];
        });
      });
    }

    this.getEvents = function getEvents() {
      return events;
    };

    this.getEventById = function getEventById(id) {
      return events[id];
    };

    this.updateDict = function updateDict(data) {
      if (!_.isUndefined(data.event)) {
        events[data.event.id] = data.event;
      }

      if (!_.isUndefined(data.guest)) {
        guests[data.guest.username] = data.guest;
      }

      if (!_.isUndefined(data.host)) {
        hosts[data.host.username] = data.host;
      }

      build();
    };

    this.updateList = function updateList(data) {
      if (!_.isUndefined(data.event)) {
        events = _.merge(events, _.keyBy(data.event, "id"));
      }

      if (!_.isUndefined(data.guest)) {
        guests = _.merge(guests, _.keyBy(data.guest, "username"));
      }

      if (!_.isUndefined(data.host)) {
        hosts = _.merge(hosts, _.keyBy(data.host, "username"));
      }

      build();
    };
  }

  angular.module("app")
    .service("Event", [Event]);

})(window, window.angular);