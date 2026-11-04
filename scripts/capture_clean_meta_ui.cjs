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

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(4000);

  // 1. Home Screenshot
  const homePath = path.join(ARTIFACT_DIR, 'ui_23_clean_home_sata_nav_truecolor_earth.png');
  await page.screenshot({ path: homePath });
  console.log('Saved Home screenshot to:', homePath);

  // 2. Query "hi"
  console.log('2. Testing "hi" query...');
  const searchInput = await page.$('input#sata-command-search-input');
  if (searchInput) {
    await searchInput.fill('hi');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4000);

    const hiPath = path.join(ARTIFACT_DIR, 'ui_24_meta_ai_hi_clean_chat_bubble.png');
    await page.screenshot({ path: hiPath });
    console.log('Saved "hi" query screenshot to:', hiPath);
  }

  // 3. Query "Riyadh, Saudi Arabia" to verify natural desert colors (NO orange blaster!)
  console.log('3. Testing "Riyadh, Saudi Arabia" query...');
  const chatInput = await page.$('input[placeholder*="Ask Meta AI"]');
  if (chatInput) {
    await chatInput.fill('Riyadh, Saudi Arabia');
    await page.keyboard.press('Enter');
  } else if (searchInput) {
    await searchInput.fill('Riyadh, Saudi Arabia');
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(4000);

  const riyadhPath = path.join(ARTIFACT_DIR, 'ui_25_riyadh_natural_desert_no_orange_blaster.png');
  await page.screenshot({ path: riyadhPath });
  console.log('Saved Riyadh query screenshot to:', riyadhPath);

  // 4. Close chat console (click X)
  console.log('4. Closing chat console...');
  const closeBtn = await page.$('button[aria-label="Close"]');
  if (closeBtn) {
    await closeBtn.click();
    await page.waitForTimeout(2500);
  }

  const closedPath = path.join(ARTIFACT_DIR, 'ui_26_closed_chat_natural_earth_restored.png');
  await page.screenshot({ path: closedPath });
  console.log('Saved closed chat screenshot to:', closedPath);

  await browser.close();
  console.log('All tests completed successfully!');
})();
