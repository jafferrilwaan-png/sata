const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=d3d11'],
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  console.log('Navigating to http://localhost:4000...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);

  // 1. Home screen verification: Unwanted software button removed, zero cyan/green dot
  const homeShot = path.join(ARTIFACT_DIR, 'ui_15_clean_home_no_software_button.png');
  await page.screenshot({ path: homeShot });
  console.log('Captured 1: Clean home screen (no software button) ->', homeShot);

  // 2. Search "Nagpur, Maharashtra time"
  console.log('Searching for "Nagpur, Maharashtra time"...');
  const searchInput = page.locator('#sata-command-search-input');
  await searchInput.fill('Nagpur, Maharashtra time');
  await searchInput.press('Enter');
  await page.waitForTimeout(6000);

  const nagpurShot = path.join(ARTIFACT_DIR, 'ui_16_nagpur_time_conversational_chat.png');
  await page.screenshot({ path: nagpurShot });
  console.log('Captured 2: Nagpur time conversational chat ->', nagpurShot);

  // 3. Return home and search "Riyadh, Saudi Arabia" to verify natural colors (no thermal override)
  console.log('Returning to home overview...');
  const closeBtn = page.locator('aside[aria-label="Satellite Intelligence Dossier"] button[aria-label="Close"]');
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
    await page.waitForTimeout(2000);
  }

  console.log('Searching for "Riyadh, Saudi Arabia"...');
  await page.locator('#sata-command-search-input').fill('Riyadh, Saudi Arabia');
  await page.locator('#sata-command-search-input').press('Enter');
  await page.waitForTimeout(6000);

  const riyadhShot = path.join(ARTIFACT_DIR, 'ui_17_riyadh_natural_earth_no_thermal_orange.png');
  await page.screenshot({ path: riyadhShot });
  console.log('Captured 3: Riyadh natural Earth (no thermal orange) ->', riyadhShot);

  await browser.close();
  console.log('All captures complete!');
}

run().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
