const dbStore = require('../models/dbStore');
const { analyzeEmergency } = require('../services/aiEngine');
const { findMatchingResources } = require('../services/matchEngine');
const {
  broadcastIncidentCreated,
  broadcastIncidentUpdated,
  broadcastNotification
} = require('../services/socketService');

function createIncident(req, res) {
  try {
    const {
      type,
      description,
      voiceTranscript,
      imageAnalysis,
      location,
      answers,
      reporter
    } = req.body;

    if (!description && !voiceTranscript && !type) {
      return res.status(400).json({ error: 'Emergency description or voice input is required.' });
    }

    // Run AI Engine analysis
    const aiResult = analyzeEmergency({
      text: description || '',
      voiceTranscript: voiceTranscript || '',
      imageAnalysis,
      type,
      answers: answers || {}
    });

    const incidentCount = dbStore.data.incidents.length + 1;
    const incidentId = `RSQ-2026-${String(incidentCount).padStart(4, '0')}`;
    const id = `inc-${Date.now()}`;

    const defaultLoc = {
      address: location?.address || 'College Main Gate, 5th Avenue',
      landmark: location?.landmark || 'Near Main Entrance',
      latitude: location?.latitude || 12.9716 + (Math.random() - 0.5) * 0.02,
      longitude: location?.longitude || 77.5946 + (Math.random() - 0.5) * 0.02
    };

    const newIncident = {
      id,
      incidentId,
      reportedBy: reporter || req.user || {
        id: 'usr-anonymous',
        name: 'Citizen Anonymous',
        email: 'anonymous@resqflow.org',
        phone: '+1 (555) 000-0000'
      },
      type: aiResult.incidentType,
      description: description || voiceTranscript || 'Emergency reported via ResQFlow platform',
      voiceTranscript: voiceTranscript || null,
      imageAnalysis: imageAnalysis || null,
      location: defaultLoc,
      severity: aiResult.severity,
      priorityScore: aiResult.priorityScore,
      aiSummary: aiResult.aiSummary,
      peopleAffected: aiResult.peopleAffected,
      injuries: aiResult.injuries,
      hazards: aiResult.hazards,
      requiredResources: aiResult.requiredResources,
      aiRecommendedActions: aiResult.recommendedActions,
      status: 'REPORTED',
      assignedResponder: null,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dbStore.data.incidents.unshift(newIncident);

    // Initial timeline record
    const timelineRecord = {
      id: `tl-${Date.now()}`,
      incidentId,
      status: 'REPORTED',
      message: `Emergency reported (${newIncident.type}). AI Priority Score: ${newIncident.priorityScore}/100 [${newIncident.severity}].`,
      updatedBy: newIncident.reportedBy.name,
      timestamp: new Date().toISOString()
    };
    dbStore.data.timeline.unshift(timelineRecord);

    // Initial notification for user & admins
    const notifUser = {
      id: `notif-${Date.now()}-1`,
      userId: newIncident.reportedBy.id,
      incidentId,
      title: '🚨 Emergency Submitted',
      message: `Incident ${incidentId} received. AI Priority ${newIncident.priorityScore}/100 (${newIncident.severity}). Responders alerted.`,
      type: 'alert',
      read: false,
      createdAt: new Date().toISOString()
    };
    dbStore.data.notifications.unshift(notifUser);

    dbStore.save();

    // Broadcast via WebSockets
    broadcastIncidentCreated(newIncident);

    // Calculate smart matched resources
    const matched = findMatchingResources(newIncident, dbStore.data.resources, dbStore.data.responders);

    res.status(201).json({
      message: 'Emergency reported successfully',
      incident: newIncident,
      matchedResources: matched.recommendedResources,
      recommendedResponders: matched.recommendedResponders,
      aiAnalysis: aiResult
    });
  } catch (err) {
    console.error('Create incident error:', err);
    res.status(500).json({ error: 'Failed to create emergency report' });
  }
}

function getIncidents(req, res) {
  try {
    const { status, severity, type, search, responderId, userId } = req.query;
    let list = [...dbStore.data.incidents];

    if (status) {
      list = list.filter(i => i.status.toUpperCase() === status.toUpperCase());
    }
    if (severity) {
      list = list.filter(i => i.severity.toUpperCase() === severity.toUpperCase());
    }
    if (type) {
      list = list.filter(i => i.type.toLowerCase().includes(type.toLowerCase()));
    }
    if (responderId) {
      list = list.filter(i => i.assignedResponder && i.assignedResponder.id === responderId);
    }
    if (userId) {
      list = list.filter(i => i.reportedBy && i.reportedBy.id === userId);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.incidentId.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.location && i.location.address && i.location.address.toLowerCase().includes(q))
      );
    }

    res.json({ incidents: list, count: list.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
}

function getIncidentById(req, res) {
  try {
    const { id } = req.params;
    const incident = dbStore.data.incidents.find(i => i.id === id || i.incidentId === id);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    const timeline = dbStore.data.timeline.filter(t => t.incidentId === incident.incidentId);
    const matched = findMatchingResources(incident, dbStore.data.resources, dbStore.data.responders);

    res.json({
      incident,
      timeline,
      matchedResources: matched.recommendedResources,
      recommendedResponders: matched.recommendedResponders
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch incident details' });
  }
}

function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note, responderId } = req.body;

    const incident = dbStore.data.incidents.find(i => i.id === id || i.incidentId === id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    incident.status = status;
    incident.updatedAt = new Date().toISOString();

    if (status === 'RESOLVED') {
      incident.resolvedAt = new Date().toISOString();
    }

    if (note) {
      if (!incident.notes) incident.notes = [];
      incident.notes.push({
        text: note,
        by: req.user ? req.user.name : 'Responder',
        timestamp: new Date().toISOString()
      });
    }

    const updaterName = req.user ? req.user.name : 'Responder';
    const timelineItem = {
      id: `tl-${Date.now()}`,
      incidentId: incident.incidentId,
      status: status,
      message: note ? `Status updated to ${status}. Note: "${note}"` : `Status updated to ${status}.`,
      updatedBy: updaterName,
      timestamp: new Date().toISOString()
    };
    dbStore.data.timeline.unshift(timelineItem);

    // Notify Reporter
    const notification = {
      id: `notif-${Date.now()}`,
      userId: incident.reportedBy.id,
      incidentId: incident.incidentId,
      title: `Status Update: ${status}`,
      message: `Your report ${incident.incidentId} status changed to ${status}.`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    };
    dbStore.data.notifications.unshift(notification);

    dbStore.save();

    broadcastIncidentUpdated(incident, timelineItem);
    broadcastNotification(incident.reportedBy.id, notification);

    res.json({ message: 'Incident status updated successfully', incident, timelineItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
}

function assignResponder(req, res) {
  try {
    const { id } = req.params;
    const { responderId } = req.body;

    const incident = dbStore.data.incidents.find(i => i.id === id || i.incidentId === id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    const responder = dbStore.data.responders.find(r => r.id === responderId);
    if (!responder) {
      return res.status(400).json({ error: 'Invalid responder ID' });
    }

    incident.assignedResponder = {
      id: responder.id,
      name: responder.name,
      type: responder.type,
      contact: responder.contact
    };
    incident.status = 'ASSIGNED';
    incident.updatedAt = new Date().toISOString();

    const timelineItem = {
      id: `tl-${Date.now()}`,
      incidentId: incident.incidentId,
      status: 'ASSIGNED',
      message: `Assigned to ${responder.name}.`,
      updatedBy: req.user ? req.user.name : 'Dispatcher',
      timestamp: new Date().toISOString()
    };
    dbStore.data.timeline.unshift(timelineItem);

    dbStore.save();

    broadcastIncidentUpdated(incident, timelineItem);

    res.json({ message: 'Responder assigned successfully', incident });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign responder' });
  }
}

function acceptIncident(req, res) {
  try {
    const { id } = req.params;
    const incident = dbStore.data.incidents.find(i => i.id === id || i.incidentId === id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    incident.status = 'ACCEPTED';
    if (!incident.assignedResponder) {
      incident.assignedResponder = {
        id: req.user ? req.user.id : 'resp-1',
        name: req.user ? req.user.name : 'Metro EMS Unit 4',
        type: 'Ambulance',
        contact: '+1 (555) 876-5432'
      };
    }
    incident.updatedAt = new Date().toISOString();

    const timelineItem = {
      id: `tl-${Date.now()}`,
      incidentId: incident.incidentId,
      status: 'ACCEPTED',
      message: `Emergency accepted by ${incident.assignedResponder.name}. Dispatch unit moving.`,
      updatedBy: incident.assignedResponder.name,
      timestamp: new Date().toISOString()
    };
    dbStore.data.timeline.unshift(timelineItem);

    dbStore.save();
    broadcastIncidentUpdated(incident, timelineItem);

    res.json({ message: 'Incident accepted', incident });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept incident' });
  }
}

function deleteIncident(req, res) {
  try {
    const { id } = req.params;
    const index = dbStore.data.incidents.findIndex(i => i.id === id || i.incidentId === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    const removed = dbStore.data.incidents.splice(index, 1)[0];
    dbStore.save();

    res.json({ message: 'Incident cancelled/deleted', id: removed.incidentId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete incident' });
  }
}

function resetDemoIncidents(req, res) {
  try {
    dbStore.seedInitialData();
    res.json({ message: 'Demo incidents reset successfully to default hackathon dataset' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset demo dataset' });
  }
}

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateStatus,
  assignResponder,
  acceptIncident,
  deleteIncident,
  resetDemoIncidents
};
