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

  // 1. Model Selector Dropdown
  console.log('1. Navigating to main dashboard ...');
  await page.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  const modelPill = page.locator('button[title="Select Analysis Model"]').first();
  if (await modelPill.count() > 0) {
    await modelPill.click();
    await page.waitForTimeout(600);
    const shot1 = path.join(ARTIFACTS_DIR, 'ui_114_model_dropdown_subtle_translucent.png');
    await page.screenshot({ path: shot1 });
    console.log(`Saved ${shot1}`);
    await modelPill.click();
    await page.waitForTimeout(300);
  }

  // 2. Fullscreen Mission Dossier Page with Satellite Vista Background & Folder Icons
  console.log('2. Navigating to Mission Dossier Page ...');
  await page.goto('http://localhost:4000?modal=profile', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const shot2 = path.join(ARTIFACTS_DIR, 'ui_115_mission_dossier_satellite_vista.png');
  await page.screenshot({ path: shot2 });
  console.log(`Saved ${shot2}`);

  // 3. Satellite Telemetry Modal: Ground Track & Meta AI API Downlink
  console.log('3. Navigating to Satellite Telemetry Modal ...');
  await page.goto('http://localhost:4000?modal=telemetry', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const shot3 = path.join(ARTIFACTS_DIR, 'ui_116_satellite_telemetry_modal_meta_api.png');
  await page.screenshot({ path: shot3 });
  console.log(`Saved ${shot3}`);

  // 4. Satellite Telemetry Modal: Clean Modern Font SGP4 Table
  console.log('4. Clicking SGP4 Orbit Telemetry ...');
  await page.click('button:has-text("SGP4 Orbit Telemetry")');
  await page.waitForTimeout(600);
  const shot4 = path.join(ARTIFACTS_DIR, 'ui_117_satellite_sgp4_clean_sans_fonts.png');
  await page.screenshot({ path: shot4 });
  console.log(`Saved ${shot4}`);

  await browser.close();
  console.log('=== ALL SHOWCASE SCREENSHOTS CAPTURED SUCCESSFULLY ===');
})();
