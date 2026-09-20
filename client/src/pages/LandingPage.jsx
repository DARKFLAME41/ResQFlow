import React from 'react';
import { Link } from 'react-router-dom';
import {
  Siren,
  AlertTriangle,
  Mic,
  Camera,
  Cpu,
  MapPin,
  Truck,
  Activity,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Radio,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { user, switchDemoRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col space-y-16 pb-16">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-radial-gradient from-rose-950/40 via-transparent to-transparent opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">

          <div className="inline-flex items-center space-x-2 bg-rose-950/80 border border-rose-800/60 px-3 py-1 rounded-full text-xs font-extrabold text-rose-400 shadow-md">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>AI-POWERED EMERGENCY COORDINATION PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            One Platform to <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">Report, Understand, Prioritize & Coordinate</span> Emergencies.
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-normal">
            ResQFlow connects citizens, responders, and command centers in real time using multi-modal AI intelligence, speech-to-text, computer vision, and smart resource dispatch.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/report"
              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold px-8 py-4 rounded-xl text-base shadow-2xl shadow-rose-900/60 flex items-center gap-2 border border-rose-400/30 hover:scale-105 transition-all"
            >
              <AlertTriangle className="w-5 h-5" /> 🚨 REPORT EMERGENCY NOW
            </Link>

            {!user ? (
              <>
                <Link
                  to="/auth?mode=login"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold px-6 py-4 rounded-xl text-base border border-slate-700 transition"
                >
                  Login
                </Link>

                <Link
                  to="/auth?mode=register"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold px-6 py-4 rounded-xl text-base border border-slate-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <Link
                to={user.role === 'Responder' ? '/responder' : user.role === 'Admin' ? '/admin' : '/citizen'}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold px-6 py-4 rounded-xl text-base border border-slate-700 transition flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Interactive Demo Role Shortcuts */}
          <div className="pt-6 max-w-xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              ⚡ Instant Role Switcher:
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => switchDemoRole('Citizen')}
                className="p-2.5 bg-slate-800 hover:bg-rose-950 text-slate-200 rounded-lg border border-slate-700 font-bold transition text-center"
              >
                👤 Citizen View
              </button>
              <button
                onClick={() => switchDemoRole('Responder')}
                className="p-2.5 bg-slate-800 hover:bg-amber-950 text-slate-200 rounded-lg border border-slate-700 font-bold transition text-center"
              >
                🚑 Responder View
              </button>
              <button
                onClick={() => switchDemoRole('Admin')}
                className="p-2.5 bg-slate-800 hover:bg-emerald-950 text-slate-200 rounded-lg border border-slate-700 font-bold transition text-center"
              >
                🖥️ Admin Command
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* DASHBOARD PREVIEW MOCKUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl overflow-hidden relative group">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 px-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">ResQFlow Command Operations Center</span>
            </div>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
              ● Live WebSocket Dispatch Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-rose-400 block">AI Incident Extraction</span>
              <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-lg text-xs space-y-1">
                <div className="font-extrabold text-white">RSQ-2026-0001 (Road Accident)</div>
                <div className="text-rose-300 font-black text-sm">AI Priority Score: 92/100 (CRITICAL)</div>
                <p className="text-slate-300 text-[11px]">2 injured victims, 1 unconscious near College Main Gate.</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 block">Smart Resource Recommendation</span>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>🚑 Metro EMS Ambulance</span>
                  <span className="text-emerald-400 font-bold">1.2 km away</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>🏥 City General ER Bed</span>
                  <span className="text-emerald-400 font-bold">2.8 km away</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-cyan-400 block">Responder Status Timeline</span>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">✓ Report Submitted</div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold">✓ AI Analysis Complete</div>
                <div className="flex items-center gap-1 text-amber-400 font-bold">● Responder En Route</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How ResQFlow Works</h2>
          <p className="text-slate-400 text-sm">From emergency report to coordinated resolution in 6 automated steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: '1', title: 'Report', desc: 'Text, Voice, or Image upload', icon: Mic },
            { step: '2', title: 'AI Understands', desc: 'NLP entity extraction', icon: Cpu },
            { step: '3', title: 'AI Prioritizes', desc: '0–100 Severity Scoring', icon: Activity },
            { step: '4', title: 'Resources Matched', desc: 'Proximity match engine', icon: Truck },
            { step: '5', title: 'Responders Coordinate', desc: 'Live dispatch console', icon: Radio },
            { step: '6', title: 'Resolved', desc: 'Verified resolution & log', icon: CheckCircle }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-2 relative">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center mx-auto">
                  {item.step}
                </span>
                <Icon className="w-6 h-6 text-rose-400 mx-auto" />
                <h4 className="font-bold text-xs text-slate-100">{item.title}</h4>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Core Capabilities</h2>
          <p className="text-slate-400 text-sm">Built for maximum speed, accuracy, and operational reliability</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'AI Emergency Classification', desc: 'Categorizes medical, fire, accident, disaster, and crime reports automatically.', icon: Cpu },
            { title: 'Voice Emergency Reporting', desc: 'Microphone speech-to-text transcriber for hands-free reporting in distress.', icon: Mic },
            { title: 'Image Vision Analysis', desc: 'Detects structural fire, vehicle damage, and visible hazards from photos.', icon: Camera },
            { title: 'Smart Priority Scoring (0-100)', desc: 'Calculates life-threatening risk levels objectively.', icon: Activity },
            { title: 'Location Intelligence', desc: 'Browser GPS, landmark input, and interactive Leaflet map pin-picker.', icon: MapPin },
            { title: 'Smart Resource Matching', desc: 'Recommends nearest ICU hospitals, ambulances, fire units, and police.', icon: Truck },
            { title: 'Real-Time Responder Console', desc: 'Interactive dispatch dashboard with live incident updates.', icon: Shield },
            { title: 'Incident Timeline Tracking', desc: 'Transparent stage-by-stage status tracking from report to resolution.', icon: Clock },
            { title: 'Emergency Operations Analytics', desc: 'Heatmaps, response metrics, and capacity management for command centers.', icon: BarChart3 }
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-100">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Siren className="w-4 h-4 text-rose-500" />
          <span className="font-bold text-slate-300">ResQFlow Platform</span>
          <span>© 2026 ResQFlow Emergency Response Platform</span>
        </div>
        <p>Built with React, Express, Socket.IO & AI Emergency Pipeline.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
