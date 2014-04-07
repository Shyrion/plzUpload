
var menuController = new MenuController();

var dragDrop = new DragDropController('centeredZone', menuController);


$('body').on('authorizeMultiupload', function() {
	console.log("Authorize multi");
	dragDrop.authorizeMultiUpload
}.bind(this));

$('body').on('unauthorizeMultiupload', function() {
	console.log("Unauthorize multi");
	dragDrop.unauthorizeMultiUpload = false;
}.bind(this));


//===== CPScene =====//

new CPGame("settings.json", function(cpGame) {

	var onResourcesLoaded = function() {
    console.log('Resources loaded !');
  
    // Launch 1rst scene
    CPSceneManager.instance.setScene("MainScene");
  }.bind(this)
  var onResourcesProgress = function(progress) {
      //console.log(progress + '%');
  }

  CPResourceManager.instance.init(cpGame.allImages, onResourcesLoaded, onResourcesProgress);

  CPResourceManager.instance.startLoading();
});

var timer = null;
$(window).resize(function(e) {
	//TODO: More smooth, with safe area (not on every resize)

	window.clearTimeout(timer);
	timer = window.setTimeout(resize, 500);

	function resize() {
  	CPGame.instance.canvasWidth = $(window).width();
    CPGame.instance.canvasHeight = $(window).height();

  	$('canvas').attr('width', CPGame.instance.canvasWidth);
  	$('canvas').attr('height', CPGame.instance.canvasHeight);

  	$('body').trigger('resizeEnd');
	}
  	
});

//===== Glooty animation =====//

$('#centeredZone').on('dragover', function(e) {
	if (fileDropOK) {
		$('body').trigger('fileDragOver', e);
	}
});

$('#centeredZone').on('dragenter', function(e) {
	if (fileDropOK) {
		$('body').trigger('fileDragEnter', e);
	} else {
		$('body').trigger('oneAtATime');
	}
});

$('#centeredZone').on('dragleave', function(e) {
	if (fileDropOK) {
		$('body').trigger('fileDragOut');
	}
	
});

$('#centeredZone').on('dragend', function(e) {
	$('body').trigger('fileDragFinished');
});

$('#centeredZone').on('dragout', function(e) {
	$('body').trigger('fileDragOut');
});

var fileDropOK = true;
$('#centeredZone').on('drop', function(e) {
	if (fileDropOK) {
		$('body').trigger('fileDropped');
		fileDropOK = false;
	}
});

$('body').on('noUploadRunning', function(e) {
	fileDropOK = true;
});

//===== Facebook login =====//

var fbManager = new FacebookManager();

fbManager.setServerValidationUrl(location.origin + '/ws/facebookLogin');

$('#FBLogin').click(function() {
	fbManager.login(function(success) {

			if (success) {
				fbManager.getUserInfo(function(response) {
					fbManager.currentUser.name = response.name;
					if (menuController) menuController.onFBLogin(fbManager.currentUser);
					$('body').trigger('authorizeMultiupload');
				});
			} else {
				console.log('User resigned :(');
			}
	}, 'email');
});

$('#FBLogout').click(function() {
	fbManager.logout(function(success) {
			if (success) {
				if (menuController) menuController.onFBLogout();
					$('body').trigger('unauthorizeMultiupload');
			} else {
				console.log('Failed to logout ? :(');
			}
	});
});

function checkUserStatus() {
	fbManager.checkUserStatus(function(userStatus) {
		//if (!$('#facebookLogin').length) initLoginButton();

		if (userStatus == 'connected') {
			fbManager.login(function(success) {
				console.log("Autologin success ? ", success);

				if (menuController) menuController.onFBLogin(fbManager.currentUser);

				fbManager.getUserInfo(function(response) {
					fbManager.currentUser.name = response.name;
				});
			}, 'email');
		} else {
			//console.log('NOT connected');

			/*fbManager.login(function(success) {
				console.log("Autologin success ? ", success);

				fbManager.getUserInfo(function(response) {
					fbManager.currentUser.name = response.name;
				});
			}, 'email');*/
		}
	})
}

fbManager.init({
	appId: '601752169899573', // test one : 126267960876070 
	locale: 'en_GB'
}, checkUserStatus);