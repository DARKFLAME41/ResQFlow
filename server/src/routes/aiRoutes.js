const express = require('express');
const router = express.Router();
const { analyzeText, analyzeImage, generateFollowUp } = require('../controllers/aiController');

router.post('/analyze', analyzeText);
router.post('/analyze-image', analyzeImage);
router.post('/follow-up', generateFollowUp);

module.exports = router;
