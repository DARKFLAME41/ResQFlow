const express = require('express');
const router = express.Router();
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateStatus,
  assignResponder,
  acceptIncident,
  deleteIncident,
  resetDemoIncidents
} = require('../controllers/incidentController');

router.post('/', createIncident);
router.get('/', getIncidents);
router.get('/reset-demo', resetDemoIncidents);
router.get('/:id', getIncidentById);
router.put('/:id/status', updateStatus);
router.post('/:id/assign', assignResponder);
router.post('/:id/accept', acceptIncident);
router.delete('/:id', deleteIncident);

module.exports = router;
