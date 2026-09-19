import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { incidentAPI } from '../services/api';
import { History, Search, Clock, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';

export const EmergencyHistory = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await incidentAPI.getAll({ userId: user?.id });
      setIncidents(res.data.incidents || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = incidents.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return i.incidentId.toLowerCase().includes(q) || i.type.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-rose-500" /> Emergency Reports History
          </h1>
          <p className="text-xs text-slate-400">Complete archive of emergency reports submitted by your account</p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report ID, type..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No report history matches your search.
          </div>
        ) : (
          filtered.map((inc) => (
            <div
              key={inc.id || inc.incidentId}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-rose-400 text-xs">{inc.incidentId}</span>
                  <span className="font-bold text-slate-100 text-sm">{inc.type}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold text-white ${
                    inc.status === 'RESOLVED' ? 'bg-blue-600' : 'bg-rose-600'
                  }`}>
                    {inc.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-1">{inc.description}</p>
                <span className="text-[10px] text-slate-500 block">Reported: {new Date(inc.createdAt).toLocaleDateString()}</span>
              </div>

              <Link
                to={`/track/${inc.incidentId}`}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs flex items-center gap-1 transition shrink-0"
              >
                View Timeline <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default EmergencyHistory;
