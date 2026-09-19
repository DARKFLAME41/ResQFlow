const express = require('express');
const router = express.Router();
const { getMetrics } = require('../controllers/analyticsController');

router.get('/', getMetrics);

module.exports = router;
