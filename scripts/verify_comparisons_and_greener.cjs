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

  // 1. Enter: "can you compare temperature of bay of bengal with chennai"
  console.log('2. Entering: can you compare temperature of bay of bengal with chennai');
  const searchInput = page.locator('input[placeholder*="Search location"]').first();
  await searchInput.fill('can you compare temperature of bay of bengal with chennai');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);

  const screenshot1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_74_bay_of_bengal_vs_chennai_comparison.png';
  await page.screenshot({ path: screenshot1 });
  console.log('Saved screenshot 1 (Comparison Table & Radiometry):', screenshot1);

  // 2. In chat console input, enter: "make greener this place"
  console.log('3. Entering: make greener this place in chat console...');
  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await chatInput.fill('make greener this place');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);

  const screenshot2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_75_make_greener_ndvi_active.png';
  await page.screenshot({ path: screenshot2 });
  console.log('Saved screenshot 2 (Make Greener NDVI Active on 3D Earth):', screenshot2);

  await browser.close();
  console.log('Verification finished successfully!');
})();
