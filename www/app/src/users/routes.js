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