import React, { useEffect, useState, useCallback } from 'react';
import { Droplets, ShieldAlert, CheckCircle, AlertTriangle, Plus, RefreshCw, Send, Loader2 } from 'lucide-react';
import api from '../services/api';

export function WaterSourcesPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [readingForm, setReadingForm] = useState({
    pH: 7.2,
    turbidity: 3.5,
    tds: 250,
    temperature: 24,
    coliformCount: 0,
  });

  const loadSources = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const data = await api.waterSources(params);
      setSources(data);
    } catch (err) {
      console.error('Failed to load water sources', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const handleOpenReading = (source: any) => {
    setSelectedSource(source);
    if (source.latestReading) {
      setReadingForm({
        pH: source.latestReading.pH || 7.0,
        turbidity: source.latestReading.turbidity || 4.0,
        tds: source.latestReading.tds || 300,
        temperature: source.latestReading.temperature || 25,
        coliformCount: source.latestReading.coliformCount || 0,
      });
    }
    setShowModal(true);
  };

  const handleReadingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSource) return;
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/water-sources/${selectedSource._id}/reading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(readingForm),
      });
      if (!res.ok) throw new Error('Failed to submit reading');
      setShowModal(false);
      loadSources();
    } catch (err: any) {
      alert('Error updating reading: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'safe':
        return <span className="badge-low"><CheckCircle className="w-3 h-3" /> Safe Potable</span>;
      case 'moderate':
        return <span className="badge-moderate"><AlertTriangle className="w-3 h-3" /> Moderate Risk</span>;
      case 'unsafe':
        return <span className="badge-critical"><ShieldAlert className="w-3 h-3" /> Contaminated</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-orange-100 text-stone-700 border border-orange-100">Untested</span>;
    }
  };

  return (
    <div className="p-5 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-700" /> Water Quality & Sources
          </h1>
          <p className="text-stone-500 text-sm">Monitoring wells, ponds, rivers, taps, and boreholes</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadSources} className="btn-outline text-xs flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Threshold Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3 border-orange-100 bg-orange-50/60">
          <div className="text-xs text-stone-700 font-medium">Safe pH Level</div>
          <div className="text-lg font-bold text-stone-800 mt-1">6.5 – 8.5</div>
          <div className="text-[11px] text-stone-500">WHO Potable Standard</div>
        </div>
        <div className="card p-3 border-orange-100 bg-orange-50/60">
          <div className="text-xs text-stone-700 font-medium">Turbidity Limit</div>
          <div className="text-lg font-bold text-stone-800 mt-1">&lt; 4.0 NTU</div>
          <div className="text-[11px] text-stone-500">&gt; 10 NTU causes alerts</div>
        </div>
        <div className="card p-3 border-orange-100 bg-orange-50/60">
          <div className="text-xs text-stone-700 font-medium">Total Dissolved Solids</div>
          <div className="text-lg font-bold text-stone-800 mt-1">&lt; 500 mg/L</div>
          <div className="text-[11px] text-stone-500">Permissible up to 1000 mg/L</div>
        </div>
        <div className="card p-3 border-orange-100 bg-orange-50/60">
          <div className="text-xs text-stone-700 font-medium">Fecal Coliform</div>
          <div className="text-lg font-bold text-stone-800 mt-1">0 CFU/100ml</div>
          <div className="text-[11px] text-pink-700">Zero tolerance pathogen standard</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 items-center card p-3">
        <span className="text-xs text-stone-700 font-medium mr-2">Filter Status:</span>
        {['', 'safe', 'moderate', 'unsafe'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 text-xs rounded-lg border transition-all capitalize ${
              statusFilter === status
                ? 'bg-sky-200/20 border-sky-200/40 text-sky-600'
                : 'border-orange-100 hover:bg-orange-100 text-stone-700'
            }`}
          >
            {status || 'All Sources'}
          </button>
        ))}
      </div>

      {/* Sources Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-sky-200 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sources.length === 0 ? (
        <div className="text-center py-16 card">
          <Droplets className="w-10 h-10 text-stone-500 mx-auto mb-2" />
          <p className="text-stone-700">No water sources found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((src) => (
            <div key={src._id} className="card border-orange-100 hover:border-orange-100 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-stone-800 text-sm">{src.name}</h3>
                    <p className="text-xs text-stone-500 capitalize">{src.type} · {src.location?.name}, {src.location?.state}</p>
                  </div>
                  {getStatusBadge(src.status)}
                </div>

                <div className="bg-orange-100/40 rounded-lg p-3 my-3 space-y-2">
                  <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Latest Water Test</div>
                  {src.latestReading ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-stone-500">pH: </span>
                        <span className={`font-semibold ${src.latestReading.pH < 6.5 || src.latestReading.pH > 8.5 ? 'text-pink-700' : 'text-stone-800'}`}>
                          {src.latestReading.pH}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500">Turbidity: </span>
                        <span className={`font-semibold ${src.latestReading.turbidity > 10 ? 'text-pink-700' : src.latestReading.turbidity > 4 ? 'text-amber-800' : 'text-stone-800'}`}>
                          {src.latestReading.turbidity} NTU
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500">TDS: </span>
                        <span className={`font-semibold ${src.latestReading.tds > 500 ? 'text-amber-800' : 'text-stone-800'}`}>
                          {src.latestReading.tds} mg/L
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500">Coliform: </span>
                        <span className={`font-semibold ${src.latestReading.coliformCount > 0 ? 'text-pink-700' : 'text-emerald-700'}`}>
                          {src.latestReading.coliformCount} CFU
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-500 italic">No recent sensor reading available</div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>Pop. Served: {(src.servedPopulation || 0).toLocaleString()}</span>
                  <span>Tested: {src.lastTested ? new Date(src.lastTested).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-orange-100 flex justify-end">
                <button
                  onClick={() => handleOpenReading(src)}
                  className="btn text-xs bg-sky-200/20 hover:bg-sky-200/30 text-sky-600 border border-sky-200/30 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Sensor Reading
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Submitting Water Reading */}
      {showModal && selectedSource && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full border-orange-100 animate-slide-in">
            <h3 className="font-bold text-stone-800 text-base mb-1">Log Water Quality Test</h3>
            <p className="text-xs text-stone-700 mb-4">{selectedSource.name} ({selectedSource.location?.name})</p>

            <form onSubmit={handleReadingSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">pH Level (6.5 – 8.5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={readingForm.pH}
                    onChange={(e) => setReadingForm({ ...readingForm, pH: parseFloat(e.target.value) })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Turbidity (NTU)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={readingForm.turbidity}
                    onChange={(e) => setReadingForm({ ...readingForm, turbidity: parseFloat(e.target.value) })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">TDS (mg/L)</label>
                  <input
                    type="number"
                    min="0"
                    value={readingForm.tds}
                    onChange={(e) => setReadingForm({ ...readingForm, tds: parseInt(e.target.value) })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={readingForm.temperature}
                    onChange={(e) => setReadingForm({ ...readingForm, temperature: parseFloat(e.target.value) })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Coliform Count (CFU/100ml)</label>
                <input
                  type="number"
                  min="0"
                  value={readingForm.coliformCount}
                  onChange={(e) => setReadingForm({ ...readingForm, coliformCount: parseInt(e.target.value) })}
                  className="input"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? 'Saving Reading...' : 'Submit & Recalculate Risk'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WaterSourcesPage;
