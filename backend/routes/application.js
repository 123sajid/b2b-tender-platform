const express = require('express');
const router = express.Router();
const appController = require('../controllers/applicationController');

// POST /api/applications
router.post('/', appController.submitProposal);

// GET /api/applications/:tenderId
router.get('/:tenderId', appController.getProposalsByTender);

module.exports = router;
