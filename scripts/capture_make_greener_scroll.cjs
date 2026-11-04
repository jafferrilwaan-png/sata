const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const searchInput = page.locator('input[placeholder*="Search location"]').first();
  await searchInput.fill('Chennai');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await chatInput.fill('make greener this place');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(9000);

  // Scroll messages to bottom
  await page.evaluate(() => {
    const list = document.querySelector('.overflow-y-auto');
    if (list) list.scrollTop = list.scrollHeight;
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_82_make_greener_finished_scroll.png' });
  await browser.close();
  console.log('Saved ui_82_make_greener_finished_scroll.png');
})();
