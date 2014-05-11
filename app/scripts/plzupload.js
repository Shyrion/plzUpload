var TUTORIAL_INACTIVITY_TIME = 5*60*1000; // 5 minutes


//===== Locale Manager =====//

var dico = {
	en: {
		'DRAG_DROP_TUTORIAL': 'Drag&Drop a file from your desktop to this page',
		'GRAPHICS_BY': 'Graphics by',
		'GET_FILE': 'Get a file',
		'ENTER_FILE_CODE': 'Enter file code',
		'GET_IT': 'Get it!',
		'LOGIN': 'Login',
		'LOGOUT': 'Logout',
		'LOGIN_AND_BENEFITS': 'Login with Facebook and instantly get benefits of :',
		'BENEFIT_1': 'Unlimited uploads in parallel',
		'BENEFIT_2': 'Unlimited lifetime of uploads',
		'BENEFIT_3': 'Access to uploads history',
		'UPLOADS': 'Uploads',
		'UPLOAD_SPEECH': 'Feed Glooty with a file from your computer, and start uploading it!',

		// Menu Uploads
		'CODE': 'Code',

		// Tooltips
		'UPLOAD_CODE_TOOLTIP_TITLE': 'Upload Code',
		'UPLOAD_CODE_TOOLTIP_CONTENT': 'Give this code to your friends, and they will be able to access your file',
		'COPY_TOOLTIP_TITLE': 'Copy to Clipboard',
		'COPY_TOOLTIP_CONTENT': 'Click to copy the share link to your clipboard',
		'PROTECT_TOOLTIP_TITLE_1': 'Protected',
		'PROTECT_TOOLTIP_CONTENT_1': 'This file is only accessible by you', // and people who have the url
		'PROTECT_TOOLTIP_TITLE_2': 'Shareable',
		'PROTECT_TOOLTIP_CONTENT_2': 'This file can be accessed by anyone who knows the code',

		// Notice / Errors
		'UPLOAD_DELETED': 'Your upload <span class="oblique colored">%0</span> has been deleted',
		'UPLOAD_PROTECTED': 'Your upload <span class="oblique colored">%0</span> will be only accessible by you from now on',
		'UPLOAD_UNPROTECTED': 'Your upload <span class="oblique colored">%0</span> will be accessible by everyone who have the code',
		'SERIOUSLY_SPEECH': 'Seriously...?<br /> Do I look like a downmarket cloud ? Feed me with REAL files, please.',
		'ONE_AT_A_TIME_SPEECH': 'I cannot eat two files at a time unless you are logged in <br />' +
			'Please <span class="button colored underlined">login with Facebook</span> to enjoy fully plzUpload experience!',
		'FILE_TOO_BIG_SPEECH' : 'I am sorry<br />This file is too big, I will never be able to digest it (>20MB)',

		// Errors
		'ERROR_LOGIN' : 'Looks like a login issue<br />Thanks to try again later',
		'ERROR_USER_RESIGNED': '...Why ? Don\'t worry, I don\'t care about your personal data, I just want to eat',
		'ERROR_100': 'An error occured while<br/>I was trying to remove your file (Error 100)'

	},
	fr: {
		'DRAG_DROP_TUTORIAL': 'Glissez un fichier depuis votre bureau dans cette page',
		'GRAPHICS_BY': 'Graphismes d\'',
		'GET_FILE': 'Récupérez un fichier',
		'ENTER_FILE_CODE': 'Entrez un code PlzUpload',
		'GET_IT': 'Récupérer',
		'LOGIN': 'Connexion',
		'LOGOUT': 'Déconnexion',
		'LOGIN_AND_BENEFITS': 'Connectez-vous avec Facebook et bénéficiez dès à présent de :',
		'BENEFIT_1': 'Uploads parallèles illimités',
		'BENEFIT_2': 'Durée de vie des upload illimitée',
		'BENEFIT_3': 'Votre historique d\'upload',
		'UPLOADS': 'Mes Fichiers',
		'UPLOAD_SPEECH': 'Donnez un fichier de votre bureau à manger au petit nuage, il s\'occupera de le télécharger pour vous !',

		// Menu Uploads
		'CODE': 'Code',

		// Tooltips
		'UPLOAD_CODE_TOOLTIP_TITLE': 'Code PlzUpload',
		'UPLOAD_CODE_TOOLTIP_CONTENT': 'Partagez ce code avec vos amis, ils pourront télécharger votre fichier !',
		'COPY_TOOLTIP_TITLE': 'Copier le lien du code',
		'COPY_TOOLTIP_CONTENT': 'Cliquez pour copier le lien du code dans le presse-papier (vous pourrez le coller ultérieurement)',
		'PROTECT_TOOLTIP_TITLE_1': 'Protégé',
		'PROTECT_TOOLTIP_CONTENT_1': 'Ce fichier est seulement accessible par vous', // and people who have the url
		'PROTECT_TOOLTIP_TITLE_2': 'Accessible',
		'PROTECT_TOOLTIP_CONTENT_2': 'Ce fichier est accessible à toute personne possédant le code',

		// Notices
		'UPLOAD_DELETED': 'Votre upload <span class="oblique colored">%0</span> a été supprimé',
		'UPLOAD_PROTECTED': 'Votre upload <span class="oblique colored">%0</span> n\'est maintenant accessible que par vous',
		'UPLOAD_UNPROTECTED': 'Votre upload <span class="oblique colored">%0</span> est maintenant accessible à ceux qui possèdent le code',
		'SERIOUSLY_SPEECH': 'Sérieux... ?<br />J\'ai vraiment l\'air d\'être un nuage bas de gamme ? Donne-moi des VRAIS fichiers à manger. Merci.',
		'ONE_AT_A_TIME_SPEECH': 'Je ne peux manger 2 fichiers à la fois que si tu es connecté<br />' +
			'Merci de te <span class="button colored underlined">connecter via Facebook</span> pour profiter à fond de PlzUpload !',
		'FILE_TOO_BIG_SPEECH' : 'Uuuuuuuh !<br />Ce fichier est beaucoup trop gros, je pourrais jamais le digérer ! (>20MB)',

		// Errors
		'ERROR_LOGIN' : 'Y\'a eu comme qui dirait un problème de login<br />Merci de ré-essayer plus tard',
		'ERROR_USER_RESIGNED': 'Bah pourquoi ?<br />T\'en fais pas, je ne suis pas intéressé par tes données personnelles, je veux juste manger',
		'ERROR_100': 'Quelque chose s\'est mal passé<br/>lors de la suppression du fichier (Error 100)'
	},
}

