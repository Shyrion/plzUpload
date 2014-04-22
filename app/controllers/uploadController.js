var fs = require('fs');
var Upload = require('../models/Upload');
var UploadCode = require('../models/UploadCode');

var UPLOAD_DIR = __dirname + "/../../uploads"
var MAX_UPLOAD = 10; // TODO: Change for 3 or 5
var ID_LENGTH = 5;
var UPLOAD_LIFE = 2 * 24 * 3600 * 1000; // 48h
var CHECK_FREQUENCY = 3600 * 1000 // 1h
var CODE_MIN_LENGTH = 2; // codes will be length 5 or 6 (2-4 syllables)

exports.checkIP = function checkIP(ip, callback) {
	Upload.count({ip: ip}, function(err, number) {
		callback(err, number<MAX_UPLOAD);
	});
}

exports.uploadFile = function(path, fileName, userId, req, res, callback) {

	// Get the file extension from the filename
	var fileExtension = '';
	fileExtension = (fileName.indexOf('.') != -1) && fileName.split('.')[fileName.split('.').length-1];
	
	fs.readFile(path, function (err, data) {
		UploadCode.getRandomCode(function(err, uploadCode) {

			if (err) {
				if (callback) callback(err, null);
				return;
			}

			// Create entry in DB
		  var up = new Upload({
		  	name: fileName,
		  	code: uploadCode.name,
		  	ip: req.connection.remoteAddress,
		  	ext: fileExtension,
		  	userId: userId,
		  	date: new Date(),
		  	protected: false,
		  });

		  var newPath = UPLOAD_DIR + '/' + up.code + "." + fileExtension;
		  up.save(function(err, result) {
				if (err) {
					UploadCode.reinsert(up.code);
					return;
				}

				// Upload to server
		  	fs.writeFile(newPath, data, function (err) {
		  		if (err) {
						UploadCode.reinsert(up.code);
						return;
					}

			  	var fullUrl = 'http://' + req.headers.host + '/' + up.getFullName();
			  	var uploadCode = up.code;
					callback(err, fullUrl, uploadCode);
			  });
		});

			
	  });
	});

}

exports.getAllUploadedFiles = getAllUploadedFiles = function(callback) {
	fs.readdir(UPLOAD_DIR, function(err, files) {
		if (err) console.log(err);

		callback(err, files);
	});
}

exports.getUploadedFilesForUser = function(userId, callback) {
	Upload.find({userId: userId}, function(err, allUploads) {
		if (callback) callback(err, allUploads);
	})
}

/*exports.removeUpload = removeUpload = function(uploadId, uploadName, callback) {
	// find file in uploaded files
	getAllUploadedFiles(function(err, allFiles) {
		allFiles.forEach(function(file) {
			if (file == uploadName) {
				console.log("Removing file : ", file);
				Upload.find({_id: uploadId}).remove();
				fs.unlinkSync(UPLOAD_DIR + '/' + file);	
			}
		});
		if (callback) callback(true);
	});
}*/

exports.removeUpload = removeUpload = function(upload, callback) {
	console.log("Going to delete ", upload.code);
	// Remove file on disk
	fs.unlinkSync(UPLOAD_DIR + '/' + upload.code + '.' + upload.ext);

	// Remove in DB
	upload.remove(function(err) {
		if (callback) callback(err, true);

		// make the code available again
		UploadCode.reinsert(upload.code);
	});
}

exports.updateUploadProtection = function(upload, isProtected, callback) {
	console.log("Going to change protection for ", upload.code, ':', isProtected);
	
	upload.protected = isProtected;
	upload.save(function(err, result) {
		console.log(err, result);
		if (callback) callback(err, result);
	})
}

exports.getUpload = getUpload = function(uploadInfo, callback) {
	Upload.findOne(uploadInfo, function(err, upload) {
		if (callback) callback(err, upload);
	});
}

exports.purgeUploadFolder = purgeUploadFolder = function(callback) {
	// Remove all entries from database
	Upload.find({}).remove();

	UploadCode.purgeDB();
	UploadCode.fillDB(CODE_MIN_LENGTH);

	// Remove all local uploaded files
	getAllUploadedFiles(function(err, allFiles) {
		allFiles.forEach(function(file) {
			fs.unlinkSync(UPLOAD_DIR + '/' + file);
		});
		callback(true);
	});
}

function removeAllAtMidnight() {
	var now = new Date();

	var midnight = new Date().setHours(0,0,0,0) + 24 * 3600 * 1000;

	var timeUntilMidnight = midnight-now;
	//timeUntilMidnight = 10 * 1000; // 10 sec

	setTimeout(function() {
		purgeUploadFolder(function(success) {
			console.log("It's midnight, all is removed !");
		})
		removeAllAtMidnight();
	}, timeUntilMidnight);
}

//removeAllAtMidnight();


function checkFilesToRemove() {
	var now = new Date();

	console.log("Check files to remove");

	Upload.find({}, function(err, allUploads) {
		if (!err && allUploads.length) {
			allUploads.forEach(function(upload) {
				if (!upload.userId) { // logged in uploads last forever
					if (now - upload.date > UPLOAD_LIFE) {
						removeUpload(upload);
					}
				}
			})
		}
	})

	setTimeout(function() {
		checkFilesToRemove();
	}, CHECK_FREQUENCY);
}

checkFilesToRemove();