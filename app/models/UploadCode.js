
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UploadCodeSchema = new Schema({
	name: String
});

var UploadCode = mongoose.model('UploadCode', UploadCodeSchema);

UploadCode.codesToProcess = [];

// TODO: code should have a "use" attribute instead of adding/removing

// re-insert code in db
UploadCode.reinsert = function reinsert(name, callback) {
	var newCode = new UploadCode({name: name});
	newCode.save(callback);
}

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
	'y', 'zy', 'ry', 'ty', 'py', 'qy', 'sy', 'dy', 'fy', 'gy', 'jy', 'ky', 'ly',
	'my', 'wy', 'xy', 'cy', 'vy', 'by', 'ny'
];

UploadCode.fillDB = function fillDB(nbDigits) {
	// TODO: be able to get codes of length 3, 5, 7, 9 when requesting 9 (for example)

	// Recursively create random word from syllabaire
	function getWordRecursive(word, count, callback) {
		if (count <= 0) {
			if (callback) callback(word);
			return;
		}
		syllables.forEach(function(syllable) {
			var newCount = count - syllable.length;
			getWordRecursive(word + syllable, newCount, callback);
		});
	}

	// Launch the algo
	getWordRecursive('', nbDigits, function(word) {
		UploadCode.findOne({name: word}, function(err, result) {
			if (err) {
				console.error(err);
			} else {
				if (result) return; // already in DB

				var upCode = new UploadCode({name: word});
				upCode.save(function(err, uploadCode) {
					if (err) {
						console.error(err);
					}
				});
			}
		});
	});
}

UploadCode.purgeDB = function purgeDB(nbDigits) {
	UploadCode.find({}).remove();
}

UploadCode.getRandomCode = function getRandomCode(callback) {
	if (!callback) return;

	UploadCode.count(function(err, count) {
		if (count <= 0) {
			var err = new Error('No more codes !');
			console.error(err);
  		if (callback) callback(err, null);
			return;
		}

  	if (err) {
  		if (callback) callback(err, null);
    } else {
    	var rand = Math.floor(Math.random() * count);
    	/*UploadCode.findOne().skip(rand).exec(function(err, uploadCode) {
    		if (UploadCode.codesToProcess.indexOf(uploadCode) != -1) { // someone already took it :/
    			console.log("Upload code already taken !");
    			if (callback) callback('Already taken', null);
    		} else {
    			if (!uploadCode) {
    				console.error("No upload code ?!", err);
    				return;
    			}

    			UploadCode.codesToProcess.push(uploadCode.name);

	    		if (uploadCode) uploadCode.take(callback);
    		}	    		
    	});*/
	  	this.findOneAndRemove().skip(rand).exec(callback);
    }
  }.bind(this));
}

module.exports = UploadCode;
