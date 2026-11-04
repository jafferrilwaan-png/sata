const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });

  console.log('1. Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Take screenshot of sidebar with live video
  const screenshot1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_86_sidebar_live_satellite_video.png';
  await page.screenshot({ path: screenshot1 });
  console.log('Saved screenshot 1 (Sidebar Live Satellite Video):', screenshot1);

  // Click on the Satellite Orbit Status card
  console.log('2. Clicking on the Satellite Orbit Status card...');
  const satCard = page.locator('div[title*="telemetry"]').first();
  await satCard.click();
  await page.waitForTimeout(4000);

  // Take screenshot of modal with live satellite video
  const screenshot2 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_87_modal_live_satellite_video_playing.png';
  await page.screenshot({ path: screenshot2 });
  console.log('Saved screenshot 2 (Modal Live Video Playing):', screenshot2);

  await browser.close();
  console.log('Verification finished successfully!');
})();
