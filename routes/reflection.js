import express from 'express';
var router = express.Router();
import Reflection from '../src/controllers/Reflection';

router.post('/', Reflection.create);
router.get('/', Reflection.getAll);
router.get('/:id', Reflection.getOne);
router.put('/:id', Reflection.update);
router.delete('/:id', Reflection.delete);

module.exports = router;