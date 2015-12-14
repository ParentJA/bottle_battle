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
      $cookies.remove("bottle_battle:authenticatedUser");
    }

    function getUser() {
      if (!$cookies.get("bottle_battle:authenticatedUser")) {
        return undefined;
      }

      return JSON.parse($cookies.get("bottle_battle:authenticatedUser"));
    }

    function hasUser() {
      return !!$cookies.get("bottle_battle:authenticatedUser");
    }

    function setUser(data) {
      $cookies.put("bottle_battle:authenticatedUser", JSON.stringify(data.user));
    }

    return service;
  }

  angular.module("app")
    .factory("AccountsModel", ["$cookies", AccountsModel]);

})(window, window.angular);