// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of self angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var audio = new Audio();
var songList = [];
var music;
var dataDir;
var fileSystemLocal;
angular.module('MoonSongsIonic', ['ionic',
  'ng-cordova',
  'starter.services',
  'moonSongsIonic.albumDetailSongsController',
  'moonSongsIonic.albumsSongsController',
  'moonSongsIonic.dashController',
  'moonSongsIonic.listSongsController',
  'moonSongsIonic.playerController',
  'moonSongsIonic.songDetailController',
  'moonSongsIonic.songsController'
])

.run(function($ionicPlatform, $rootScope, ServerIp, Music, $http, Token) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove self to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.serverIp = ServerIp.get;

    $rootScope.data = {
      showOptionsBut: false,
      showReorderBut: false,
      showDelete: false,
      showReorder: false,
      canSwipe: false,
      showDownload: false,
      download: 0,
      offline: false,
      serverIp: '',
      'userName': '',
      'pass': ''
    };

    if (!$rootScope.getUser) {
      $rootScope.getUser = Token.getUser;
    }
    if (Token.get()) {
      $rootScope.status = {
        'logged': true
      };
      $rootScope.currentUser = Token.getUser();
    } else {
      $rootScope.status = {
        'logged': false
      };
    }

    function onError(e) {
      console.log("ERROR");
      console.log(JSON.stringify(e));
    }

    function onSuccess(fileSystem) {
      console.log('Sistema de archivos preparado');
      fileSystemLocal = fileSystem;
      fileSystem.root.getDirectory('ionicSongs', {
        create: true
      }, gotDir, onError);
    }

    function gotDir(dir) {
      dataDir = dir;
    }

    try {
      // request the persistent file system
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, null);
    } catch (e) {
      console.log('Tu plataforma no soporta descarga de archivos');
    }


    Music.audio.addEventListener('ended', function() {
      $rootScope.$broadcast('Music.audio.ended', self);
    });

    $rootScope.$on('Music.audio.ended', function() {
      Music.nextSong(true);
    });

    $rootScope.getAlbumURL = function(song) {
      if (song.imageUrl) return song.imageUrl;
      else return ServerIp.get() + '/music/' + song.artist + '/' + song.album + '/Cover.jpg?dim=128x128';
    };

    $rootScope.getArtistURL = function(song) {
      if (song.artistUrl) return song.artistUrl;
      else return ServerIp.get() + '/music/' + song.artist + '/Artist.jpg?dim=128x64';
    };
  });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashController'
        }
      }
    })

    .state('tab.songs', {
      url: '/songs',
      views: {
        'tab-songs': {
          templateUrl: 'templates/tab-songs.html',
          controller: 'SongsController'
        }
      }
    })

    .state('tab.player', {
      url: '/player',
      views: {
        'tab-player': {
          templateUrl: 'templates/tab-player.html',
          controller: 'PlayerController'
        }
      }
    })

    .state('tab.list-songs', {
      url: '/list-songs',
      views: {
        'tab-list-songs': {
          templateUrl: 'templates/tab-list-songs.html',
          controller: 'ListSongsController'
        }
      }
    })

    .state('tab.albums', {
      url: '/albums',
      views: {
        'tab-albums': {
          templateUrl: 'templates/tab-albums.html',
          controller: 'AlbumsController'
        }
      }
    })

    .state('tab.song-detail', {
      url: '/song/',
      views: {
        'tab-albums': {
          templateUrl: 'templates/song-detail.html',
          controller: 'SongDetailController'
        }
      }
    })

    .state('tab.song-detail2', {
      url: '/private/song/:songId',
      views: {
        'tab-songs': {
          templateUrl: 'templates/song-detail.html',
          controller: 'SongDetailController'
        }
      }
    })

    .state('tab.album-detail', {
      url: '/album',
      views: {
        'tab-albums': {
          templateUrl: 'templates/album-detail.html',
          controller: 'AlbumDetailController'
        }
      }
    });

    // if none of the above states are matched, use self as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

  })
  .config(['$compileProvider', function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
  }]);
