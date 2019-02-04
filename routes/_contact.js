import express from 'express';
var router = express.Router();
import multer from 'multer';
import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

/**for storing in memory as buffer
 *const upload = multer({ storage: multer.memoryStorage() })
 */
const upload = multer({ dest: 'uploads/' })

/* GET contacts page. */
router.get('/', (req, res) => {
	res.render('layouts/index', {
		section:'../contact',
		data: {},
	    errors: {},
	    csrfToken: req.csrfToken()
	})
})

router.post('/', upload.single('photo'), [
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
});

module.exports = router;