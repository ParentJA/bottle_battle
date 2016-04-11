(function (window, angular, undefined) {

  "use strict";

  function HttpConfig($httpProvider) {
    $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
    $httpProvider.defaults.xsrfCookieName = "csrftoken";
  }

  function CoreRouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("app", {
        url: "/app",
        template: "<div ui-view></div>",
        data: {
          loginRequired: true
        },
        abstract: true
      });

    //Default state...
    $urlRouterProvider.otherwise("/");
  }

  function CoreRunner($rootScope, $state, AccountModel, navigationService) {
    $rootScope.$state = $state;
    $rootScope.$on("$stateChangeStart", function (event, toState) {
      // Close navigation.
      navigationService.closeNavigation();

      // Check authentication.
      if (toState.data.loginRequired && !AccountModel.hasUser()) {
        event.preventDefault();
        $state.go("log_in");
      }
    });
  }

  function MainController($scope, $state, AccountModel, logOutService, navigationService) {
    $scope.navigationService = navigationService;

    $scope.hasUser = function hasUser() {
      return AccountModel.hasUser();
    };

    $scope.logOut = function logOut() {
      logOutService().finally(function () {
        $state.go("log_in");
      });
    };
  }

  angular.module("templates", []);

  angular.module("app", ["templates", "example-accounts", "ui.bootstrap", "ui.router"])
    .constant("BASE_URL", "/api/v1/")
    .config(["$httpProvider", HttpConfig])
    .config(["$stateProvider", "$urlRouterProvider", CoreRouterConfig])
    .run(["$rootScope", "$state", "AccountModel", "navigationService", CoreRunner])
    .controller("MainController", [
      "$scope", "$state", "AccountModel", "logOutService", "navigationService", MainController
    ]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function EventsRouterConfig($stateProvider) {
    $stateProvider.state("app.events", {
      url: "/events",
      templateUrl: "events/views/events/events.html",
      data: {
        loginRequired: true
      },
      resolve: {
        events: function (EventResource) {
          return EventResource.list();
        }
      },
      controller: "EventsController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", EventsRouterConfig]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function LandingRouterConfig($stateProvider) {
    $stateProvider.state("landing", {
      url: "/",
      templateUrl: "landing/views/landing/landing.html",
      data: {
        loginRequired: false
      },
      controller: "LandingController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", LandingRouterConfig]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function AuthorizationRouterConfig($stateProvider) {
    // Account-based config.
    $stateProvider
      .state("log_in", {
        url: "/log_in",
        templateUrl: "users/views/log_in/log_in.html",
        data: {
          loginRequired: false
        },
        controller: "LogInController"
      })
      .state("sign_up", {
        url: "/sign_up",
        templateUrl: "users/views/sign_up/sign_up.html",
        data: {
          loginRequired: false
        },
        controller: "SignUpController"
      });

    // Users-based config.
    $stateProvider
      .state("app.profile", {
        url: "/profile",
        template: "<div ui-view></div>",
        data: {
          loginRequired: true
        },
        abstract: true
      })
      .state("app.profile.detail", {
        url: "/detail",
        templateUrl: "users/views/profile_detail/profile_detail.html",
        data: {
          loginRequired: true
        },
        resolve: {
          userProfile: function (UserProfileModel, loadUserProfile) {
            if (!UserProfileModel.hasUserProfile()) {
              return loadUserProfile();
            }

            return UserProfileModel;
          }
        },
        controller: "ProfileDetailController"
      })
      .state("app.profile.edit", {
        url: "/edit",
        templateUrl: "users/views/profile_edit/profile_edit.html",
        data: {
          loginRequired: true
        },
        resolve: {
          userProfile: function (UserProfileModel, loadUserProfile) {
            if (!UserProfileModel.hasUserProfile()) {
              return loadUserProfile();
            }

            return UserProfileModel;
          }
        },
        controller: "ProfileEditController"
      });
  }

  angular.module("app")
    .config(["$stateProvider", AuthorizationRouterConfig]);

})(window, window.angular);
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
(function (window, angular, undefined) {

  "use strict";

  function eventService(AccountModel, Event) {
    this.getEventsAttending = function getEventsAttending() {
      return _.filter(Event.getEvents(), function (event) {
        return _.includes(event.guests, AccountModel.getUser().username);
      });
    };

    this.getEventsHosting = function getEventsHosting() {
      return _.filter(Event.getEvents(), function (event) {
        return _.includes(event.hosts, AccountModel.getUser().username);
      });
    };
  }

  angular.module("app")
    .service("eventService", ["AccountModel", "Event", eventService]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function navigationService() {
    var navigationOpen = false;

    var service = {
      closeNavigation: function closeNavigation() {
        navigationOpen = false;
      },
      isNavigationOpen: function isNavigationOpen() {
        return navigationOpen;
      },
      openNavigation: function openNavigation() {
        navigationOpen = true;
      },
      toggleNavigation: function toggleNavigation() {
        navigationOpen = !navigationOpen;
      }
    };

    return service;
  }

  angular.module("app")
    .service("navigationService", [navigationService]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function UserProfileModel() {
    var userProfile = {};

    this.getFirstName = function getFirstName() {
      return userProfile.first_name;
    };

    this.getLastName = function getLastName() {
      return userProfile.last_name;
    };

    this.getFullName = function getFullName() {
      return userProfile.first_name + " " + userProfile.last_name;
    };

    this.getEmail = function getEmail() {
      return userProfile.email;
    };

    this.getPhoto = function getPhoto() {
      return userProfile.photo;
    };

    this.getAddress1 = function getAddress1() {
      return userProfile.address_1;
    };

    this.getAddress2 = function getAddress2() {
      return userProfile.address_2;
    };

    this.getCity = function getCity() {
      return userProfile.city;
    };

    this.getState = function getState() {
      return userProfile.state;
    };

    this.getZipCode = function getZipCode() {
      return userProfile.zip_code;
    };

    this.getFullAddress = function getFullAddress() {
      var address = userProfile.address_1;

      if (userProfile.address_2) {
        address = address + ", " + userProfile.address_2;
      }

      return address + ", " + userProfile.city + ", " + userProfile.state + " " + userProfile.zip_code;
    };

    this.getPhoneNumber = function getPhoneNumber() {
      return userProfile.phone_number;
    };

    this.hasUserProfile = function hasUserProfile() {
      return !_.isEmpty(userProfile);
    };

    this.update = function update(data) {
      userProfile = data;
    };
  }

  angular.module("app")
    .service("UserProfileModel", [UserProfileModel]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function loadUserProfile($http, $q, BASE_URL, UserProfileModel) {

    return function () {
      var deferred = $q.defer();

      $http.get(BASE_URL + "users/user_profile/").then(function (response) {
        UserProfileModel.update(response.data);
        deferred.resolve(UserProfileModel);
      }, function (response) {
        console.error("Failed to load user profile.");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };

  }

  angular.module("app")
    .service("loadUserProfile", ["$http", "$q", "BASE_URL", "UserProfileModel", loadUserProfile]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function saveUserProfile($http, $q, BASE_URL, UserProfileModel) {

    return function (payload) {
      var deferred = $q.defer();

      $http.post(BASE_URL + "users/user_profile/", payload).then(function (response) {
        UserProfileModel.update(response.data);
        deferred.resolve(UserProfileModel);
      }, function (response) {
        console.error("Failed to save user profile.");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };

  }

  angular.module("app")
    .service("saveUserProfile", ["$http", "$q", "BASE_URL", "UserProfileModel", saveUserProfile]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function EventsController($scope, events, eventService) {
    $scope.models = {
      hosting: eventService.getEventsHosting(),
      attending: eventService.getEventsAttending()
    };
  }

  angular.module("app")
    .controller("EventsController", [
      "$scope", "events", "eventService", EventsController
    ]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function LandingController($scope) {}

  angular.module("app")
    .controller("LandingController", ["$scope", LandingController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function LogInController($scope, $state, logInService) {
    $scope.error = {};
    $scope.form = "";
    $scope.password = null;
    $scope.username = null;

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      logInService($scope.username, $scope.password).then(function () {
        $state.go("app.events");
      }, function (response) {
        $scope.error = response;
        $scope.password = null;
      });
    };
  }

  angular.module("app")
    .controller("LogInController", ["$scope", "$state", "logInService", LogInController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function ProfileEditController($scope, $state, saveUserProfile, userProfile) {
    $scope.error = {};
    $scope.form = "";
    $scope.models = {
      first_name: userProfile.getFirstName(),
      last_name: userProfile.getLastName(),
      address_1: userProfile.getAddress1(),
      address_2: userProfile.getAddress2(),
      city: userProfile.getCity(),
      state: userProfile.getState(),
      zip_code: userProfile.getZipCode(),
      phone_number: userProfile.getPhoneNumber()
    };

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      saveUserProfile($scope.models).then(function () {
        $state.go("app.profile.detail");
      }, function (response) {
        $scope.error = response;
      });
    };
  }

  angular.module("app")
    .controller("ProfileEditController", [
      "$scope", "$state", "saveUserProfile", "userProfile", ProfileEditController
    ]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function ProfileDetailController($scope, userProfile) {
    $scope.selectedDetail = "name";
    $scope.models = {
      full_name: userProfile.getFullName(),
      photo: userProfile.getPhoto(),
      full_address: userProfile.getFullAddress(),
      phone_number: userProfile.getPhoneNumber(),
      email: userProfile.getEmail()
    };

    $scope.setSelectedDetail = function setSelectedDetail(detail) {
      $scope.selectedDetail = detail;
    };
  }

  angular.module("app")
    .controller("ProfileDetailController", ["$scope", "userProfile", ProfileDetailController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function SignUpController($scope, $state, signUpService) {
    $scope.email = null;
    $scope.error = {};
    $scope.form = "";
    $scope.password = null;
    $scope.passwordAgain = null;
    $scope.username = null;

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      signUpService($scope.username, $scope.email, $scope.password).then(function () {
        $state.go("app.events");
      }, function (response) {
        $scope.error = response;
        $scope.password = null;
        $scope.passwordAgain = null;
      });
    };

    $scope.passwordsMatch = function passwordsMatch() {
      return (!_.isEmpty($scope.password) && $scope.password === $scope.passwordAgain);
    };
  }

  angular.module("app")
    .controller("SignUpController", ["$scope", "$state", "signUpService", SignUpController]);

})(window, window.angular);
angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("events/views/events/events.html","<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <h4 class=\"panel-title\">\n          Hosting <span class=\"badge pull-right\">{{ models.hosting.length }}</span>\n        </h4>\n      </div>\n      <div class=\"panel-body text-center\" ng-if=\"models.hosting.length === 0\">\n        You are not hosting any events...\n      </div>\n      <table class=\"table table-responsive\" ng-if=\"models.hosting.length > 0\">\n        <thead>\n        <tr>\n          <th>Name</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr ng-repeat=\"event in models.hosting\">\n          <td>{{ event.name }}</td>\n        </tr>\n        </tbody>\n      </table>\n    </div>\n\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <h4 class=\"panel-title\">\n          Attending <span class=\"badge pull-right\">{{ models.attending.length }}</span>\n        </h4>\n      </div>\n      <div class=\"panel-body text-center\" ng-if=\"models.attending.length === 0\">\n        You are not attending any events...\n      </div>\n      <table class=\"table table-responsive\" ng-if=\"models.attending.length > 0\">\n        <thead>\n        <tr>\n          <th>Name</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr ng-repeat=\"event in models.attending\">\n          <td>{{ event.name }}</td>\n        </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>");
$templateCache.put("landing/views/landing/landing.html","<div class=\"middle-center\">\n  <h1>Welcome to Bottle Battle</h1>\n  <div ng-show=\"hasUser()\">\n    <a class=\"btn btn-large btn-primary\" ui-sref=\"app.events\">Continue to events</a>\n  </div>\n  <div ng-hide=\"hasUser()\">\n    <a class=\"btn btn-large btn-primary\" ui-sref=\"log_in\">Log in</a>\n    <a class=\"btn btn-large btn-primary\" ui-sref=\"sign_up\">Sign up</a>\n  </div>\n</div>");
$templateCache.put("users/views/log_in/log_in.html","<div class=\"row\">\n  <div class=\"col-lg-offset-4 col-lg-4\">\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <h4 class=\"panel-title\">Log in</h4>\n      </div>\n      <div class=\"panel-body\">\n        <form name=\"form\" novalidate ng-submit=\"onSubmit()\">\n          <div class=\"alert alert-danger\" ng-if=\"hasError()\">{{ error.detail }}</div>\n          <div class=\"form-group\">\n            <label for=\"username\">Username:</label>\n            <input id=\"username\" class=\"form-control\" type=\"text\" ng-model=\"username\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"password\">Password:</label>\n            <input id=\"password\" class=\"form-control\" type=\"password\" ng-model=\"password\" required>\n          </div>\n          <button class=\"btn btn-primary btn-block\" type=\"submit\" ng-disabled=\"form.$invalid\">Log in\n          </button>\n        </form>\n      </div>\n    </div>\n    <p class=\"text-center\">Don\'t have an account? <a href ui-sref=\"sign_up\">Sign up!</a></p>\n  </div>\n</div>");
$templateCache.put("users/views/profile_edit/profile_edit.html","<div class=\"row\">\n  <div class=\"col-lg-offset-4 col-lg-4\">\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <h4 class=\"panel-title\">Profile</h4>\n      </div>\n      <div class=\"panel-body\">\n        <form name=\"form\" novalidate ng-submit=\"onSubmit()\">\n          <div class=\"form-group\">\n            <label for=\"first-name\">First name:</label>\n            <input id=\"first-name\" class=\"form-control\" type=\"text\" ng-value=\"models.first_name\" ng-model=\"models.first_name\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"last-name\">Last name:</label>\n            <input id=\"last-name\" class=\"form-control\" type=\"text\" ng-value=\"models.last_name\" ng-model=\"models.last_name\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"address\">Address:</label>\n            <input id=\"address\" class=\"form-control\" type=\"text\" ng-value=\"models.address_1\" ng-model=\"models.address_1\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"address-2\">Address (line 2):</label>\n            <input id=\"address-2\" class=\"form-control\" type=\"text\" ng-value=\"models.address_2\" ng-model=\"models.address_2\">\n          </div>\n          <div class=\"form-group\">\n            <label for=\"city\">City:</label>\n            <input id=\"city\" class=\"form-control\" type=\"text\" ng-value=\"models.city\" ng-model=\"models.city\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"state\">State:</label>\n            <input id=\"state\" class=\"form-control\" type=\"text\" ng-value=\"models.state\" ng-model=\"models.state\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"zip-code\">Zip code:</label>\n            <input id=\"zip-code\" class=\"form-control\" type=\"text\" ng-value=\"models.zip_code\" ng-model=\"models.zip_code\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"phone-number\">Phone number:</label>\n            <input id=\"phone-number\" class=\"form-control\" type=\"text\" ng-value=\"models.phone_number\" ng-model=\"models.phone_number\" required>\n          </div>\n          <button class=\"btn btn-primary btn-block\" type=\"submit\" ng-disabled=\"form.$invalid\">Update</button>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("users/views/profile_detail/profile_detail.html","<div class=\"row\">\n  <div class=\"col-lg-offset-4 col-lg-4\">\n    <div class=\"text-center\">\n      <a href ui-sref=\"app.profile.edit\">\n        <img class=\"img-circle center-block\" ng-src=\"{{ models.photo }}\" width=\"160\">\n      </a>\n      <div class=\"details-display\">\n        <div ng-if=\"selectedDetail === \'name\'\">\n          <p>Hi, my name is</p>\n          <h4>{{ models.full_name }}</h4>\n        </div>\n        <div ng-if=\"selectedDetail === \'email\'\">\n          <p>My email address is</p>\n          <h4>{{ models.email }}</h4>\n        </div>\n        <div ng-if=\"selectedDetail === \'address\'\">\n          <p>My address is</p>\n          <h4>{{ models.full_address }}</h4>\n        </div>\n        <div ng-if=\"selectedDetail === \'phone\'\">\n          <p>My phone number is</p>\n          <h4>{{ models.phone_number }}</h4>\n        </div>\n      </div>\n      <ul class=\"details-list list-inline\">\n        <li ng-mouseenter=\"setSelectedDetail(\'name\')\" ng-click=\"setSelectedDetail(\'name\')\">\n          <i class=\"fa fa-user\"></i>\n        </li>\n        <li ng-mouseenter=\"setSelectedDetail(\'email\')\" ng-click=\"setSelectedDetail(\'email\')\">\n          <i class=\"fa fa-envelope\"></i>\n        </li>\n        <li ng-mouseenter=\"setSelectedDetail(\'address\')\" ng-click=\"setSelectedDetail(\'address\')\">\n          <i class=\"fa fa-map-marker\"></i>\n        </li>\n        <li ng-mouseenter=\"setSelectedDetail(\'phone\')\" ng-click=\"setSelectedDetail(\'phone\')\">\n          <i class=\"fa fa-phone\"></i>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>");
$templateCache.put("users/views/sign_up/sign_up.html","<div class=\"row\">\n  <div class=\"col-lg-offset-4 col-lg-4\">\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <h4 class=\"panel-title\">Sign up</h4>\n      </div>\n      <div class=\"panel-body\">\n        <form name=\"form\" novalidate ng-submit=\"onSubmit()\">\n          <div class=\"form-group\" ng-class=\"{\n            \'has-error\': error.username,\n            \'has-feedback\': error.username\n          }\">\n            <label for=\"username\" class=\"control-label\">Username:</label>\n            <input id=\"username\" class=\"form-control\" type=\"text\" ng-model=\"username\" required>\n            <span class=\"help-block\" ng-if=\"error.username\">{{ error.username[0] }}</span>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"email\">Email:</label>\n            <input id=\"email\" class=\"form-control\" type=\"text\" ng-model=\"email\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"password\">Password:</label>\n            <input id=\"password\" class=\"form-control\" type=\"password\" ng-model=\"password\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"password-confirmation\">Password (again):</label>\n            <input id=\"password-confirmation\" class=\"form-control\" type=\"password\" ng-model=\"passwordAgain\" required>\n          </div>\n          <button class=\"btn btn-primary btn-block\" type=\"submit\" ng-disabled=\"form.$invalid || !passwordsMatch()\">Sign up\n          </button>\n        </form>\n      </div>\n    </div>\n    <p class=\"text-center\">Already have an account? <a href ui-sref=\"log_in\">Log in!</a></p>\n  </div>\n</div>");}]);