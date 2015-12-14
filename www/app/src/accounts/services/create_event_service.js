(function (window, angular, undefined) {

  "use strict";

  function createEventService($http, $q, BASE_URL, eventsModel) {

    return function (name, description) {
      var deferred = $q.defer();

      $http.post(BASE_URL + "events/", {
        name: name,
        description: description
      }).then(function (response) {
        deferred.resolve(response.data);
      }, function (response) {
        console.error("Event was not created!");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };
  }

  angular.module("app")
    .factory("createEventService", ["$http", "$q", "BASE_URL", "eventsModel", createEventService]);

})(window, window.angular);