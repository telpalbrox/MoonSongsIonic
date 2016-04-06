angular.module('moonSongsIonic.songDetailController', [])
  .controller('SongDetailController', function($scope, $stateParams, $http, $rootScope, $ionicLoading, ServerIp, Music) {

    $scope.play = function() {
      Music.addSong($rootScope.song);
      Music.playNow();
    };

    $scope.addSong = function() {
      Music.addSong($rootScope.song);
    };

    $scope.download = function() {
      var fileTransfer = new FileTransfer();

      function onError(e) {
        console.log("ERROR");
        console.log(JSON.stringify(e));
      }

      function gotDirArtistImg(dir) {

        var artist = $rootScope.song.artist;
        var album = $rootScope.song.album;
        var title = $rootScope.song.title;

        $scope.data.showDownload = true;
        // $cordovaToast.showShortBottom('Descargando cancion en la carpeta: '+dir.nativeURL);
        console.log('directorio: ');
        console.log(JSON.stringify(dir));
        console.log('Obtenido directorio: ' + dir.nativeURL);
        fileTransfer.download(encodeURI(ServerIp.get() + '/api/music/' + artist + '/image'),
          dir.nativeURL + '/' + artist + '/Artist.jpg',
          function() {
            console.log('Download artist image complete');
          }, onError);

        fileTransfer.download(encodeURI(ServerIp.get() + '/api/songs/' + artist + '/' + album + '/' + title + '/listen'),
          dir.nativeURL + '/' + artist + '/' + album + '/' + title + '.mp3',
          function() {
            console.log('Download Music complete');
            //$ionicLoading.hide();
            // $cordovaToast.showShortBottom('Descarga completada');
          }, onError);
        fileTransfer.onprogress = function(progressEvent) {

        };

        fileTransfer.download(encodeURI(ServerIp.get() + '/api/music/' + artist + '/' + album + '/image'),
          dir.nativeURL + '/' + artist + '/' + album + '/Cover.jpg',
          function() {
            console.log('Download album image complete');
          }, onError);
      }

      fileSystemLocal.root.getDirectory('ionicSongs/', {
        create: true
      }, gotDirArtistImg, onError);

    };
  });