LocaleManager.getInstance().init(dico);
var browserLanguage = navigator.language || navigator.userLanguage;
LocaleManager.getInstance().setLanguage(browserLanguage == 'fr' ? 'fr' : 'en');
LocaleManager.getInstance().localize();

//===== MenuController =====//

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

$('body').on('wrongFileTypeDropped', function(e) {
	NoticeManager.getInstance().showNotice({
		content: LocaleManager.getInstance().getValue('SERIOUSLY_SPEECH')
	});
});

if (localStorage.nbVisits == undefined) {
	localStorage.nbVisits = 0;
}
localStorage.nbVisits = parseInt(localStorage.nbVisits) + 1;
// We show the tutorial on start only on 3 first visits
if (localStorage.nbVisits <= 3) {
	tutorialTimer = setTimeout(showTutorial, 5*1000);
}

//===== Error management =====//

$('body').on('oneAtATime', function(eventTrigger, e) {
	var content = LocaleManager.getInstance().getValue('ONE_AT_A_TIME_SPEECH');

	NoticeManager.getInstance().showNotice({
		content: content
	}, function() {
		$('#notice .content .button').click(function() {
			$('#FBLogin').click();
		})
	});
});

$('body').on('fileTooBig', function(eventTrigger, e) {
	var content = LocaleManager.getInstance().getValue('FILE_TOO_BIG_SPEECH');

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
				NoticeManager.getInstance().showNotice({
					content: LocaleManager.getInstance().getValue('ERROR_USER_RESIGNED')
				});
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
				NoticeManager.getInstance().showNotice({
					content: LocaleManager.getInstance().getValue('ERROR_LOGIN')
				});
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