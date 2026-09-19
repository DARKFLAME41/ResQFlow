let io = null;

function initSocket(socketIoServer) {
  io = socketIoServer;

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('join_role', (role) => {
      socket.join(`role:${role}`);
      console.log(`[Socket] Client ${socket.id} joined role:${role}`);
    });

    socket.on('join_incident', (incidentId) => {
      socket.join(`incident:${incidentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}

function broadcastIncidentCreated(incident) {
  if (!io) return;
  io.emit('incident_created', incident);
  io.to('role:Responder').emit('alert_new_incident', incident);
  io.to('role:Admin').emit('admin_incident_update', incident);
}

function broadcastIncidentUpdated(incident, timelineItem = null) {
  if (!io) return;
  io.emit('incident_updated', { incident, timelineItem });
  io.to(`incident:${incident.incidentId}`).emit('incident_status_changed', { incident, timelineItem });
}

function broadcastNotification(userId, notification) {
  if (!io) return;
  io.emit('notification_broadcast', { userId, notification });
}

module.exports = {
  initSocket,
  broadcastIncidentCreated,
  broadcastIncidentUpdated,
  broadcastNotification
};
