const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('1. Navigating to http://localhost:4000?modal=telemetry ...');
  await page.goto('http://localhost:4000?modal=telemetry', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Tab 1: Live Stream
  const shot1 = path.join(ARTIFACTS_DIR, 'ui_100_satellite_live_stream_clean.png');
  await page.screenshot({ path: shot1 });
  console.log(`Saved ${shot1}`);

  // Tab 2: Real-Time Telemetry Graph
  console.log('2. Clicking "Real-Time Telemetry Graph"...');
  await page.click('button:has-text("Real-Time Telemetry Graph")');
  await page.waitForTimeout(1000);
  const shot2 = path.join(ARTIFACTS_DIR, 'ui_101_satellite_realtime_graph.png');
  await page.screenshot({ path: shot2 });
  console.log(`Saved ${shot2}`);

  // Tab 3: Orbit Comparison
  console.log('3. Clicking "Orbit Comparison"...');
  await page.click('button:has-text("Orbit Comparison")');
  await page.waitForTimeout(1000);
  const shot3 = path.join(ARTIFACTS_DIR, 'ui_102_satellite_orbit_comparison.png');
  await page.screenshot({ path: shot3 });
  console.log(`Saved ${shot3}`);

  await browser.close();
  console.log('=== SATELLITE MODAL VERIFICATION COMPLETED ===');
})();
