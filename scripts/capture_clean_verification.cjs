const path = require('path');
const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const artifactDir = 'C:\\Users\\jaffer rilwaan.v\\.gemini\\antigravity\\brain\\32a487f7-7845-4c2b-a528-42947b5bbd0e';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-gpu-blocklist', '--enable-webgl'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to Home...');
  await page.goto('http://localhost:4000/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(artifactDir, 'ui_18_clean_sata_app_title_home.png') });
  console.log('Saved ui_18_clean_sata_app_title_home.png');

  console.log('Searching for highest rainfall query...');
  const searchInput = await page.$('input#sata-command-search-input');
  if (searchInput) {
    await searchInput.fill('CAN YOU LOCATE THE PLACE WITH HIGHEST RAINFALL');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(8000);
    await page.screenshot({ path: path.join(artifactDir, 'ui_19_mawsynram_highest_rainfall_clean_chat.png') });
    console.log('Saved ui_19_mawsynram_highest_rainfall_clean_chat.png');
  }

  await browser.close();
}

main().catch(console.error);
