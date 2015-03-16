angular.module('moonSongsIonic.albumDetailSongsController', [])
  .controller('AlbumDetailController', function($scope, $rootScope, $http, $ionicListDelegate, ServerIp, Music) {
    var arrSongs = [];
    $scope.randomize = function() {
      for (var i in $rootScope.album.songs) {
        arrSongs.push($rootScope.album.songs[i]);
      }

      Music.songList = [];
      Music.songList = arrSongs;
      Music.randomizeSongList();
      Music.songIndex = 0;
      Music.playNow();
    };

    $scope.songClick = function(song) {
      $rootScope.song = song;
    };
  });
