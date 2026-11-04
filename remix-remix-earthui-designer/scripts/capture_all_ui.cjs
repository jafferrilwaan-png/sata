const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\jaffer rilwaan.v\\.gemini\\antigravity\\brain\\32a487f7-7845-4c2b-a528-42947b5bbd0e';

const targets = [
  { name: 'ui_01_home_screen.png', url: 'http://localhost:4000', delay: 4000 },
  { name: 'ui_08_detailed_recommendations_and_thinking.png', url: 'http://localhost:4000/?q=CAN+YOU+LOCATE+THE+PLACE+WITH+HIGHER+WATER+RAINFALL', delay: 6000 },
  { name: 'ui_09_mawsynram_highest_rainfall.png', url: 'http://localhost:4000/?q=CAN+YOU+LOCATE+THE+PLACE+WITH+HIGHER+WATER+RAINFALL', delay: 6000 },
  { name: 'ui_10_tamil_nadu_clean_dossier.png', url: 'http://localhost:4000/?q=Tamil+Nadu', delay: 5000 },
  { name: 'ui_11_tropical_cyclone_murasu.png', url: 'http://localhost:4000/?q=Tropical+Cyclone+Murasu', delay: 5000 },
];

async function capture(target) {
  const outPath = path.join(artifactDir, target.name);
  if (fs.existsSync(outPath)) {
    try { fs.unlinkSync(outPath); } catch {}
  }
  
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1920,1080',
    `--virtual-time-budget=${target.delay}`,
    `--screenshot=${outPath}`,
    target.url,
  ];

  return new Promise((resolve) => {
    const proc = spawn(chromePath, args, { stdio: 'ignore' });
    proc.on('close', (code) => {
      console.log(`Captured ${target.name} (exit: ${code}, exists: ${fs.existsSync(outPath)})`);
      resolve();
    });
    setTimeout(() => {
      try { proc.kill(); } catch {}
      resolve();
    }, target.delay + 7000);
  });
}

async function runAll() {
  for (const t of targets) {
    console.log(`Starting capture for ${t.name}...`);
    await capture(t);
  }
  console.log('All screenshots captured successfully!');
}

runAll();
