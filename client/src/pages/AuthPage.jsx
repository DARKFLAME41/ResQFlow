import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { Shield, User, Lock, Mail, Phone, Building, MapPin, AlertCircle } from 'lucide-react';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [isRegister, setIsRegister] = useState(initialMode === 'register');

  const { login, register, loading, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Citizen',
    responderType: 'Ambulance',
    organization: '',
    serviceArea: ''
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'Responder') navigate('/responder');
      else if (user.role === 'Admin') navigate('/admin');
      else navigate('/citizen');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Authentication failed');
    }
  };

  const fillDemoAccount = (roleName) => {
    const acc = DEMO_USERS[roleName];
    if (acc) {
      setFormData({
        name: acc.name,
        email: acc.email,
        phone: acc.phone || '',
        password: 'password123',
        role: acc.role,
        responderType: acc.responderType || 'Ambulance',
        organization: acc.organization || '',
        serviceArea: acc.serviceArea || ''
      });
      setIsRegister(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6">

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">
            {isRegister ? 'Create ResQFlow Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? 'Register as a Citizen, Responder, or Admin Coordinator' : 'Sign in to manage and track emergency operations'}
          </p>
        </div>

        {/* Quick Demo Autofill Bar for Hackathon Evaluation */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-center space-y-1.5">
          <span className="text-slate-400 font-semibold block text-[11px]">⚡ Quick Hackathon Autofill:</span>
          <div className="flex justify-center space-x-2">
            <button type="button" onClick={() => fillDemoAccount('Citizen')} className="px-2.5 py-1 bg-slate-800 hover:bg-rose-900/60 rounded text-[11px] font-bold text-slate-200">
              Citizen
            </button>
            <button type="button" onClick={() => fillDemoAccount('Responder')} className="px-2.5 py-1 bg-slate-800 hover:bg-amber-900/60 rounded text-[11px] font-bold text-slate-200">
              Responder
            </button>
            <button type="button" onClick={() => fillDemoAccount('Admin')} className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-900/60 rounded text-[11px] font-bold text-slate-200">
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-center space-x-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  required={isRegister}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@resqflow.org"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 234-5678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:ring-2 focus:ring-rose-500 font-semibold"
                >
                  <option value="Citizen">Citizen (Report & Track Emergencies)</option>
                  <option value="Responder">Responder (Ambulance, Fire, Police, Hospital)</option>
                  <option value="Admin">Admin / Emergency Coordinator</option>
                </select>
              </div>

              {formData.role === 'Responder' && (
                <div className="p-3 bg-slate-950 border border-amber-900/60 rounded-xl space-y-3">
                  <span className="text-[11px] font-bold text-amber-400 block">Responder Service Credentials</span>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Responder Type</label>
                    <select
                      name="responderType"
                      value={formData.responderType}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100"
                    >
                      <option value="Ambulance">Ambulance Squad</option>
                      <option value="Hospital">Hospital Trauma Team</option>
                      <option value="Police">Police / Traffic Control</option>
                      <option value="Fire & Rescue">Fire & Rescue Unit</option>
                      <option value="Disaster-response">Disaster Response Team</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. Metro EMS Unit 4"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-3 rounded-xl text-sm shadow-xl shadow-rose-950/50 transition"
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
