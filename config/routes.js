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
	//========= MISC ==========//
	//=========================//

	app.post('/upload', function(req, res) {
		uploadController.uploadFile(req.files.uploadedFile.path, req.files.uploadedFile.name,
			req.connection.remoteAddress, req, res, function(err, uploadUrl, fullUrl) {
				if (err) {
					req.flash('Error', err.message);
				} else {
					var message = 'Accédez à l\'upload à cette url :<br /> <a href="%1">%2</a>';
					message = message.replace('%1', uploadUrl).replace('%2', fullUrl);
		  		req.flash('Notice', message);
				}
				res.redirect('/');
		});
	});

	app.post('/uploadAjax', function(req, res) {
		uploadController.uploadFile(req.files.uploadedFile.path, req.files.uploadedFile.name,
			req.connection.remoteAddress, req, res, function(err, uploadUrl, fullUrl) {
				res.send({
					error: err,
					uploadUrl: uploadUrl,
					fullUrl: fullUrl
				});
		});
	});

	app.get('/info', function(req, res) {
		uploadController.getAllUploadedFiles(function(allFiles) {
			res.redirect('/');
		})
	});

	app.get('/clear', function(req, res) {
		uploadController.purgeUploadFolder(function(success) {
			console.log('removed all');
			res.redirect('/');
		})
	});

	app.get('/contact', function(req, res) {
		res.render('contact');
	});

	//=========================//
	//========== 404 ==========//
	//=========================//

	app.use(function(req, res, next){
		res.render('errorPages/404', { title: 'Fail :/' });
	});
}