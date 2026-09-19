const express = require('express');
const router = express.Router();
const { getAllResponders, getNearbyResponders, updateResponderStatus } = require('../controllers/responderController');

router.get('/', getAllResponders);
router.get('/nearby', getNearbyResponders);
router.put('/:id/status', updateResponderStatus);

module.exports = router;
