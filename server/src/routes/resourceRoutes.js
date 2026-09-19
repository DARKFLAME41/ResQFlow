const express = require('express');
const router = express.Router();
const { getAllResources, getNearbyResources } = require('../controllers/resourceController');

router.get('/', getAllResources);
router.get('/nearby', getNearbyResources);

module.exports = router;
