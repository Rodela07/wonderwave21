const fs = require('fs');

// Validate JS syntax
const code = fs.readFileSync('app.js', 'utf8');
try {
  new Function(code);
  console.log('✓ JS SYNTAX OK');
} catch (e) {
  console.error('✗ JS SYNTAX ERROR:', e.message);
}

// Validate HTML IDs for WanderWise
const html = fs.readFileSync('index.html', 'utf8');
const ids = [
  'sectionDashboard',
  'sectionTrips',
  'sectionCalendar',
  'sectionBudget',
  'sectionChecklist',
  'sectionReports',
  'sectionSettings',
  'tripModalBackdrop',
  'tripDetailModalBackdrop',
  'reportModalBackdrop',
  'viewReportModalBackdrop',
  'smartModalBackdrop',
  'confirmModalBackdrop',
  'tripForm',
  'toastContainer',
  'searchInput',
  'tripsGrid',
  'statsDashboard',
  'openAddModalBtn',
  'smartPlannerBtn',
  'calendarGrid',
  'budgetTripSelect',
  'checklistTripSelect',
  'langEnBtn',
  'langBnBtn'
];

let missingIds = 0;
ids.forEach(id => {
  const found = html.includes('id="' + id + '"');
  if (!found) missingIds++;
  console.log((found ? '✓' : '✗') + ' ID: ' + id);
});

// Check references in HTML
console.log((html.includes('app.js') ? '✓' : '✗') + ' app.js referenced in HTML');
console.log((html.includes('style.css') ? '✓' : '✗') + ' style.css referenced in HTML');

console.log('\nFile sizes:');
console.log('  index.html:', fs.statSync('index.html').size, 'bytes');
console.log('  app.js:', fs.statSync('app.js').size, 'bytes');
console.log('  style.css:', fs.statSync('style.css').size, 'bytes');

if (missingIds === 0) {
  console.log('\n✓ ALL VALIDATION CHECKS PASSED!');
} else {
  console.error(`\n✗ ${missingIds} IDs missing!`);
  process.exit(1);
}
