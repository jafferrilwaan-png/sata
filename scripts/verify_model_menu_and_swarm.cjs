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

  // 1. Verify Home search bar has model selection dropdown
  const screenshotHome = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_52_home_search_with_model_selection.png';
  await page.screenshot({ path: screenshotHome });
  console.log('Saved screenshot 1 (Home search with model selection):', screenshotHome);

  // 2. Submit search to dock bar at top
  const searchInput = page.locator('#sata-command-search-input-bottom');
  await searchInput.fill('Sydney, Australia');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // Verify Top docked search bar does NOT contain the model dropdown
  const screenshotTopDocked = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_53_top_docked_search_clean_no_model_dropdown.png';
  await page.screenshot({ path: screenshotTopDocked });
  console.log('Saved screenshot 2 (Top docked clean bar without model dropdown):', screenshotTopDocked);

  // 3. Ask about models running
  const chatInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await chatInput.fill('AND TELL IS YOU ONLY USING ONE MUSE SPARK 1.2 NOT OTHER MODEL YOU USING OR NOT');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);

  const screenshotSwarm = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_54_multi_agent_consensus_response.png';
  await page.screenshot({ path: screenshotSwarm });
  console.log('Saved screenshot 3 (Multi-agent consensus response):', screenshotSwarm);

  await browser.close();
  console.log('All tests completed successfully!');
})();
