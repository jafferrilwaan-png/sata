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

  // 1. Test "Track Next Satellite"
  console.log('Testing Track Next Satellite...');
  const satCard = page.locator('text=Cartosat-3').first();
  await satCard.click();
  await page.waitForTimeout(1000);

  // Click "Track Next Satellite" button in the modal
  const trackNextBtn = page.locator('button:has-text("Track Next Satellite")');
  await trackNextBtn.click();
  await page.waitForTimeout(1000);

  const screenshotSat1 = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_48_next_satellite_tracked.png';
  await page.screenshot({ path: screenshotSat1 });
  console.log('Saved screenshot 1:', screenshotSat1);

  // Close modal
  const closeSatModal = page.locator('button[aria-label="Close Satellite Dossier"]');
  await closeSatModal.click();
  await page.waitForTimeout(1000);

  // 2. Test Image Paste in Intelligence Console
  console.log('Testing Image Paste...');
  const searchInput = page.locator('#sata-command-search-input-bottom');
  await searchInput.fill('Chennai, Tamil Nadu');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  const consoleInput = page.locator('input[placeholder*="Ask Meta AI"]').first();
  await consoleInput.focus();

  // Simulate clipboard paste with an image
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Ask Meta AI"]');
    const dt = new DataTransfer();
    // Create a 1x1 dummy PNG file
    const byteString = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    const file = new File([blob], 'satellite_sensor_capture.png', { type: 'image/png' });
    dt.items.add(file);

    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: dt,
    });
    input.dispatchEvent(pasteEvent);
  });

  await page.waitForTimeout(1000);
  const screenshotPaste = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_49_clipboard_paste_image.png';
  await page.screenshot({ path: screenshotPaste });
  console.log('Saved screenshot 2:', screenshotPaste);

  // 3. Test Clean Markdown Formatting without Asterisks
  console.log('Testing Markdown Formatting...');
  await consoleInput.fill('satellite nadir ground track and altitude');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3500);

  const screenshotMarkdown = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_50_clean_bold_markdown_rendered.png';
  await page.screenshot({ path: screenshotMarkdown });
  console.log('Saved screenshot 3:', screenshotMarkdown);

  await browser.close();
  console.log('All three user issue tests completed successfully!');
})();
