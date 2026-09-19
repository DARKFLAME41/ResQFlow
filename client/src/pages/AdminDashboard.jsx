import React, { useState, useEffect } from 'react';
import { incidentAPI, responderAPI, analyticsAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import {
  Activity,
  Search,
  Filter,
  Users,
  Clock,
  Shield,
  MapPin,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Flame,
  Layers,
  BarChart3
} from 'lucide-react';

import InteractiveMap from '../components/InteractiveMap';

export const AdminDashboard = () => {
  const { lastEvent } = useSocket();

  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'heatmap'

  // Modal State
  const [assignModalIncident, setAssignModalIncident] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (lastEvent) {
      fetchData();
    }
  }, [lastEvent]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incRes, respRes, metRes] = await Promise.all([
        incidentAPI.getAll(),
        responderAPI.getAll(),
        analyticsAPI.getMetrics()
      ]);
      setIncidents(incRes.data.incidents || []);
      setResponders(respRes.data.responders || []);
      setMetrics(metRes.data || null);
    } catch (err) {
      console.error('Failed to fetch admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (incidentId, responderId) => {
    try {
      await incidentAPI.assignResponder(incidentId, responderId);
      setAssignModalIncident(null);
      fetchData();
    } catch (e) {
      alert('Failed to assign responder');
    }
  };

  const filteredIncidents = incidents.filter(i => {
    if (filterType !== 'ALL' && !i.type.toLowerCase().includes(filterType.toLowerCase())) return false;
    if (filterSeverity !== 'ALL' && i.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchId = i.incidentId.toLowerCase().includes(q);
      const matchType = i.type.toLowerCase().includes(q);
      const matchLoc = i.location?.address?.toLowerCase().includes(q);
      if (!matchId && !matchType && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-slate-950 font-black flex items-center justify-center shadow-lg">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Emergency Operations Command Center</h1>
            <p className="text-xs text-slate-400">Citywide emergency monitoring, dispatch control, and responder management</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'table' ? 'bg-emerald-600 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" /> Operations Table
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'heatmap' ? 'bg-emerald-600 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Flame className="w-4 h-4" /> Heatmap View
          </button>
        </div>
      </div>

      {/* 6 COMMAND METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Incidents</span>
          <div className="text-2xl font-black text-white">{metrics?.summary?.totalIncidents || incidents.length}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Emergencies</span>
          <div className="text-2xl font-black text-rose-500">{metrics?.summary?.activeIncidents || 4}</div>
        </div>

        <div className="bg-slate-900 border border-rose-900/60 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-rose-400 uppercase">Critical Priority</span>
          <div className="text-2xl font-black text-rose-500">{metrics?.summary?.criticalIncidents || 2}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Responders</span>
          <div className="text-2xl font-black text-emerald-400">{responders.length}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Response Time</span>
          <div className="text-2xl font-black text-cyan-400">6.8 min</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Resolved Today</span>
          <div className="text-2xl font-black text-blue-400">{metrics?.summary?.resolvedToday || 24}</div>
        </div>
      </div>

      {/* HEATMAP VIEW TAB */}
      {activeTab === 'heatmap' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" /> CITY EMERGENCY INCIDENT DENSITY HEATMAP
            </h3>
            <span className="text-[10px] text-slate-400">High Density Concentration Zones</span>
          </div>

          <InteractiveMap
            incidents={incidents}
            center={[12.9716, 77.5946]}
            zoom={13}
            height="450px"
          />
        </div>
      )}

      {/* OPERATIONS TABLE TAB */}
      {activeTab === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          
          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Incident ID, type, address..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              >
                <option value="ALL">All Emergency Types</option>
                <option value="Road Accident">Road Accident</option>
                <option value="Fire">Fire</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Natural Disaster">Natural Disaster</option>
                <option value="Crime">Crime / Security</option>
              </select>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-bold"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="REPORTED">REPORTED</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="EN ROUTE">EN ROUTE</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>

          </div>

          {/* INCIDENTS DATA TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Incident ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">AI Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Dispatch</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id || inc.incidentId} className="hover:bg-slate-950/60 transition">
                    <td className="p-3 font-mono font-black text-rose-400">{inc.incidentId}</td>
                    <td className="p-3 font-bold text-slate-100">{inc.type}</td>
                    <td className="p-3 max-w-xs truncate text-slate-300">📍 {inc.location?.address}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                        inc.severity === 'CRITICAL' ? 'bg-rose-600' : inc.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'
                      }`}>
                        {inc.severity} ({inc.priorityScore})
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-amber-400">{inc.status}</span>
                    </td>
                    <td className="p-3">
                      {inc.assignedResponder ? (
                        <span className="text-emerald-400 font-bold">{inc.assignedResponder.name}</span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setAssignModalIncident(inc)}
                        className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded font-bold transition flex items-center gap-1 ml-auto"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* DISPATCH ASSIGNMENT MODAL */}
      {assignModalIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Assign Responder — {assignModalIncident.incidentId}</h3>
              <button onClick={() => setAssignModalIncident(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-300">Select available emergency squad for <strong>{assignModalIncident.type}</strong>:</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {responders.map((resp) => (
                  <div key={resp.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-100 block">{resp.name}</strong>
                      <span className="text-slate-400 text-[10px]">{resp.type} • {resp.availability}</span>
                    </div>
                    <button
                      onClick={() => handleAssign(assignModalIncident.incidentId, resp.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded text-xs transition"
                    >
                      Dispatch Unit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
