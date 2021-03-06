var express 		= require('express');
var bodyParser  = require('body-parser');
var utils				= require('./app/lib/utils');
var useragent 	= require('useragent');

function setupMongoose(callback) {
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/plzUpload', function(err) {
		if (err) {
			console.log("COULD NOT START SERVER : ", err);
			process.exit(0);
		} else {
			mongoose.connection.on('error', function(err, a) {
				console.log(err, a);
			});
			if (callback) callback(mongoose);
		}
	});
}

function setupRoutes(app, callback) {
	// Routes setup
	require('./config/routes')(app);

	if (callback) callback(app);
}

function setupExpress(callback) {

	var app = express();

	//===== Configuration =====//

	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/app/views');

	app.use(express.static(__dirname + "/public"));
	app.use(express.static(__dirname + "/public/upload"));

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());


	app.use(express.methodOverride());
	app.use(express.cookieParser('Node JS is quite cool'));
	app.use(express.session({ cookie: { maxAge: 3*60*60*1000 }}));
	//app.use(utils.userAuthCheck(app)); // add req.isUserLogged boolean
	app.use(utils.moreRender(app));

	app.locals.title = 'Plz Upload';
	app.locals.projectName = 'PlzUpload';

	if ('development' == app.get('env')) {
		app.set('port', 3112);
		//app.use(express.logger());
	} else if ('production' == app.get('env')) {
		app.set('port', 80);
	}


	function isClientSupported(req, res, next) {

		useragent(true);
		var ua = useragent.is(req.headers['user-agent']);

		if (ua.ie || ua.safari || ua.android ||  ua.mobile_safari) {
			res.render('wrongBrowser');
		} else {
			next();
		}
	}
	app.use(isClientSupported);

	if (callback) callback(app);
}

function startServer(app) {
	app.listen(app.get('port'), function() {
		console.log('Server is running on port ' + app.get('port'));
	});
}

setupMongoose(function() {
	setupExpress(function(app) {
		setupRoutes(app, function(app) {
			startServer(app);
		});
	});
});