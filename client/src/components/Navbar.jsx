import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Siren,
  AlertTriangle,
  LayoutDashboard,
  ShieldAlert,
  Activity,
  BarChart3,
  Bell,
  LogOut,
  User,
  BookOpen,
  History,
  Menu,
  X
} from 'lucide-react';
import SafetyGuideModal from './SafetyGuideModal';

export const Navbar = () => {
  const { user, logout, isCitizen, isResponder, isAdmin } = useAuth();
  const { notifications, unreadCount, clearUnread } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSafetyGuide, setShowSafetyGuide] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo Brand */}
            <RouterLink to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-900/40 group-hover:scale-105 transition-transform">
                <Siren className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  ResQ<span className="text-rose-500">Flow</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium block leading-none">
                  Coordinated Emergency Response
                </span>
              </div>
            </RouterLink>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">

              {isCitizen && (
                <>
                  <RouterLink
                    to="/citizen"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      isActive('/citizen')
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </RouterLink>

                  <RouterLink
                    to="/history"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      isActive('/history')
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <History className="w-4 h-4" /> My Reports
                  </RouterLink>
                </>
              )}

              {isResponder && (
                <RouterLink
                  to="/responder"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/responder')
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Responder Console
                </RouterLink>
              )}

              {isAdmin && (
                <>
                  <RouterLink
                    to="/admin"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      isActive('/admin')
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Activity className="w-4 h-4 text-emerald-400" /> Command Center
                  </RouterLink>

                  <RouterLink
                    to="/analytics"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      isActive('/analytics')
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-400" /> Analytics
                  </RouterLink>
                </>
              )}

              <button
                onClick={() => setShowSafetyGuide(true)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" /> Safety Guides
              </button>

              {/* REPORT EMERGENCY CTA BUTTON */}
              <RouterLink
                to="/report"
                className="ml-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg shadow-rose-950/50 border border-rose-400/30 flex items-center gap-2 hover:scale-[1.02] transition-transform animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" /> REPORT EMERGENCY
              </RouterLink>

            </div>

            {/* Right Action Icons: Notification & Profile */}
            <div className="flex items-center space-x-3">

              {/* Notifications Dropdown Toggle */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    clearUnread();
                  }}
                  className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-3 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <h4 className="font-bold text-sm text-slate-200">Notifications</h4>
                      <span className="text-xs text-slate-400">{notifications.length} alerts</span>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No active notifications</p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                            <p className="font-semibold text-rose-400 mb-0.5">{n.message || n.title}</p>
                            <span className="text-[10px] text-slate-400 block">{n.createdAt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Dropdown / Login */}
              {user ? (
                <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 py-1 px-2.5 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-xs font-bold text-rose-300">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="text-xs font-semibold text-slate-200 block leading-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{user.role}</span>
                  </div>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-1 text-slate-400 hover:text-rose-400 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <RouterLink
                  to="/auth"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-3 py-1.5 rounded-lg text-xs transition border border-slate-700"
                >
                  Login / Register
                </RouterLink>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
            <RouterLink
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-rose-600 text-white font-bold py-2.5 rounded-lg text-sm mb-3"
            >
              🚨 REPORT EMERGENCY NOW
            </RouterLink>
            {isCitizen && (
              <>
                <RouterLink to="/citizen" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Citizen Dashboard</RouterLink>
                <RouterLink to="/history" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">My Emergency History</RouterLink>
              </>
            )}
            {isResponder && (
              <RouterLink to="/responder" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-400 font-medium">Responder Console</RouterLink>
            )}
            {isAdmin && (
              <>
                <RouterLink to="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-emerald-400 font-medium">Command Center</RouterLink>
                <RouterLink to="/analytics" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-emerald-400 font-medium">Emergency Analytics</RouterLink>
              </>
            )}
            <button onClick={() => { setShowSafetyGuide(true); setMobileMenuOpen(false); }} className="block py-2 text-cyan-400 font-medium w-full text-left">First Aid & Safety Guides</button>
          </div>
        )}
      </nav>

      {/* Safety Guide Modal */}
      {showSafetyGuide && (
        <SafetyGuideModal onClose={() => setShowSafetyGuide(false)} />
      )}
    </>
  );
};

export default Navbar;
