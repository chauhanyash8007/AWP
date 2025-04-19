var app = angular.module("clockApp", []);

app.controller("ClockController", function ($scope, $timeout) {
  function updateTime() {
    $scope.time = new Date().toLocaleTimeString();
    $timeout(updateTime, 1000); // Update every second
  }
  updateTime();
});
