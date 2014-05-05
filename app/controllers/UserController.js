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

exports.getAllUsers = function purgeUsers(callback) {
	User.find({}, callback);
}
