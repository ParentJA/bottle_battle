(function (window, angular, undefined) {

  "use strict";

  function loadEventsService($http, $q, BASE_URL, eventsModel) {

    return function() {
      var deferred = $q.defer();

      $http.get(BASE_URL + "events/").then(function (response) {
        eventsModel.update(response.data);
        deferred.resolve(eventsModel);
      }, function (response) {
        console.error("Events failed to load!");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };
  }

  angular.module("app")
    .factory("loadEventsService", ["$http", "$q", "BASE_URL", "eventsModel", loadEventsService]);

})(window, window.angular);