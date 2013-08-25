var fs = require('fs');

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
		fs.readFile(req.files.uploadedFile.path, function (err, data) {
		  var newPath = __dirname + "/../public/upload/" + req.files.uploadedFile.name;
		  fs.writeFile(newPath, data, function (err) {
		  	var uploadUrl = '/upload/' + req.files.uploadedFile.name;
		  	req.flash('Notice', 'Upload OK. Access it at the following url : <br/><br/>' +
		  		'<a href="' + uploadUrl + '">' + uploadUrl + '</a>');
				res.redirect('/');
		  });
		});
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