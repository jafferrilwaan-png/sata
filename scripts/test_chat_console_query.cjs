const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Focus and submit in top search bar to open console
  console.log('2. Opening Chennai in search bar...');
  const searchInput = page.locator('input[placeholder*="Search location"]').first();
  await searchInput.fill('Chennai');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // Now ask in chat console:
  console.log('3. Asking in chat console: can you compare temperature of bay of bengal with chennai');
  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await chatInput.fill('can you compare temperature of bay of bengal with chennai');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  const screenshot1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_76_chat_comparison_rendered.png';
  await page.screenshot({ path: screenshot1 });
  console.log('Saved screenshot 1:', screenshot1);

  // Now ask: make greener this place
  console.log('4. Asking: make greener this place');
  await chatInput.fill('make greener this place');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);

  const screenshot2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_77_chat_make_greener_rendered.png';
  await page.screenshot({ path: screenshot2 });
  console.log('Saved screenshot 2:', screenshot2);

  await browser.close();
  console.log('All tests completed successfully!');
})();
