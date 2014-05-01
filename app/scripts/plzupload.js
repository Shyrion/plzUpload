var TUTORIAL_INACTIVITY_TIME = 5*60*1000; // 5 minutes

var menuController = new MenuController();

var dropZoneId = 'centeredZone';
var dragDrop = new DragDropController(dropZoneId, menuController);


$('body').on('authorizeMultiupload', function() {
	dragDrop.authorizeMultiUpload();
}.bind(this));

$('body').on('unauthorizeMultiupload', function() {
	dragDrop.unauthorizeMultiUpload();
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
$('body').trigger('resizeEnd');

//===== Tutorial =====//

var tutorial = $('#tutorial');
var tutorialTimer = null;
function showTutorial() {
	tutorial.css('left', $(window).width() * 5/100);
	tutorial.css('top', $(window).height() * 55/100);
	$('img', tutorial).css('left', 0);
	$('img', tutorial).css('top', 0);

	tutorial.fadeIn(1000);
	$('img', tutorial).animate({
		width: '80',
		height: '100',
		opacity: '1'
	}, 1500, 'easeOutQuint', function() {
		$('img', tutorial).animate({
			left: '300px',
			top: '-100px'
		}, 2000, 'linear', function() {
			setTimeout(function() {
				$('img', tutorial).animate({
					width: '160',
					height: '200',
					opacity: '0'
				}, 1500, 'easeOutQuint', function() {
					setTimeout(function() {
						tutorial.fadeOut(1000, function() {
							if (!tutorialTimer) {
								tutorialTimer = setTimeout(showTutorial, TUTORIAL_INACTIVITY_TIME);
							}
						});
					}, 2000);
				});
			},1000);
		});
	});
}

function launchTutorialTimer() {
	clearTimeout(tutorialTimer);
	setTimeout(showTutorial, TUTORIAL_INACTIVITY_TIME);
}

function stopTutorialTimer() {
	clearTimeout(tutorialTimer);
}

$('body').on('noUploadRunning', function(e) {
	launchTutorialTimer();
});

$('body').on('fileDragEnter', function(e) {
	stopTutorialTimer();
});

$('body').on('fileDropped', function(e) {
	stopTutorialTimer();
});

tutorialTimer = setTimeout(showTutorial, 5*1000);

//===== Error management =====//

$('body').on('oneAtATime', function(eventTrigger, e) {
	var content = 'Your cannot upload more than one file at a time<br />' +
               'Please <span class="button colored underlined">login with Facebook</span> to enjoy fully plzUpload experience!';

	NoticeManager.getInstance().showNotice({
		content: content
	}, function() {
		$('#notice .content .button').click(function() {
			$('#FBLogin').click();
		})
	});
});

$('body').on('fileTooBig', function(eventTrigger, e) {
	var content = 'I am sorry<br />' +
               'This file is too big, I will never be able to digest it'

	NoticeManager.getInstance().showNotice({
		content: content
	}, function() {
		$('#notice .content .button').click(function() {
			$('#FBLogin').click();
		})
	});
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
				if (menuController) {
					menuController.clearUploads(true);
					menuController.onFBLogout();
				}
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
				if (success) {
					$('body').trigger('authorizeMultiupload');
					if (menuController) menuController.onFBLogin(fbManager.currentUser);
					fbManager.getUserInfo(function(response) {
						fbManager.currentUser.name = response.name;
					});
				}					
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