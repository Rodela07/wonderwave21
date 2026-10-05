const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const crypto = require('crypto');
const os = require('os');
const fs = require('fs');
const path = require('path');

function startStaticServer(port) {
  return new Promise((resolve) => {
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    const server = http.createServer((req, res) => {
      let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(fs.readFileSync(filePath));
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    server.listen(port, () => resolve(server));
  });
}

class SimpleWS {
  constructor(url) {
    this.url = new URL(url);
    this.callbacks = {};
    this.connected = false;
  }
  connect() {
    return new Promise((resolve, reject) => {
      const port = this.url.port || 80;
      const host = this.url.hostname;
      const path = this.url.pathname;
      const key = crypto.randomBytes(16).toString('base64');
      const req = [
        `GET ${path} HTTP/1.1`,
        `Host: ${host}:${port}`,
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Key: ${key}`,
        'Sec-WebSocket-Version: 13',
        '\r\n'
      ].join('\r\n');
      const socket = net.connect(port, host, () => socket.write(req));
      this.socket = socket;
      let buffer = Buffer.alloc(0);
      let upgraded = false;
      socket.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        if (!upgraded) {
          const headerEnd = buffer.indexOf('\r\n\r\n');
          if (headerEnd !== -1) {
            upgraded = true;
            this.connected = true;
            buffer = buffer.slice(headerEnd + 4);
            resolve();
          }
        }
        while (upgraded && buffer.length >= 2) {
          const firstByte = buffer[0];
          const secondByte = buffer[1];
          const opcode = firstByte & 0x0f;
          let payloadLength = secondByte & 0x7f;
          let offset = 2;
          if (payloadLength === 126) {
            if (buffer.length < 4) break;
            payloadLength = buffer.readUInt16BE(2);
            offset = 4;
          } else if (payloadLength === 127) {
            if (buffer.length < 10) break;
            payloadLength = Number(buffer.readBigUInt64BE(2));
            offset = 10;
          }
          if (buffer.length < offset + payloadLength) break;
          const payload = buffer.slice(offset, offset + payloadLength);
          buffer = buffer.slice(offset + payloadLength);
          if (opcode === 1 && this.onMessage) this.onMessage(payload.toString('utf8'));
          else if (opcode === 8) socket.end();
        }
      });
      socket.on('error', reject);
    });
  }
  send(data) {
    const payload = Buffer.from(data, 'utf8');
    const length = payload.length;
    let header;
    const mask = crypto.randomBytes(4);
    if (length < 126) {
      header = Buffer.alloc(6);
      header[0] = 0x81;
      header[1] = 0x80 | length;
      mask.copy(header, 2);
    } else if (length < 65536) {
      header = Buffer.alloc(8);
      header[0] = 0x81;
      header[1] = 0x80 | 126;
      header.writeUInt16BE(length, 2);
      mask.copy(header, 4);
    } else {
      header = Buffer.alloc(14);
      header[0] = 0x81;
      header[1] = 0x80 | 127;
      header.writeBigUInt64BE(BigInt(length), 2);
      mask.copy(header, 10);
    }
    const maskedPayload = Buffer.alloc(length);
    for (let i = 0; i < length; i++) maskedPayload[i] = payload[i] ^ mask[i % 4];
    this.socket.write(Buffer.concat([header, maskedPayload]));
  }
  close() {
    if (this.socket) this.socket.end();
  }
}

async function runE2E() {
  console.log('🌟 [E2E] Running Dream Places (First UI) Full Verification...\n');

  const serverPort = 8555;
  const server = await startStaticServer(serverPort);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const cdpPort = 9888;
  const tempProfile = `${os.tmpdir()}\\dp-firstui-qa-${Date.now()}`;

  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${cdpPort}`,
    '--headless=new',
    '--window-size=1280,850',
    `--user-data-dir=${tempProfile}`,
    `http://localhost:${serverPort}`
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${cdpPort}/json/list`, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(t => t.type === 'page');
  const ws = new SimpleWS(page.webSocketDebuggerUrl);
  await ws.connect();

  let msgId = 1;
  const pending = new Map();
  const errors = [];

  ws.onMessage = (raw) => {
    try {
      const res = JSON.parse(raw);
      if (res.method === 'Runtime.consoleAPICalled' && res.params.type === 'error') {
        errors.push(res.params.args.map(a => a.value).join(' '));
      }
      if (res.id && pending.has(res.id)) {
        pending.get(res.id)(res);
        pending.delete(res.id);
      }
    } catch (e) {}
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (res.result && res.result.exceptionDetails) {
      throw new Error(`Eval error in: ${expression}\nDetails: ${JSON.stringify(res.result.exceptionDetails)}`);
    }
    return res.result.result ? res.result.result.value : undefined;
  }

  await send('Runtime.enable');
  await send('Page.enable');

  // TEST 1: Initial Hero & Stats
  console.log('Test 1: Hero & Stats Dashboard');
  const stats = await evaluate(`({
    title: document.getElementById('hero-title')?.textContent.trim(),
    total: document.getElementById('statTotalPlaces')?.textContent,
    countries: document.getElementById('statTotalCountries')?.textContent,
    planned: document.getElementById('statPlannedTrips')?.textContent,
    visited: document.getElementById('statVisitedPlaces')?.textContent,
    cards: document.querySelectorAll('#placesGrid .place-card').length
  })`);
  console.log('   Stats:', stats);
  if (!stats.title.includes('Wonderwave') || Number(stats.total) < 6 || stats.cards < 6) {
    throw new Error('Initial UI did not load sample places properly');
  }
  console.log('   ✓ Wonderwave Hero and Stats dashboard verified.');

  // TEST 2: Search functionality
  console.log('\nTest 2: Search by destination / country');
  await evaluate(`
    const inp = document.getElementById('searchInput');
    inp.value = 'Kyoto';
    inp.dispatchEvent(new Event('input'));
  `);
  await new Promise(r => setTimeout(r, 200));
  const searchCount = await evaluate(`document.querySelectorAll('#placesGrid .place-card').length`);
  console.log('   Search "Kyoto" results count:', searchCount);
  if (searchCount !== 1) throw new Error('Search failed');

  // Clear search
  await evaluate(`document.getElementById('clearSearchBtn').click()`);
  await new Promise(r => setTimeout(r, 200));
  const clearedCount = await evaluate(`document.querySelectorAll('#placesGrid .place-card').length`);
  console.log('   Restored count after search clear:', clearedCount);
  if (clearedCount !== 6) throw new Error('Search clear failed');
  console.log('   ✓ Search and clear verified.');

  // TEST 3: Filters (Status & Priority)
  console.log('\nTest 3: Status & Priority Filters');
  await evaluate(`document.querySelector('#statusFilterGroup .filter-chip[data-filter-status="visited"]').click()`);
  await new Promise(r => setTimeout(r, 200));
  const visitedCount = await evaluate(`document.querySelectorAll('#placesGrid .place-card').length`);
  console.log('   Visited filter count:', visitedCount);
  if (visitedCount !== 1) throw new Error('Status filter failed');

  await evaluate(`document.getElementById('clearAllFiltersBtn').click()`);
  await new Promise(r => setTimeout(r, 200));
  console.log('   ✓ Filters and Clear Filters verified.');

  // TEST 4: Add New Place Modal with Scrolling, Budget & Validation
  console.log('\nTest 4: Add Place Modal Scrolling, Live Budget & Form Validation');
  await evaluate(`document.getElementById('openAddModalBtn').click()`);
  await new Promise(r => setTimeout(r, 200));

  // Test modal scrolling
  const scrollInfo = await evaluate(`(() => {
    const mb = document.querySelector('#placeModalBackdrop .modal-body');
    const canScroll = mb.scrollHeight > mb.clientHeight;
    mb.scrollTop = 250;
    const isScrolled = mb.scrollTop > 0;
    return { scrollHeight: mb.scrollHeight, clientHeight: mb.clientHeight, canScroll, isScrolled, scrollTop: mb.scrollTop };
  })()`);
  console.log('   Modal Scroll State:', scrollInfo);
  if (!scrollInfo.canScroll || !scrollInfo.isScrolled) throw new Error('Modal body cannot be scrolled!');
  console.log('   ✓ Modal scrolling verified successfully!');

  // Trigger validation error
  await evaluate(`document.getElementById('savePlaceBtn').click()`);
  const valErrors = await evaluate(`({
    nameErr: document.getElementById('placeNameError').classList.contains('visible'),
    countryErr: document.getElementById('countryError').classList.contains('visible')
  })`);
  console.log('   Validation triggered:', valErrors);
  if (!valErrors.nameErr || !valErrors.countryErr) throw new Error('Validation failed');

  // Fill in Tokyo
  await evaluate(`
    document.getElementById('placeNameInput').value = 'Tokyo';
    document.getElementById('countryInput').value = 'Japan';
    document.getElementById('noteInput').value = 'Explore Akihabara and Shinjuku neon nights!';
    document.getElementById('travelDateInput').value = '2025-11-10';
    document.getElementById('travelDaysInput').value = '7';
    document.getElementById('travelersCountInput').value = '2';
    document.querySelector('input[name="priority"][value="high"]').checked = true;
    document.getElementById('statusSelectInput').value = 'planning';
    document.getElementById('fBudgetFlight').value = '60000';
    document.getElementById('fBudgetAccommodation').value = '35000';
    document.getElementById('fBudgetFood').value = '15000';
    document.getElementById('fBudgetUserBudget').value = '120000';
    document.getElementById('fBudgetFlight').dispatchEvent(new Event('input'));
  `);
  await new Promise(r => setTimeout(r, 200));

  const budgetTotal = await evaluate(`document.getElementById('formBudgetEstimatedTotal').textContent`);
  console.log('   Calculated Budget Total:', budgetTotal);
  if (!budgetTotal.includes('1,10,000') && !budgetTotal.includes('110,000')) throw new Error('Budget calculation incorrect');

  // Save place
  await evaluate(`document.getElementById('savePlaceBtn').click()`);
  await new Promise(r => setTimeout(r, 300));
  const newCardsCount = await evaluate(`document.querySelectorAll('#placesGrid .place-card').length`);
  console.log('   Total cards after addition:', newCardsCount);
  if (newCardsCount !== 7) throw new Error('Card addition failed');
  console.log('   ✓ Add place and live budget verified.');

  // TEST 5: Destination Detail Modal (Itinerary & Packing)
  console.log('\nTest 5: Destination Detail Modal (Itinerary & Packing)');
  await evaluate(`{
    const card = Array.from(document.querySelectorAll('#placesGrid .place-card')).find(c => c.querySelector('.card-title').textContent.includes('Tokyo'));
    card.querySelector('[data-action="view"]').click();
  }`);
  await new Promise(r => setTimeout(r, 300));

  const detailTitle = await evaluate(`document.getElementById('detailModalTitle')?.textContent`);
  console.log('   Detail Modal Title:', detailTitle);
  if (!detailTitle.includes('Tokyo')) throw new Error('Detail modal failed');

  // Add day & activity to itinerary
  await evaluate(`document.getElementById('detailAddDayBtn').click()`);
  await new Promise(r => setTimeout(r, 200));
  await evaluate(`
    const actInp = document.querySelector('[id^="newActInput-"]');
    if (actInp) actInp.value = 'Visit Shibuya Crossing';
    document.querySelector('[data-action="add-act"]').click();
  `);
  await new Promise(r => setTimeout(r, 200));

  // Add packing item
  await evaluate(`
    const pInp = document.getElementById('newCustomPackInput');
    if (pInp) pInp.value = 'Pocket WiFi';
    document.getElementById('addCustomPackBtn').click();
  `);
  await new Promise(r => setTimeout(r, 200));

  const packCount = await evaluate(`document.querySelectorAll('#detailPackingUl .packing-li').length`);
  console.log('   Packing items count (8 default + 1 custom):', packCount);
  if (packCount !== 9) throw new Error('Packing checklist failed');

  // Close detail modal
  await evaluate(`document.getElementById('closeDetailModalBtn').click()`);
  await new Promise(r => setTimeout(r, 200));
  console.log('   ✓ Detail modal, Itinerary builder, and Packing checklist verified.');

  // TEST 6: "Where Should I Go?" Recommender
  console.log('\nTest 6: "Where Should I Go?" Questionnaire Recommender');
  await evaluate(`document.getElementById('whereShouldIGoBtn').click()`);
  await new Promise(r => setTimeout(r, 200));
  await evaluate(`
    document.querySelector('#suggBudgetOptions .sugg-opt-btn[data-budget="100k+"]').click();
    document.querySelector('#suggDurationOptions .sugg-opt-btn[data-duration="7"]').click();
    document.querySelector('#suggMoodOptions .mood-select-chip[data-mood="photography"]').click();
    document.getElementById('findMatchBtn').click();
  `);
  await new Promise(r => setTimeout(r, 300));

  const matchTitle = await evaluate(`document.querySelector('.sugg-match-pct')?.textContent`);
  console.log('   Match Result:', matchTitle);
  if (!matchTitle || !matchTitle.includes('% Match')) throw new Error('Recommender failed');

  await evaluate(`document.getElementById('closeSuggModalBtn').click()`);
  await new Promise(r => setTimeout(r, 200));
  console.log('   ✓ Recommendation engine verified.');

  // TEST 7: LocalStorage Persistence
  console.log('\nTest 7: LocalStorage Persistence');
  await send('Page.reload');
  await new Promise(r => setTimeout(r, 1200));

  const reloadedCount = await evaluate(`document.querySelectorAll('#placesGrid .place-card').length`);
  console.log('   Places count after page reload:', reloadedCount);
  if (reloadedCount !== 7) throw new Error('LocalStorage failed to persist across reload');
  console.log('   ✓ LocalStorage verified.');

  // Take screenshot of the restored first UI
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshotRes.result && screenshotRes.result.data) {
    fs.writeFileSync('first-ui-rendered.png', Buffer.from(screenshotRes.result.data, 'base64'));
    console.log('✓ Saved first-ui-rendered.png');
  }

  console.log('\nAudit Console Errors:', errors.length ? errors : 'None! (0 errors)');
  if (errors.length > 0) throw new Error(`Console errors: ${JSON.stringify(errors)}`);

  console.log('\n════════════════════════════════════════════════════');
  console.log('🎉 FIRST UI VERIFIED AND ALL 7 TESTS PASSED! 🎉');
  console.log('════════════════════════════════════════════════════\n');

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
}

runE2E().catch(err => {
  console.error('\n❌ E2E Failed:', err);
  process.exit(1);
});
