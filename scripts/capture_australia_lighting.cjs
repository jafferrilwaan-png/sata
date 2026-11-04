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

  // 1. Search Australia
  console.log('Searching Australia...');
  const searchInput = await page.$('input#sata-command-search-input');
  if (searchInput) {
    await searchInput.fill('Australia');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4500);

    const ausFocusPath = path.join(ARTIFACT_DIR, 'ui_29_australia_focused_daylight.png');
    await page.screenshot({ path: ausFocusPath });
    console.log('Saved Australia focused screenshot to:', ausFocusPath);
  }

  // 2. Close chat and zoom out to high orbital altitude (overview)
  console.log('Closing chat to zoom out...');
  const closeBtn = await page.$('button[aria-label="Close"]');
  if (closeBtn) {
    await closeBtn.click();
    await page.waitForTimeout(2500);
  }

  // Rotate and view Australia from high zoom out
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    // Call pointOfView on globe if exposed or trigger overview
    const homeBtn = document.querySelector('button[aria-label="SATA Home"]');
    if (homeBtn) homeBtn.click();
  });
  await page.waitForTimeout(3000);

  const zoomedOutPath = path.join(ARTIFACT_DIR, 'ui_30_australia_zoomed_out_fully_illuminated.png');
  await page.screenshot({ path: zoomedOutPath });
  console.log('Saved Zoomed out Australia screenshot to:', zoomedOutPath);

  await browser.close();
  console.log('ALL LIGHTING TESTS COMPLETE!');
})();
