import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { BarChart3, PieChart, Clock, Activity, ShieldCheck, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getMetrics();
      setData(res.data);
    } catch (e) {
      console.error('Failed to fetch analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#DC2626'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" /> Emergency Response Analytics & Intelligence
        </h1>
        <p className="text-xs text-slate-400">Systemwide operational KPIs, response times, and incident distribution metrics</p>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Avg Response Time</span>
          <div className="text-3xl font-black text-emerald-400">6.8 min</div>
          <span className="text-[10px] text-slate-500">Target: &lt; 8.0 min</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Resource Utilization</span>
          <div className="text-3xl font-black text-cyan-400">72%</div>
          <span className="text-[10px] text-slate-500">Ambulance & Hospital capacity</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">AI Accuracy Rate</span>
          <div className="text-3xl font-black text-rose-500">94.8%</div>
          <span className="text-[10px] text-slate-500">Severity classification score</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Resolved Rate</span>
          <div className="text-3xl font-black text-amber-400">98.2%</div>
          <span className="text-[10px] text-slate-500">24-hour resolution rate</span>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Emergencies by Type (Bar Chart) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Emergencies Distribution by Type
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.byType || [
                { name: 'Road Accident', count: 12 },
                { name: 'Medical', count: 18 },
                { name: 'Fire', count: 8 },
                { name: 'Disaster', count: 5 },
                { name: 'Crime', count: 7 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#e11d48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergencies by Severity (Pie Chart) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-rose-500" /> Severity Level Breakdown
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={data?.bySeverity || [
                    { name: 'Low', value: 5, color: '#10B981' },
                    { name: 'Medium', value: 12, color: '#F59E0B' },
                    { name: 'High', value: 8, color: '#EF4444' },
                    { name: 'Critical', value: 4, color: '#DC2626' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.bySeverity || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsPage;
