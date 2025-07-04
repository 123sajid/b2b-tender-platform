const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // Use memory storage

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/companyController');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', upload.single('logo'), create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
