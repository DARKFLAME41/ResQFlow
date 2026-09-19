import React from 'react';
import { Hospital, Truck, Shield, Flame, PhoneCall, CheckCircle, Navigation } from 'lucide-react';

export const ResourceMatcher = ({ resources = [], incidentType = 'Emergency' }) => {
  const getResourceIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('hospital')) return <Hospital className="w-5 h-5 text-rose-400" />;
    if (t.includes('ambulance')) return <Truck className="w-5 h-5 text-amber-400" />;
    if (t.includes('police')) return <Shield className="w-5 h-5 text-blue-400" />;
    if (t.includes('fire')) return <Flame className="w-5 h-5 text-red-500" />;
    return <Truck className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div>
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Smart Resource Recommendations
          </h3>
          <p className="text-[11px] text-slate-400">Matched for incident: <strong className="text-slate-200">{incidentType}</strong></p>
        </div>
        <span className="bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
          AI Proximity Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  {getResourceIcon(res.type)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-200 line-clamp-1">{res.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{res.type} • {res.organization}</span>
                </div>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-black text-[11px] px-2 py-0.5 rounded-full">
                {res.matchScore || 85}% Match
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-900">
              <span className="flex items-center gap-1 text-slate-400">
                <Navigation className="w-3 h-3 text-cyan-400" /> {res.distanceKm || 1.4} km away
              </span>
              <span className="text-slate-400">{res.capacity || 'Ready'}</span>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800/60">
              💡 {res.recommendationReason || `${res.distanceKm || 1.4} km away • ${res.availability}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceMatcher;
