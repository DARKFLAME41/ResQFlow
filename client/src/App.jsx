import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import DemoModeBar from './components/DemoModeBar';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CitizenDashboard from './pages/CitizenDashboard';
import ReportEmergency from './pages/ReportEmergency';
import TrackingPage from './pages/TrackingPage';
import ResponderDashboard from './pages/ResponderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmergencyHistory from './pages/EmergencyHistory';
import AnalyticsPage from './pages/AnalyticsPage';

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <DemoModeBar />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/report" element={<ReportEmergency />} />
          <Route path="/track/:id" element={<TrackingPage />} />
          <Route path="/responder" element={<ResponderDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/history" element={<EmergencyHistory />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
