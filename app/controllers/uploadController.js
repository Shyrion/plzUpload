var fs = require('fs');
var Upload = require('../models/Upload');
var ObjectID = require('mongodb').ObjectID;

var UPLOAD_DIR = __dirname + "/../../public/upload"
var MAX_UPLOAD = 10; // TODO: Change for 3 or 5
var ID_LENGTH = 5;
var UPLOAD_LIFE = 2 * 24 * 3600 * 1000; // 48h
var CHECK_FREQUENCY = 3600 * 1000 // 1h

var syllables = ['a', 'za', 'ra', 'ta', 'ya', 'pa', 'qa', 'sa', 'da', 'fa', 'ga', 'ja', 'ka', 'la',
	'ma', 'wa', 'xa', 'ca', 'va', 'ba', 'na',
	'e', 'ze', 're', 'te', 'ye', 'pe', 'qe', 'se', 'de', 'fe', 'ge', 'je', 'ke', 'le',
	'me', 'we', 'xe', 'ce', 've', 'be', 'ne',
	'i', 'zi', 'ri', 'ti', 'yi', 'pi', 'qi', 'si', 'di', 'fi', 'gi', 'ji', 'ki', 'li',
	'mi', 'wi', 'xi', 'ci', 'vi', 'bi', 'ni',
	'o', 'zo', 'ro', 'to', 'yo', 'po', 'qo', 'so', 'do', 'fo', 'go', 'jo', 'ko', 'lo',
	'mo', 'wo', 'xo', 'co', 'vo', 'bo', 'no',
	'u', 'zu', 'ru', 'tu', 'yu', 'pu', 'qu', 'su', 'du', 'fu', 'gu', 'ju', 'ku', 'lu',
	'mu', 'wu', 'xu', 'cu', 'vu', 'bu', 'nu',
	'ou', 'zou', 'rou', 'tou', 'you', 'pou', 'qou', 'sou', 'dou', 'fou', 'gou', 'jou', 'kou', 'lou',
	'mou', 'wou', 'xou', 'cou', 'vou', 'bou', 'nou',
	'oo', 'zoo', 'roo', 'too', 'yoo', 'poo', 'qoo', 'soo', 'doo', 'foo', 'goo', 'joo', 'koo', 'loo',
	'moo', 'woo', 'xoo', 'coo', 'voo', 'boo', 'noo'/*,
	'y', 'zy', 'ry', 'ty', 'yy', 'py', 'qy', 'sy', 'dy', 'fy', 'gy', 'jy', 'ky', 'ly',
	'my', 'wy', 'xy', 'cy', 'vy', 'by', 'ny'*/
];

function generateName() {
	var name = '';

	allSyllableLength = syllables.length;

	while(name.length < ID_LENGTH) {
		name += syllables[Math.floor(Math.random()*allSyllableLength)];
	}

	return name;
}

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
		console.log("FINISHED READFILE");

		// Create entry in DB
	  var up = new Upload({
	  	name: fileName,
	  	code: generateName(),
	  	ip: req.connection.remoteAddress,
	  	ext: fileExtension,
	  	userId: userId,
	  	date: new Date()
	  });

	  var newPath = UPLOAD_DIR + '/' + up.code + "." + fileExtension;
	  up.save(function(err, result) {
			console.log("FINISHED SAVE");

			// Upload to server
	  	fs.writeFile(newPath, data, function (err) {
				console.log("FINISHED WRITEFILE");
		  	var uploadUrl = '/' + up.code + "." + fileExtension;
		  	var fullUrl = 'http://' + req.headers.host + uploadUrl;
		  	var uploadCode = up.code;
				callback(err, uploadUrl, fullUrl, uploadCode);
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
	});
}

exports.getUpload = getUpload = function(uploadInfo, callback) {
	Upload.findOne(uploadInfo, function(err, upload) {
		if (callback) callback(err, upload);
	});
}

exports.purgeUploadFolder = purgeUploadFolder = function(callback) {
	// Remove all entries from database
	Upload.find({}).remove();

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