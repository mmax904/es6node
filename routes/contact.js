import express from 'express';
var router = express.Router();
import Contact from '../src/controllers/Contact';
import multer from 'multer';
import { check } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

/**for storing in memory as buffer
 *const upload = multer({ storage: multer.memoryStorage() })
 */
/**
 * Simple upload method without file extension
 */
//const upload = multer({ dest: 'uploads/' });

multer({ dest: 'uploads/contacts' });

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/contacts')
	},
	filename: function (req, file, cb) {
		//console.log('file:'+JSON.stringify(file));
		cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname );
	}
});
 
var upload = multer({ storage: storage });

/* GET contacts list. */
router.get('/', Contact.view);

router.get('/add', Contact.create);
router.post('/add', upload.single('photo'), [
	check('message')
		.isLength({ min: 1 })
		.withMessage('Message is required')
		.trim(),
	check('email')
		.isEmail()
		.withMessage('That email doesn‘t look right')
		.trim()
		.normalizeEmail()
	], 
Contact.store);

router.get('/edit/:id', Contact.edit);
router.post('/edit/:id', upload.single('photo'), [
	check('message')
		.isLength({ min: 1 })
		.withMessage('Message is required')
		.trim(),
	check('email')
		.isEmail()
		.withMessage('That email doesn‘t look right')
		.trim()
		.normalizeEmail()
	], 
Contact.update);

router.post('/:id', Contact.delete);

var uploadProfileImgs = multer({dest : 'uploads/profile/'}).single('avatar');

router.post('/profile', function (req, res) {
  uploadProfileImgs(req, res, function (err) {
    if (err) {
      console.log(err.message);
      // An error occurred when uploading
      return
    }
    console.log('Everything went fine');
    // Everything went fine
  })
})

module.exports = router;