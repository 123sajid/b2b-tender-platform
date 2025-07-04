const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, tenderController.createTender);
router.get('/', tenderController.getAllTenders);
router.get('/company/:companyId', tenderController.getTendersByCompany);
router.delete('/:id', verifyToken, tenderController.deleteTender);
router.put('/:id', verifyToken, tenderController.updateTender);

module.exports = router;
