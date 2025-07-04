const express = require('express');
const router = express.Router();
const appController = require('../controllers/applicationController');
const verifyToken = require('../middleware/verifyToken');

// Submit proposal
router.post('/', verifyToken, appController.submitProposal);

// Get all proposals for a tender
router.get('/:tenderId', appController.getApplicationsByTender);

// Get all proposals by a specific company
router.get('/company/:companyId', appController.getApplicationsByCompany);

// Get all proposals by logged-in company
router.get('/my', verifyToken, appController.getApplicationsByLoggedInCompany);

module.exports = router;
