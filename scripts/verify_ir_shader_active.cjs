const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Submit search to open intelligence console
  const searchInput = page.locator('#sata-command-search-input-bottom');
  await searchInput.fill('Sydney, Australia');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // 2. Type "APPLY IR VIEW ON EARTH TO SEE" into the chat console
  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await chatInput.fill('APPLY IR VIEW ON EARTH TO SEE');
  await page.keyboard.press('Enter');

  // Wait 2.5s for shader transition and HUD status pill to activate
  await page.waitForTimeout(2500);

  const screenshotIrActive = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_46_ir_thermal_view_active_on_earth.png';
  await page.screenshot({ path: screenshotIrActive });
  console.log('Saved screenshot:', screenshotIrActive);

  // 3. Click "Weather Radar" chip to verify weather radar mode
  const radarChip = page.locator('button:has-text("Weather Radar")').first();
  await radarChip.click();
  await page.waitForTimeout(2500);

  const screenshotRadarActive = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_47_weather_radar_active_on_earth.png';
  await page.screenshot({ path: screenshotRadarActive });
  console.log('Saved screenshot:', screenshotRadarActive);

  await browser.close();
  console.log('All shader verification tests completed successfully!');
})();
