'use strict';

/* Controllers */

var dtsController = angular.module('dtsController', []);


dtsController.controller('HomeController', ['stats','$scope', '$http','$route',
  function(stats,$scope, $http, $route) 
  {
    $http.get('econ_parsers/treasures.json').success(function(treasures) {
      console.log(treasures);
      $http.get('econ_parsers/items_detail.json').success(function(items) {
        console.log(items);
      
        $scope.items = items;
        $scope.treasures = treasures;
      });
    });

    if(!localStorage.getItem('alertedHome'))
      $("#modalWrapper").fadeIn('fast');

    $("#modal button").click(function(){
      $("#modalWrapper").fadeOut('fast');
      localStorage.setItem('alertedHome', 'ok');
    });

    $scope.stats = stats;
  }
]);

dtsController.controller('TreasureController', ['stats','$scope', '$routeParams', '$http',
  function(stats,$scope, $routeParams, $http) {

    $scope.stats = stats;

    if(!localStorage.getItem('alertedTreasure'))
      $("#modalTreasureWrapper").fadeIn('fast');

    $("#modalTreasure button").click(function(){
      $("#modalTreasureWrapper").fadeOut('fast');
      localStorage.setItem('alertedTreasure', 'ok');
    });



    $http.get('econ_parsers/treasures.json').success(function(treasures) {
      console.log(treasures);
      $http.get('econ_parsers/items_detail.json').success(function(items) {
        console.log(items);
        
        $scope.items = items;
        
        for(var i = 0,len = treasures.length; i<len;i++)
        {
          if(treasures[i].id == $routeParams.treasureId)
          {
            $scope.treasure = treasures[i];
          }
        }
      });
    });


    $scope.openTreasure = function(){  // less awful!?
      var tries = 0;
      var item = null;
      var loot_list = null;
      $scope.stats.opens++;

      var roll = Math.random()*100; 
      
      if(roll<=0.4 && (loot_list = $scope.treasure["unusual_loot"]) != null && loot_list.length > 0)  //math pls
      {
        $("#openAnother").blur(); 
        $("#openTreasure").blur(); 
        new Audio('http://www.cyborgmatt.com/wp-content/uploads/2012/06/stinger_loot_05.wav').play();
        $scope.loot_rarity = "Ultra Rare Loot - ";
        $scope.stats.ultra_rare++;
      }
      else if(roll<=2.4 && (loot_list = $scope.treasure["extra_rare_loot"]) != null && loot_list.length > 0)
      {
        $("#openAnother").blur(); 
        $("#openTreasure").blur(); 
        new Audio('http://www.cyborgmatt.com/wp-content/uploads/2012/06/stinger_loot_03.wav').play();
        $scope.loot_rarity = "Extra Rare Loot - ";
        $scope.stats.extra_rare++;
      }
      else if(roll<=12.4 && (loot_list = $scope.treasure["very_rare_loot"]) != null && loot_list.length > 0)
      {
        $scope.loot_rarity = "Very Rare Loot - ";
        $scope.stats.very_rare++;
      }
      else if((loot_list = $scope.treasure["common_loot"]) != null && loot_list.length > 0)
      {
        $scope.loot_rarity = "";
        $scope.stats.common++;
      }
      else
      {
        // treasure has no loot, we've got some problems
      }
      
      item = loot_list[Math.floor(Math.random()*loot_list.length)];
      item.rarity = $scope.items[item.name].rarity;
      item.image_url = $scope.items[item.name].image_url;
      $scope.item = item;

      $("#modalWrapper").fadeIn('fast');

      $("#modalWrapper").click(function(e){
        if( e.target != this )
          return;
        $("#modalWrapper").fadeOut('fast');
      });
    }
    
  }
]);
