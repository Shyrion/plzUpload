var fs = require('fs');
var Upload = require('../models/Upload');
var ObjectID = require('mongodb').ObjectID;

var UPLOAD_DIR = __dirname + "/../public/upload"
var MAX_UPLOAD = 10;
var ID_LENGTH = 5;

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
	'mou', 'wou', 'xou', 'cou', 'vou', 'bou', 'nou'

];

function generateName() {
	var name = '';

	allSyllableLength = syllables.length;

	while(name.length < ID_LENGTH) {
		name += syllables[Math.floor(Math.random()*allSyllableLength)];
	}

	return name;
}

function checkIP(ip, callback) {
	Upload.count({ip: ip}, function(err, number) {
		callback(err, number<MAX_UPLOAD);
	});
}

exports.uploadFile = function(path, fileName, ip, req, res, callback) {

	checkIP(ip, function(err, result) {
		if (err || result) {
			var fileExtension = fileName.split('.')[fileName.split('.').length-1];
			fs.readFile(path, function (err, data) {
				console.log("FINISHED READFILE", err, data);
			  var up = new Upload({
			  	name: generateName(),
			  	ip: req.connection.remoteAddress,
			  	ext: fileExtension
			  });
			  var newPath = __dirname + "/../public/upload/" + up.name + "." + fileExtension;
			  up.save(function(err, result) {
					console.log("FINISHED SAVE", err, result);
			  	fs.writeFile(newPath, data, function (err) {
						console.log("FINISHED WRITEFILE", err);
				  	var uploadUrl = '/' + up.name + "." + fileExtension;
				  	var fullUrl = req.headers.host + uploadUrl;
				  	var uploadCode = up.name;
						callback(err, uploadUrl, fullUrl, uploadCode);
				  });
			  });
			});
		} else {
			var err = new Error('You have reached your quota for today :). Come back tomorrow !');
			callback(err, null, null);
		}
	});

}

exports.getAllUploadedFiles = getAllUploadedFiles = function(callback) {
	fs.readdir(UPLOAD_DIR, function(err, files) {
		if (err) console.log(err);

		callback(err, files);
	})
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

       console.log(now, midnight);
	
	console.log("Call function in " + timeUntilMidnight/1000 + "sec");

	setTimeout(function() {
		purgeUploadFolder(function(success) {
			console.log("It's midnight, all is removed !");
		})
		removeAllAtMidnight();
	}, timeUntilMidnight);
}

removeAllAtMidnight();
