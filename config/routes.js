

module.exports = function(app) {

	var path								= require('path');
	var utils 							= require('../app/lib/utils');
	var errors							= require('./errors');

	var fbLoginController		= require('../app/controllers/fbLoginController');
	var uploadController		= require('../app/controllers/uploadController');

	//=========================//
	//========= HOME ==========//
	//=========================//

	app.get('/', function(req, res) {
		res.render('index');
	});

	//=========================//
	//======== UPLOAD =========//
	//=========================//

	app.get('/up/:code', function(req, res) {

		function serveFile(upload) {
			res.sendfile(path.resolve(__dirname, '..', 'uploads', upload.code + '.' + upload.ext));
		}

		uploadController.getUpload({code: req.params.code}, function(err, upload) {
			if (upload) {
				if (upload.userId && upload.protected) { // upload.isProtected
					console.log("File", upload.code, "protected ! Requester:", req.session.userId, "owner:", upload.userId);
					fbLoginController.validateTokenValidity(req.session.userId, req.session.fbToken, function(err, user) {
							if (user.id == upload.userId) {
								serveFile(upload);
							} else {
								res.render('errorPages/403', { title: 'Forbidden!' });
							}
					});
				} else {
					console.log("File", upload.code, "not protected, we can access");
					serveFile(upload);
				}
			} else {
				res.render('errorPages/404', { title: 'Not found :(' });
			}
		});
	});

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

	app.get('/upload/:code/remove', function(req, res) {
		fbLoginController.validateTokenValidity(req.session.userId, req.session.fbToken, function(err, user) {
			uploadController.getUpload({code: req.params.code}, function(err, upload) {
				// The user will really delete one of its upload, not someone else's :).
				if (req.session.userId == upload.userId) {
					uploadController.removeUpload(upload, function(err, result) {
						if (err) {
							console.log(err);
							response = {
								result: 'error',
								error: errors.REMOVE_ERROR
							}
						} else {
							response = {
								result: 'ok'
							};
						}
						res.send(JSON.stringify(response));
					});
				} else {
					res.send(JSON.stringify({
						result: 'error',
						error: errors.REMOVE_ERROR
					}));
				}
			});
		});
	});

	app.post('/upload/:code/updateProtection', function(req, res) {
		fbLoginController.validateTokenValidity(req.session.userId, req.session.fbToken, function(err, user) {
			uploadController.getUpload({code: req.params.code}, function(err, upload) {
				// The user will really update one of its upload, not someone else's :).
				if (req.session.userId == upload.userId) {
					uploadController.updateUploadProtection(upload, req.body.isProtected, function(err, result) {
						if (err) {
							console.log(err);
							response = {
								result: 'error',
								error: errors.REMOVE_ERROR
							}
						} else {
							response = {
								result: 'ok'
							};
						}
						res.send(JSON.stringify(response));
					});
				} else {
					res.send(JSON.stringify({
						result: 'error',
						error: errors.REMOVE_ERROR
					}));
				}
			});
		});
	});
	
	app.post('/uploadAjax', function(req, res) {

		fbLoginController.validateTokenValidity(req.session.userId, req.session.fbToken, function(err, user) {

			function uploadFunction(callback) {
				uploadController.uploadFile(req.files.uploadedFile.path, req.files.uploadedFile.name,
					req.session.userId, req, res, function(err, fullUrl, uploadCode) {
						if (err) {
							console.log(err);
							response = {
								result: 'error',
								error: errors.GENERAL_ERROR
							}
						} else {
							response = {
								result: 'ok',
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