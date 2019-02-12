process.env.NODE_ENV = 'dev';
var NodeEnviRonment = '.env.'+process.env.NODE_ENV;

import dotenv from 'dotenv';
dotenv.config({path: NodeEnviRonment});

import createError from 'http-errors';
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import layout from 'express-layout';
import validator from 'express-validator';
import session from 'express-session';
import flash from 'express-flash';
import helmet from 'helmet';
import csrf from 'csurf';
import "babel-polyfill";

// environment variables
process.env.NODE_ENV = 'development';

// uncomment below line to test this code against staging environment
// process.env.NODE_ENV = 'staging';

// config variables
import config from './config/config.js';
import mysqlcon from './config/MySQL';

const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
process.env.TZ = process.env.SERVER_TIMEZONE;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
/*app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts') }));
app.set('view engine', 'hbs');*/
app.set('view engine', 'ejs');

const middlewares = [
	validator(),
	session({
		secret: 'super-secret-key',
		key: 'super-secret-cookie',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 60000 }
	}),
	flash(),
	helmet(),
	csrf({ cookie: true })
]


//app.use(layout());
app.use(logger('dev'));

/*app.use(express.json());
app.use(express.urlencoded({ extended: false }));*/

app.use(cookieParser());

app.use(middlewares);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(function (req, res, next) {
	res.cookie('XSRF-TOKEN', req.csrfToken());
	res.locals.csrfToken = req.csrfToken();
	res.locals.title = 'Express Ejs';
	res.locals.section = '../index';
	next();
});

/** 
* bodyParser.urlencoded(options)
* Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
* and exposes the resulting object (containing the keys and values) on req.body
*/
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 1000000
}));

/**
 * bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json({limit: '50mb'}));

/**
 * parse application/vnd.api+json as json
 */
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

import indexRouter from './routes/index';
import contactRouter from './routes/contact';
import reflectionRouter from './routes/reflection';

app.use('/', indexRouter);
app.use('/contact', contactRouter);
app.use('/api/v1/reflections', reflectionRouter);
app.get('/api/v1/test', (req, res) => {
  	return res.status(200).send({'message': 'YAY! Congratulations! Your first endpoint is working'});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;