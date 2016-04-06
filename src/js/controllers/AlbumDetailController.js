(function() {
  angular.module('MoonSongsIonic')
    .controller('AlbumDetailController', AlbumDetail);

  AlbumDetail.$inject = ['$scope', '$rootScope', 'Music'];

  function AlbumDetail($scope, $rootScope, Music) {
    var vm = this;
    vm.arrSongs = [];
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
  }
})();
