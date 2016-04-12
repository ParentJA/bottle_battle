(function (window, angular, undefined) {

  "use strict";

  function EventGuestResource($http, $q, BASE_URL, Event) {
    this.create = function create(guest) {
      var deferred = $q.defer();

      $http.post(BASE_URL + "events/guest/", guest).then(function (response) {
        Event.updateDict(response.data);
        deferred.resolve(Event);
      }, function (response) {
        console.error("Failed to create event guest.");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };
  }

  angular.module("app")
    .service("EventGuestResource", ["$http", "$q", "BASE_URL", "Event", EventGuestResource]);

})(window, window.angular);