const dbStore = require('../models/dbStore');
const { calculateDistance } = require('../services/matchEngine');

function getAllResponders(req, res) {
  try {
    const { type, availability } = req.query;
    let list = [...dbStore.data.responders];

    if (type) {
      list = list.filter(r => r.type.toLowerCase().includes(type.toLowerCase()));
    }
    if (availability) {
      list = list.filter(r => r.availability.toLowerCase() === availability.toLowerCase());
    }

    res.json({ responders: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch responders' });
  }
}

function getNearbyResponders(req, res) {
  try {
    const lat = parseFloat(req.query.lat) || 12.9716;
    const lon = parseFloat(req.query.lon) || 77.5946;

    const withDist = dbStore.data.responders.map(r => ({
      ...r,
      distanceKm: calculateDistance(lat, lon, r.latitude, r.longitude)
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ responders: withDist });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nearby responders' });
  }
}

function updateResponderStatus(req, res) {
  try {
    const { id } = req.params;
    const { availability, currentWorkload, latitude, longitude } = req.body;

    const responder = dbStore.data.responders.find(r => r.id === id || r.userId === id);
    if (!responder) {
      return res.status(404).json({ error: 'Responder not found' });
    }

    if (availability) responder.availability = availability;
    if (typeof currentWorkload === 'number') responder.currentWorkload = currentWorkload;
    if (latitude) responder.latitude = latitude;
    if (longitude) responder.longitude = longitude;

    dbStore.save();
    res.json({ message: 'Responder status updated', responder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update responder status' });
  }
}

module.exports = {
  getAllResponders,
  getNearbyResponders,
  updateResponderStatus
};
