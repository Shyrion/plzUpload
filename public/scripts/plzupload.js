requirejs.config({
    //By default load any module IDs from scripts
    baseUrl: 'scripts'
});


require(['lib/jquery-2.1.0.min', 'dragDrop', 'lib/MenuController', 'lib/Glooty', 'lib/FacebookManager'],
	function(a, DragDropController, MenuController, Glooty, FacebookManager) {
  var menuController = new MenuController();
  var dragDrop = new DragDropController(menuController);


  //===== Glooty animation =====//


  var glooty = new Glooty(function(self) {
	  self.setAnimation('wait');
	  self.play();
  });

  $('#glooty').on('dragover', function(e) {
	  glooty.setAnimation('preEat');
  });

  $('#glooty').on('dragleave', function(e) {
	  glooty.setAnimation('wait');
  });

  $('#glooty').on('dragend', function(e) {
	  glooty.setAnimation('wait');
  });

  $('#glooty').on('drop', function(e) {
	  glooty.setAnimation('eat');
  });

  //===== Facebook login =====//

	var fbManager = new FacebookManager();

	$('#FBLogin').click(function() {
		fbManager.login(function(success) {

				if (success) {
					fbManager.getUserInfo(function(response) {
						fbManager.currentUser.name = response.name;
						if (menuController) menuController.onFBLogin(fbManager.currentUser.name);
					});
				} else {
					console.log('User resigned :(');
				}
		}, 'email');
	});
  
  function checkUserStatus() {
		fbManager.checkUserStatus(function(userStatus) {
			//if (!$('#facebookLogin').length) initLoginButton();

			if (userStatus == 'connected') {
				console.log('connected', fbManager);

				if (menuController) menuController.onFBLogin(fbManager.currentUser.name);
				
				fbManager.getUserInfo(function(response) {
					fbManager.currentUser.name = response.name;
				});
				fbManager.login(function(success) {
					console.log("Autologin success ? ", success);

					fbManager.getUserInfo(function(response) {
						fbManager.currentUser.name = response.name;
					});
				}, 'email');
			} else {
				console.log('NOT connected');

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
		appId: '601752169899573',
		//channelUrl: '//book.fruitygames.fr/channel.html',
		locale: 'en_GB'
		/*onLoginStatusConnectedCB,
		onLoginStatusNotAuthorizedCB,
		onLoginStatusNotConnectedCB,*/
	}, checkUserStatus);
});