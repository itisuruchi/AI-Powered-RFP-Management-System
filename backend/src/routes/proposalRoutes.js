const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');

router.get('/byRfp/:rfpId', proposalController.getProposalsForRfp);
router.get('/:id', proposalController.getProposal);
router.post('/score/:id', proposalController.scoreProposalWithAI); 
router.post("/", proposalController.createProposal);
module.exports = router;
