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

  // 1. First trigger a location so the MetaDeepIntelligenceConsole card is visible
  console.log('2. Entering query: India into top search bar...');
  const searchInput = page.locator('input[placeholder*="Search location"]').first();
  await searchInput.fill('India');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);

  // Take screenshot of the 30 tools palette
  const screenshot1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_66_30_nasa_isro_tools_palette.png';
  await page.screenshot({ path: screenshot1 });
  console.log('Saved screenshot 1 (30 tools palette):', screenshot1);

  // 3. Click on RISAT-1A SAR Microwave chip
  console.log('3. Clicking RISAT-1A SAR Microwave chip...');
  const sarChip = page.locator('button:has-text("RISAT-1A SAR Microwave")').first();
  await sarChip.click();
  await page.waitForTimeout(1000);

  const screenshot2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_67_apply_selector_dialog.png';
  await page.screenshot({ path: screenshot2 });
  console.log('Saved screenshot 2 (Apply Selector Dialog):', screenshot2);

  // 4. Click [ 🌍 Apply to 3D Earth ]
  console.log('4. Clicking [ 🌍 Apply to 3D Earth ]...');
  const applyEarthBtn = page.locator('button:has-text("Apply to 3D Earth")').first();
  await applyEarthBtn.click();
  await page.waitForTimeout(3000);

  const screenshot3 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_68_applied_to_3d_earth.png';
  await page.screenshot({ path: screenshot3 });
  console.log('Saved screenshot 3 (Applied to 3D Earth):', screenshot3);

  // 5. Click on VIIRS Thermal IR chip and then [ 🖼️ Apply to Image ]
  console.log('5. Clicking VIIRS Thermal IR (375m) chip...');
  const viirsChip = page.locator('button:has-text("VIIRS Thermal IR")').first();
  await viirsChip.click();
  await page.waitForTimeout(1000);

  console.log('6. Clicking [ 🖼️ Apply to Image ]...');
  const applyImageBtn = page.locator('button:has-text("Apply to Image")').first();
  await applyImageBtn.click();
  await page.waitForTimeout(5000);

  const screenshot4 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_69_applied_to_image_downlink.png';
  await page.screenshot({ path: screenshot4 });
  console.log('Saved screenshot 4 (Applied to Image):', screenshot4);

  await browser.close();
  console.log('Verification run complete!');
})();
