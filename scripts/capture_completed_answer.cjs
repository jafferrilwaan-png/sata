const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const searchInput = page.locator('#sata-command-search-input-bottom');
  await searchInput.fill('India');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await chatInput.fill('which place is the image you given');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(7000);

  const outPath = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_64_image_geolocation_complete_answer.png';
  await page.screenshot({ path: outPath });
  console.log('Saved:', outPath);
  await browser.close();
})();
