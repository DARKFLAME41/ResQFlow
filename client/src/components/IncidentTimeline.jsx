import React from 'react';
import { CheckCircle2, Clock, Circle, ShieldCheck, AlertCircle } from 'lucide-react';

const STAGES = [
  { key: 'REPORTED', label: 'Report Submitted' },
  { key: 'VERIFIED', label: 'AI Priority Assigned' },
  { key: 'ASSIGNED', label: 'Responder Assigned' },
  { key: 'ACCEPTED', label: 'Dispatch Accepted' },
  { key: 'EN ROUTE', label: 'Responder En Route' },
  { key: 'ON SCENE', label: 'Unit On Scene' },
  { key: 'RESOLVED', label: 'Emergency Resolved' }
];

export const IncidentTimeline = ({ currentStatus = 'REPORTED', timelineHistory = [] }) => {
  const getStageIndex = (statusKey) => {
    return STAGES.findIndex(s => s.key === statusKey.toUpperCase());
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-500" /> Real-Time Response Progression
        </h3>
        <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
          Status: {currentStatus}
        </span>
      </div>

      {/* Horizontal Step Indicator for Desktop */}
      <div className="hidden lg:flex items-center justify-between relative py-2">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>

        {STAGES.map((stage, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCurrent
                    ? 'bg-rose-600 text-white ring-4 ring-rose-900/60 scale-110 shadow-lg'
                    : isDone
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`text-[10px] font-semibold mt-2 text-center max-w-[80px] ${
                isCurrent ? 'text-rose-400 font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit Log Timeline Items */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Activity Log</h4>
        {timelineHistory.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Initializing timeline updates...</p>
        ) : (
          <div className="space-y-2 border-l-2 border-slate-800 ml-2 pl-4">
            {timelineHistory.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-slate-900"></div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                    <span className="text-rose-400">{item.status}</span>
                    <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{item.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Updated by: {item.updatedBy}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentTimeline;
