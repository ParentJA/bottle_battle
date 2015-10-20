(function (window, angular, undefined) {

  "use strict";

  function AccountsModel($cookies) {
    var service = {
      clearUser: clearUser,
      getUser: getUser,
      hasUser: hasUser,
      setUser: setUser
    };

    function clearUser() {
      $cookies.remove("authenticatedUser");
    }

    function getUser() {
      if (!$cookies.get("authenticatedUser")) {
        return undefined;
      }

      return JSON.parse($cookies.get("authenticatedUser"));
    }

    function hasUser() {
      return !!$cookies.get("authenticatedUser");
    }

    function setUser(data) {
      $cookies.put("authenticatedUser", JSON.stringify(data.user));
    }

    return service;
  }

  angular.module("app")
    .factory("AccountsModel", ["$cookies", AccountsModel]);

})(window, window.angular);