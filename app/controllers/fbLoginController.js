var https = require('https');

var admins = [
	{
		id: '100003874428105'
	},

	{
		id: '521939382'
	}

]
exports.validateFacebookLogin = function(fbData, callback) {
	var token = fbData.accessToken; // ex CAAHsZANtx9dMBALllC31UtVWTxn6ZBVWKq4uh4T83P...
	var userId = fbData.userId; // ex 521939382

	validateTokenValidity(userId, token, function(err, result) {
		if (callback) callback(err, result);
	})
}

exports.isAdminLoggedIn = function(userId, token, callback) {

	getUserInfo(userId, token, function(err, userInfo) {
		var found = false;
		if (!err) {
			admins.forEach(function(admin) {
				if ( admin.id == userInfo.id) {
					if (callback) callback(err, true);
					found = true
					return;
				}
			});
		}
		if (!found) {
			if (callback) callback(err, false);
		}
	})
}

exports.validateTokenValidity = validateTokenValidity = function(userId, token, callback) {
	var url = 'https://graph.facebook.com/' + userId + '?access_token=' + token;

	var req = https.get(url, function(res) {
		/*"error": { "message": "The access token could not be decrypted",
	      "type": "OAuthException", "code": 190 }*/

	  var result = '';

	  res.on('data', function(data) {
	  	var buff = new Buffer(data);
	  	result += buff.toString();
	  });

	  res.on('end', function() {
	  	var resultJSON = JSON.parse(result);

	  	if (resultJSON.error) {
	  		if (resultJSON.error.code == 190) {
	  			console.log("User Not logged");
	  		}
	  	}

			admins.forEach(function(admin) {
				if ( (admin.id == resultJSON.id) ) {
					resultJSON.admin = true;
				}
			});

	  	if (callback) callback(resultJSON.error, resultJSON);
	  })
	});

	req.on('error', function(err) {
		console.log('ERROR : ', err);
	})
}

exports.getUserInfo = getUserInfo = function(userId, token, callback) {
	var url = 'https://graph.facebook.com/me?access_token=' + token;

	var req = https.get(url, function(res) {
		/*"error": { "message": "The access token could not be decrypted",
	      "type": "OAuthException", "code": 190 }*/

	  var result = '';

	  res.on('data', function(data) {
	  	var buff = new Buffer(data);
	  	result += buff.toString();
	  });

	  res.on('end', function() {
	  	var resultJSON = JSON.parse(result);

	  	if (resultJSON.error) {
	  		if (resultJSON.error.code == 190) {
	  			console.log("AUTH FAIL");
	  		}
	  	}

	  	if (callback) callback(resultJSON.error, resultJSON);
	  })
	});

	req.on('error', function(err) {
		console.log('ERROR : ', err);
	})
}

exports.getAvatarUrl = function(userId) {
	return 'http://graph.facebook.com/' + userId + '/picture?type=square'
}