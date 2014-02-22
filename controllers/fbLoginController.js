var https = require('https');

var admins = [
	{
		id: '100003874428105',
		username: 'jewemy.baboulinet'
	},

	{
		id: '521939382',
		username: 'j.gabriele'
	},

	{
		id: '100004467845399',
		username: 'Anthonygermain13'
	}
	
]
exports.validateFacebookLogin = function(fbData, callback) {
	var token = fbData.accessToken; // ex CAAHsZANtx9dMBALllC31UtVWTxn6ZBVWKq4uh4T83PhIQsSYwTf3EpZBSIN84ZB0t0NFON3F3bl63KGywzWeFswjAi4w4mVZB6KxYKINawcboeGfdPQ11PDlUSP2v5sr8hW0palfJKGv7FYTJW2aVSZAZA1J9bzFJUq0VR4rNDw1wmZC6Xu2UEg6izbBrCyZCykbxzA1flxjlwwZDZD
	var userId = fbData.userId; // ex 521939382

	validateTokenValidity(userId, token, function(err, result) {
		if (callback) callback(err, result);
	})
}

exports.isAdminLoggedIn = function(userId, token, callback) {

	getUserInfo(userId, token, function(err, userInfo) {
		var found = false;
		console.log(userInfo);
		if (!err) {
			admins.forEach(function(admin) {
				if ( (admin.id == userInfo.id) && (admin.username == userInfo.username) ) {
					if (callback) callback(err, true);
					found = true
					return;
				}
			});
		}
		if (!found)
			if (callback) callback(err, false);
	})
}

exports.validateTokenValidity = validateTokenValidity = function(userId, token, callback) {
	var url = 'https://graph.facebook.com/' + userId + '/friends?access_token=' + token;

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