const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Zoom out to altitude 3.8 over Australia (-25, 133)
  await page.evaluate(() => {
    const globe = (window).globeInstance || (window).__sataGlobe;
    // Let's check how globe is accessed or dispatch wheel events to zoom out
  });

  // Let's use search to point to Australia, then zoom out with mouse wheel
  const searchInput = page.locator('input[placeholder*="Search"]');
  await searchInput.fill('Australia');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // Close console
  const closeBtn = page.locator('button[title*="Return to Home Overview"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  // Now zoom out by wheeling up multiple times over the center of the screen
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  if (box) {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    for (let i = 0; i < 8; i++) {
      await page.mouse.move(cx, cy);
      await page.mouse.wheel(0, 300); // wheel down / zoom out
      await page.waitForTimeout(200);
    }
  }

  await page.waitForTimeout(2000);
  const screenshotZoomedOut = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_test_australia_wheel_zoom_out.png';
  await page.screenshot({ path: screenshotZoomedOut });
  console.log('Saved wheel zoom out screenshot:', screenshotZoomedOut);

  await browser.close();
})();
