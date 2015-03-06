angular.module('moonSongsIonic.playerController', [])
.controller('PlayerController', function($scope, $rootScope, $http, ServerIp, Music) {

  function powerRangeTime() {
    $('#rangeTime').mousedown(function(event) {
      if(Music.getSong() === undefined) {
        event.preventDefault();
      }
      pulsado = true;
    })
    .mouseup(function(event) {
      pulsado = false;
    })
    .change(function(event) {
      if(Music.getSong() === undefined) {
        event.preventDefault();
      }
      var elem = $( this ).get(0);
      $scope.time = elem.value;
      Music.setTime($scope.time);
    });
  }

  function updateInfoSong() {
    try{
      $scope.title = Music.getSong().title;
      $scope.album = Music.getSong().album;
      $scope.imageUrl = $rootScope.getAlbumURL(Music.getSong());
      $scope.duration = Music.getDuration();
    } catch(e) {
      $scope.imageUrl = 'img/disc.jpg';
      $scope.title = '';
      $scope.album = '';
      $scope.title = 'No se esta reproduciendo nada';
    }
  }

  $scope.$on('$ionicView.loaded', powerRangeTime);
  $scope.$on('$ionicView.beforeEnter', updateInfoSong);

  $scope.getSongIndex = function() {
    return Music.getIndex();
  };

  $scope.getMusicLength = function() {
    return Music.songList.length;
  };

  $scope.click = function() {
    Music.setTime($scope.data.time);
  };

  setInterval(function() {
    Music.getTime(function(time) {
      $scope.data.time = Math.floor(time);
    });
    updateInfoSong();
    $scope.$apply();
  }, 500);

  $scope.play = function() {
    var lol = encodeURI(Music.getAudioUrl());
    if(Music.audio.src != encodeURI(Music.getAudioUrl()).replace(/%2520/g, '%20')) {
      console.log('distinto src');
      Music.audio.src = Music.getAudioUrl();
    }
    Music.play();
  };

  $scope.pause = function() {
    Music.pause();
  };

  $scope.nextSong = function() {
    Music.nextSong();
    updateInfoSong();
  };
  $scope.prevSong = function() {
    Music.prevSong();
    updateInfoSong();
  };
});
