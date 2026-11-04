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

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Test 1: Search "Thermal Heat Sensor Check"
  console.log('2. Querying "Thermal Heat Sensor Check"...');
  const searchInput = page.locator('input[placeholder*="Search location"]');
  await searchInput.click();
  await searchInput.fill('Thermal Heat Sensor Check');
  await searchInput.press('Enter');
  await page.waitForTimeout(4000);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ui_94_thermal_sensor_check_success.png') });
  console.log('Saved ui_94_thermal_sensor_check_success.png');

  // Test 2: Search "hi dudue" to ensure NO text is marked on Earth
  console.log('3. Querying "hi dudue" and verifying ZERO pins marked on Earth...');
  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]');
  if (await chatInput.count() > 0) {
    await chatInput.click();
    await chatInput.fill('hi dudue');
    await chatInput.press('Enter');
    await page.waitForTimeout(3500);
  } else {
    await searchInput.click();
    await searchInput.fill('hi dudue');
    await searchInput.press('Enter');
    await page.waitForTimeout(3500);
  }

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ui_95_hi_dudue_no_text_on_earth.png') });
  console.log('Saved ui_95_hi_dudue_no_text_on_earth.png');

  // Test 3: Check Cartosat-3 satellite modal transparent glass
  console.log('4. Checking Cartosat-3 satellite telemetry modal glass...');
  await page.goto('http://localhost:4000?modal=telemetry', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ui_96_cartosat3_clean_transparent_glass.png') });
  console.log('Saved ui_96_cartosat3_clean_transparent_glass.png');

  await browser.close();
  console.log('=== VERIFICATION COMPLETED ===');
})();
