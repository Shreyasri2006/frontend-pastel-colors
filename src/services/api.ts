import {
  MOCK_USERS,
  MOCK_LOCATIONS,
  MOCK_WATER_SOURCES,
  MOCK_ALERTS,
  MOCK_HEALTH_REPORTS,
  MOCK_CONSULTATIONS,
  getMockDashboardStats
} from './mockData';

const API_BASE = 'http://localhost:5000/api';

// In-memory simulation state for client fallback
let simState = {
  running: false,
  step: 0,
  totalSteps: 9,
  steps: [
    { step: 1, title: '✅ Normal State', description: 'Rongpur village — baseline surveillance. Risk score: 22/100 (LOW)', riskScore: 22, status: 'pending' },
    { step: 2, title: '🌧️ Heavy Rainfall Detected', description: '95mm rainfall in 24 hours — Surface runoff contaminates open water sources', riskScore: 35, status: 'pending' },
    { step: 3, title: '💧 Water Quality Drops', description: 'Turbidity spikes to 42 NTU (safe: <4). TDS rises to 780 mg/L. Pond contaminated.', riskScore: 52, status: 'pending' },
    { step: 4, title: '🤒 Disease Reports Incoming', description: '18 diarrhea, 12 vomiting, 22 fever cases reported by field health worker', riskScore: 68, status: 'pending' },
    { step: 5, title: '🧠 AI Pattern Detection', description: 'AI detects correlated spike: rainfall + turbidity + diarrhea = outbreak pattern', riskScore: 78, status: 'pending' },
    { step: 6, title: '📈 Risk Score: CRITICAL', description: 'Risk jumps to 86/100 — CRITICAL. Rongpur village turns RED on map.', riskScore: 86, status: 'pending' },
    { step: 7, title: '🚨 Alert Generated', description: '🔴 CRITICAL Alert issued. Mobile medical teams & boil-water advisory dispatched.', riskScore: 86, status: 'pending' },
    { step: 8, title: '👩‍⚕️ Health Worker Notified', description: 'Rahul Bora receives urgent priority alert. Consultation request filed.', riskScore: 86, status: 'pending' },
    { step: 9, title: '🩺 Doctor Consultation', description: 'Dr. Priya Sharma reviews symptoms. Emergency ORS distribution initiated.', riskScore: 86, status: 'pending' },
  ],
  locationId: 'loc-23',
  startedAt: null as Date | null,
};

let dynamicAlerts = [...MOCK_ALERTS];
let dynamicReports = [...MOCK_HEALTH_REPORTS];
let dynamicConsultations = [...MOCK_CONSULTATIONS];
let dynamicSources = [...MOCK_WATER_SOURCES];

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('jalraksha_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Fast 2s fallback to mock if backend is down

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      localStorage.removeItem('jalraksha_token');
      localStorage.removeItem('jalraksha_user');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (err: any) {
    // If backend is unreachable or timed out, gracefully handle via mock data
    return handleMockFallback<T>(endpoint, options);
  }
}

