// Complete mock database for standalone presentation & demo mode
export const MOCK_USERS = [
  { id: 'usr-1', name: 'Dr. Priya Sharma (Health Director)', email: 'admin@jalraksha.gov.in', role: 'admin' },
  { id: 'usr-2', name: 'Dr. Arindam Das (Chief Medical Officer)', email: 'doctor@jalraksha.gov.in', role: 'doctor' },
  { id: 'usr-3', name: 'Rahul Bora (ASHA Health Worker)', email: 'worker@jalraksha.gov.in', role: 'health_worker' },
  { id: 'usr-4', name: 'Barpeta District Council (Authority)', email: 'authority@jalraksha.gov.in', role: 'village_authority' },
  { id: 'usr-5', name: 'Biplab Hazarika (Community Member)', email: 'user@jalraksha.gov.in', role: 'community_user' },
];

export const MOCK_LOCATIONS = [
  // States
  { _id: 'loc-1', name: 'Assam', type: 'state', state: 'Assam', coordinates: { lat: 26.2006, lng: 92.9376 }, population: 35607039, currentRiskScore: 68, currentRiskLevel: 'high', totalCases: 42, activeCases: 19 },
  { _id: 'loc-2', name: 'Meghalaya', type: 'state', state: 'Meghalaya', coordinates: { lat: 25.4670, lng: 91.3662 }, population: 3366710, currentRiskScore: 24, currentRiskLevel: 'low', totalCases: 8, activeCases: 2 },
  { _id: 'loc-3', name: 'Manipur', type: 'state', state: 'Manipur', coordinates: { lat: 24.6637, lng: 93.9063 }, population: 3091545, currentRiskScore: 35, currentRiskLevel: 'moderate', totalCases: 14, activeCases: 4 },
  { _id: 'loc-4', name: 'Nagaland', type: 'state', state: 'Nagaland', coordinates: { lat: 26.1584, lng: 94.5624 }, population: 2249695, currentRiskScore: 22, currentRiskLevel: 'low', totalCases: 6, activeCases: 1 },
  { _id: 'loc-5', name: 'Tripura', type: 'state', state: 'Tripura', coordinates: { lat: 23.9408, lng: 91.9882 }, population: 3992000, currentRiskScore: 42, currentRiskLevel: 'moderate', totalCases: 16, activeCases: 5 },
  { _id: 'loc-6', name: 'Mizoram', type: 'state', state: 'Mizoram', coordinates: { lat: 23.1645, lng: 92.9376 }, population: 1239244, currentRiskScore: 18, currentRiskLevel: 'low', totalCases: 3, activeCases: 0 },
  { _id: 'loc-7', name: 'Arunachal Pradesh', type: 'state', state: 'Arunachal Pradesh', coordinates: { lat: 28.2180, lng: 94.7278 }, population: 1570458, currentRiskScore: 29, currentRiskLevel: 'moderate', totalCases: 11, activeCases: 3 },
  { _id: 'loc-8', name: 'Sikkim', type: 'state', state: 'Sikkim', coordinates: { lat: 27.5330, lng: 88.5122 }, population: 682073, currentRiskScore: 12, currentRiskLevel: 'low', totalCases: 1, activeCases: 0 },

  // Districts / Cities
  { _id: 'loc-9', name: 'Guwahati', type: 'city', state: 'Assam', district: 'Kamrup Metro', coordinates: { lat: 26.1445, lng: 91.7362 }, population: 962334, currentRiskScore: 28, currentRiskLevel: 'moderate', totalCases: 12, activeCases: 3 },
  { _id: 'loc-10', name: 'Dibrugarh', type: 'district', state: 'Assam', district: 'Dibrugarh', coordinates: { lat: 27.4728, lng: 94.9120 }, population: 1327748, currentRiskScore: 38, currentRiskLevel: 'moderate', totalCases: 21, activeCases: 6 },
  { _id: 'loc-11', name: 'Jorhat', type: 'district', state: 'Assam', district: 'Jorhat', coordinates: { lat: 26.7509, lng: 94.2037 }, population: 1092256, currentRiskScore: 32, currentRiskLevel: 'moderate', totalCases: 15, activeCases: 4 },
  { _id: 'loc-12', name: 'Silchar', type: 'city', state: 'Assam', district: 'Cachar', coordinates: { lat: 24.8333, lng: 92.7789 }, population: 228985, currentRiskScore: 54, currentRiskLevel: 'high', totalCases: 29, activeCases: 11 },
  { _id: 'loc-13', name: 'Tezpur', type: 'city', state: 'Assam', district: 'Sonitpur', coordinates: { lat: 26.6338, lng: 92.7956 }, population: 101000, currentRiskScore: 26, currentRiskLevel: 'moderate', totalCases: 9, activeCases: 2 },
  { _id: 'loc-14', name: 'Barpeta', type: 'district', state: 'Assam', district: 'Barpeta', coordinates: { lat: 26.3224, lng: 91.0048 }, population: 1693622, currentRiskScore: 76, currentRiskLevel: 'critical', totalCases: 54, activeCases: 28 },
  { _id: 'loc-15', name: 'Nagaon', type: 'district', state: 'Assam', district: 'Nagaon', coordinates: { lat: 26.3466, lng: 92.6836 }, population: 2826006, currentRiskScore: 48, currentRiskLevel: 'moderate', totalCases: 22, activeCases: 7 },

  // Capitals
  { _id: 'loc-16', name: 'Shillong', type: 'city', state: 'Meghalaya', district: 'East Khasi Hills', coordinates: { lat: 25.5788, lng: 91.8933 }, population: 354759, currentRiskScore: 19, currentRiskLevel: 'low', totalCases: 4, activeCases: 1 },
  { _id: 'loc-17', name: 'Imphal', type: 'city', state: 'Manipur', district: 'Imphal West', coordinates: { lat: 24.8170, lng: 93.9368 }, population: 414288, currentRiskScore: 33, currentRiskLevel: 'moderate', totalCases: 11, activeCases: 3 },
  { _id: 'loc-18', name: 'Kohima', type: 'city', state: 'Nagaland', district: 'Kohima', coordinates: { lat: 25.6751, lng: 94.1086 }, population: 99039, currentRiskScore: 21, currentRiskLevel: 'low', totalCases: 2, activeCases: 0 },
  { _id: 'loc-19', name: 'Agartala', type: 'city', state: 'Tripura', district: 'West Tripura', coordinates: { lat: 23.8315, lng: 91.2868 }, population: 438011, currentRiskScore: 39, currentRiskLevel: 'moderate', totalCases: 14, activeCases: 4 },
  { _id: 'loc-20', name: 'Aizawl', type: 'city', state: 'Mizoram', district: 'Aizawl', coordinates: { lat: 23.7307, lng: 92.7173 }, population: 400309, currentRiskScore: 16, currentRiskLevel: 'low', totalCases: 1, activeCases: 0 },
  { _id: 'loc-21', name: 'Itanagar', type: 'city', state: 'Arunachal Pradesh', district: 'Papum Pare', coordinates: { lat: 27.0844, lng: 93.6053 }, population: 59490, currentRiskScore: 27, currentRiskLevel: 'moderate', totalCases: 6, activeCases: 2 },
  { _id: 'loc-22', name: 'Gangtok', type: 'city', state: 'Sikkim', district: 'East Sikkim', coordinates: { lat: 27.3389, lng: 88.6065 }, population: 100286, currentRiskScore: 10, currentRiskLevel: 'low', totalCases: 0, activeCases: 0 },

  // Villages
  { _id: 'loc-23', name: 'Rongpur', type: 'village', state: 'Assam', district: 'Barpeta', coordinates: { lat: 26.4012, lng: 91.0891 }, population: 3450, currentRiskScore: 86, currentRiskLevel: 'critical', totalCases: 32, activeCases: 18 },
  { _id: 'loc-24', name: 'Hajo', type: 'village', state: 'Assam', district: 'Kamrup', coordinates: { lat: 26.2441, lng: 91.5308 }, population: 11230, currentRiskScore: 58, currentRiskLevel: 'high', totalCases: 19, activeCases: 8 },
  { _id: 'loc-25', name: 'Sualkuchi', type: 'village', state: 'Assam', district: 'Kamrup', coordinates: { lat: 26.3292, lng: 91.6177 }, population: 12500, currentRiskScore: 45, currentRiskLevel: 'moderate', totalCases: 13, activeCases: 4 },
  { _id: 'loc-26', name: 'Boko', type: 'village', state: 'Assam', district: 'Kamrup', coordinates: { lat: 26.0041, lng: 91.0319 }, population: 8900, currentRiskScore: 37, currentRiskLevel: 'moderate', totalCases: 8, activeCases: 2 },
  { _id: 'loc-27', name: 'Nalbari', type: 'village', state: 'Assam', district: 'Nalbari', coordinates: { lat: 26.4477, lng: 91.4369 }, population: 21000, currentRiskScore: 62, currentRiskLevel: 'high', totalCases: 24, activeCases: 11 },
  { _id: 'loc-28', name: 'Majuli', type: 'village', state: 'Assam', district: 'Majuli', coordinates: { lat: 27.0000, lng: 94.2833 }, population: 167304, currentRiskScore: 72, currentRiskLevel: 'high', totalCases: 41, activeCases: 20 },
  { _id: 'loc-29', name: 'Haflong', type: 'village', state: 'Assam', district: 'Dima Hasao', coordinates: { lat: 25.1638, lng: 93.0144 }, population: 18000, currentRiskScore: 51, currentRiskLevel: 'high', totalCases: 18, activeCases: 7 },
  { _id: 'loc-30', name: 'Morigaon', type: 'village', state: 'Assam', district: 'Morigaon', coordinates: { lat: 26.2500, lng: 92.3333 }, population: 15800, currentRiskScore: 49, currentRiskLevel: 'moderate', totalCases: 15, activeCases: 5 },
];

