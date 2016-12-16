var fs 					= require('fs');
var Upload 			= require('../models/Upload');
var UploadCode 	= require('../models/UploadCode');
var User 				= require('../models/User');
var moment 			= require('moment');

var UPLOAD_DIR 			= __dirname + "/../../uploads";
var MAX_UPLOAD 			= 5;
var UPLOAD_LIFE 		= 2 * 24 * 3600 * 1000; // 48h
var CHECK_FREQUENCY = 3600 * 1000; // 1h
var CODE_MIN_LENGTH = 2; // codes will be length 5 or 6 (2-4 syllables)

exports.checkIP = function checkIP(ip, callback) {
	Upload.count({ip: ip, userId: null}, function(err, number) {
		console.log(number);
		callback(err, number<MAX_UPLOAD);
	});
}

exports.uploadFile = function(bufferData, fileName, userId, req, res, callback) {

	// Get the file extension from the filename
	var fileExtension = '';
	fileExtension = (fileName.indexOf('.') != -1) && fileName.split('.')[fileName.split('.').length-1];

	UploadCode.getRandomCode(function(uploadCode, err, result) {

		if (err) {
			if (callback) callback(err, null);
			return;
		}

		console.log('Got code:', uploadCode);

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

	  // We save the file with the code as name to avoid collisions
	  var newPath = UPLOAD_DIR + '/' + up.code + '.' + up.ext;

	  up.save(function(err, result) {
			if (err) {
				UploadCode.reinsert(up.code);
				return;
			}

			// Upload to server
	  	fs.writeFile(newPath, bufferData, function (err) {
	  		if (err) {
					UploadCode.reinsert(up.code);
					return;
				}

				// add Upload to user
				if (userId) {
					User.findOne({fbId: userId}, function(err, user) {
						user.addUpload(up);
					})
				}

		  	var fullUrl = 'http://' + req.headers.host + '/' + up.getFullName();
		  	var uploadCode = up.code;

				console.log('upload to file ok', fullUrl, uploadCode, userId);

				callback(err, fullUrl, uploadCode);
		  });
		});
  });
}

exports.getAllUploadedFiles = getAllUploadedFiles = function(callback) {
	// http://stackoverflow.com/questions/14504385/why-cant-you-modify-the-data-returned-by-a-mongoose-query-ex-findbyid
	// Cannot modify results from Mongoose. Need to call lean() to get
	// a plain json object.
	Upload.find({}).lean().exec(function(err, allUploads) {
		allUploads.forEach(function(upload) {
			upload.date = moment(upload.date).format('DD-MM-YY, hh:mm');
		});
		if (callback) callback(err, allUploads);
	});
}

exports.removeUpload = removeUpload = function(upload, callback) {
	console.log("Going to delete ", upload.code);

	try {
		// Remove file on disk
		fs.unlinkSync(UPLOAD_DIR + '/' + upload.code + '.' + upload.ext);
	} catch (err) {
		console.log(err);
	}

	// Remove in DB
	upload.remove(function(err) {
		if (callback) callback(err, true);

		// Remove also from user's list
		if (upload.userId) {
			User.findOne({fbId: upload.userId}, function(err, user) {
				user.removeUpload(upload);
			})
		}

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

exports.getUpload = function(uploadInfo, callback) {
	Upload.findOne(uploadInfo, function(err, upload) {
		if (callback) callback(err, upload);
	});
}

exports.purgeUploadFolder = purgeUploadFolder = function(callback) {
	// Remove all entries from database
	Upload.find({}).remove();

	UploadCode.purgeDB();
	UploadCode.fillDB(CODE_MIN_LENGTH);

	// remove from user upload list
	User.update({}, { uploads: [] }, function(err, result) {
		console.log(err, result);
	});

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


function checkFilesToRemove(forceRemove) {
	var now = new Date();

	console.log("Check files to remove");

	Upload.find({}, function(err, allUploads) {
		if (!err && allUploads.length) {
			allUploads.forEach(function(upload) {
				if (!upload.userId) { // logged in uploads last forever
					if (forceRemove || (now - upload.date > UPLOAD_LIFE)) {
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