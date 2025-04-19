var app = angular.module("clockApp", []);

app.controller("ClockController", function ($scope, $timeout) {
  function updateTime() {
    var now = new Date();
    $scope.hours = now.getHours();
    $scope.minutes = now.getMinutes();
    $scope.seconds = now.getSeconds();
    $timeout(updateTime, 1000); // Update every second
  }

  $scope.getHourRotation = function () {
    var hours = $scope.hours % 12; // Convert 24-hour format to 12-hour format
    var degree = (hours + $scope.minutes / 60) * 30; // 360° / 12 hours = 30° per hour
    return { transform: "rotate(" + degree + "deg)" };
  };

  $scope.getMinuteRotation = function () {
    var degree = ($scope.minutes + $scope.seconds / 60) * 6; // 360° / 60 minutes = 6° per minute
    return { transform: "rotate(" + degree + "deg)" };
  };

  $scope.getSecondRotation = function () {
    var degree = $scope.seconds * 6; // 360° / 60 seconds = 6° per second
    return { transform: "rotate(" + degree + "deg)" };
  };

  updateTime();
});
