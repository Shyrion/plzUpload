/**
* Facebook Manager, for simpler use of facebook sdk client side.
*
* @class FacebookManager
* @constructor
*/
define([], function() {
	var FacebookManager = function() {

		this.currentUser = {};

		this.appId = '';
		this.channelUrl = '';
		this.locale = '';
		this.serverAuthUrl = '';

		this.ready = false;

		this.onLoginStatusConnectedCB = null;
		this.onLoginStatusNotAuthorizedCB = null;
		this.onLoginStatusNotConnectedCB = null;

		this.resetCurrentUser = function() {
			this.currentUser = {
				id: null,
				avatar: null,
				token: null,
				permissions: [],
				pages: []
			}
		}

		this.resetCurrentUser();

		/**
		* Set the authorisation the user already granted for this app
		*
		* @method setAuthAlreadyGranted
		* @param {Array} listAuth New auth to add
		*/
		this.setAuthAlreadyGranted = function(listAuth) {
			listAuth.forEach(function(auth) {
				if (this.currentUser.permissions.indexOf(auth) == -1)
					this.currentUser.permissions.push(auth);
			}.bind(this));
		}

		/**
		* Set the server URL to redirect to after login
		*
		* @method setServerUrl
		* @param {String} serverUrl The url to go to after login
		*/
		this.setServerValidationUrl = function(serverUrl) {
			this.serverAuthUrl = serverUrl;
		}

		/**
		* Login to facebook. Ask for auth if needed.
		*
		* @param {Function} callback A callback(bool isLoggedIn) function to be called when response is got
		* @param {String} scope String of auth needed, separated by ','. Ex: 'email, user_photos'
		*
		* @return nothing
		*/
		this.login = function(callback, scope) {

			var allAuthAlreadyGranted = true;
			var scopeArray = scope.split(',');
			if (this.currentUser.permissions.length && scope != '') {
				// We already logged in before, so maybe we do not need to login again
				scopeArray.forEach(function(auth) {
					if (this.currentUser.permissions.indexOf(auth.trim()) == -1) {
						console.log('New permission asked : ', auth);
						allAuthAlreadyGranted = false;
					}
				}.bind(this));
			}
				

			// If we have this.currentUser set <=> already logged in
			// We just need to forward to the server
			// /!\ Except if we are asking for a new scope !
			if (this.currentUser && this.currentUser.id && this.currentUser.token && allAuthAlreadyGranted) {
				if (this.serverAuthUrl != '') {
							
					console.log('Logged in already. Notifying the server...');
					
					var postData = {
						userID: this.currentUser.id,
						accessToken: this.currentUser.token
					}

					$.ajax(this.serverAuthUrl, {
			        type: 'POST',
			        data: postData,
			        complete: function(result) {
			        	var resultJSON = JSON.parse(result.responseText);
			        	if (resultJSON.result == 'ok') {
									this.checkUserStatus(function(status) {
										if (callback) callback(true);
									})
			        	} else {
			        		// TODO : display error message
			        		if (callback) callback(false);
			        	}
			        }.bind(this)
			    });
				}
				return;
			}

			FB.login(function(response) {
				if (!this.ready) {
					console.error("FB SDK not ready !");
					if (callback) callback(false);
					return;
				}

				if (response.authResponse) {
					// If we have a serverAuthUrl, directly redirect to the server
					if (this.serverAuthUrl != '') {
						
						// Login on FB worked on client at least, we can add the auth we have for this app
						this.checkUserStatus(function(status) {
							console.log('Notifying the server...');
							
							$.ajax(this.serverAuthUrl, {
					        type: 'POST',
					        data: response.authResponse,
					        complete: function(result) {
					        	var resultJSON = JSON.parse(result.responseText);
					        	console.log('Result from server : ', resultJSON);
					        	if (resultJSON.result == 'ok') {
					        		// TODO : display success message
					        		if (callback) callback(true);
					        	} else {
					        		// TODO : display error message
					        		if (callback) callback(false);
					        	}
					        }
					    });
						}.bind(this));
					} else {
						// No redirection to the server, we can execute the callback
						this.checkUserStatus(function(status) {
							if (callback) callback(true);
						});
					}
				} else {
					if (callback) callback(false);
					console.log('User cancelled login or did not fully authorize.');
				}
			}.bind(this), {scope: scope});
		}

		/**
		* Logout from the app only (deauthorize permissions, in fact). User is still logged on facebook.com
		*
		* @param {Function} callback A callback function to be called when response is got
		*
		* @return nothing
		*/
		this.logout = function(callback) {
			/*var expireTokenUrl = 'https://api.facebook.com/restserver.php?method=auth.expireSession& ' +
													'format=json&access_token=' + this.currentUser.token;*/
			// The above method do not work, it seems

			var permissionsUrl = 'https://graph.facebook.com/me/permissions?access_token=' +
													this.currentUser.token;

			$.ajax(permissionsUrl, {
	        type: 'DELETE',
	        complete: function(result) {
            if (result.responseText == "true" && result.statusText == "OK") {
            	this.resetCurrentUser();
            }
            if (callback) callback(result.responseText == "true" && result.statusText == "OK");
	        }.bind(this)
	    });
		}

		/**
		* Real logout from facebook. Even after accessing facebook.com, the user will be
		* logged out
		*
		* @param {Function} callback A callback function to be called when response is got
		*
		* @return nothing
		*/
		this.logoutFromFacebook = function(callback) {
			FB.logout(function(response) {
				if (!this.ready) {
					console.err("FB SDK not ready !");
					if (callback) callback(false);
					return;
				}

				if (this.serverAuthUrl != '') {
						
					console.log('Notifying the server for logout...');

					var postData = {};
					postData.askForLogout = true;
					
					$.ajax(this.serverAuthUrl, {
			        type: 'POST',
			        data: postData,
			        complete: function(result) {
			        	var resultJSON = JSON.parse(result.responseText);
			        	if (resultJSON.result == 'ok') {
			        		// TODO : display success message
	            		this.currentUser = null;
									if (callback) callback(true);
			        	} else {
			        		// TODO : display error message
			        		if (callback) callback(false);
			        	}
			        }
			    });
				}
			}.bind(this));
		}

		/**
		* Checks the user status. Internally set this.currentUser object for easier access
		*
		* @param {Function} callback A callback(statusString) function to be called when response is got
		*
		* @return nothing
		*/
		this.checkUserStatus = function(callback) {
			FB.getLoginStatus(function(response) {
				/*{
			    status: 'connected',
			    authResponse: { accessToken: '...',  expiresIn:'...', signedRequest:'...', userID:'...' }
				} */

				this.currentUser.id = response.authResponse && response.authResponse.userID;
				this.currentUser.token = response.authResponse && response.authResponse.accessToken;

				var status = ( (response.status == 'connected') && 'connected' ) ||
										( (response.status == 'not_authorized') && 'notAuthorized' ) ||
										'notConnected';

				if (status == 'connected') {
					// If we're logged in, we get the permissions
					this.getUserPermissions(function(permissions) {
						if (callback) callback(status);
					})
				} else {
					if (callback) callback(status);
				}
			}.bind(this), true); // true to avoid cached data
		}

		/**
		* Simple alias to graph request /me. Check if the user is logged in
		*
		* @param {Function} callback A callback function to be called when response is got
		*
		* @return nothing
		*/
		this.getUserInfo = function(callback) {
			if (!this.currentUser.id && !this.currentUser.token) { // User not logged in
				console.error("Trying to get info without being logged !");
				return;
			}

			FB.api('/me', function(response) {
				if (callback) callback(response);
			});
		}

		/**
		* Simple alias to graph request /me/accounts. Check if the user is logged in
		*
		* @param {Function} callback A callback function to be called when response is got
		*
		* @return nothing
		*/
		this.getUserAccounts = function(callback) {
			if (!this.currentUser.id && !this.currentUser.token) { // User not logged in
				console.error("Trying to get info without being logged !");
				return;
			}

			FB.api('/me/accounts', function(response) {
				if (response.data && response.data.length) {
					// parse all accounts that are returned
					response.data.forEach(function(account) {
						if (account.category == 'App page' || account.category == 'Community') {
							// need to check if we do not have it already
							var alreadyHavePage = false;
							this.currentUser.pages.forEach(function(userPage) {
								if (userPage.id == account.id) {
									alreadyHavePage = true;
								}
							});
							if (!alreadyHavePage) this.currentUser.pages.push(account);
						}
					}.bind(this));
				}

				if (callback) callback(response.data);
			}.bind(this));
		}

		/**
		* Simple alias to graph request /me/accounts. Check if the user is logged in
		*
		* @param {Function} callback A callback function to be called when response is got
		*
		* @return nothing
		*/
		this.getUserPage = function(pageName, callback) {

			function _getUserPage(pageName, callback) {
				var found = false;

				this.currentUser.pages.forEach(function(userPage) {
					if (userPage.name.indexOf(pageName) != -1) {
						found = true;
						if (callback) callback(userPage);
					}
				}.bind(this));

				// If we did not found it, callback with false
				if (!found) if (callback) callback(false);
			}

			if (!this.currentUser.pages.length) {
				// Calling getUserAccount BEFORE getUserPage is mandatory.
				// We call it if needed
				console.log("Fetching user accounts...");
				this.getUserAccounts(function() {
					_getUserPage.call(this, pageName, callback);
				}.bind(this));
			} else {
				_getUserPage.call(this, pageName, callback);
			}
		}

		/**
		* Simple alias to graph request /me. Check if the user is logged in
		*
		* @param {Function} callback A callback(permissionsArray) function to be called when response is got
		*
		* @return nothing
		*/
		this.getUserPermissions = function(callback) {
			if (!this.currentUser.id && !this.currentUser.token) { // User not logged in
				console.error("Trying to get info without being logged !");
				return;
			}

			var permissionsUrl = 'https://graph.facebook.com/' + this.currentUser.id +
														'/permissions?access_token=' + this.currentUser.token

			$.ajax(permissionsUrl, {
	        type: 'GET',
	        complete: function(result) {
	        	var resultJSON = JSON.parse(result.responseText);
	        	if (resultJSON.data && resultJSON.data.length) {
	        		// data is an array with 1 object : [{ 'perm1' : 1, 'perm2' : 1, ... }]
	        		var permissionsArray = [];
	        		for (var key in resultJSON.data[0]) {
	        			if (resultJSON.data[0][key] == 1) {
	        				permissionsArray.push(key);
	        			}
	        		}
	        		this.setAuthAlreadyGranted(permissionsArray);
	        		if (callback) callback(permissionsArray);
	        	} else {
	        		if (callback) callback([]);
	        	}
	        }.bind(this)
	    });
		}

		/**
		* Upload a photo in album (+ message on wall)
		*
		* @method uploadPhotoFromUrl
		* @param {String} url The url to go to after login
		* @param {String} message The url to go to after login
		* @param {Function} callback A callback function to be called when response is got
		*/
		this.uploadPhotoFromUrl = function(url, message, callback) {
			// First of all, we login with photo_upload right.
			// This way, we do not need to "approve" photo after upload and we get message on wall !
			this.login(function(isLoggedIn) {
				var data = {
					url: url,
					message: message
				}
				
				// Only continue if we have the permission to upload
				if (this.currentUser.permissions.indexOf('photo_upload') != -1) {
					FB.api('/me/photos', 'post', data, function(response) {
						if (!response || response.error) {
							if (response.error.code == 200) {
								 // Not authorized to upload... Need to login with auth again
								console.log('Need photo_upload rights, login-in');
								this.uploadPhotoFromUrl(url, message, callback);
							} else {
								console.log("Other error : ", response.error);
								if (callback) callback(response.error, false);
							}
						} else {
							console.log("upload ok : ", response);
							if (callback) callback(null, true);
						}
					}.bind(this));
				} else {
					// TODO: Error message
					console.log('Not authorized to upload photo without need of approval (shitty)');
				}
			}.bind(this), 'photo_upload');
		}

		/**
		* Share on the wall
		*
		* @method share
		* @param {String} url The url to go to after login
		* @param {String} message The url to go to after login
		* @param {Function} callback A callback function to be called when response is got
		*/
		this.share = function(message, imageUrl, link, caption, description, callback) {
			// First of all, we login with photo_upload right.
			// This way, we do not need to "approve" photo after upload and we get message on wall !
			this.login(function(isLoggedIn) {
				var data = {
					message: message,
					picture: imageUrl,
					link: link,
					caption: caption,
					description: description
				}
				
				// Only continue if we have the permission to upload
				if (this.currentUser.permissions.indexOf('publish_stream') != -1) {
					FB.api('/me/feed', 'post', data, function(response) {
						if (!response || response.error) {
							if (response.error.code == 200) {
								 // Not authorized to upload... Need to login with auth again
								console.log('Need publish_stream rights, login-in');
								this.uploadPhotoFromUrl(message, url, link, callback);
							} else {
								console.log("Other error : ", response.error);
								if (callback) callback(response.error, false);
							}
						} else {
							console.log("publish ok : ", response);
							if (callback) callback(null, true);
						}
					}.bind(this));
				} else {
					// TODO: Error message
					console.log('Not authorized to upload photo without need of approval (shitty)');
				}
			}.bind(this), 'publish_stream');
		}

		/**
		* Upload a photo on a Facebook page (+ message on wall)
		*
		* @method uploadPhotoFromUrl
		* @param {String} url The url to go to after login
		* @param {String} message The url to go to after login
		* @param {Function} callback A callback function to be called when response is got
		*/
		this.uploadPhotoOnPage = function(pageId, pageName, url, message, callback) {
			// First of all, we login with publish_stream and manage_pages right.
			this.login(function(isLoggedIn) {
				// Only continue if we have the permission to upload
				if (this.currentUser.permissions.indexOf('manage_pages') != -1) {

					this.getUserPage(pageName, function(page) {
						var data = new FormData();
						data.append("message", message);
						data.append("url", url);
						data.append("access_token", page.access_token || "NO_TOKEN");

						$.ajax({
						    url: 'https://graph.facebook.com/'+pageId+'/photos',
						    data: data,
						    cache: false,
						    contentType: false,
						    processData: false,
						    type: 'POST',
						    success: function(response) {
						    	if (!response || response.error) {
										if (response.error.code == 200) {
											 // Not authorized to upload... Need to login with auth again
											console.log('Need photo_upload rights, login-in');
											this.uploadPhotoOnPage(pageId, url, message, callback);
										} else {
											console.log("Other error : ", response.error);
											if (callback) callback(response.error, false);
										}
									} else {
										console.log("upload ok : ", response);
										if (callback) callback(null, true);
									}
						    },
						    error: function(response) {
						    	if (callback) callback(response.responseJSON.error, false);
						    }

						});
					}.bind(this))
				} else {
					// TODO: Error message
					console.warn('Not authorized to upload to page. Try again later');
				}
			}.bind(this), 'publish_stream,manage_pages,photo_upload');
		}

		/**
		* Init the FacebookManager object
		*
		* @param {Object} params Info like appId, channelUrl, locale,...
		* @param {Function} onUserStatusCB A callback function to be called when sdk is loaded
		*
		* @return nothing
		*/
		this.init = function(params, onSDKLoaded) {
			this.appId = params.appId;
			this.channelUrl = params.channelUrl || '';
			this.locale = params.locale || 'en_US';

			// Load the SDK asynchronously
			$.getScript('//connect.facebook.net/'+this.locale+'/all.js', function() {
		    FB.init({
		      appId: this.appId,
		      channelUrl: this.channelUrl,
		      status: true,
		      xfbml: true // parse the page looking for facebook tags
		    });

		    this.ready = true;

		    if (onSDKLoaded) onSDKLoaded();
			}.bind(this));
		}
	}

	return FacebookManager;
});