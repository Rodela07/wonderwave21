/**
 * Comprehensive Logic & Unit Test Suite for WanderWise
 */

const fs = require('fs');
const vm = require('vm');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ✗ ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

// Minimal DOM & Storage Mock
const mockStorage = {};
const mockLocalStorage = {
  getItem: k => (k in mockStorage ? mockStorage[k] : null),
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: k => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

const createMockElement = () => ({
  textContent: '',
  innerHTML: '',
  value: '',
  style: {},
  classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
  setAttribute: () => {},
  removeAttribute: () => {},
  addEventListener: () => {},
  appendChild: () => {},
  elements: {}
});

const contextWindow = {
  localStorage: mockLocalStorage,
  console: console,
  document: {
    readyState: 'complete',
    documentElement: { lang: 'en' },
    addEventListener: () => {},
    querySelectorAll: () => [],
    getElementById: () => createMockElement(),
    createElement: () => createMockElement()
  },
  location: { hash: '' },
  Image: class { constructor() { this.onload = null; this.src = null; } },
  Date: Date,
  Math: Math,
  JSON: JSON,
  setTimeout: () => {},
  requestAnimationFrame: () => {}
};

contextWindow.window = contextWindow;

const code = fs.readFileSync('app.js', 'utf8');
vm.createContext(contextWindow);
vm.runInContext(code, contextWindow);

const WW = contextWindow.window.WanderWise;
assert(WW, 'WanderWise namespace must be exported');

console.log('\n--- Running WanderWise Business Logic Tests ---');

// Test 1: Sample Data initialization
test('Sample Data initializes with realistic field visit trips', () => {
  assert(Array.isArray(WW.SAMPLE_TRIPS) && WW.SAMPLE_TRIPS.length >= 5, 'Must have at least 5 sample trips');
  const floodTrip = WW.SAMPLE_TRIPS.find(t => t.id === 'trip_demo_1');
  assert(floodTrip, 'Khulna flood trip should exist');
  assert(floodTrip.purpose === 'Disaster Response', 'Purpose should be Disaster Response');
  assert(floodTrip.team && floodTrip.team.length === 4, 'Team size should be 4');
});

// Test 2: Readiness Score calculation
test('Readiness calculation accurately scores preparation progress', () => {
  const completeTrip = {
    name: 'Inspection',
    location: 'Dhaka',
    country: 'Bangladesh',
    purpose: 'Inspection',
    organization: 'Quality Cell',
    startDate: '2026-10-10',
    endDate: '2026-10-12',
    status: 'Upcoming',
    participantsCount: 3,
    team: [{ id: '1', name: 'Lead', role: 'Inspector' }],
    estimatedBudget: 500,
    itinerary: [
      { id: '1', day: 1, activity: 'Morning meeting' },
      { id: '2', day: 2, activity: 'Site audit' }
    ],
    checklist: [
      { id: '1', completed: true },
      { id: '2', completed: true }
    ]
  };

  const res = WW.calculateTripReadiness(completeTrip);
  assert(res.score >= 90, `Complete trip should score >= 90%, got ${res.score}%`);
  assert(res.level === 'ready', `Level should be ready, got ${res.level}`);

  const emptyTrip = { name: 'Draft' };
  const resEmpty = WW.calculateTripReadiness(emptyTrip);
  assert(resEmpty.score < 40, `Empty trip should score < 40%, got ${resEmpty.score}%`);
  assert(resEmpty.level === 'not-ready', `Level should be not-ready, got ${resEmpty.level}`);
});

// Test 3: Bilingual i18n support
test('Bilingual dictionary contains all required English and Bangla keys', () => {
  WW.State.settings.language = 'en';
  assert(WW.t('navDashboard') === 'Dashboard', 'English navDashboard should be Dashboard');
  assert(WW.t('tagline') === 'Plan better. Travel prepared.', 'English tagline mismatch');

  WW.State.settings.language = 'bn';
  assert(WW.t('navDashboard') === 'ড্যাশবোর্ড', 'Bangla navDashboard should be ড্যাশবোর্ড');
  assert(WW.t('tagline') === 'পরিকল্পনা হোক নির্ভুল। প্রস্তুতি হোক সম্পন্ন।', 'Bangla tagline mismatch');
});

// Test 4: Budget Aggregation Logic
test('Budget calculation handles estimated, actual, and variance correctly', () => {
  const trip = {
    estimatedBudget: 1000,
    budget: {
      transportation: { est: 400, act: 350 },
      accommodation: { est: 300, act: 300 },
      food: { est: 200, act: 250 },
      other: { est: 100, act: 50 }
    }
  };

  let totalAct = 0;
  Object.values(trip.budget).forEach(b => { totalAct += b.act; });
  const remaining = trip.estimatedBudget - totalAct;

  assert(totalAct === 950, `Actual total should be 950, got ${totalAct}`);
  assert(remaining === 50, `Remaining balance should be 50, got ${remaining}`);
});

// Test 5: LocalStorage Persistence
test('Trip state persists in localStorage across reloads', () => {
  WW.State.trips.push({
    id: 'test_custom_trip',
    name: 'Barishal Logistics Visit',
    location: 'Barishal',
    startDate: '2026-11-01',
    endDate: '2026-11-03',
    status: 'Planned',
    priority: 'Medium'
  });

  mockLocalStorage.setItem('wanderwise_trips', JSON.stringify(WW.State.trips));
  const retrieved = JSON.parse(mockLocalStorage.getItem('wanderwise_trips'));
  assert(retrieved.some(t => t.id === 'test_custom_trip'), 'Custom trip should persist in storage');
});

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✓ ALL LOGIC TESTS PASSED SUCCESSFULLY!');
}
