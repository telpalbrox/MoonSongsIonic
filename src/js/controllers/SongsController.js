angular.module('moonSongsIonic.songsController', [])
  .controller('SongsController', function($scope, $http, ServerIp) {
    $http.get(ServerIp.get() + '/api/songs')
      .success(function(data) {
        $scope.songs = data;
      });
  });
