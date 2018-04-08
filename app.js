require('babel-register');
require('babel-polyfill');
const debug = require('debug')('draft:server');
const http = require('http');
const appConfig = require('./config.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const express = require('express');
// The session will expire after an hour of inactivity (3600000 ms)
const expressSession = require('express-session')({
	secret: appConfig.expressSession.secret,
	resave: true,
	rolling: true,
	cookie: { expires: 3600000 },
	saveUninitialized: true,
});
const favicon = require('serve-favicon');
const LocalStrategy = require('passport-local');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.babel');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const User = require('./routes/dbModels/User');

// route files
const index = require('./routes/index');
const api = require('./routes/index');
const account = require('./routes/Account');
const drafts = require('./routes/Drafts');
const infos = require('./routes/Infos');
const app = express();

// Connect to Mongoose
mongoose.connect(`mongodb://${appConfig.mongoose.mongodb}`);
// Feed the initial data to DB. This should be commented once done.
const initialData = require('./routes/dbModels/InitialData');
initialData();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// https://michalzalecki.com/optimize-react-build-for-production-with-webpack/#compress-with-gzip
app.use(compression({
	level: 6, // set compression level from 1 to 9 (6 by default)
}));

if (process.env.NODE_ENV === 'production') {
	app.get('*.js', (req, res, next) => {
		req.url = `${req.url}.gz`;
		res.set('Content-Encoding', 'gzip');
		res.set('Content-Type', 'text/javascript');
		next();
	});
	app.get('*.css', (req, res, next) => {
		req.url = `${req.url}.gz`;
		res.set('Content-Encoding', 'gzip');
		res.set('Content-Type', 'text/css');
		next();
	});
}

app.use(favicon(path.join(__dirname, 'src', 'shared', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// Webpack Server
if (process.env.NODE_ENV !== 'production') {
	const webpackCompiler = webpack(webpackConfig);
	app.use(webpackDevMiddleware(webpackCompiler, {
		publicPath: webpackConfig.output.publicPath,
		stats: {
			colors: true,
			chunks: true,
			'errors-only': true,
		},
	}));
	app.use(webpackHotMiddleware(webpackCompiler, {
		log: console.log,
	}));
}

app.use('/api', api);
app.use('/api/account', account);
app.use('/api/drafts', drafts);
app.use('/api/infos', infos);
app.use('/*', index);

// Configure Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// Normalize a port into a number, string, or false.
function normalizePort(val) {
	const port = parseInt(val, 10);
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	if (port >= 0) {
		// port number
		return port;
	}
	return false;
}
// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);
// Create HTTP server.
const server = http.createServer(app);
// Listen on provided port, on all network interfaces.
server.listen(port);
// Set timeout for api calls to 1 minute.
server.timeout = 60000;
// Event listener for HTTP server "error" event.
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const bind = typeof port === 'string'
		? `Pipe ${port}`
		: `Port ${port}`;
	// Handle specific listen errors with friendly messages
	switch (error.code) {
	case 'EACCES':
		console.error(`${bind} requires elevated privileges`);
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.error(`${bind} is already in use`);
		process.exit(1);
		break;
	default:
		throw error;
	}
}
// Event listener for HTTP server "listening" event.
function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? `pipe ${addr}`
		: `port ${addr.port}`;
	debug(`Listening on ${bind}`);
}
server.on('error', onError);
server.on('listening', onListening);

