import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { incidentAPI, resourceAPI } from '../services/api';
import {
  AlertTriangle,
  MapPin,
  FileText,
  Bell,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Hospital
} from 'lucide-react';
import ResourceMatcher from '../components/ResourceMatcher';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNearby, setShowNearby] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incRes, resRes] = await Promise.all([
        incidentAPI.getAll({ userId: user?.id }),
        resourceAPI.getAll()
      ]);
      setIncidents(incRes.data.incidents || []);
      setResources(resRes.data.resources || []);
    } catch (err) {
      console.error('Citizen dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReport = async (incidentId) => {
    if (!window.confirm(`Are you sure you want to cancel emergency report ${incidentId}?`)) return;
    try {
      await incidentAPI.delete(incidentId);
      setIncidents(incidents.filter(i => i.incidentId !== incidentId && i.id !== incidentId));
    } catch (err) {
      alert('Failed to cancel report');
    }
  };

  const activeReports = incidents.filter(i => i.status !== 'RESOLVED');
  const resolvedReports = incidents.filter(i => i.status === 'RESOLVED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, <span className="text-rose-500">{user?.name || 'Citizen'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ResQFlow Citizen Operations & Emergency Command Hub
          </p>
        </div>

        <Link
          to="/report"
          className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black px-6 py-3 rounded-xl text-sm shadow-xl shadow-rose-950/60 flex items-center gap-2 border border-rose-400/30 hover:scale-105 transition"
        >
          <AlertTriangle className="w-5 h-5 animate-bounce" /> 🚨 REPORT EMERGENCY
        </Link>
      </div>

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-rose-900/50 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Reports</span>
          <div className="text-3xl font-black text-rose-500">{activeReports.length}</div>
          <span className="text-[10px] text-slate-500">Live monitoring active</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">Resolved Reports</span>
          <div className="text-3xl font-black text-emerald-400">{resolvedReports.length}</div>
          <span className="text-[10px] text-slate-500">Completed emergencies</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">Nearby Resources</span>
          <div className="text-3xl font-black text-cyan-400">{resources.length}</div>
          <span className="text-[10px] text-slate-500">Hospitals & Ambulances</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Alerts</span>
          <div className="text-3xl font-black text-amber-400">1</div>
          <span className="text-[10px] text-slate-500">Command Center Sync</span>
        </div>
      </div>

      {/* 4 MAIN ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/report"
          className="bg-gradient-to-br from-rose-900/80 to-red-950 border border-rose-700/60 hover:border-rose-500 p-5 rounded-xl space-y-2 group shadow-lg transition"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-sm text-white">🚨 REPORT EMERGENCY</h3>
          <p className="text-[11px] text-rose-200">Text, Voice, Image, & Location AI report</p>
        </Link>

        <button
          onClick={() => setShowNearby(!showNearby)}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 p-5 rounded-xl space-y-2 group text-left shadow-lg transition"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-100">📍 Nearby Emergency Resources</h3>
          <p className="text-[11px] text-slate-400">Hospitals, Ambulances & Fire Units</p>
        </button>

        <Link
          to="/history"
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl space-y-2 group shadow-lg transition"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-100">📋 My Reports & History</h3>
          <p className="text-[11px] text-slate-400">View timeline history & details</p>
        </Link>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-100">🔔 Real-Time Notifications</h3>
          <p className="text-[11px] text-slate-400">Live push updates from responders</p>
        </div>
      </div>

      {/* TOGGLE NEARBY RESOURCES PANEL */}
      {showNearby && (
        <div className="animate-fadeIn">
          <ResourceMatcher resources={resources} incidentType="Nearby Assistance" />
        </div>
      )}

      {/* ACTIVE REPORTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" /> Active Emergency Reports
          </h2>
          <span className="text-xs text-slate-400">{activeReports.length} in progress</span>
        </div>

        {activeReports.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
            <h3 className="font-bold text-slate-200">No active emergency reports</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              If you or someone near you needs emergency assistance, click Report Emergency below.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              🚨 Report Emergency Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeReports.map((inc) => (
              <div
                key={inc.id || inc.incidentId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-black text-rose-400 font-mono">{inc.incidentId}</span>
                    <span className="font-bold text-slate-100 text-sm">{inc.type}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                      inc.severity === 'CRITICAL' ? 'bg-rose-600' : inc.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'
                    }`}>
                      {inc.severity} ({inc.priorityScore}/100)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCancelReport(inc.incidentId)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-semibold transition border border-slate-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Cancel Report
                    </button>
                    <Link
                      to={`/track/${inc.incidentId}`}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
                    >
                      Track Live <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 font-semibold block">Description:</span>
                    <p className="line-clamp-2">{inc.description}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Location:</span>
                    <p className="line-clamp-2">📍 {inc.location?.address}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Assigned Responder:</span>
                    <p className="text-emerald-400 font-bold">
                      {inc.assignedResponder ? inc.assignedResponder.name : 'Dispatching Nearest Unit...'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CitizenDashboard;
