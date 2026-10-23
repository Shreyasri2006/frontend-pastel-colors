import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, AlertTriangle, Droplets, MapPin, TrendingUp, TrendingDown,
  Users, CheckCircle, Clock, BarChart3, ArrowUpRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import api from '../services/api';
import { RiskScoreBadge, RiskGauge } from '../components/RiskScoreBadge';
import { AlertCard } from '../components/AlertCard';
import { SimulateButton } from '../components/SimulateButton';
import { RISK_COLORS } from '../utils';

function StatCard({ icon: Icon, label, value, sub, color, link }: any) {
  const content = (
    <div className="stat-card group cursor-pointer hover:border-orange-100">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5 text-white" size={18} />
        </div>
        {link && <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-stone-700 transition-colors" />}
      </div>
      <div className="text-2xl font-bold text-stone-800">{value}</div>
      <div className="text-sm font-medium text-stone-700">{label}</div>
      {sub && <div className="text-xs text-stone-500 mt-0.5">{sub}</div>}
    </div>
  );
  return link ? <Link to={link}>{content}</Link> : content;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-orange-100 border border-orange-100 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-stone-700 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStats = useCallback(async () => {
    try {
      const data = await api.dashboardStats();
      setStats(data);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats, refreshKey]);

  const handleSimUpdate = () => setRefreshKey(k => k + 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-sky-200 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const s = stats?.summary || {};
  const dist = stats?.riskDistribution || {};
  const trend = stats?.riskTrend || [];
  const waterStatus = stats?.waterStatus || {};

  const pieData = [
    { name: 'Low', value: dist.low || 0, color: RISK_COLORS.low },
    { name: 'Moderate', value: dist.moderate || 0, color: RISK_COLORS.moderate },
    { name: 'High', value: dist.high || 0, color: RISK_COLORS.high },
    { name: 'Critical', value: dist.critical || 0, color: RISK_COLORS.critical },
  ].filter(d => d.value > 0);

  const waterPieData = [
    { name: 'Safe', value: waterStatus.safe || 0, color: '#a7d7b5' },
    { name: 'Moderate', value: waterStatus.moderate || 0, color: '#f6d9a8' },
    { name: 'Unsafe', value: waterStatus.unsafe || 0, color: '#f3b7c5' },
    { name: 'Untested', value: waterStatus.untested || 0, color: '#a8a29e' },
  ].filter(d => d.value > 0);

  return (
    <div className="p-5 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Health Monitoring Dashboard</h1>
          <p className="text-stone-500 text-sm">Northeast India — Water-Borne Disease Surveillance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-200/20 border border-emerald-200/30">
            <div className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
            <span className="text-emerald-700 text-xs font-medium">Live Monitoring</span>
          </div>
          <button onClick={loadStats} className="btn-outline text-xs flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={MapPin} label="Locations" value={s.totalLocations || 0} color="bg-sky-200" link="/locations" />
        <StatCard icon={AlertTriangle} label="Critical Zones" value={s.criticalLocations || 0} color="bg-pink-200" sub="Immediate action" link="/alerts" />
        <StatCard icon={Activity} label="Active Alerts" value={s.activeAlerts || 0} color="bg-orange-200" link="/alerts" />
        <StatCard icon={Droplets} label="Water Sources" value={s.waterSources || 0} color="bg-sky-200" link="/water-sources" />
        <StatCard icon={Users} label="Total Cases" value={s.totalCases || 0} color="bg-pink-600" sub="Last 30 days" link="/health-reports" />
        <StatCard icon={Clock} label="Pending Consults" value={s.pendingConsultations || 0} color="bg-purple-200" link="/consultations" />
      </div>

      {/* Simulate + Alerts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SimulateButton onUpdate={handleSimUpdate} />
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-800" /> Active Alerts
            </h3>
            <Link to="/alerts" className="text-xs text-sky-700 hover:text-sky-600">View all →</Link>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stats?.recentAlerts?.length > 0 ? stats.recentAlerts.map((alert: any) => (
              <div key={alert._id} className={`flex items-start gap-2 p-2 rounded-lg ${alert.severity === 'critical' ? 'bg-pink-200/20 border border-pink-200/30' : 'bg-orange-200/20 border border-orange-200/30'}`}>
                <span>{alert.severity === 'critical' ? '🔴' : '🟠'}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-stone-800 truncate">{alert.location?.name}</p>
                  <p className="text-xs text-stone-500 truncate">{alert.title.replace(/🔴|🟠|⚠️/g, '').trim()}</p>
                </div>
                <span className={`text-xs font-bold flex-shrink-0 ${alert.severity === 'critical' ? 'text-pink-700' : 'text-orange-800'}`}>{alert.riskScore}</span>
              </div>
            )) : (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-emerald-700 mx-auto mb-1" />
                <p className="text-stone-500 text-xs">No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Risk Trend */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-sky-700" />
            <h3 className="font-semibold text-stone-800 text-sm">7-Day Average Risk Trend</h3>
          </div>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fff7ed" />
                <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#a8a29e' }} tickFormatter={(v) => v?.slice(5)} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#a8a29e' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="avgScore" name="Avg Risk Score" stroke="#a7c7e7" strokeWidth={2} dot={{ r: 3, fill: '#a7c7e7' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-stone-500 text-sm">No trend data available</div>
          )}
        </div>

        {/* Risk Distribution Pie */}
        <div className="card">
          <h3 className="font-semibold text-stone-800 text-sm mb-4">Risk Distribution</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} locations`, n]} contentStyle={{ background: '#fff7ed', border: '1px solid #f3e8d8', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-stone-700">{d.name}: <span className="text-stone-800 font-medium">{d.value}</span></span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-stone-500 text-sm">Loading...</div>
          )}
        </div>
      </div>

      {/* Top/Lowest Risk Tables */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Highest Risk */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-pink-700" />
            <h3 className="font-semibold text-stone-800 text-sm">🔴 Highest Risk Locations</h3>
          </div>
          <div className="space-y-2">
            {stats?.topRisk?.map((loc: any, i: number) => (
              <Link key={loc._id} to={`/locations?id=${loc._id}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-orange-100/50 hover:bg-orange-100 transition-colors border border-transparent hover:border-orange-100">
                <span className="text-stone-500 text-sm font-bold w-4">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{loc.name}</p>
                  <p className="text-xs text-stone-500">{loc.type} · {loc.state}</p>
                </div>
                <RiskGauge score={loc.currentRiskScore} size={44} />
              </Link>
            ))}
          </div>
        </div>

        {/* Lowest Risk */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-emerald-700" />
            <h3 className="font-semibold text-stone-800 text-sm">🟢 Lowest Risk Locations</h3>
          </div>
          <div className="space-y-2">
            {stats?.lowestRisk?.map((loc: any, i: number) => (
              <Link key={loc._id} to={`/locations?id=${loc._id}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-orange-100/50 hover:bg-orange-100 transition-colors border border-transparent hover:border-orange-100">
                <span className="text-stone-500 text-sm font-bold w-4">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{loc.name}</p>
                  <p className="text-xs text-stone-500">{loc.type} · {loc.state}</p>
                </div>
                <RiskGauge score={loc.currentRiskScore} size={44} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Water Source Distribution */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-4 h-4 text-sky-700" />
          <h3 className="font-semibold text-stone-800 text-sm">Water Source Safety Status</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Safe', value: waterStatus.safe || 0, color: 'bg-emerald-200/20 border-emerald-200/30 text-emerald-700', icon: '✅' },
            { label: 'Moderate', value: waterStatus.moderate || 0, color: 'bg-amber-200/20 border-amber-200/30 text-amber-800', icon: '⚠️' },
            { label: 'Unsafe', value: waterStatus.unsafe || 0, color: 'bg-pink-200/20 border-pink-200/30 text-pink-700', icon: '❌' },
            { label: 'Untested', value: waterStatus.untested || 0, color: 'bg-orange-100/30 border-orange-200/30 text-stone-700', icon: '❓' },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-3 ${s.color}`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
