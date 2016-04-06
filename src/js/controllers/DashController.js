angular.module('moonSongsIonic.dashController', [])
  .controller('DashController', function($scope, $http, $ionicPopup, ServerIp, $timeout, LocalSongs, Music, $ionicModal, StorageService, Token, $rootScope) {

    // Triggered on a button click, or some other target
    $scope.showPopup = function() {
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="url" ng-model="data.serverIp">',
        title: 'Introduce la direccion IP',
        subTitle: 'Direccion actual: ' + ServerIp.get(),
        scope: $scope,
        buttons: [{
          text: 'Cancelar'
        }, {
          text: '<b>Guardar</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.serverIp) {
              //don't allow the user to close unless he enters server ip
              e.preventDefault();
            } else {
              return $scope.data.serverIp;
            }
          }
        }, ]
      });
      myPopup.then(function(res) {
        if (res) {
          ServerIp.set(res);
        }
      });
    };

    $scope.test = function() {
      ServerIp.set('http://moonsongs.albertovps.duckdns.org');
    };

    $scope.scan = function() {
      function onError(e) {
        console.log("ERROR");
        console.log(JSON.stringify(e));
      }

      var localAlbums = [];
      var ionicSongsURL;

      function gotDir(ionicDir) {
        console.log('obtenido directorio ionicSongs');
        console.log(JSON.stringify(ionicDir));
        ionicSongsURL = ionicDir.nativeURL;
        var directoryReader = ionicDir.createReader();
        directoryReader.readEntries(readIonicFiles, onError);
      }

      function readIonicFiles(files) {
        console.log('obtenidos archivos de ionicSongs');
        for (var i in files) {
          console.log('archivo ionicSongs: ' + files[i].name);
          if (files[i].isDirectory) {
            var directoryReader = files[i].createReader();
            directoryReader.readEntries(readArtistFiles, onError);
          }
        }
      }

      function readArtistFiles(files) {
        for (var i in files) {
          if (files[i].isDirectory) {
            console.log('directorio artistDir: ' + files[i].name);
            var directoryReader = files[i].createReader();
            directoryReader.readEntries(readAlbumFiles, onError);
          }
        }
      }

      function readAlbumFiles(files) {
        for (var i in files) {
          console.log('archivo albumDir: ' + files[i].name);
          var extension = files[i].name.substring(files[i].name.length - 3, files[i].name.length);
          console.log('archivo albumDir: ' + files[i].name);
          console.log('extension archivo: ' + extension);
          if (extension === 'mp3') {
            var arraySong = files[i].fullPath.split('/');
            console.log('arraySong: ');
            console.log(JSON.stringify(arraySong));
            var title = files[i].name.substring(0, files[i].name.length - 4);
            var album = arraySong[3];
            var artist = arraySong[2];
            console.log('Encontrada cancion en: ' + files[i].fullPath);
            var albumIndex = -1;
            for (var j in localAlbums) {
              if (localAlbums[j].album === album) {
                albumIndex = j;
              }
            }

            if (albumIndex != -1) {
              console.log('Existe el album: ' + album);
              localAlbums[albumIndex].songs.push({
                'title': title,
                'artist': artist,
                'album': album,
                'url': files[i].nativeURL,
                'imageUrl': ionicSongsURL + artist + '/' + album + '/Cover.jpg',
                'artistUrl': ionicSongsURL + artist + '/Artist.jpg'
              });
            } else {
              console.log('No existe el album: ' + album);
              console.log(JSON.stringify(localAlbums));
              localAlbums.push({
                'artist': artist,
                'album': album,
                'songs': []
              });
              localAlbums[localAlbums.length - 1].songs.push({
                'title': title,
                'artist': artist,
                'album': album,
                'url': files[i].nativeURL,
                'imageUrl': ionicSongsURL + artist + '/' + album + '/Cover.jpg',
                'artistUrl': ionicSongsURL + artist + '/Artist.jpg'
              });
            }
          }
        }
      }

      fileSystemLocal.root.getDirectory('ionicSongs/', {
        create: true
      }, gotDir, onError);

      $timeout(function() {
        console.log(JSON.stringify(localAlbums));
        LocalSongs.set(localAlbums);
        console.log('canciones guaradadas');
      }, 500, false);

    };

    $ionicModal.fromTemplateUrl('modals/login-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.inicioSesionModal = function() {
      $scope.openModal();
    };

    $scope.login = function() {
      $http.post(ServerIp.get() + '/api/authenticate', {
          'userName': $scope.data.userName,
          'password': $scope.data.pass
        })
        .success(function(data) {
          console.log(data.token);
          Token.save(data.token);
          $scope.closeModal();
        })
        .error(function(err) {
          console.log('error:');
          console.log(err);
        });
    };

    $scope.modeChanged = function() {
      Music.setOffline($scope.data.offline);
    };

    $scope.logout = function() {
      Token.remove();
      $rootScope.status = {
        'logged': false
      };
      Music.reset();
    };

  });
