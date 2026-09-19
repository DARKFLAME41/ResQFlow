import React, { useState } from 'react';
import { X, ShieldAlert, Heart, Flame, Waves, AlertTriangle, LifeBuoy } from 'lucide-react';

const GUIDES = [
  {
    id: 'fire',
    title: '🔥 Structure & Building Fire',
    icon: Flame,
    color: 'text-red-500',
    steps: [
      'Crawl low under smoke to avoid toxic gas inhalation.',
      'Touch doors with the back of your hand before opening; if hot, do NOT open.',
      'Use stairs only — never use elevators during a fire evacuation.',
      'If clothes catch fire: STOP, DROP, and ROLL.'
    ]
  },
  {
    id: 'medical',
    title: '❤️ Cardiac & Medical Emergency',
    icon: Heart,
    color: 'text-rose-500',
    steps: [
      'Check responsiveness and breathing; call emergency services immediately.',
      'If person is unconscious and not breathing normally, begin CPR (100–120 compressions/min).',
      'Locate and apply an Automated External Defibrillator (AED) if available.',
      'Do not give food or drink to an unconscious individual.'
    ]
  },
  {
    id: 'flood',
    title: '🌊 Flood & Heavy Waterlogging',
    icon: Waves,
    color: 'text-cyan-400',
    steps: [
      'Move immediately to higher ground; avoid walking or driving through moving water.',
      'Six inches of fast-moving water can knock an adult over; 12 inches can float cars.',
      'Avoid contact with floodwater — it may contain sewage or live electricity.',
      'Turn off main electrical switches if standing in dry areas.'
    ]
  },
  {
    id: 'earthquake',
    title: '🌋 Earthquake Protocol',
    icon: AlertTriangle,
    color: 'text-amber-500',
    steps: [
      'DROP, COVER, and HOLD ON under sturdy furniture or interior walls.',
      'Stay inside until shaking stops; avoid windows and tall glass structures.',
      'If outdoors, move away from buildings, streetlights, and utility wires.',
      'Be prepared for post-earthquake aftershocks.'
    ]
  }
];

export const SafetyGuideModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('fire');

  const selectedGuide = GUIDES.find(g => g.id === activeTab) || GUIDES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 bg-rose-950/80 border border-rose-800/60 rounded-xl text-rose-400">
            <LifeBuoy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-slate-100">Emergency Safety & First-Aid Protocol</h2>
            <p className="text-xs text-slate-400">Essential field guidance while waiting for emergency responders</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {GUIDES.map((g) => {
            const Icon = g.icon;
            return (
              <button
                key={g.id}
                onClick={() => setActiveTab(g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === g.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {g.title.split(' ')[1]}
              </button>
            );
          })}
        </div>

        {/* Guide Content */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className={`font-bold text-sm flex items-center gap-2 ${selectedGuide.color}`}>
            <selectedGuide.icon className="w-5 h-5" /> {selectedGuide.title}
          </h3>

          <ol className="space-y-3">
            {selectedGuide.steps.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300 text-[11px] flex items-center justify-between">
          <span>🚨 For life-threatening emergencies, immediately call local emergency services or tap <strong>REPORT EMERGENCY</strong>.</span>
          <button
            onClick={onClose}
            className="ml-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded text-xs transition shrink-0"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};

export default SafetyGuideModal;
