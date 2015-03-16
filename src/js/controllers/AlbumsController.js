angular.module('moonSongsIonic.albumsSongsController', [])
  .controller('AlbumsController', function($scope, $rootScope, $http, $ionicListDelegate, ServerIp, LocalSongs, Music) {
    function getAlbums() {
      if ($scope.data.offline) {
        var canciones = LocalSongs.get();
        console.log('cargando canciones offline');
        $rootScope.albums = canciones;
      } else {
        $http.get(ServerIp.get() + '/private/albums')
          .success(function(data) {
            $rootScope.albums = data;
          });
      }
    }
    $scope.$on('$ionicView.enter', getAlbums);

    $scope.randomize = function() {
      var arrSongs = [];

      for (var i in $rootScope.albums) {
        for (var j in $rootScope.albums[i].songs) {
          arrSongs.push($rootScope.albums[i].songs[j]);
        }
      }

      Music.songList = [];
      Music.songList = arrSongs;
      Music.randomizeSongList();
      Music.songIndex = 0;
      Music.playNow();

    };

    $scope.albumSelected = function(album) {
      $rootScope.album = album;
    };

  });
