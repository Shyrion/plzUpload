
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Upload = require('./Upload').Schema;

var UserSchema = new Schema({
	fbId: String,
	uploads: [Upload],
	email: String,
	firstname: String,
	lastname: String,
	gender: String
});

var User = mongoose.model('Users', UserSchema);

User.createUser = function createUser(userData, callback) {
	User.findOne({fbId: userData.fbId}, function(err, user) {
		if (err) {
			console.error(err);
			if (callback) callback(err, null);
		} else {
			// Create user if does not exist
			if (!user) {
				var user = new User({
					fbId: userData.fbId,
					uploads: [],
					email: userData.email,
					firstname: userData.firstname,
					lastname: userData.lastname,
					gender: userData.gender
				})
				user.save(function(err, result) {
					if (err) console.error(err);
					console.log('[New User] ', userData.firstname, userData.lastname);
					if (callback) callback(null, true);
				});
			} else {
				if (callback) callback(null, false);
			}
		}
	});
}

User.prototype.addUpload = function addUpload(upload, callback) {
	this.uploads.push(upload);
	this.save(callback);
}

User.prototype.removeUpload = function addUpload(upload, callback) {
	this.uploads.splice(this.uploads.indexOf(upload), 1);
	this.save(callback);
}

User.prototype.purgeUploads = function purgeUploads(callback) {
	this.uploads = [];
	this.save(callback);
}

module.exports = User;
