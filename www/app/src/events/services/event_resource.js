(function (window, angular, undefined) {

  "use strict";

  function EventResource($http, $q, BASE_URL, Event) {
    this.list = function list() {
      var deferred = $q.defer();

      $http.get(BASE_URL + "events/event/").then(function (response) {
        Event.updateList(response.data);
        deferred.resolve(Event);
      }, function (response) {
        console.error("Failed to list events.");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };

    this.create = function create(event) {
      var deferred = $q.defer();

      $http.post(BASE_URL + "events/event/", event).then(function (response) {
        Event.updateDict(response.data);
        deferred.resolve(Event);
      }, function (response) {
        console.error("Failed to create event.");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };
  }

  angular.module("app")
    .service("EventResource", ["$http", "$q", "BASE_URL", "Event", EventResource]);

})(window, window.angular);