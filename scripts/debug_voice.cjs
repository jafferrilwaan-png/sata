const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--allow-file-access']
  });
  const context = await browser.newContext({ permissions: ['microphone'] });
  const page = await context.newPage();
  page.on('console', m => console.log('BROWSER CONSOLE:', m.text()));
  page.on('pageerror', e => console.log('PAGE ERROR:', e));
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const micButton = page.locator('button[aria-label="Voice Search"]');
  console.log('Clicking mic button...');
  await micButton.click();
  await page.waitForTimeout(2000);
  const isIndicatorVisible = await page.locator('text=/00:0[0-9]/').isVisible().catch(() => false);
  console.log('Is recording timer indicator visible?', isIndicatorVisible);
  await page.screenshot({ path: 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_debug_recording.png' });
  await browser.close();
})();
