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

  // Tab 1: Live Ground Track (0.28m Nadir)
  const shot1 = path.join(ARTIFACTS_DIR, 'ui_103_satellite_real_ground_track_nadir.png');
  await page.screenshot({ path: shot1 });
  console.log(`Saved ${shot1}`);

  // Tab 2: SGP4 Orbit Telemetry
  console.log('2. Clicking "SGP4 Orbit Telemetry"...');
  await page.click('button:has-text("SGP4 Orbit Telemetry")');
  await page.waitForTimeout(1000);
  const shot2 = path.join(ARTIFACTS_DIR, 'ui_104_satellite_sgp4_real_telemetry.png');
  await page.screenshot({ path: shot2 });
  console.log(`Saved ${shot2}`);

  // Tab 3: Constellation Compare
  console.log('3. Clicking "Constellation Compare"...');
  await page.click('button:has-text("Constellation Compare")');
  await page.waitForTimeout(1000);
  const shot3 = path.join(ARTIFACTS_DIR, 'ui_105_satellite_constellation_compare.png');
  await page.screenshot({ path: shot3 });
  console.log(`Saved ${shot3}`);

  // Tab 4: Close modal and view clean Observation sidebar
  console.log('4. Closing modal to view Observation sidebar...');
  await page.click('button[aria-label="Close Satellite Dossier"]');
  await page.waitForTimeout(1000);
  const shot4 = path.join(ARTIFACTS_DIR, 'ui_106_observation_sidebar_clean.png');
  await page.screenshot({ path: shot4 });
  console.log(`Saved ${shot4}`);

  await browser.close();
  console.log('=== VERIFICATION SCRIPT FINISHED SUCCESSFULLY ===');
})();
