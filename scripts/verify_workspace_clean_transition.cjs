const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. Initial Home Screen: search bar is at bottom center, bottom cards visible, sidebar visible
  const screenshotHome = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_40_home_pristine_layout.png';
  await page.screenshot({ path: screenshotHome });
  console.log('Saved home screenshot:', screenshotHome);

  // 2. Type "Manaus, Amazon Basin" and hit Enter
  const bottomSearchInput = page.locator('input[placeholder*="Search"]').first();
  await bottomSearchInput.fill('Manaus, Amazon Basin');
  console.log('Filled search, pressing Enter...');
  await page.keyboard.press('Enter');

  // Wait for the animated transition: search bar floats UP to TopNavbar, response appears on LEFT, bottom cards & sidebar hide
  await page.waitForTimeout(4000);

  const screenshotDossier = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_41_search_docked_top_full_height_chat_clean_earth.png';
  await page.screenshot({ path: screenshotDossier });
  console.log('Saved dossier mode screenshot:', screenshotDossier);

  // 3. Click Close 'X' button on the Meta AI console to return home
  const closeBtn = page.locator('button[title*="Return to Home Overview"]');
  if (await closeBtn.isVisible()) {
    console.log('Clicking Close button on console...');
    await closeBtn.click();
    await page.waitForTimeout(3000);

    const screenshotBackHome = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_42_returned_to_home_search_at_bottom.png';
    await page.screenshot({ path: screenshotBackHome });
    console.log('Saved back to home screenshot:', screenshotBackHome);
  }

  await browser.close();
  console.log('Workspace transition test completed successfully!');
})();
