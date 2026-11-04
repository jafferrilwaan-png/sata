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

  // 1. Ask "is it true iamge"
  console.log('Asking "is it true iamge"...');
  const searchInput = await page.$('input#sata-command-search-input');
  if (searchInput) {
    await searchInput.fill('is it true iamge');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4500);

    const authPath = path.join(ARTIFACT_DIR, 'ui_27_is_it_true_image_clean_chat.png');
    await page.screenshot({ path: authPath });
    console.log('Saved image auth screenshot to:', authPath);
  }

  // 2. Ask "show satellite image of Chennai" to verify clean image frame with ZERO text coordinates under it
  console.log('Asking "show satellite image of Chennai"...');
  const chatInput = await page.$('input[placeholder*="Ask Meta AI"]');
  if (chatInput) {
    await chatInput.fill('show satellite image of Chennai');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);

    const imgPath = path.join(ARTIFACT_DIR, 'ui_28_clean_image_no_coordinates_box.png');
    await page.screenshot({ path: imgPath });
    console.log('Saved clean image screenshot to:', imgPath);
  }

  await browser.close();
  console.log('ALL PLAYWRIGHT TESTS COMPLETE!');
})();