export const MOCK_WATER_SOURCES = [
  { _id: 'ws-1', name: 'Main Village Pond — Rongpur', type: 'pond', location: MOCK_LOCATIONS[22], coordinates: { lat: 26.4020, lng: 91.0880 }, status: 'unsafe', servedPopulation: 1400, lastTested: new Date(), latestReading: { pH: 5.8, turbidity: 42.0, tds: 780, temperature: 31, coliformCount: 280 } },
  { _id: 'ws-2', name: 'Community Borewell — Rongpur', type: 'borehole', location: MOCK_LOCATIONS[22], coordinates: { lat: 26.4005, lng: 91.0910 }, status: 'moderate', servedPopulation: 950, lastTested: new Date(), latestReading: { pH: 6.4, turbidity: 8.5, tds: 520, temperature: 28, coliformCount: 15 } },
  { _id: 'ws-3', name: 'Barpeta Municipal Tap Line', type: 'tap', location: MOCK_LOCATIONS[13], coordinates: { lat: 26.3210, lng: 91.0060 }, status: 'moderate', servedPopulation: 45000, lastTested: new Date(), latestReading: { pH: 6.8, turbidity: 6.2, tds: 440, temperature: 27, coliformCount: 12 } },
  { _id: 'ws-4', name: 'Brahmaputra River Ghat — Majuli', type: 'river', location: MOCK_LOCATIONS[27], coordinates: { lat: 26.9980, lng: 94.2810 }, status: 'unsafe', servedPopulation: 12000, lastTested: new Date(), latestReading: { pH: 6.1, turbidity: 34.0, tds: 640, temperature: 29, coliformCount: 190 } },
  { _id: 'ws-5', name: 'Shillong Natural Spring', type: 'spring', location: MOCK_LOCATIONS[15], coordinates: { lat: 25.5800, lng: 91.8950 }, status: 'safe', servedPopulation: 8500, lastTested: new Date(), latestReading: { pH: 7.4, turbidity: 1.8, tds: 160, temperature: 21, coliformCount: 0 } },
  { _id: 'ws-6', name: 'Guwahati Water Treatment Plant', type: 'tap', location: MOCK_LOCATIONS[8], coordinates: { lat: 26.1460, lng: 91.7380 }, status: 'safe', servedPopulation: 120000, lastTested: new Date(), latestReading: { pH: 7.3, turbidity: 2.1, tds: 280, temperature: 25, coliformCount: 0 } },
  { _id: 'ws-7', name: 'Hajo Temple Tank Well', type: 'well', location: MOCK_LOCATIONS[23], coordinates: { lat: 26.2450, lng: 91.5320 }, status: 'moderate', servedPopulation: 3200, lastTested: new Date(), latestReading: { pH: 6.6, turbidity: 9.0, tds: 480, temperature: 28, coliformCount: 30 } },
  { _id: 'ws-8', name: 'Gangtok Alpine Source', type: 'spring', location: MOCK_LOCATIONS[21], coordinates: { lat: 27.3400, lng: 88.6080 }, status: 'safe', servedPopulation: 25000, lastTested: new Date(), latestReading: { pH: 7.6, turbidity: 0.8, tds: 110, temperature: 17, coliformCount: 0 } },
];

