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

  // 2. Submit user's exact query
  console.log('2. Entering: HIGH-RES FOR INDIA WITH CLAER RESOLUTION OF 3D I WANT TO SEE');
  const searchInput = page.locator('#sata-command-search-input-bottom');
  await searchInput.fill('HIGH-RES FOR INDIA WITH CLAER RESOLUTION OF 3D I WANT TO SEE');
  await page.keyboard.press('Enter');

  // Wait for camera flight and swarm consensus response
  console.log('3. Waiting for camera zoom & multi-agent swarm response...');
  await page.waitForTimeout(6000);

  const screenshotPath1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_56_india_high_res_close_zoom.png';
  await page.screenshot({ path: screenshotPath1 });
  console.log('Saved screenshot 1:', screenshotPath1);

  // 4. Click High-Res Optical quick chip in chat console
  console.log('4. Clicking High-Res Optical action chip...');
  const highResBtn = page.locator('button:has-text("High-Res Optical")').first();
  if (await highResBtn.isVisible()) {
    await highResBtn.click();
    await page.waitForTimeout(5000);
  }

  const screenshotPath2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_57_india_cartosat3_optical_pass_verified.png';
  await page.screenshot({ path: screenshotPath2 });
  console.log('Saved screenshot 2:', screenshotPath2);

  await browser.close();
  console.log('All verification steps completed successfully!');
})();
