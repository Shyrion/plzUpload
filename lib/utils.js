
Object.each = function(object, callback) {
	for(var key in object) {
	   callback(object[key], key);
	}
}

// Merge obj2 into obj1 (== obj1 should be bigger after merge)
Object.merge = function(obj1, obj2) {
	Object.each(obj2, function(value, attr) {
		if (obj1[attr] == null) {
			if (typeof(value) == 'object') {
				obj1[attr] = {};
				Object.merge(obj1[attr], value);
			} else {
				obj1[attr] = value;
			}
		}
	});
}

exports.moreRender = function(app) {
	return function(req, res, next) {

		res._oldRender = res.render;

		res.render = function(viewName, options, callback) {

			if (!options) options = {};
			options.flash = req.session.flash ? req.session.flash : {};

			this._oldRender(viewName, options, callback);

			req.session.flash = null;
		}

		req.flash = function(type, value) {
			if (!req.session.flash) req.session.flash = {};

			if (!req.session.flash[type]) req.session.flash[type] = [];

			req.session.flash[type].push(value);
		}

		res.renderWithLayout = function(layout, viewName, options, callback) {

			/* 2-times rendering : 
			 *  Render the view
			 *  Copy the result html inside the layout
			 */
			this.render(viewName, options, function(err, html) {

				if (err) {
					console.log(err);
					callback(err, null);
					return;
				}

				options.body = html;
				options.page = viewName;

				options.navBarData = {};
				Object.merge(options.navBarData, app.locals.navBarData);

				// Activate the good tab
				if (options.activeTab)
					options.navBarData[options.activeTab].selected = true;
				else
					options.navBarData.Book.selected = true;

				this.render('layout', options, callback);

			}.bind(this));
		}

		next();
	}
}

exports.userAuthCheck = function() {
	return function(req, res, next) {
		
		if ( (req.cookies.username && req.cookies.password) || req.session.userId) {
			req.isUserLogged = true;

			if (req.session.userId) {
				User.findOne({_id: req.session.userId}, function(err, user) {
					if (err) {
						console.log("FUCK ! ", err);
						req.isUserLogged = false;
					} else if (!user) {
						console.log("FUCK ! No user with name ", req.cookies.username);
						req.isUserLogged = false;
					} else {
						req.session.userId = user._id;
						req.currentUser = user;
					}

					next();
				});
			} else if (req.cookies.username) {
				User.findOne({name: req.cookies.username}, function(err, user) {
					if (err) {
						console.log("FUCK ! ", err);
						req.isUserLogged = false;
					} else if (!user) {
						console.log("FUCK ! No user with name ", req.cookies.username);
						req.isUserLogged = false;
					} else {
						req.session.userId = user._id;
						req.currentUser = user;
					}

					next();
				});
			} else {
				console.log("Something's wrong here...");

				next();
			}
		} else {
			req.isUserLogged = false;
			next();
		}
	}
}

exports.cleanEmptyCollections = function(db) {
}