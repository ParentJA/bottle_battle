(function (window, angular, undefined) {

  "use strict";

  function EventResource($http, $q, BASE_URL, Event) {
    this.list = function list() {
      var deferred = $q.defer();

      $http.get(BASE_URL + "events/event/").then(function (response) {
        Event.updateList(response.data);
        deferred.resolve(Event);
      }, function (response) {
        console.error("Failed to load events.");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };
  }

  angular.module("app")
    .service("EventResource", ["$http", "$q", "BASE_URL", "Event", EventResource]);

})(window, window.angular);