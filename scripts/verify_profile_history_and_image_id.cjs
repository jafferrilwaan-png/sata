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

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 2. Click the Profile / Commander icon in the top right navbar
  console.log('2. Clicking Profile icon in top right navbar...');
  const profileBtn = page.locator('button[title*="Profile"], button[aria-label*="Profile"], button:has(svg.lucide-user)').first();
  await profileBtn.click();
  await page.waitForTimeout(1500);

  const screenshot1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_61_profile_mission_history_modal.png';
  await page.screenshot({ path: screenshot1 });
  console.log('Saved screenshot 1 (Mission History & Dossier Folders):', screenshot1);

  // 3. Click "Fly to Sector on 3D Earth" on active mission folder
  console.log('3. Clicking "Fly to Sector on 3D Earth"...');
  const flyBtn = page.locator('button:has-text("Fly to Sector on 3D Earth")').first();
  await flyBtn.click();
  await page.waitForTimeout(4000);

  const screenshot2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_62_fly_to_sector_from_history.png';
  await page.screenshot({ path: screenshot2 });
  console.log('Saved screenshot 2 (Flew to sector from history):', screenshot2);

  // 4. Ask about image geolocation in chat console
  console.log('4. Asking: which place is the image you given');
  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await chatInput.fill('which place is the image you given');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  const screenshot3 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_63_image_geolocation_verified.png';
  await page.screenshot({ path: screenshot3 });
  console.log('Saved screenshot 3 (Image location verified):', screenshot3);

  await browser.close();
  console.log('All verification finished successfully!');
})();
