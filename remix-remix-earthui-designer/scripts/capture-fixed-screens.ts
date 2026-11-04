import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function main() {
  const artifactDir = 'C:\\Users\\jaffer rilwaan.v\\.gemini\\antigravity\\brain\\32a487f7-7845-4c2b-a528-42947b5bbd0e';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log('Capturing Mawsynram rainfall query...');
  await page.goto('http://localhost:4000/?q=CAN+YOU+LOCATE+THE+PLACE+WITH+HIGHER+WATER+RAINFALL', { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: path.join(artifactDir, 'ui_09_mawsynram_highest_rainfall.png'), fullPage: false });

  console.log('Capturing Tamil Nadu query...');
  await page.goto('http://localhost:4000/?q=Tamil+Nadu', { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(artifactDir, 'ui_10_tamil_nadu_clean_dossier.png'), fullPage: false });

  console.log('Capturing Tropical Cyclone Murasu query...');
  await page.goto('http://localhost:4000/?q=Tropical+Cyclone+Murasu', { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(artifactDir, 'ui_11_tropical_cyclone_murasu.png'), fullPage: false });

  await browser.close();
  console.log('All screenshots captured successfully.');
}

main().catch(console.error);
