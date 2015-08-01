'use strict';

/* App Module */
(function() {


  var dts = angular.module('dotaTreasureSimulator', [
    'ngRoute',
    'dtsController',
  ]);

  dts.value('stats', { opens: 0, common: 0, very_rare: 0, extra_rare:0, ultra_rare: 0 });

  dts.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider){
      $routeProvider.
        when('/', {
          templateUrl: '../views/home.html',
          controller: 'HomeController'
        }).
        when('/treasure/:treasureId', {
          templateUrl: 'views/treasure.html',
          controller: 'TreasureController'
        }).
        otherwise({
          redirectTo: '/'
        });
    }
  ]);
  
})();