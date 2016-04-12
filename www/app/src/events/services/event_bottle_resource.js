(function (window, angular, undefined) {

  "use strict";

  function EventBottleResource($http, $q, BASE_URL, Event) {
    this.create = function create(bottle) {
      var deferred = $q.defer();

      $http.post(BASE_URL + "events/bottle/", bottle).then(function (response) {
        Event.updateDict(response.data);
        deferred.resolve(Event);
      }, function (response) {
        console.error("Failed to create event bottle.");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };
  }

  angular.module("app")
    .service("EventBottleResource", ["$http", "$q", "BASE_URL", "Event", EventBottleResource]);

})(window, window.angular);