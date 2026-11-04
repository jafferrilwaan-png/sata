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

  console.log('1. Navigating to main dashboard ...');
  await page.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  // 1. Open Model Selector Dropdown
  console.log('2. Opening model selector dropdown ...');
  const modelPill = page.locator('button[title="Select Analysis Model"]').first();
  if (await modelPill.count() > 0) {
    await modelPill.click();
    await page.waitForTimeout(500);
    const shot1 = path.join(ARTIFACTS_DIR, 'ui_108_model_dropdown_clean_translucent.png');
    await page.screenshot({ path: shot1 });
    console.log(`Saved ${shot1}`);
    // Close it
    await modelPill.click();
    await page.waitForTimeout(300);
  }

  // 2. Open Mission History & Flight Dossier
  console.log('3. Opening Mission History Dossier ...');
  // Click user profile button in top right navigation
  const profileBtn = page.locator('button[title="Flight Dossier & Saved Folders"]').or(page.locator('button[aria-label="Profile"]')).or(page.locator('header button').last());
  if (await profileBtn.count() > 0) {
    await profileBtn.click();
    await page.waitForTimeout(1000);
    const shot2 = path.join(ARTIFACTS_DIR, 'ui_109_mission_dossier_satellite_bg_and_folders.png');
    await page.screenshot({ path: shot2 });
    console.log(`Saved ${shot2}`);

    // Close dossier
    const backBtn = page.locator('button:has-text("Back to 3D Globe")');
    if (await backBtn.count() > 0) {
      await backBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // 3. Open Satellite Telemetry Modal
  console.log('4. Opening Satellite Telemetry Modal ...');
  await page.goto('http://localhost:4000?modal=telemetry', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  // Ground track tab
  const shot3 = path.join(ARTIFACTS_DIR, 'ui_110_satellite_meta_downlink_api.png');
  await page.screenshot({ path: shot3 });
  console.log(`Saved ${shot3}`);

  // SGP4 tab with clean typography
  console.log('5. Clicking SGP4 Orbit Telemetry ...');
  await page.click('button:has-text("SGP4 Orbit Telemetry")');
  await page.waitForTimeout(600);
  const shot4 = path.join(ARTIFACTS_DIR, 'ui_111_satellite_sgp4_clean_typography.png');
  await page.screenshot({ path: shot4 });
  console.log(`Saved ${shot4}`);

  await browser.close();
  console.log('=== ALL SCREENSHOTS CAPTURED PERFECTLY ===');
})();
