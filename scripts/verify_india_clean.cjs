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

  // 2. Submit user query
  console.log('2. Entering: HIGH-RES FOR INDIA WITH CLAER RESOLUTION OF 3D I WANT TO SEE');
  const searchInput = page.locator('#sata-command-search-input-bottom');
  await searchInput.fill('HIGH-RES FOR INDIA WITH CLAER RESOLUTION OF 3D I WANT TO SEE');
  await page.keyboard.press('Enter');

  // Wait 4 seconds for camera rotation and zoom to complete
  await page.waitForTimeout(4500);

  const screenshot1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_58_clean_india_globe_zoom.png';
  await page.screenshot({ path: screenshot1 });
  console.log('Saved screenshot 1:', screenshot1);

  // 3. Click High-Res Optical button
  console.log('3. Clicking High-Res Optical action chip...');
  const highResBtn = page.locator('button:has-text("High-Res Optical")').first();
  if (await highResBtn.isVisible()) {
    await highResBtn.click();
    await page.waitForTimeout(6000);
  }

  const screenshot2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_59_clean_optical_pass_response.png';
  await page.screenshot({ path: screenshot2 });
  console.log('Saved screenshot 2:', screenshot2);

  await browser.close();
  console.log('All verification complete!');
})();
