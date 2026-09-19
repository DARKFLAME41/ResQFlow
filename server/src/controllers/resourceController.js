const dbStore = require('../models/dbStore');
const { calculateDistance } = require('../services/matchEngine');

function getAllResources(req, res) {
  try {
    const { type, availability } = req.query;
    let list = [...dbStore.data.resources];

    if (type) {
      list = list.filter(r => r.type.toLowerCase().includes(type.toLowerCase()));
    }
    if (availability) {
      list = list.filter(r => r.availability.toLowerCase() === availability.toLowerCase());
    }

    res.json({ resources: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
}

function getNearbyResources(req, res) {
  try {
    const lat = parseFloat(req.query.lat) || 12.9716;
    const lon = parseFloat(req.query.lon) || 77.5946;

    const withDist = dbStore.data.resources.map(r => ({
      ...r,
      distanceKm: calculateDistance(lat, lon, r.latitude, r.longitude)
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ resources: withDist });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nearby resources' });
  }
}

module.exports = {
  getAllResources,
  getNearbyResources
};