function handleMockFallback<T>(endpoint: string, options: RequestInit): T {
  // Auth Login
  if (endpoint === '/auth/login' && options.method === 'POST') {
    const body = JSON.parse(options.body as string || '{}');
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === body.email?.toLowerCase()) || {
      id: 'demo-user',
      name: body.email?.split('@')[0] || 'Demo User',
      email: body.email || 'demo@jalraksha.gov.in',
      role: 'admin',
    };
    return { token: 'mock-jwt-token-demo', user } as T;
  }

  // Dashboard Stats
  if (endpoint === '/dashboard/stats') {
    return getMockDashboardStats() as T;
  }

  // Top Risk
  if (endpoint === '/locations/top-risk') {
    const sorted = [...MOCK_LOCATIONS].filter(l => l.type !== 'state').sort((a, b) => b.currentRiskScore - a.currentRiskScore);
    return {
      highest: sorted.slice(0, 5),
      lowest: [...sorted].reverse().slice(0, 5),
    } as T;
  }

  // Locations list
  if (endpoint.startsWith('/locations')) {
    const url = new URL(`http://localhost${endpoint}`);
    const type = url.searchParams.get('type');
    const state = url.searchParams.get('state');
    const riskLevel = url.searchParams.get('riskLevel');
    const search = url.searchParams.get('search')?.toLowerCase();
    const sortBy = url.searchParams.get('sortBy');

    let filtered = [...MOCK_LOCATIONS];
    if (type) filtered = filtered.filter(l => l.type === type);
    if (state) filtered = filtered.filter(l => l.state === state);
    if (riskLevel) filtered = filtered.filter(l => l.currentRiskLevel === riskLevel);
    if (search) filtered = filtered.filter(l => l.name.toLowerCase().includes(search));

    if (sortBy === 'lowest') filtered.sort((a, b) => a.currentRiskScore - b.currentRiskScore);
    else if (sortBy === 'cases') filtered.sort((a, b) => b.totalCases - a.totalCases);
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else filtered.sort((a, b) => b.currentRiskScore - a.currentRiskScore);

    // Single location detail
    const pathParts = endpoint.split('?')[0].split('/');
    if (pathParts.length === 3 && pathParts[2]) {
      const locId = pathParts[2];
      const loc = MOCK_LOCATIONS.find(l => l._id === locId) || MOCK_LOCATIONS[0];
      return {
        location: loc,
        latestRisk: {
          score: loc.currentRiskScore,
          level: loc.currentRiskLevel,
          waterQualityScore: Math.round(loc.currentRiskScore * 0.4),
          diseaseScore: Math.round(loc.currentRiskScore * 0.3),
          environmentalScore: Math.round(loc.currentRiskScore * 0.2),
          sanitationScore: Math.round(loc.currentRiskScore * 0.1),
          trend: loc.currentRiskScore > 70 ? 'rapidly_worsening' : loc.currentRiskScore > 40 ? 'worsening' : 'stable',
          factors: [
            { label: 'Water Turbidity', value: loc.currentRiskScore > 60 ? '42 NTU (Critical)' : '4.2 NTU (Normal)', contribution: loc.currentRiskScore > 60 ? 10 : 2, severity: loc.currentRiskScore > 60 ? 'critical' : 'safe', description: 'Elevated particle suspension indicates potential pathogen contamination' },
            { label: 'Diarrhea Clusters', value: `${loc.activeCases} active cases`, contribution: loc.activeCases > 10 ? 12 : 3, severity: loc.activeCases > 10 ? 'danger' : 'warning', description: 'Surge in acute gastrointestinal symptoms reported by ASHA workers' },
            { label: 'Rainfall Runoff', value: '95 mm/day', contribution: 8, severity: 'danger', description: 'Heavy monsoon showers causing runoff into unprotected wells' },
          ],
          recommendations: [
            'Issue immediate boil-water directive across the administrative area',
            'Deploy mobile medical triage units with ORS and purification tablets',
            'Close or chlorinate all surface ponds and open shallow wells',
            'Conduct emergency microbiological water testing'
          ]
        },
        activeAlerts: dynamicAlerts.filter(a => a.location?._id === loc._id),
      } as T;
    }

    return filtered as T;
  }

  // Water Sources
  if (endpoint.startsWith('/water-sources')) {
    const url = new URL(`http://localhost${endpoint}`);
    const status = url.searchParams.get('status');
    let res = [...dynamicSources];
    if (status) res = res.filter(s => s.status === status);
    return res as T;
  }

  // Health Reports
  if (endpoint.startsWith('/health-reports')) {
    if (options.method === 'POST') {
      const data = JSON.parse(options.body as string || '{}');
      const newReport = {
        _id: `hr-${Date.now()}`,
        village: MOCK_LOCATIONS.find(l => l._id === data.village) || MOCK_LOCATIONS[22],
        reportedBy: MOCK_USERS[2],
        symptoms: data.symptoms || ['diarrhea'],
        affectedCount: data.affectedCount || 1,
        severity: data.severity || 'moderate',
        duration: data.duration || 1,
        notes: data.notes || '',
        synced: true,
        createdAt: new Date().toISOString(),
      };
      dynamicReports.unshift(newReport);
      return newReport as T;
    }
    return dynamicReports as T;
  }

  // Alerts
  if (endpoint.startsWith('/alerts')) {
    const parts = endpoint.split('?')[0].split('/');
    if (options.method === 'PATCH') {
      const alertId = parts[2];
      const alert = dynamicAlerts.find(a => a._id === alertId);
      if (alert) {
        if (parts[3] === 'resolve') alert.status = 'resolved';
        if (parts[3] === 'acknowledge') alert.status = 'acknowledged';
      }
      return alert as T;
    }
    return dynamicAlerts as T;
  }

  // Consultations
  if (endpoint.startsWith('/consultations')) {
    if (options.method === 'PATCH') {
      const parts = endpoint.split('/');
      const id = parts[2];
      const body = JSON.parse(options.body as string || '{}');
      const consult = dynamicConsultations.find(c => c._id === id);
      if (consult) {
        Object.assign(consult, body);
      }
      return consult as T;
    }
    return dynamicConsultations as T;
  }

  // Simulation Start
  if (endpoint === '/simulate/start') {
    simState.running = true;
    simState.step = 0;
    simState.startedAt = new Date();
    simState.steps.forEach(s => (s.status = 'pending'));

    // Execute progressive client-side simulation loop
    let current = 0;
    const interval = setInterval(() => {
      if (current < simState.steps.length) {
        simState.steps[current].status = 'running';
        simState.step = current + 1;
        setTimeout(() => {
          if (simState.steps[current]) {
            simState.steps[current].status = 'done';
          }
        }, 1200);
        current++;
      } else {
        simState.running = false;
        clearInterval(interval);
      }
    }, 1500);

    return { message: 'Simulation started', state: simState } as T;
  }

  // Simulation Status
  if (endpoint === '/simulate/status') {
    return simState as T;
  }

  // Simulation Reset
  if (endpoint === '/simulate/reset') {
    simState.running = false;
    simState.step = 0;
    simState.steps.forEach(s => (s.status = 'pending'));
    return { message: 'Simulation reset' } as T;
  }

  return [] as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => apiRequest<any>('/auth/me'),

  // Dashboard
  dashboardStats: () => apiRequest<any>('/dashboard/stats'),

  // Locations
  locations: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>(`/locations${query}`);
  },
  locationDetail: (id: string) => apiRequest<any>(`/locations/${id}`),
  topRisk: () => apiRequest<{ highest: any[]; lowest: any[] }>('/locations/top-risk'),

  // Water Sources
  waterSources: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>(`/water-sources${query}`);
  },

  // Health Reports
  healthReports: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>(`/health-reports${query}`);
  },
  createHealthReport: (data: any) =>
    apiRequest<any>('/health-reports', { method: 'POST', body: JSON.stringify(data) }),

  // Risk
  riskLatest: (locationId: string) => apiRequest<any>(`/risk/${locationId}/latest`),
  riskHistory: (locationId: string, days = 30) => apiRequest<any[]>(`/risk/${locationId}/history?days=${days}`),

  // Alerts
  alerts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>(`/alerts${query}`);
  },
  resolveAlert: (id: string) => apiRequest<any>(`/alerts/${id}/resolve`, { method: 'PATCH' }),
  acknowledgeAlert: (id: string) => apiRequest<any>(`/alerts/${id}/acknowledge`, { method: 'PATCH' }),

  // Consultations
  consultations: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>(`/consultations${query}`);
  },
  createConsultation: (data: any) =>
    apiRequest<any>('/consultations', { method: 'POST', body: JSON.stringify(data) }),
  updateConsultation: (id: string, data: any) =>
    apiRequest<any>(`/consultations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Simulation
  simulateStart: () => apiRequest<any>('/simulate/start', { method: 'POST' }),
  simulateStatus: () => apiRequest<any>('/simulate/status'),
  simulateReset: () => apiRequest<any>('/simulate/reset', { method: 'POST' }),
};

export default api;
