const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });

  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const searchInput = page.locator('#sata-command-search-input-bottom');
  await searchInput.fill('HIGH-RES FOR INDIA WITH CLAER RESOLUTION OF 3D I WANT TO SEE');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);

  const highResBtn = page.locator('button:has-text("High-Res Optical")').first();
  console.log('Button visible?', await highResBtn.isVisible());
  if (await highResBtn.isVisible()) {
    await highResBtn.click();
    await page.waitForTimeout(4000);
  }

  const outPath = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_60_debug_high_res_click.png';
  await page.screenshot({ path: outPath });
  console.log('Saved screenshot:', outPath);
  await browser.close();
})();
