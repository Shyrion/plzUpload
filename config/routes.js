var uploadController = require('../controllers/uploadController');

module.exports = function(app) {

	var utils 							= require('../lib/utils');
	var errors							= require('./errors');

	var fbLoginController		= require('../controllers/fbLoginController');

	//=========================//
	//========= HOME ==========//
	//=========================//

	app.get('/', function(req, res) {
		res.render('index');
	});

	//=========================//
	//======== UPLOAD =========//
	//=========================//

	/*app.post('/upload', function(req, res) {
		console.log(req.files.uploadedFile.path);
		uploadController.uploadFile(req.files.uploadedFile.path, req.files.uploadedFile.name,
			req.connection.remoteAddress, req, res, function(err, uploadUrl, fullUrl, uploadCode) {
				if (err) {
					req.flash('Error', 'Error', err.message);
				} else {
					var title = 'Upload successful';
					var message = 'Give this code to your friend for download: <a href="%1">%2</a>';
					message = message.replace('%1', uploadUrl).replace('%2', uploadCode);
		  		req.flash('Notice', title, message);
				}
				res.redirect('/');
		});
	});*/

	app.get('/uploads/:fbUserId', function(req, res) {
		fbLoginController.validateTokenValidity(req.session.userId, req.session.fbToken, function(err, user) {
			var response;
			if (err) {
				console.log(err);
				response = {
					result: 'error',
					error: errors.GENERAL_ERROR
				}
				res.send(JSON.stringify(response));
			} else if (user.id != req.params.fbUserId) {
				response = {
					result: 'error',
					error: errors.GENERAL_ERROR
				};
				res.send(JSON.stringify(response));
			} else {
				uploadController.getUploadedFilesForUser(user.id, function(err, allUploads) {
					if (err) {
						response = {
							result: 'error',
							error: errors.GENERAL_ERROR
						};
					} else {
						response = {
							result: 'ok',
							allUploads: allUploads
						};
					}
					res.send(JSON.stringify(response));
				});
			}
		});
	});

	app.post('/uploadAjax', function(req, res) {

		fbLoginController.validateTokenValidity(req.session.userId, req.session.fbToken, function(err, user) {

			function uploadFunction(callback) {
				uploadController.uploadFile(req.files.uploadedFile.path, req.files.uploadedFile.name,
					req.session.userId, req, res, function(err, uploadUrl, fullUrl, uploadCode) {
						if (err) {
							console.log(err);
							response = {
								result: 'error',
								error: errors.GENERAL_ERROR
							}
						} else {
							response = {
								result: 'ok',
								uploadUrl: uploadUrl,
								fullUrl: fullUrl,
								uploadCode: uploadCode
							};
						}
						if (callback) callback(response);		
				});
			}

			var response = {};
			
			if (err) {
				// User is not logged in : Authorize only 3 uploads per IP address !
				console.log('user not connected. Restrictions ! :).');
				uploadController.checkIP(req.connection.remoteAddress, function(err, ipAuthorized) {
					if (ipAuthorized) {
						uploadFunction(function(response) {
							res.send(JSON.stringify(response));
						});
					} else {
						res.send(JSON.stringify({
							result: 'error',
							error: errors.QUOTA_REACHED
						}));
					}
				});
				return;
			} else {
				// User is logged in, we let him do what he wants :)
				console.log('user connected. Have fun :).');
				uploadFunction(function(response) {
					res.send(JSON.stringify(response));
				});
			}
		});
	});




/////µµµµµµµµµµ TODO : Empêcher upload vides quand input + Récupérer vide.
/////////////       Test fichier sans extension



	app.post('/ws/facebookLogin', function(req, res) {

		if (req.body.askForLogout == 'true') {
			console.log("Asked for logout", req.body);
			req.session.userId = null;
	    req.session.fbToken = null;

			response = {
				result: 'ok'
			}
	    	
	   	res.send(JSON.stringify(response));
	   	return;
		}

		var fbData = {
        accessToken: req.body.accessToken,
        expiresIn: req.body.expiresIn,
        signedRequest: req.body.signedRequest,
        userId: req.body.userID
    }

    fbLoginController.validateFacebookLogin(fbData, function(err, result) {
    	var response;
    	if (err) {
    		response = {
    			result: 'error',
    			error: err
    		}
    	} else {

    		req.session.userId = fbData.userId;
    		req.session.fbToken = fbData.accessToken;

    		response = {
    			result: 'ok'
    		}
    	}
    	
    	res.send(JSON.stringify(response));
    });
	
	});


	//=========================//
	//========= MISC ==========//
	//=========================//



	app.get('/getAllUploads', function(req, res) {
		uploadController.getAllUploadedFiles(function(err, allFiles) {
			console.log(allFiles,allFiles.length);
			res.render('showUploads', {allFileNames: allFiles});
		})
	});

	app.get('/clear', function(req, res) {
		fbLoginController.isAdminLoggedIn(req.session.userId, req.session.fbToken, function(err, authorized) {
			if (authorized) {
				uploadController.purgeUploadFolder(function(success) {
					console.log('removed all');
					res.redirect('/');
				});
			} else {
				res.send("You are not admin.");
			}
		});
	});


	//=========================//
	//========= INFO ==========//
	//=========================//


	/*app.get('/info', function(req, res) {
		uploadController.getAllUploadedFiles(function(allFiles) {
			res.render('info');
		})
	});


	app.get('/contact', function(req, res) {
		res.render('contact');
	});*/

	//=========================//
	//========= MISC ==========//
	//=========================//

	//=========================//
	//========== 404 ==========//
	//=========================//

	app.use(function(req, res, next){
		res.render('errorPages/404', { title: 'Fail :/' });
	});
}