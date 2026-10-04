const fs = require('fs');

// Validate JS
const code = fs.readFileSync('app.js','utf8');
try {
  new Function(code);
  console.log('✓ JS SYNTAX OK');
} catch(e) {
  console.error('✗ JS SYNTAX ERROR:', e.message);
}

// Validate HTML IDs
const html = fs.readFileSync('index.html','utf8');
const ids = [
  'placeModalBackdrop',
  'detailModalBackdrop',
  'deleteModalBackdrop',
  'suggModalBackdrop',
  'placeForm',
  'toastContainer',
  'searchInput',
  'placesGrid',
  'statsDashboard',
  'openAddModalBtn',
  'whereShouldIGoBtn'
];
ids.forEach(id => {
  const found = html.includes('id="' + id + '"');
  console.log((found ? '✓' : '✗') + ' ID: ' + id);
});

// Check references in html
console.log((html.includes('app.js') ? '✓' : '✗') + ' app.js referenced in HTML');
console.log((html.includes('style.css') ? '✓' : '✗') + ' style.css referenced in HTML');

console.log('\nFile sizes:');
console.log('  index.html:', fs.statSync('index.html').size, 'bytes');
console.log('  app.js:', fs.statSync('app.js').size, 'bytes');
console.log('  style.css:', fs.statSync('style.css').size, 'bytes');
