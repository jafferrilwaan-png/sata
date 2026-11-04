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

  console.log('1. Navigating to Satellite Telemetry Modal to verify Payload & SGP4 text removed...');
  await page.goto('http://localhost:4000?modal=telemetry', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const satShot = path.join(ARTIFACTS_DIR, 'ui_98_satellite_modal_no_payload_no_sgp4.png');
  await page.screenshot({ path: satShot });
  console.log(`Saved ${satShot}`);

  console.log('2. Navigating to Dedicated Fullscreen Dossier Page...');
  await page.goto('http://localhost:4000?modal=profile', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  const profileShot = path.join(ARTIFACTS_DIR, 'ui_99_fullscreen_dossier_page_satellite_background.png');
  await page.screenshot({ path: profileShot });
  console.log(`Saved ${profileShot}`);

  await browser.close();
  console.log('=== VERIFICATION COMPLETED ===');
})();
