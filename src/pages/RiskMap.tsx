import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, SlidersHorizontal, TrendingUp, TrendingDown, MapPin, Droplets, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { RISK_COLORS, RISK_ICONS, RISK_LABELS, getRiskLevel } from '../utils';
import { RiskScoreBadge, RiskGauge } from '../components/RiskScoreBadge';

type MapLayer = 'district' | 'village' | 'water';
type SortMode = 'highest' | 'lowest' | 'cases';
type FilterRisk = '' | 'low' | 'moderate' | 'high' | 'critical';

function MapRecenter({ locations }: { locations: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const lats = locations.map(l => l.coordinates.lat);
      const lngs = locations.map(l => l.coordinates.lng);
      const bounds: [[number, number], [number, number]] = [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ];
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [locations.length]);
  return null;
}

function LocationDetailPanel({ location, onClose }: { location: any; onClose: () => void }) {
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    if (location?._id) {
      api.locationDetail(location._id).then(setDetail).catch(() => {});
    }
  }, [location?._id]);

  const loc = detail?.location || location;
  const latestRisk = detail?.latestRisk;

  return (
    <div className="absolute right-3 top-3 bottom-3 w-72 z-[1000] bg-orange-50/95 backdrop-blur-xl border border-orange-100/60 rounded-2xl shadow-2xl overflow-y-auto">
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-stone-800 text-base">{loc.name}</h3>
            <p className="text-stone-500 text-xs">{loc.type} · {loc.state}</p>
            {loc.district && <p className="text-stone-500 text-xs">{loc.district}</p>}
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-800 ml-2 p-1 rounded">✕</button>
        </div>

        {/* Risk Gauge */}
        <div className="flex items-center gap-4 mb-4">
          <RiskGauge score={loc.currentRiskScore || 0} size={80} />
          <div>
            <RiskScoreBadge score={loc.currentRiskScore || 0} animate={loc.currentRiskLevel === 'critical'} />
            <p className="text-stone-700 text-xs mt-1">Population: {(loc.population || 0).toLocaleString()}</p>
            <p className="text-stone-700 text-xs">Cases: {loc.totalCases || 0} total</p>
            <p className="text-stone-700 text-xs">Active: {loc.activeCases || 0}</p>
          </div>
        </div>

        {/* Risk Factors */}
        {latestRisk?.factors?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">Risk Factors</p>
            <div className="space-y-1.5">
              {latestRisk.factors.slice(0, 5).map((f: any, i: number) => (
                <div key={i} className={`flex items-start gap-2 p-2 rounded-lg text-xs ${f.severity === 'critical' ? 'bg-pink-200/20' : f.severity === 'danger' ? 'bg-orange-200/20' : f.severity === 'warning' ? 'bg-amber-200/20' : 'bg-emerald-200/20'}`}>
                  <span className="font-medium text-stone-700 flex-shrink-0">{f.label}:</span>
                  <span className="text-stone-700">{f.value}</span>
                  {f.contribution > 0 && <span className="ml-auto font-bold text-orange-800 flex-shrink-0">+{f.contribution}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-scores */}
        {latestRisk && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">Score Breakdown</p>
            {[
              { label: '💧 Water Quality', score: latestRisk.waterQualityScore, max: 40 },
              { label: '🤒 Disease Reports', score: latestRisk.diseaseScore, max: 30 },
              { label: '🌧️ Environmental', score: latestRisk.environmentalScore, max: 20 },
              { label: '🚽 Sanitation', score: latestRisk.sanitationScore, max: 10 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-stone-700 w-36 flex-shrink-0">{item.label}</span>
                <div className="flex-1 bg-orange-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${(item.score / item.max) * 100}%`, background: item.score > item.max * 0.7 ? '#f3b7c5' : item.score > item.max * 0.4 ? '#f6c28b' : '#a7d7b5' }}
                  />
                </div>
                <span className="text-xs text-stone-500 w-10 text-right">{item.score}/{item.max}</span>
              </div>
            ))}
          </div>
        )}

        {/* Active Alerts */}
        {detail?.activeAlerts?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide mb-2">🚨 Active Alerts ({detail.activeAlerts.length})</p>
            {detail.activeAlerts.map((alert: any) => (
              <div key={alert._id} className="bg-pink-200/20 border border-pink-200/30 rounded-lg p-2 mb-1.5">
                <p className="text-xs font-medium text-pink-600">{alert.title}</p>
                <p className="text-xs text-stone-500 mt-0.5">{alert.message.slice(0, 80)}...</p>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {latestRisk?.recommendations?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">Recommendations</p>
            <ul className="space-y-1">
              {latestRisk.recommendations.slice(0, 4).map((r: string, i: number) => (
                <li key={i} className="text-xs text-stone-700 leading-relaxed">{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function RiskMapPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [waterSources, setWaterSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [layer, setLayer] = useState<MapLayer>('district');
  const [filterRisk, setFilterRisk] = useState<FilterRisk>('');
  const [filterState, setFilterState] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('highest');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [topRisk, setTopRisk] = useState<{ highest: any[]; lowest: any[] } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterRisk) params.riskLevel = filterRisk;
      if (filterState) params.state = filterState;
      if (sortMode === 'highest') params.sortBy = 'highest';
      else if (sortMode === 'lowest') params.sortBy = 'lowest';
      else if (sortMode === 'cases') params.sortBy = 'cases';

      if (layer === 'district') {
        const [cities, districts] = await Promise.all([
          api.locations({ ...params, type: 'city' }),
          api.locations({ ...params, type: 'district' }),
        ]);
        setLocations([...cities, ...districts]);
      } else if (layer === 'village') {
        const data = await api.locations({ ...params, type: 'village' });
        setLocations(data);
      }

      if (layer === 'water') {
        const ws = await api.waterSources();
        setWaterSources(ws);
      }

      const top = await api.topRisk();
      setTopRisk(top);
    } catch (err) {
      console.error('Failed to load map data:', err);
    } finally {
      setLoading(false);
    }
  }, [layer, filterRisk, filterState, sortMode]);

  useEffect(() => { loadData(); }, [loadData]);

  const states = ['Assam', 'Meghalaya', 'Manipur', 'Nagaland', 'Tripura', 'Mizoram', 'Arunachal Pradesh', 'Sikkim'];

  const getMarkerRadius = (loc: any) => {
    if (loc.type === 'city') return 18;
    if (loc.type === 'district') return 15;
    return 10;
  };

  const displayLocations = layer !== 'water' ? locations : [];
  const displayWater = layer === 'water' ? waterSources : [];

  return (
    <div className="flex h-[calc(100vh-0px)] relative overflow-hidden">
      {/* Left Panel */}
      <div className="w-72 flex-shrink-0 bg-orange-50/90 border-r border-orange-100 flex flex-col z-10 overflow-y-auto">
        <div className="p-4 border-b border-orange-100">
          <h2 className="font-bold text-stone-800 flex items-center gap-2 text-sm">
            <span className="text-2xl">🗺️</span> Risk Map
          </h2>
          <p className="text-stone-500 text-xs mt-0.5">Northeast India — Interactive Health Risk</p>
        </div>

        {/* Layer Toggle */}
        <div className="p-3 border-b border-orange-100">
          <p className="label mb-2">Map Layer</p>
          <div className="space-y-1">
            {([
              { key: 'district', label: '🏙️ City/District View', desc: 'Urban areas and districts' },
              { key: 'village', label: '🏘️ Village View', desc: 'Individual village risk' },
              { key: 'water', label: '💧 Water Sources', desc: 'Safe/unsafe sources' },
            ] as const).map(l => (
              <button key={l.key} onClick={() => setLayer(l.key)} className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${layer === l.key ? 'bg-sky-200/20 border-sky-200/40 text-sky-600' : 'border-transparent hover:bg-orange-100 text-stone-700'}`}>
                <div className="font-medium">{l.label}</div>
                <div className="text-stone-500">{l.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-orange-100 space-y-2">
          <p className="label">Filters</p>
          <select value={filterState} onChange={e => setFilterState(e.target.value)} className="input text-xs py-1.5">
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterRisk} onChange={e => setFilterRisk(e.target.value as FilterRisk)} className="input text-xs py-1.5">
            <option value="">All Risk Levels</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="moderate">🟡 Moderate</option>
            <option value="low">🟢 Low</option>
          </select>
          <div className="grid grid-cols-3 gap-1">
            {([{ key: 'highest', label: '↑ Highest' }, { key: 'lowest', label: '↓ Lowest' }, { key: 'cases', label: '⚕ Cases' }] as const).map(s => (
              <button key={s.key} onClick={() => setSortMode(s.key)} className={`text-xs px-2 py-1.5 rounded-lg border transition-all ${sortMode === s.key ? 'bg-sky-200/20 border-sky-200/40 text-sky-600' : 'border-orange-100 hover:bg-orange-100 text-stone-700'}`}>
                {s.label}
              </button>
            ))}
          </div>
          <button onClick={loadData} className="btn-outline w-full text-xs flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3 h-3" /> Apply
          </button>
        </div>

        {/* Legend */}
        <div className="p-3 border-b border-orange-100">
          <p className="label mb-2">Risk Legend</p>
          {(['critical', 'high', 'moderate', 'low'] as const).map(level => (
            <div key={level} className="flex items-center gap-2 mb-1.5">
              <div className="w-3.5 h-3.5 rounded-full border-2" style={{ background: RISK_COLORS[level] + '40', borderColor: RISK_COLORS[level] }} />
              <span className="text-xs text-stone-700">{RISK_ICONS[level]} {RISK_LABELS[level]}</span>
            </div>
          ))}
        </div>

        {/* Top 5 Highest */}
        {topRisk && (
          <div className="p-3 border-b border-orange-100">
            <p className="label mb-2 text-pink-700">🔴 Top 5 Highest Risk</p>
            {topRisk.highest.slice(0, 5).map((loc: any, i: number) => (
              <button key={loc._id} onClick={() => setSelectedLocation(loc)} className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-orange-100 transition-colors text-left mb-0.5">
                <span className="text-stone-500 text-xs w-3">#{i + 1}</span>
                <span className="text-xs text-stone-700 flex-1 truncate">{loc.name}</span>
                <span className="text-xs font-bold" style={{ color: RISK_COLORS[loc.currentRiskLevel as keyof typeof RISK_COLORS] || '#a7d7b5' }}>{loc.currentRiskScore}</span>
              </button>
            ))}
          </div>
        )}

        {/* Top 5 Lowest */}
        {topRisk && (
          <div className="p-3">
            <p className="label mb-2 text-emerald-700">🟢 Top 5 Lowest Risk</p>
            {topRisk.lowest.slice(0, 5).map((loc: any, i: number) => (
              <button key={loc._id} onClick={() => setSelectedLocation(loc)} className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-orange-100 transition-colors text-left mb-0.5">
                <span className="text-stone-500 text-xs w-3">#{i + 1}</span>
                <span className="text-xs text-stone-700 flex-1 truncate">{loc.name}</span>
                <span className="text-xs font-bold text-emerald-700">{loc.currentRiskScore}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-orange-50/70 z-[2000] flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-sky-200 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-stone-700 text-sm">Loading map data...</p>
            </div>
          </div>
        )}

        <MapContainer
          center={[26.0, 93.0]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Location markers */}
          {displayLocations.map(loc => {
            const color = RISK_COLORS[loc.currentRiskLevel as keyof typeof RISK_COLORS] || RISK_COLORS.low;
            const radius = getMarkerRadius(loc);
            return (
              <CircleMarker
                key={loc._id}
                center={[loc.coordinates.lat, loc.coordinates.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.8,
                  color: color,
                  weight: loc.currentRiskLevel === 'critical' ? 3 : 2,
                  opacity: 1,
                }}
                eventHandlers={{ click: () => setSelectedLocation(loc) }}
              >
                <Popup>
                  <div className="min-w-48">
                    <div className="font-bold text-stone-800 text-sm">{loc.name}</div>
                    <div className="text-stone-700 text-xs">{loc.type} · {loc.state}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span style={{ color }} className="text-2xl font-black">{loc.currentRiskScore}</span>
                      <div>
                        <div className="text-xs font-semibold" style={{ color }}>{RISK_ICONS[loc.currentRiskLevel as keyof typeof RISK_ICONS] || '🟢'} {RISK_LABELS[loc.currentRiskLevel as keyof typeof RISK_LABELS] || 'LOW'}</div>
                        <div className="text-stone-500 text-xs">Pop: {(loc.population || 0).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-xs text-stone-500 mt-1">Active cases: {loc.activeCases || 0}</div>
                    <button onClick={() => setSelectedLocation(loc)} className="mt-2 text-xs text-sky-700 hover:text-sky-600 underline">View details →</button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Water source markers */}
          {displayWater.map(ws => {
            const statusColor = ws.status === 'safe' ? '#a7d7b5' : ws.status === 'unsafe' ? '#f3b7c5' : '#f6d9a8';
            return (
              <CircleMarker
                key={ws._id}
                center={[ws.coordinates.lat, ws.coordinates.lng]}
                radius={8}
                pathOptions={{ fillColor: statusColor, fillOpacity: 0.9, color: statusColor, weight: 2 }}
              >
                <Popup>
                  <div>
                    <div className="font-bold text-stone-800 text-sm">{ws.name}</div>
                    <div className="text-stone-700 text-xs capitalize">{ws.type}</div>
                    <div className="text-xs mt-1" style={{ color: statusColor }}>Status: {ws.status?.toUpperCase()}</div>
                    {ws.latestReading && (
                      <div className="text-xs text-stone-500 mt-1 space-y-0.5">
                        <div>pH: {ws.latestReading.pH}</div>
                        <div>Turbidity: {ws.latestReading.turbidity} NTU</div>
                        <div>TDS: {ws.latestReading.tds} mg/L</div>
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {displayLocations.length > 0 && <MapRecenter locations={displayLocations} />}
        </MapContainer>

        {/* Location Count Badge */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-orange-50/90 border border-orange-100 rounded-xl px-4 py-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-sky-700" />
            <span className="text-stone-700 font-medium">{displayLocations.length + displayWater.length} locations shown</span>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedLocation && (
        <div className="absolute inset-0 pointer-events-none z-[999]">
          <div className="pointer-events-auto absolute right-0 top-0 h-full">
            <LocationDetailPanel location={selectedLocation} onClose={() => setSelectedLocation(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default RiskMapPage;
