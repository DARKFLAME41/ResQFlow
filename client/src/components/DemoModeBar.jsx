import React from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { incidentAPI } from '../services/api';
import { Zap, UserCheck, ShieldAlert, RefreshCw, Eye } from 'lucide-react';

export const DemoModeBar = ({ onPresetSelect }) => {
  const { user, switchDemoRole } = useAuth();

  const handleResetDemo = async () => {
    try {
      await incidentAPI.resetDemo();
      window.location.reload();
    } catch (e) {
      alert('Demo reset complete.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-rose-900 via-purple-950 to-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-rose-800/40 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center space-x-2">
          <span className="bg-rose-600 text-white font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1 shadow">
            <Zap className="w-3 h-3 fill-current animate-bounce" /> HACKATHON DEMO MODE
          </span>
          <span className="text-slate-300 hidden md:inline">
            Active Role: <strong className="text-rose-400">{user?.name}</strong> ({user?.role})
          </span>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 hidden sm:inline mr-1">Switch View:</span>

          <button
            onClick={() => switchDemoRole('Citizen')}
            className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
              user?.role === 'Citizen'
                ? 'bg-rose-600 text-white shadow-md font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3 h-3" /> Citizen
          </button>

          <button
            onClick={() => switchDemoRole('Responder')}
            className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
              user?.role === 'Responder'
                ? 'bg-amber-600 text-white shadow-md font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="w-3 h-3" /> Responder
          </button>

          <button
            onClick={() => switchDemoRole('Admin')}
            className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
              user?.role === 'Admin'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3 h-3" /> Admin Ops
          </button>

          <button
            onClick={handleResetDemo}
            title="Reset DB to initial demo state"
            className="px-2 py-1 bg-slate-800 hover:bg-rose-900/60 text-slate-300 rounded-md border border-slate-700 transition flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset Demo
          </button>
        </div>

      </div>
    </div>
  );
};

export default DemoModeBar;
