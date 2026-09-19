import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { incidentAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import {
  Clock,
  MapPin,
  AlertTriangle,
  Truck,
  Shield,
  CheckCircle,
  FileText,
  Trash2,
  Share2
} from 'lucide-react';

import IncidentTimeline from '../components/IncidentTimeline';
import ResourceMatcher from '../components/ResourceMatcher';
import InteractiveMap from '../components/InteractiveMap';

export const TrackingPage = () => {
  const { id } = useParams();
  const { lastEvent } = useSocket();

  const [incident, setIncident] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [matchedResources, setMatchedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidentDetails();
  }, [id]);

  // Update real-time if socket emits update for this incident
  useEffect(() => {
    if (lastEvent && lastEvent.type === 'INCIDENT_UPDATED' && lastEvent.payload?.incident) {
      if (lastEvent.payload.incident.incidentId === id || lastEvent.payload.incident.id === id) {
        setIncident(lastEvent.payload.incident);
        if (lastEvent.payload.timelineItem) {
          setTimeline((prev) => [lastEvent.payload.timelineItem, ...prev]);
        }
      }
    }
  }, [lastEvent, id]);

  const fetchIncidentDetails = async () => {
    setLoading(true);
    try {
      const res = await incidentAPI.getById(id);
      setIncident(res.data.incident);
      setTimeline(res.data.timeline || []);
      setMatchedResources(res.data.matchedResources || []);
    } catch (err) {
      console.error('Failed to fetch incident tracking details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReport = async () => {
    if (!window.confirm('Cancel this emergency report?')) return;
    try {
      await incidentAPI.delete(incident.incidentId);
      alert('Report cancelled successfully');
      window.location.href = '/citizen';
    } catch (e) {
      alert('Error cancelling report');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Clock className="w-10 h-10 text-rose-500 animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-300">Loading Live Emergency Tracking Console ({id})...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="py-24 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Emergency Incident Not Found</h2>
        <p className="text-xs text-slate-400">Incident ID {id} does not exist in active records.</p>
        <Link to="/citizen" className="inline-block bg-slate-800 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* TOP INCIDENT STATUS BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-black text-rose-500 font-mono">{incident.incidentId}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase text-white shadow ${
                incident.severity === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-500'
              }`}>
                {incident.severity} PRIORITY ({incident.priorityScore}/100)
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-1">{incident.type}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancelReport}
              className="px-3 py-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Cancel Report
            </button>
            <div className="px-4 py-2 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 font-extrabold text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>LIVE TRACKING ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Reporter & Assigned Responder Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-semibold block">Location:</span>
            <p className="font-bold text-slate-200">📍 {incident.location?.address}</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-semibold block">Assigned Dispatch Unit:</span>
            <p className="font-extrabold text-emerald-400 flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> {incident.assignedResponder ? incident.assignedResponder.name : 'Matching Nearest Unit...'}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-semibold block">Reported At:</span>
            <p className="font-semibold text-slate-300">{new Date(incident.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* REAL-TIME PROGRESS TIMELINE */}
      <IncidentTimeline currentStatus={incident.status} timelineHistory={timeline} />

      {/* MAP & AI BRIEF GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Incident Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" /> Incident Location on Map
          </h3>
          <InteractiveMap
            incidents={[incident]}
            resources={matchedResources}
            center={[incident.location?.latitude || 12.9716, incident.location?.longitude || 77.5946]}
            zoom={14}
            height="320px"
          />
        </div>

        {/* Right: AI Response Brief & Recommended Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" /> AI Responder Brief & Actions
          </h3>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
            <span className="font-bold text-slate-400 block uppercase text-[10px]">AI Incident Summary:</span>
            <p className="text-slate-200 leading-relaxed font-mono">{incident.aiSummary}</p>
          </div>

          {incident.aiRecommendedActions && (
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
              <span className="font-bold text-slate-400 block uppercase text-[10px]">Recommended Operational Actions:</span>
              <ul className="space-y-1.5 text-slate-300">
                {incident.aiRecommendedActions.map((act, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

      {/* MATCHED NEARBY RESOURCES */}
      <ResourceMatcher resources={matchedResources} incidentType={incident.type} />

    </div>
  );
};

export default TrackingPage;
