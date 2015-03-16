angular.module('moonSongsIonic.songsController', [])
  .controller('SongsController', function($scope, $http, ServerIp) {
    $http.get(ServerIp.get() + '/private/songs')
      .success(function(data) {
        $scope.songs = data;
      });
  });
