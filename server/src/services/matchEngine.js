/**
 * ResQFlow Smart Resource Matching Engine
 * Matches emergency incidents with nearest available response units & hospitals
 */

// Haversine distance formula in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.5; // fallback default distance
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
}

function findMatchingResources(incident, resources, responders = []) {
  const incLat = incident.location?.latitude || 12.9716;
  const incLon = incident.location?.longitude || 77.5946;
  const reqTypes = incident.requiredResources || [];

  const matchedResources = resources.map(resource => {
    const dist = calculateDistance(incLat, incLon, resource.latitude, resource.longitude);
    let typeMatch = 15;

    // Type matching priority logic
    const resType = resource.type.toLowerCase();
    const incType = incident.type.toLowerCase();

    if (incType.includes('road') || incType.includes('medical')) {
      if (resType.includes('ambulance') || resType.includes('hospital')) typeMatch = 40;
      else if (resType.includes('police')) typeMatch = 25;
    } else if (incType.includes('fire') || incType.includes('collapse')) {
      if (resType.includes('fire')) typeMatch = 40;
      else if (resType.includes('ambulance')) typeMatch = 30;
    } else if (incType.includes('crime')) {
      if (resType.includes('police')) typeMatch = 40;
      else if (resType.includes('ambulance')) typeMatch = 20;
    } else if (incType.includes('disaster')) {
      if (resType.includes('shelter') || resType.includes('rescue')) typeMatch = 40;
    }

    // Availability score
    const availScore = resource.availability === 'Available' ? 30 : 5;

    // Distance penalty (farther resources get lower score)
    const distanceScore = Math.max(0, 30 - dist * 4);

    const matchScore = Math.round(typeMatch + availScore + distanceScore);

    let reason = `${dist} km away • ${resource.availability}`;
    if (matchScore >= 80) reason = `Top Match • ${dist} km away • High Capacity (${resource.capacity})`;

    return {
      ...resource,
      distanceKm: dist,
      matchScore,
      recommendationReason: reason
    };
  });

  // Sort descending by match score
  matchedResources.sort((a, b) => b.matchScore - a.matchScore);

  // Match available Responders as well
  const matchedResponders = responders.map(resp => {
    const dist = calculateDistance(incLat, incLon, resp.latitude, resp.longitude);
    const availScore = resp.availability === 'Available' ? 30 : 10;
    const workloadPenalty = (resp.currentWorkload || 0) * 5;
    const matchScore = Math.round(Math.max(10, 60 + availScore - dist * 3 - workloadPenalty));

    return {
      ...resp,
      distanceKm: dist,
      matchScore,
      recommendationReason: `${dist} km away • ${resp.availability} • Current Workload: ${resp.currentWorkload || 0}`
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return {
    recommendedResources: matchedResources.slice(0, 4),
    recommendedResponders: matchedResponders.slice(0, 3)
  };
}

module.exports = {
  calculateDistance,
  findMatchingResources
};
