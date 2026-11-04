const path = require('path');
const { chromium } = require('C:/Users/jaffer rilwaan.v/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const artifactDir = 'C:\\Users\\jaffer rilwaan.v\\.gemini\\antigravity\\brain\\32a487f7-7845-4c2b-a528-42947b5bbd0e';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('Launching browser with Chrome executable...');
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-gpu-blocklist',
      '--enable-webgl',
      '--disable-gpu-compositing',
    ],
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  // 1. Natural Earth
  console.log('Navigating to Home...');
  await page.goto('http://localhost:4000/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(artifactDir, 'ui_12_natural_earth_day_mode.png') });
  console.log('Saved ui_12_natural_earth_day_mode.png');

  // 2. Open Simulations Modal
  console.log('Opening Simulations Modal...');
  const simBtn = await page.$('button:has-text("Planetary Simulations")');
  if (simBtn) {
    await simBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'ui_14_planetary_simulations_30_catalog.png') });
    console.log('Saved ui_14_planetary_simulations_30_catalog.png');
    const closeBtn = await page.$('button:has(svg.lucide-x)');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  // 3. Thar Desert Snowfall Simulation
  console.log('Navigating to Thar Desert Snowfall Simulation...');
  await page.goto('http://localhost:4000/?q=simulate+snowfall+scenario+on+Thar+desert', {
    waitUntil: 'load',
    timeout: 30000,
  });
  await page.waitForTimeout(4500);
  await page.screenshot({ path: path.join(artifactDir, 'ui_13_thar_desert_snowfall_simulation.png') });
  console.log('Saved ui_13_thar_desert_snowfall_simulation.png');

  await browser.close();
  console.log('DONE ALL EVIDENCE!');
}

main().catch(console.error);
