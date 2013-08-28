var fs = require('fs');
var Upload = require('../models/Upload');

var UPLOAD_DIR = __dirname + "/../public/upload"

exports.uploadFile = function(path, fileName, ip, req, res, callback) {
	var fileExtension = fileName.split('.')[fileName.split('.').length-1];
	fs.readFile(path, function (err, data) {
	  var up = new Upload({
	  	ip: req.connection.remoteAddress,
	  	ext: fileExtension
	  });
	  var newPath = __dirname + "/../public/upload/" + up._id + "." + fileExtension;
	  up.save(function(err, result) {
	  	fs.writeFile(newPath, data, function (err) {
		  	var uploadUrl = '/' + up._id + "." + fileExtension;
		  	var fullUrl = req.headers.host + uploadUrl;
				callback(err, uploadUrl, fullUrl);
		  });
	  });
	});
}

function purgeUploadFolder(callback) {
	// Remove all entries from database
	Upload.find({}).remove();

	// Remove all local uploaded files
	getAllUploadedFiles(function(allFiles) {
		allFiles.forEach(function(file) {
			fs.unlinkSync(UPLOAD_DIR + '/' + file);
		});
		callback(true);
	});
}
exports.purgeUploadFolder = purgeUploadFolder;

exports.getAllUploadedFiles = getAllUploadedFiles = function(callback) {
	fs.readdir(UPLOAD_DIR, function(err, files) {
		if (err) console.log(err);

		callback(files);
	})
}

function removeAllAtMidnight() {
	var now = new Date();

	var midnight = new Date().setHours(0,0,0,0) + 24 * 3600 * 1000;

	var timeUntilMidnight = midnight-now;
	//timeUntilMidnight = 10 * 1000; // 10 sec
	
	console.log("Call function in " + timeUntilMidnight/1000 + "sec");

	setTimeout(function() {
		purgeUploadFolder(function(success) {
			console.log("It's midnight, all is removed !");
		})
		removeAllAtMidnight();
	}, timeUntilMidnight);
}

removeAllAtMidnight();