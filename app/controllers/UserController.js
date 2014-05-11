var User = require('../models/User');

exports.createUser = function(userData, callback) {

	User.createUser({
		fbId: userData.id,
		email: userData.email,
		firstname: userData.first_name,
		lastname: userData.last_name,
		gender: userData.gender
	}, callback);

}

exports.purgeUsers = function purgeUsers(callback) {
	User.find({}).remove(callback);
}

exports.getAllUsers = function getAllUsers(callback) {
	User.find({}, callback);
}

exports.getUploads = function(userId, callback) {
	User.findOne({fbId: userId}, function(err, user) {
		if (callback) callback(err, user.uploads);
	})
}