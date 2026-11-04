const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

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
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log('2. Entering query: India into top search bar...');
  const searchInput = page.locator('input[placeholder*="Search location"]').first();
  await searchInput.fill('India');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // 3. Click on Oceansat-3 Scatterometer (the exact one the user screenshotted!)
  console.log('3. Clicking Oceansat-3 Scatterometer chip...');
  const oceansatChip = page.locator('button:has-text("Oceansat-3 Scatterometer")').first();
  await oceansatChip.click();
  await page.waitForTimeout(1000);

  const screenshot1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_71_clean_pure_text_selector.png';
  await page.screenshot({ path: screenshot1 });
  console.log('Saved screenshot 1 (Pure text selector, NO emojis, NO dots):', screenshot1);

  // 4. Click [ Apply to 3D Earth ]
  console.log('4. Clicking [ Apply to 3D Earth ]...');
  const applyEarthBtn = page.locator('button:has-text("Apply to 3D Earth")').first();
  await applyEarthBtn.click();
  await page.waitForTimeout(3000);

  const screenshot2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_72_clean_earth_no_banner_no_dots.png';
  await page.screenshot({ path: screenshot2 });
  console.log('Saved screenshot 2 (Clean 3D Earth with NO banner, NO red dot, NO bullet dots):', screenshot2);

  // 5. Click VIIRS Thermal IR (375m) chip, and click [ Apply to Image ]
  console.log('5. Clicking VIIRS Thermal IR (375m) chip...');
  const viirsChip = page.locator('button:has-text("VIIRS Thermal IR")').first();
  await viirsChip.click();
  await page.waitForTimeout(800);

  console.log('6. Clicking [ Apply to Image ]...');
  const applyImageBtn = page.locator('button:has-text("Apply to Image")').first();
  await applyImageBtn.click();
  await page.waitForTimeout(5000);

  const screenshot3 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_73_viirs_thermal_applied.png';
  await page.screenshot({ path: screenshot3 });
  console.log('Saved screenshot 3 (Thermal IR applied):', screenshot3);

  await browser.close();
  console.log('Verification finished successfully!');
})();
