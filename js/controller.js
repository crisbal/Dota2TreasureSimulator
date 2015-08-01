'use strict';

/* Controllers */

var dtsController = angular.module('dtsController', []);


dtsController.controller('HomeController', ['stats','$scope', '$http','$route',
  function(stats,$scope, $http, $route) 
  {
    $http.get('_econ_parsers/treasures.json').success(function(treasures) {
      console.log(treasures);
      $http.get('_econ_parsers/items_detail.json').success(function(items) {
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



    $http.get('_econ_parsers/treasures.json').success(function(treasures) {
      console.log(treasures);
      $http.get('_econ_parsers/items_detail.json').success(function(items) {
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


    $scope.openTreasure = function(){  //absolutely awful function
      var tries = 0;
      var item = null;
      $scope.stats.opens++;

      while(tries<100)
      {
        var roll = Math.random()*100; 
       
        if(roll<=0.4)  //math pls
        {
          var ul = $scope.treasure["unusual_loot"];
          if(ul.length != 0)
          {
            item = ul[Math.floor(Math.random()*ul.length)];
            $("#openAnother").blur(); 
            $("#openTreasure").blur(); 
            new Audio('http://www.cyborgmatt.com/wp-content/uploads/2012/06/stinger_loot_05.wav').play();
            $scope.loot_rarity = "Ultra Rare Loot - ";
            $scope.stats.ultra_rare++;
            break;
          }
        }
        else if(roll<=2.4)
        {
          var erl = $scope.treasure["extra_rare_loot"];
          if(erl.length != 0)
          {
            item = erl[Math.floor(Math.random()*erl.length)];
            $("#openAnother").blur(); 
            $("#openTreasure").blur(); 
            new Audio('http://www.cyborgmatt.com/wp-content/uploads/2012/06/stinger_loot_03.wav').play();
            $scope.loot_rarity = "Extra Rare Loot - ";
            $scope.stats.extra_rare++;
            break;
          }
        }
        else if(roll<=12.4)
        {
          
          var vrl = $scope.treasure["very_rare_loot"];
          if(vrl.length != 0)
          {
            item = vrl[Math.floor(Math.random()*vrl.length)];
            $scope.loot_rarity = "Very Rare Loot - ";
            $scope.stats.very_rare++;
            break;
          }
        }
        else
        {
          var cl = $scope.treasure["common_loot"];
          if(cl.length != 0)
          {
            item = cl[Math.floor(Math.random()*cl.length)];
            $scope.loot_rarity = "";
            $scope.stats.common++;
            break;
          }
        }
        tries++;
      }

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
