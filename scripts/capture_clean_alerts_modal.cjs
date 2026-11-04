const path = require('path');
const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const ARTIFACT_DIR = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-gpu-blocklist', '--enable-webgl'],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Click alerts button in TopNavbar
  console.log('Opening Mission Alerts modal...');
  const alertsBtn = await page.$('button[aria-label="Observation Alerts"]');
  if (alertsBtn) {
    await alertsBtn.click();
    await page.waitForTimeout(1500);

    const alertsPath = path.join(ARTIFACT_DIR, 'ui_31_clean_ios_glass_mission_alerts_no_svg.png');
    await page.screenshot({ path: alertsPath });
    console.log('Saved clean alerts screenshot to:', alertsPath);
  }

  await browser.close();
  console.log('ALERTS MODAL TEST COMPLETE!');
})();
