angular.module('moonSongsIonic.listSongsController', [])
.controller('ListSongsController', function($scope, $rootScope, $http, $ionicListDelegate, ServerIp, $state, $ionicActionSheet, $timeout, StorageService, $ionicPopup, $ionicModal, Music) {

  $rootScope.data.showOptionsBut = true;
  $rootScope.data.showReorderBut = true;

  $scope.getSongList = function() {
    return Music.songList;
  };

  $scope.equalsSong = function(song) {
    return Music.equals(song);
  };

  $scope.clickSong = function(song) {
    $rootScope.song = song;
    $state.go('tab.albums');
  };

  $scope.share = function(item) {
    alert('Share Item: ' + item.title);
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    Music.songList.splice(fromIndex, 1);
    Music.songList.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function(item) {
    if(Music.equals(item)) {
      Music.pause();
    }
    Music.songList.splice(Music.songList.indexOf(item), 1);
  };

  $rootScope.onTabSelected = function() {
    $rootScope.data.showOptionsBut = true;
    $rootScope.data.showReorderBut = true;
  };

  $rootScope.onTabDeselected = function() {
    $rootScope.data.showOptionsBut = false;
    $rootScope.data.showReorderBut = false;
    $rootScope.data.showReorder = false;
  };

  $ionicModal.fromTemplateUrl('my-modal2.html', {
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

  $scope.listSelected = function(index) {
    Music.pause();
    Music.songIndex = 0;
    Music.songList = $scope.lists[index].list;
    $scope.closeModal();
  };

  $scope.listDelete = function(list) {
    $scope.lists.splice($scope.lists.indexOf(list), 1);
    StorageService.save('listas', $scope.lists);
  };

  $rootScope.options = function() {
    $scope.data.name = "";
    // show the action sheep
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        {text: 'Guardar lista de reproduccion'},
        {text: 'Cargar lista de reproduccion' }
      ],
      destructiveText: 'Vaciar lista de reproduccion',
      destructiveButtonClicked : function() {
        Music.pause();
        Music.songIndex = 0;
        Music.songList = [];
        hideSheet();
      },
      titleText: 'Lista de reproduccion',
      cancelText: 'Cancelar',
      buttonClicked: function(index) {
        hideSheet();
        if(index === 0) {
          if(Music.songList === 0) {
            $ionicPopup.alert({
              title : 'Error',
              template : 'No hay nada en la lista de reproduccion'
            }).then(function() {

            });
            return;
          }
          $ionicPopup.prompt({
            title: 'Nombre lista de reproduccion',
            template: 'Introduce un nombre para la lista de reproduccion',
            inputType: 'text',
            inputPlaceholder: 'El nombre de la lista'
          }).then(function(res) {
            if(res === "") {
              alert('Es necesario un nombre para la lista');
              return;
            }

            var listas = JSON.parse(StorageService.get('listas')) || [];

            for(var i in listas) {
              if(listas[i].title == res) {
                alert('Ya existe una lista con ese nombre');
                return;
              }
            }
            listas.push({
              'title' : res,
              'offline' : Music.offline,
              'list' : Music.songList
            });
            StorageService.save('listas', listas);
          });
        }
        else if(index == 1) {
          $scope.lists = JSON.parse(StorageService.get('listas')) || [];
          hideSheet();
          $scope.openModal();
        }
      }
    });
  };
});
