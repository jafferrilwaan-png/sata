const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Submit search to open intelligence console
  const searchInput = page.locator('input[placeholder*="Search"]').first();
  await searchInput.fill('Sydney, Australia');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // 2. Type another message in console chat input to trigger thinking state
  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await chatInput.fill('Thermal Sensor Scan');
  await page.keyboard.press('Enter');

  // Immediately take screenshot while isAgentExecuting is true and spinner is active
  await page.waitForTimeout(250);

  const screenshotPurpleRotating = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_44_purple_meta_rotating_thinking.png';
  await page.screenshot({ path: screenshotPurpleRotating });
  console.log('Saved screenshot:', screenshotPurpleRotating);

  // Wait for response to complete and take a screenshot of response card with purple badge
  await page.waitForTimeout(3500);
  const screenshotResponseCard = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_45_response_with_purple_badge.png';
  await page.screenshot({ path: screenshotResponseCard });
  console.log('Saved screenshot:', screenshotResponseCard);

  await browser.close();
  console.log('All tests completed successfully!');
})();
