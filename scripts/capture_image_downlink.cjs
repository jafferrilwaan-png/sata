const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const searchInput = page.locator('input[placeholder*="Search location"]').first();
  await searchInput.fill('India');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);

  const viirsChip = page.locator('button:has-text("VIIRS Thermal IR")').first();
  await viirsChip.click();
  await page.waitForTimeout(600);

  const applyImageBtn = page.locator('button:has-text("Apply to Image")').first();
  await applyImageBtn.click();
  await page.waitForTimeout(7000);

  await page.screenshot({ path: 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_70_viirs_image_downlink_rendered.png' });
  await browser.close();
  console.log('Saved ui_70_viirs_image_downlink_rendered.png');
})();
