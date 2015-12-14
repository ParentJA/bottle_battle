(function (window, angular, undefined) {

  "use strict";

  function HttpConfig($httpProvider) {
    $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
    $httpProvider.defaults.xsrfCookieName = "csrftoken";
  }

  function UiRouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("my", {
        url: "/my",
        template: "<div ui-view></div>",
        resolve: {
          events: function (eventsModel, loadEventsService) {
            if (_.isEmpty(eventsModel.getEvents())) {
              return loadEventsService();
            }

            return eventsModel;
          }
        },
        abstract: true
      });

    //Default state...
    $urlRouterProvider.otherwise("/");
  }

  function UiRunner($rootScope, $state) {
    $rootScope.$state = $state;
  }

  function MainController($scope, $state, accountsService) {
    $scope.getUser = function getUser() {
      return accountsService.getUser();
    };

    $scope.hasUser = function hasUser() {
      return accountsService.hasUser();
    };

    $scope.logOut = function logOut() {
      accountsService.logOut().then(function () {
        $state.go("home");
      });
    };
  }

  angular.module("app", ["ngCookies", "ui.bootstrap", "ui.router"])
    .constant("BASE_URL", "/api/v1/")
    .config(["$httpProvider", HttpConfig])
    .config(["$stateProvider", "$urlRouterProvider", UiRouterConfig])
    .run(["$rootScope", "$state", UiRunner])
    .controller("MainController", ["$scope", "$state", "accountsService", MainController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function AccountsRouterConfig($stateProvider) {
    $stateProvider
      .state("sign_up", {
        url: "/sign_up",
        templateUrl: "/static/accounts/views/sign_up/sign_up.html",
        controller: "SignUpController"
      })
      .state("log_in", {
        url: "/log_in",
        templateUrl: "/static/accounts/views/log_in/log_in.html",
        controller: "LogInController"
      });
  }

  angular.module("app")
    .config(["$stateProvider", AccountsRouterConfig]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function HomeRouterConfig($stateProvider) {
    $stateProvider.state("home", {
      url: "/",
      templateUrl: "/static/home/views/home/home.html",
      controller: "HomeController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", HomeRouterConfig]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function EventsRouterConfig($stateProvider) {
    $stateProvider.state("my.events", {
      url: "/events",
      templateUrl: "/static/my_events/views/events/events.html",
      controller: "EventsController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", EventsRouterConfig]);

})(window, window.angular);
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
(function (window, angular, undefined) {

  "use strict";

  function accountsService($http, AccountsModel) {
    var service = {
      getUser: getUser,
      hasUser: hasUser,
      logIn: logIn,
      logOut: logOut,
      signUp: signUp
    };

    function getUser() {
      return AccountsModel.getUser();
    }

    function hasUser() {
      return AccountsModel.hasUser();
    }

    function logIn(username, password) {
      return $http.post("/accounts/log_in/", {
        username: username,
        password: password
      }).then(function (response) {
        AccountsModel.setUser(response.data);
      });
    }

    function logOut() {
      return $http.post("/accounts/log_out/", {}).then(function (response) {
        AccountsModel.clearUser();
      }, function () {
        console.error("Log out failed!");
      });
    }

    function signUp(firstName, lastName, email, password) {
      return $http.post("/accounts/sign_up/", {
        first_name: firstName,
        last_name: lastName,
        username: email,
        email: email,
        password: password
      }).then(function () {
        return logIn(email, password);
      });
    }

    return service;
  }

  angular.module("app")
    .factory("accountsService", ["$http", "AccountsModel", accountsService]);

})(window, window.angular);
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
(function (window, angular, undefined) {

  "use strict";

  function eventsService(AccountsModel, eventsModel) {
    var service = {
      getAttendedEvents: getAttendedEvents,
      getHostedEvents: getHostedEvents
    };

    function getAttendedEvents() {
      return _.filter(eventsModel.getEvents(), function (event) {
        return _.includes(event.attendees, AccountsModel.getUser().id);
      });
    }

    function getHostedEvents() {
      return _.filter(eventsModel.getEvents(), function (event) {
        return _.includes(event.hosts, AccountsModel.getUser().id);
      });
    }

    return service;
  }

  angular.module("app")
    .service("eventsService", ["AccountsModel", "eventsModel", eventsService]);

})(window, window.angular);
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
(function (window, angular, undefined) {

  "use strict";

  function HomeController($scope, accountsService) {
    $scope.hasUser = function hasUser() {
      return accountsService.hasUser();
    };
  }

  angular.module("app")
    .controller("HomeController", ["$scope", "accountsService", HomeController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function LogInController($scope, $state, accountsService) {
    $scope.error = {};
    $scope.form = "";
    $scope.password = "";
    $scope.username = "";

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      accountsService.logIn($scope.username, $scope.password).then(function () {
        $state.go("home");
      }, function (response) {
        $scope.error = response.data;
        $scope.password = "";
      });
    };
  }

  angular.module("app")
    .controller("LogInController", ["$scope", "$state", "accountsService", LogInController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function SignUpController($scope, $state, accountsService) {
    $scope.email = "";
    $scope.error = {};
    $scope.firstName = "";
    $scope.form = "";
    $scope.lastName = "";
    $scope.password1 = "";
    $scope.password2 = "";

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      accountsService.signUp($scope.firstName, $scope.lastName, $scope.email, $scope.password1).then(function () {
        $state.go("home");
      }, function (response) {
        $scope.error = response.data;
        $scope.email = "";
        $scope.password1 = "";
        $scope.password2 = "";
      });
    };
  }

  angular.module("app")
    .controller("SignUpController", ["$scope", "$state", "accountsService", SignUpController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function EventsController($scope, $state, createEventService) {
    $scope.error = {};
    $scope.form = "";
    $scope.name = "";
    $scope.description = "";

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      createEventService($scope.name, $scope.description).then(function () {
        $state.go("home");
      }, function (response) {
        $scope.error = response.data;
        $scope.name = "";
        $scope.description = "";
      });
    };
  }

  angular.module("app")
    .controller("EventsController", ["$scope", "$state", "createEventService", EventsController]);

})(window, window.angular);