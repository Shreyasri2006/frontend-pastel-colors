import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Search, Filter, Activity, Users, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { RiskScoreBadge, RiskGauge } from '../components/RiskScoreBadge';
import { RISK_COLORS, RISK_LABELS, getRiskLevel } from '../utils';

export function LocationsPage() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('id');

  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [sortBy, setSortBy] = useState('highest');
  const [selectedLoc, setSelectedLoc] = useState<any>(null);
  const [locDetail, setLocDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const states = ['Assam', 'Meghalaya', 'Manipur', 'Nagaland', 'Tripura', 'Mizoram', 'Arunachal Pradesh', 'Sikkim'];

  const loadLocations = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (stateFilter) params.state = stateFilter;
      if (riskFilter) params.riskLevel = riskFilter;
      if (sortBy) params.sortBy = sortBy;

      const data = await api.locations(params);
      setLocations(data);

      if (highlightId) {
        const found = data.find((l: any) => l._id === highlightId);
        if (found) {
          setSelectedLoc(found);
        }
      }
    } catch (err) {
      console.error('Failed to load locations', err);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, stateFilter, riskFilter, sortBy, highlightId]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (selectedLoc?._id) {
      setLoadingDetail(true);
      api.locationDetail(selectedLoc._id)
        .then(setLocDetail)
        .catch(console.error)
        .finally(() => setLoadingDetail(false));
    } else {
      setLocDetail(null);
    }
  }, [selectedLoc?._id]);

  return (
    <div className="p-5 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-700" /> Monitored Locations
          </h1>
          <p className="text-stone-500 text-sm">Districts, Cities, and Villages across Northeast India</p>
        </div>
        <div className="text-xs text-stone-700 font-medium px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100">
          Showing {locations.length} administrative areas
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-3 flex flex-wrap gap-2.5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search location by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-xs py-2"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input text-xs py-2 w-32"
        >
          <option value="">All Types</option>
          <option value="city">Cities</option>
          <option value="district">Districts</option>
          <option value="village">Villages</option>
          <option value="state">States</option>
        </select>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="input text-xs py-2 w-36"
        >
          <option value="">All States</option>
          {states.map(st => <option key={st} value={st}>{st}</option>)}
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="input text-xs py-2 w-36"
        >
          <option value="">All Risk Levels</option>
          <option value="critical">🔴 Critical</option>
          <option value="high">🟠 High</option>
          <option value="moderate">🟡 Moderate</option>
          <option value="low">🟢 Low</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input text-xs py-2 w-36"
        >
          <option value="highest">Highest Risk</option>
          <option value="lowest">Lowest Risk</option>
          <option value="cases">Most Cases</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Locations List */}
        <div className="lg:col-span-2 space-y-2.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-sky-200 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-16 card">
              <MapPin className="w-10 h-10 text-stone-500 mx-auto mb-2" />
              <p className="text-stone-700">No locations found matching the criteria</p>
            </div>
          ) : (
            locations.map((loc) => {
              const isSelected = selectedLoc?._id === loc._id;
              const color = RISK_COLORS[loc.currentRiskLevel as keyof typeof RISK_COLORS] || '#a7d7b5';
              return (
                <div
                  key={loc._id}
                  onClick={() => setSelectedLoc(loc)}
                  className={`card p-3.5 flex items-center justify-between cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-sky-200/60 bg-sky-200/20 shadow-md shadow-sky-200/10'
                      : 'hover:border-orange-100 bg-orange-50/90'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{ background: color + '20', color: color, border: `1px solid ${color}40` }}
                    >
                      {loc.currentRiskScore}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-stone-800 text-sm truncate">{loc.name}</h4>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-orange-100 text-stone-700">
                          {loc.type}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate">
                        {loc.district ? `${loc.district}, ` : ''}{loc.state} · Pop: {(loc.population || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-stone-700">{loc.totalCases || 0} Cases</p>
                      <p className="text-[11px] text-stone-500">{loc.activeCases || 0} active</p>
                    </div>
                    <RiskScoreBadge score={loc.currentRiskScore} size="sm" />
                    <ChevronRight className="w-4 h-4 text-stone-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Location Detail Card */}
        <div className="lg:col-span-1">
          {selectedLoc ? (
            <div className="card sticky top-4 border-orange-100 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-stone-800">{selectedLoc.name}</h3>
                  <p className="text-xs text-stone-700 capitalize">
                    {selectedLoc.type} · {selectedLoc.district ? `${selectedLoc.district}, ` : ''}{selectedLoc.state}
                  </p>
                </div>
                <RiskScoreBadge score={selectedLoc.currentRiskScore} animate={selectedLoc.currentRiskLevel === 'critical'} />
              </div>

              {/* Coordinates & Population */}
              <div className="grid grid-cols-2 gap-2 bg-orange-100/40 p-3 rounded-lg text-xs">
                <div>
                  <span className="text-stone-500 block">Coordinates</span>
                  <span className="text-stone-700 font-mono">
                    {selectedLoc.coordinates?.lat?.toFixed(4)}, {selectedLoc.coordinates?.lng?.toFixed(4)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Population</span>
                  <span className="text-stone-700 font-semibold">
                    {(selectedLoc.population || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Gauge & Subscores */}
              {loadingDetail ? (
                <div className="py-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-sky-200 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : locDetail?.latestRisk ? (
                <>
                  <div className="flex items-center justify-around py-2 border-y border-orange-100">
                    <RiskGauge score={locDetail.latestRisk.score} size={85} />
                    <div className="space-y-1 text-xs">
                      <p className="text-stone-700">Trend: <span className="font-semibold text-stone-800 capitalize">{locDetail.latestRisk.trend?.replace('_', ' ')}</span></p>
                      <p className="text-stone-700">Total Cases: <span className="font-semibold text-orange-800">{selectedLoc.totalCases || 0}</span></p>
                      <p className="text-stone-700">Active Cases: <span className="font-semibold text-pink-700">{selectedLoc.activeCases || 0}</span></p>
                    </div>
                  </div>

                  {/* Factor Breakdown */}
                  <div>
                    <h5 className="text-xs font-bold uppercase text-stone-700 mb-2">Key Risk Factors</h5>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {locDetail.latestRisk.factors?.map((f: any, idx: number) => (
                        <div key={idx} className="text-xs p-2 rounded bg-orange-100/60 border border-orange-100/40">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-semibold text-stone-800">{f.label}</span>
                            <span className="font-bold text-orange-800">+{f.contribution} pts</span>
                          </div>
                          <p className="text-stone-700 text-[11px]">{f.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {locDetail.latestRisk.recommendations?.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold uppercase text-stone-700 mb-2">Preventive Directives</h5>
                      <ul className="space-y-1 text-xs text-stone-700">
                        {locDetail.latestRisk.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-sky-700 mt-0.5">›</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-stone-500 py-4 text-center">
                  No detailed risk assessment history available yet.
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-16 border-dashed border-orange-100">
              <Activity className="w-10 h-10 text-stone-500 mx-auto mb-2" />
              <p className="text-stone-700 text-sm font-medium">Select a location</p>
              <p className="text-stone-500 text-xs mt-1">Click on any village, city, or district on the left to see its risk breakdown and recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationsPage;
