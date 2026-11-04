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

  console.log('Navigating to http://localhost:4000?modal=profile ...');
  await page.goto('http://localhost:4000?modal=profile', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const shot = path.join(ARTIFACTS_DIR, 'ui_112_mission_dossier_profile_page.png');
  await page.screenshot({ path: shot });
  console.log(`Saved ${shot}`);

  // Also re-capture telemetry modal ground track with zero dots
  console.log('Navigating to http://localhost:4000?modal=telemetry ...');
  await page.goto('http://localhost:4000?modal=telemetry', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const shot2 = path.join(ARTIFACTS_DIR, 'ui_113_satellite_meta_downlink_no_dots.png');
  await page.screenshot({ path: shot2 });
  console.log(`Saved ${shot2}`);

  await browser.close();
  console.log('Capture completed successfully.');
})();