export const MOCK_ALERTS = [
  {
    _id: 'alt-1',
    location: MOCK_LOCATIONS[22], // Rongpur
    type: 'risk_increase',
    severity: 'critical',
    title: '🔴 CRITICAL ALERT — Rongpur Village Outbreak',
    message: 'High concentration of Diarrhea and Vomiting cases detected. Turbidity in main pond reached 42 NTU (safe < 4). 95mm rainfall caused runoff.',
    riskScore: 86,
    factors: [
      'Turbidity 42 NTU — 10x safe limit',
      'Coliform count: 280 CFU/100ml detected',
      '18 Diarrhea & 12 Vomiting cases in last 48 hours',
      'Heavy runoff rainfall (95 mm/day)',
      'Sanitation score: 28/100 (poor latrine containment)'
    ],
    recommendations: [
      'Issue immediate boil-water advisory',
      'Deploy mobile medical team with ORS & IV fluids',
      'Cordon off Main Village Pond for drinking purposes',
      'Distribute chlorine purification tablets to 450 households'
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    _id: 'alt-2',
    location: MOCK_LOCATIONS[13], // Barpeta
    type: 'water_quality',
    severity: 'critical',
    title: '🔴 CRITICAL — Barpeta District Warning',
    message: 'District composite risk score crossed 76/100 due to multiple village clusters reporting gastrointestinal infections.',
    riskScore: 76,
    factors: ['Multiple village cluster outbreaks', 'Brahmaputra tributary flooding', 'Overwhelmed PHC triage'],
    recommendations: ['Activate Emergency Operation Centre (EOC)', 'Stockpile ORS and antibiotic supplies'],
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'alt-3',
    location: MOCK_LOCATIONS[27], // Majuli
    type: 'flood',
    severity: 'high',
    title: '🟠 HIGH RISK — Majuli Island Flood Runoff',
    message: 'River ghat turbidity elevated to 34 NTU following seasonal swelling. 41 suspected water-borne cases.',
    riskScore: 72,
    factors: ['Riverbank inundation', 'Coliform count 190 CFU', '41 symptomatic patients'],
    recommendations: ['Distribute water filtration kits', 'Chlorinate community storage tanks'],
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'alt-4',
    location: MOCK_LOCATIONS[26], // Nalbari
    type: 'disease_outbreak',
    severity: 'high',
    title: '🟠 HIGH RISK — Nalbari Village Cluster',
    message: '24 reported acute watery diarrhea cases within 3 days. Water source testing in progress.',
    riskScore: 62,
    factors: ['24 cases in short timeframe', 'Fever & abdominal cramps reported'],
    recommendations: ['Isolate suspected well source', 'Conduct household epidemiological survey'],
    status: 'active',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  }
];

export const MOCK_HEALTH_REPORTS = [
  {
    _id: 'hr-1',
    village: MOCK_LOCATIONS[22],
    reportedBy: MOCK_USERS[2],
    symptoms: ['diarrhea', 'vomiting', 'fever', 'abdominal_pain'],
    affectedCount: 18,
    severity: 'severe',
    duration: 2,
    notes: 'Outbreak in Rongpur North tola. Multiple children and elderly patients showing moderate dehydration after drinking untreated pond water.',
    synced: true,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    _id: 'hr-2',
    village: MOCK_LOCATIONS[27],
    reportedBy: MOCK_USERS[2],
    symptoms: ['diarrhea', 'nausea', 'vomiting'],
    affectedCount: 14,
    severity: 'moderate',
    duration: 3,
    notes: 'Flood waters entered shallow wells in Majuli riverbank. Families complaining of stomach cramps.',
    synced: true,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'hr-3',
    village: MOCK_LOCATIONS[23],
    reportedBy: MOCK_USERS[2],
    symptoms: ['fever', 'typhoid'],
    affectedCount: 6,
    severity: 'moderate',
    duration: 4,
    notes: 'Suspected typhoid cluster near Hajo temple tank area.',
    synced: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  }
];

export const MOCK_CONSULTATIONS = [
  {
    _id: 'con-1',
    healthReport: MOCK_HEALTH_REPORTS[0],
    requestedBy: MOCK_USERS[2],
    assignedDoctor: MOCK_USERS[1],
    village: MOCK_LOCATIONS[22],
    status: 'assigned',
    symptoms: ['diarrhea', 'vomiting', 'fever'],
    affectedCount: 18,
    severity: 'severe',
    villageRiskScore: 86,
    villageRiskLevel: 'critical',
    priority: 'urgent',
    notes: 'Urgent consultation needed. 5 children severely dehydrated. ORS packs supplied, requesting physician review and hospital referral authorization.',
    doctorNotes: 'Advised immediate IV Ringer Lactate for 3 severe cases. Direct referral to Barpeta Civil Hospital initiated. Mobile health unit dispatched.',
    followUpDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    referralHospital: 'Barpeta District Civil Hospital',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    _id: 'con-2',
    healthReport: MOCK_HEALTH_REPORTS[1],
    requestedBy: MOCK_USERS[2],
    assignedDoctor: MOCK_USERS[1],
    village: MOCK_LOCATIONS[27],
    status: 'in_progress',
    symptoms: ['diarrhea', 'vomiting'],
    affectedCount: 14,
    severity: 'moderate',
    villageRiskScore: 72,
    villageRiskLevel: 'high',
    priority: 'high',
    notes: 'Majuli riverbank cluster. Patients stable on oral rehydration.',
    doctorNotes: 'Prescribed zinc supplementation for children under 5. Monitor stool frequency for next 48 hours.',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  }
];

export function getMockDashboardStats() {
  const low = MOCK_LOCATIONS.filter(l => l.currentRiskLevel === 'low').length;
  const moderate = MOCK_LOCATIONS.filter(l => l.currentRiskLevel === 'moderate').length;
  const high = MOCK_LOCATIONS.filter(l => l.currentRiskLevel === 'high').length;
  const critical = MOCK_LOCATIONS.filter(l => l.currentRiskLevel === 'critical').length;

  const sorted = [...MOCK_LOCATIONS].filter(l => l.type !== 'state').sort((a, b) => b.currentRiskScore - a.currentRiskScore);
  const topRisk = sorted.slice(0, 5);
  const lowestRisk = [...sorted].reverse().slice(0, 5);

  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 3600 * 1000);
    dates.push({
      _id: d.toISOString().slice(0, 10),
      avgScore: 38 + Math.sin(i) * 8 + (6 - i) * 2.5,
      count: MOCK_LOCATIONS.length,
    });
  }

  return {
    summary: {
      totalLocations: MOCK_LOCATIONS.length,
      criticalLocations: critical,
      activeAlerts: MOCK_ALERTS.length,
      waterSources: MOCK_WATER_SOURCES.length,
      totalCases: 236,
      pendingConsultations: MOCK_CONSULTATIONS.filter(c => c.status === 'pending' || c.status === 'assigned').length,
    },
    riskDistribution: { low, moderate, high, critical },
    riskTrend: dates,
    recentAlerts: MOCK_ALERTS.slice(0, 4),
    waterStatus: { safe: 3, moderate: 3, unsafe: 2, untested: 0 },
    topRisk,
    lowestRisk,
  };
}
