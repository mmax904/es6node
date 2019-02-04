import createError from 'http-errors';
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
//import layout from 'express-layout';
import validator from 'express-validator';
import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import session from 'express-session';
import flash from 'express-flash';
import helmet from 'helmet';
import csrf from 'csurf';
import multer from 'multer';

/**for storing in memory as buffer
 *const upload = multer({ storage: multer.memoryStorage() })
 */
const upload = multer({ dest: 'uploads/' })

import Reflection from './src/controllers/Reflection';

const port = 3000;
const app = express();

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

/*import indexRouter from './routes/index';
import usersRouter from './routes/users';*/

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
})

app.get('/', function(req, res, next) {
  	res.render('layouts/index', { title: 'Express' });
});

app.get('/contact', (req, res) => {
	res.render('layouts/index', {
		section:'../contact',
		data: {},
	    errors: {},
	    csrfToken: req.csrfToken()
	})
})

app.post('/contact', upload.single('photo'), [
	check('message')
		.isLength({ min: 1 })
		.withMessage('Message is required')
		.trim(),
	check('email')
		.isEmail()
		.withMessage('That email doesn‘t look right')
		.trim()
		.normalizeEmail()
	], (req, res) => {
	console.log(req.body);
	const errors = validationResult(req)
	
	if (!errors.isEmpty()) {
		return res.render('layouts/index', {
			section:'../contact',
			data: req.body,
			errors: errors.mapped(),
			csrfToken: req.csrfToken()
		})
	}

	const data = matchedData(req)
	console.log('Sanitized: ', data)
	if (req.file) {
		console.log('Uploaded: ', req.file)
		// Homework: Upload file to S3
	}
	req.flash('success', 'Thanks for the message! I‘ll be in touch :)')
	res.redirect('/')
})

app.get('/api/v1/test', (req, res) => {
  	return res.status(200).send({'message': 'YAY! Congratulations! Your first endpoint is working'});
});

app.post('/api/v1/reflections', Reflection.create);
app.get('/api/v1/reflections', Reflection.getAll);
app.get('/api/v1/reflections/:id', Reflection.getOne);
app.put('/api/v1/reflections/:id', Reflection.update);
app.delete('/api/v1/reflections/:id', Reflection.delete);

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


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});