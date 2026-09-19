import React, { useState, useEffect } from 'react';
import { incidentAPI, responderAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  PhoneCall,
  Activity,
  AlertTriangle,
  FileText,
  MessageSquarePlus,
  X
} from 'lucide-react';

import InteractiveMap from '../components/InteractiveMap';
import ResourceMatcher from '../components/ResourceMatcher';

export const ResponderDashboard = () => {
  const { user } = useAuth();
  const { lastEvent } = useSocket();

  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (lastEvent && (lastEvent.type === 'INCIDENT_CREATED' || lastEvent.type === 'INCIDENT_UPDATED')) {
      fetchIncidents();
    }
  }, [lastEvent]);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await incidentAPI.getAll();
      const list = res.data.incidents || [];
      setIncidents(list);
      if (list.length > 0 && !selectedIncident) {
        setSelectedIncident(list[0]);
      }
    } catch (err) {
      console.error('Failed to fetch responder incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (statusKey) => {
    if (!selectedIncident) return;
    try {
      if (statusKey === 'ACCEPTED') {
        await incidentAPI.accept(selectedIncident.incidentId);
      } else {
        await incidentAPI.updateStatus(selectedIncident.incidentId, {
          status: statusKey,
          note: noteText || null
        });
      }
      setNoteText('');
      fetchIncidents();
    } catch (e) {
      alert('Failed to update incident status');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !selectedIncident) return;
    try {
      await incidentAPI.updateStatus(selectedIncident.incidentId, {
        status: selectedIncident.status,
        note: noteText
      });
      setNoteText('');
      fetchIncidents();
    } catch (e) {
      alert('Failed to add note');
    }
  };

  const filteredIncidents = incidents.filter(i => {
    if (filterSeverity === 'ALL') return true;
    return i.severity === filterSeverity;
  });

  const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const respondingCount = incidents.filter(i => i.status === 'EN ROUTE' || i.status === 'ACCEPTED').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Responder Header & Active Unit Badge */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600 text-slate-950 font-black flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Responder Dispatch Console</h1>
            <p className="text-xs text-slate-400">
              Active Unit: <strong className="text-amber-400">{user?.name || 'Metro EMS Unit 4'}</strong> ({user?.responderType || 'Ambulance'})
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-400 font-extrabold text-xs flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>UNIT STATUS: AVAILABLE FOR DISPATCH</span>
        </div>
      </div>

      {/* 4 TOP RESPONDER CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">ACTIVE INCIDENTS</span>
          <div className="text-3xl font-black text-slate-100">{activeCount}</div>
          <span className="text-[10px] text-slate-500">Awaiting or in progress</span>
        </div>

        <div className="bg-slate-900 border border-rose-900/60 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-bold text-rose-400 uppercase">CRITICAL ALERTS</span>
          <div className="text-3xl font-black text-rose-500">{criticalCount}</div>
          <span className="text-[10px] text-rose-400/80 font-bold">Immediate dispatch needed</span>
        </div>

        <div className="bg-slate-900 border border-amber-900/60 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-bold text-amber-400 uppercase">RESPONDING UNITS</span>
          <div className="text-3xl font-black text-amber-400">{respondingCount}</div>
          <span className="text-[10px] text-slate-500">En route / On scene</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">RESOLVED TODAY</span>
          <div className="text-3xl font-black text-emerald-400">{resolvedCount}</div>
          <span className="text-[10px] text-slate-500">Successfully closed</span>
        </div>
      </div>

      {/* MAIN LAYOUT: MAP + LIST & ACTION MODAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Live Map & Emergency List */}
        <div className="lg:col-span-2 space-y-6">

          {/* Interactive Incident Map */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" /> LIVE INCIDENT DISPATCH MAP
              </h3>
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-600"></span> Critical</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium/High</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low</span>
              </div>
            </div>

            <InteractiveMap
              incidents={filteredIncidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              center={[12.9716, 77.5946]}
              zoom={13}
              height="380px"
            />
          </div>

          {/* Incident Filter & List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm">Nearby Incident Queue</h3>
              
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-slate-400 hidden sm:inline">Filter:</span>
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                      filterSeverity === sev
                        ? 'bg-amber-600 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {filteredIncidents.map((inc) => {
                const isSelected = selectedIncident?.incidentId === inc.incidentId;
                return (
                  <div
                    key={inc.id || inc.incidentId}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/80 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black text-amber-400">{inc.incidentId}</span>
                        <span className="font-bold text-xs text-slate-100">{inc.type}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase text-white ${
                        inc.severity === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-500'
                      }`}>
                        {inc.severity} ({inc.priorityScore}/100)
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{inc.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                      <span>📍 {inc.location?.address}</span>
                      <span className="font-bold text-amber-400">{inc.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Selected Incident Details & Responder Action Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-2xl h-fit sticky top-24">
          
          {selectedIncident ? (
            <>
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-rose-400">{selectedIncident.incidentId}</span>
                  <span className="bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                    Status: {selectedIncident.status}
                  </span>
                </div>
                <h2 className="text-lg font-black text-white mt-1">{selectedIncident.type}</h2>
                <p className="text-xs text-slate-400 mt-0.5">📍 {selectedIncident.location?.address}</p>
              </div>

              {/* Priority & AI Summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">AI Priority Score:</span>
                  <span className="text-rose-500 font-extrabold">{selectedIncident.priorityScore}/100 ({selectedIncident.severity})</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-mono text-[11px] bg-slate-900 p-2.5 rounded border border-slate-800">
                  {selectedIncident.aiSummary}
                </p>
              </div>

              {/* Required Resources */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-semibold block">Required Services:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedIncident.requiredResources?.map((r, i) => (
                    <span key={i} className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      ✓ {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* RESPONDER ACTION BUTTONS */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 block uppercase">Update Dispatch Status:</span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleUpdateStatus('ACCEPTED')}
                    className="p-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl transition shadow"
                  >
                    ACCEPT DISPATCH
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('EN ROUTE')}
                    className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl transition shadow"
                  >
                    START RESPONSE (EN ROUTE)
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('ON SCENE')}
                    className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl transition shadow"
                  >
                    MARK ON SCENE
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('RESOLVED')}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition shadow"
                  >
                    RESOLVE EMERGENCY
                  </button>
                </div>
              </div>

              {/* Add Note Section */}
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Add Field Dispatch Note:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="e.g. Unit 4 arrived at location. Patient stabilized."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                  <button
                    onClick={handleAddNote}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold shrink-0"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 py-12 text-center">Select an incident from the queue to manage dispatch</p>
          )}

        </div>

      </div>

    </div>
  );
};

export default ResponderDashboard;
