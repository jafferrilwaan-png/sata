const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const path = require('path');
const fs = require('fs');

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
  await page.waitForTimeout(3000);

  // 1. Take initial screenshot of clean home screen with mic button
  const screenshotHomePath = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_32_home_with_mic_button.png';
  await page.screenshot({ path: screenshotHomePath });
  console.log('Saved home screenshot:', screenshotHomePath);

  // 2. Click the Mic button to start real voice recording
  const micButton = page.locator('button[aria-label="Voice Search"]');
  console.log('Clicking voice search mic button...');
  await micButton.click();

  // Wait 2.5 seconds while fake media stream records audio
  await page.waitForTimeout(2500);

  // Take screenshot of active recording state (with live timer, waveform, pulsing red dot)
  const screenshotRecordingPath = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_33_real_voice_recording_active.png';
  await page.screenshot({ path: screenshotRecordingPath });
  console.log('Saved recording state screenshot:', screenshotRecordingPath);

  // 3. Stop recording by clicking the finish button (or mic button)
  const checkButton = page.locator('button[title="Send voice query"]');
  if (await checkButton.isVisible()) {
    console.log('Clicking check button to complete voice recording...');
    await checkButton.click();
  } else {
    console.log('Clicking mic button to finish recording...');
    await micButton.click();
  }

  // Wait for Meta AI intelligence console to open with the voice message and response
  await page.waitForTimeout(4000);

  const screenshotConsolePath = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/32a487f7-7845-4c2b-a528-42947b5bbd0e/ui_34_meta_ai_voice_message_console.png';
  await page.screenshot({ path: screenshotConsolePath });
  console.log('Saved voice message console screenshot:', screenshotConsolePath);

  await browser.close();
  console.log('Voice verification completed successfully!');
})();
