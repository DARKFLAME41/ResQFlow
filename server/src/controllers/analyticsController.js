const dbStore = require('../models/dbStore');

function getMetrics(req, res) {
  try {
    const incidents = dbStore.data.incidents;
    const total = incidents.length;
    const active = incidents.filter(i => i.status !== 'RESOLVED').length;
    const critical = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
    const resolvedToday = incidents.filter(i => i.status === 'RESOLVED').length;
    const respondersActive = dbStore.data.responders.filter(r => r.availability === 'Available' || r.currentWorkload > 0).length;

    // Type Breakdown
    const typeCounts = {};
    incidents.forEach(i => {
      typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
    });

    const byType = Object.keys(typeCounts).map(key => ({
      name: key,
      count: typeCounts[key]
    })).sort((a, b) => b.count - a.count);

    // Severity Breakdown
    const severityCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    incidents.forEach(i => {
      if (severityCounts[i.severity] !== undefined) {
        severityCounts[i.severity]++;
      }
    });

    const bySeverity = [
      { name: 'Low', value: severityCounts.LOW, color: '#10B981' },
      { name: 'Medium', value: severityCounts.MEDIUM, color: '#F59E0B' },
      { name: 'High', value: severityCounts.HIGH, color: '#EF4444' },
      { name: 'Critical', value: severityCounts.CRITICAL, color: '#DC2626' }
    ];

    // Response time distribution mock / calculated
    const avgResponseMinutes = 6.8;

    // Heatmap data points
    const heatmapPoints = incidents.map(i => ({
      id: i.incidentId,
      type: i.type,
      lat: i.location?.latitude || 12.9716,
      lng: i.location?.longitude || 77.5946,
      intensity: i.severity === 'CRITICAL' ? 1.0 : i.severity === 'HIGH' ? 0.7 : i.severity === 'MEDIUM' ? 0.4 : 0.2,
      severity: i.severity,
      address: i.location?.address
    }));

    // Resource Utilization Rate
    const totalResources = dbStore.data.resources.length;
    const availableResources = dbStore.data.resources.filter(r => r.availability === 'Available').length;
    const resourceUtilizationRate = totalResources ? Math.round(((totalResources - availableResources) / totalResources) * 100) : 45;

    res.json({
      summary: {
        totalIncidents: total,
        activeIncidents: active,
        criticalIncidents: critical,
        resolvedToday,
        respondersActive,
        avgResponseTimeMinutes: avgResponseMinutes,
        resourceUtilizationRate
      },
      byType,
      bySeverity,
      heatmapPoints,
      hourlyTrend: [
        { hour: '00:00', count: 1 },
        { hour: '04:00', count: 0 },
        { hour: '08:00', count: 3 },
        { hour: '12:00', count: 5 },
        { hour: '16:00', count: 8 },
        { hour: '20:00', count: 4 }
      ]
    });
  } catch (err) {
    console.error('Analytics metrics error:', err);
    res.status(500).json({ error: 'Failed to generate analytics metrics' });
  }
}

module.exports = {
  getMetrics
};
