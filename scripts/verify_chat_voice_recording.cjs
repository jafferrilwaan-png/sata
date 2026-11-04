const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--allow-file-access']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['microphone']
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:4000 ...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. First open the intelligence console by searching or pressing Enter
  const searchInput = page.locator('input[placeholder*="Search"]');
  await searchInput.fill('Wildfire in Australia');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // 2. In the console, find the mic button in the chat input bar
  const consoleMicBtn = page.locator('button[title="Record voice query with Meta AI"]');
  console.log('Is console mic button visible?', await consoleMicBtn.isVisible());
  if (await consoleMicBtn.isVisible()) {
    console.log('Clicking console mic button to record voice query...');
    await consoleMicBtn.click();
    await page.waitForTimeout(2500);

    // Take screenshot of active recording state inside the intelligence console
    const screenshotConsoleRecording = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_35_console_voice_recording_active.png';
    await page.screenshot({ path: screenshotConsoleRecording });
    console.log('Saved console recording screenshot:', screenshotConsoleRecording);

    // Click checkmark / send voice button inside the recording pill
    const checkBtn = page.locator('button[title="Send voice query"]');
    if (await checkBtn.isVisible()) {
      console.log('Sending voice recording...');
      await checkBtn.click();
    }
    await page.waitForTimeout(4000);

    // Take screenshot of the conversation with the authentic voice message bubble
    const screenshotVoiceBubble = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_36_voice_message_bubble_in_chat.png';
    await page.screenshot({ path: screenshotVoiceBubble });
    console.log('Saved voice message bubble screenshot:', screenshotVoiceBubble);
  }

  await browser.close();
  console.log('Console voice verification completed!');
})();
