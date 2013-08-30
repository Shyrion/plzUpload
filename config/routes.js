var uploadController = require('../controllers/uploadController');

module.exports = function(app, acl) {
	var utils = require('../lib/utils');

	//=========================//
	//========= HOME ==========//
	//=========================//

	app.get('/', function(req, res) {
		res.render('index');
	});

	//=========================//
	//======== UPLOAD =========//
	//=========================//

	app.post('/upload', function(req, res) {
		uploadController.uploadFile(req.files.uploadedFile.path, req.files.uploadedFile.name,
			req.connection.remoteAddress, req, res, function(err, uploadUrl, fullUrl) {
				if (err) {
					req.flash('Error', 'Error', err.message);
				} else {
					var title = 'Upload successful';
					var message = 'Access your file here: <a href="%1">%2</a>';
					message = message.replace('%1', uploadUrl).replace('%2', fullUrl);
		  		req.flash('Notice', title, message);
				}
				res.redirect('/');
		});
	});

	app.post('/uploadAjax', function(req, res) {
		uploadController.uploadFile(req.files.uploadedFile.path, req.files.uploadedFile.name,
			req.connection.remoteAddress, req, res, function(err, uploadUrl, fullUrl) {
				res.send({
					errorMessage: (err ? err.message : null),
					uploadUrl: uploadUrl,
					fullUrl: fullUrl
				});
		});
	});

	app.get('/getAllUploads', function(req, res) {
		uploadController.getAllUploadedFiles(function(err, allFiles) {
			console.log(allFiles,allFiles.length);
			res.render('showUploads', {allFileNames: allFiles});
		})
	});

	app.get('/clear', function(req, res) {
		uploadController.purgeUploadFolder(function(success) {
			console.log('removed all');
			res.redirect('/');
		})
	});


	//=========================//
	//========= INFO ==========//
	//=========================//


	app.get('/info', function(req, res) {
		uploadController.getAllUploadedFiles(function(allFiles) {
			res.render('info');
		})
	});


	app.get('/contact', function(req, res) {
		res.render('contact');
	});

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