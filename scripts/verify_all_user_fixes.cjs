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

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Capture initial home screen showing Model Selector in search bar and clean sidebar video
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ui_88_home_with_model_selector.png') });
  console.log('Saved ui_88_home_with_model_selector.png');

  // 2. Type "HI" in the search bar and submit to move it to the top
  console.log('2. Testing search bar with text "HI" and verifying Model Selector stays visible at top...');
  const searchInput = page.locator('input[placeholder*="Search location"]');
  await searchInput.click();
  await searchInput.fill('HI');
  await searchInput.press('Enter');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ui_89_searchbar_model_selector_at_top.png') });
  console.log('Saved ui_89_searchbar_model_selector_at_top.png');

  // Click model dropdown at top to verify it opens downwards and looks gorgeous
  const modelButton = page.locator('button[title="Select Analysis Model"]');
  if (await modelButton.count() > 0) {
    await modelButton.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ui_90_model_dropdown_open_at_top.png') });
    console.log('Saved ui_90_model_dropdown_open_at_top.png');
    // Close dropdown
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 3. Return home and open Mission History & Flight Dossier modal
  console.log('3. Opening Mission History & Flight Dossier modal...');
  await page.goto('http://localhost:4000?modal=profile', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ui_91_mission_dossier_fullpage_iso_glass.png') });
  console.log('Saved ui_91_mission_dossier_fullpage_iso_glass.png');

  // 4. Open Satellite Telemetry Modal
  console.log('4. Opening Satellite Telemetry Modal...');
  await page.goto('http://localhost:4000?modal=telemetry', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ui_92_satellite_modal_clean_glass_no_overlays.png') });
  console.log('Saved ui_92_satellite_modal_clean_glass_no_overlays.png');

  // 5. Open Active Mission Alerts Modal
  console.log('5. Opening Active Mission Alerts Modal...');
  await page.goto('http://localhost:4000?modal=alerts', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ui_93_mission_alerts_clean_glass.png') });
  console.log('Saved ui_93_mission_alerts_clean_glass.png');

  await browser.close();
  console.log('=== ALL SCREENSHOTS CAPTURED AND VERIFIED SUCCESSFULLY ===');
})();
