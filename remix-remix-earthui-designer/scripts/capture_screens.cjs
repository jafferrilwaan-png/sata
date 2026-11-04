const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\jaffer rilwaan.v\\.gemini\\antigravity\\brain\\32a487f7-7845-4c2b-a528-42947b5bbd0e';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching Chrome with remote debugging on port ' + PORT);
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`,
    '--window-size=1920,1080',
    'http://localhost:4000',
  ]);

  await sleep(3000);

  try {
    let tabs = null;
    for (let attempt = 0; attempt < 12; attempt++) {
      try {
        const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
        if (listRes.ok) {
          tabs = await listRes.json();
          if (Array.isArray(tabs) && tabs.length > 0 && tabs[0].webSocketDebuggerUrl) break;
        }
      } catch {}
      await sleep(600);
    }
    if (!tabs) throw new Error('Could not connect to Chrome debugging port after 12 attempts');
    const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
    if (!pageTab || !pageTab.webSocketDebuggerUrl) {
      throw new Error('No page tab found in Chrome');
    }

    console.log('Connecting to CDP at:', pageTab.webSocketDebuggerUrl);
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((res) => (ws.onopen = res));

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    async function capture(fileName) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const outPath = path.join(ARTIFACT_DIR, fileName);
      fs.writeFileSync(outPath, Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot: ${outPath} (${res.data.length} bytes base64)`);
    }

    async function evalCode(expression) {
      return send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    }

    // 1. Initial Home Screen
    await sleep(2500);
    await capture('ui_01_home_screen.png');

    // 2. Open Keyboard Shortcuts Modal
    await evalCode(`
      const btn = document.querySelector('button[title*="Shortcuts"], button[aria-label*="Shortcut"]');
      if (btn) btn.click();
    `);
    await sleep(800);
    await capture('ui_02_modal_shortcuts.png');

    // Close Shortcuts Modal (press Escape)
    await evalCode(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27 }));
    `);
    await sleep(600);

    // 3. Open Commander Profile Modal
    await evalCode(`
      const profileBtn = document.querySelector('button[title*="Profile"], button[aria-label*="Profile"]');
      if (profileBtn) profileBtn.click();
    `);
    await sleep(800);
    await capture('ui_03_modal_commander.png');

    // Close Profile Modal
    await evalCode(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27 }));
    `);
    await sleep(600);

    // 4. Open Satellite Telemetry Modal
    await evalCode(`
      const telBtn = document.querySelector('button[title*="Telemetry"], button[aria-label*="Telemetry"]');
      if (telBtn) telBtn.click();
    `);
    await sleep(800);
    await capture('ui_04_modal_telemetry.png');

    // Close Telemetry Modal
    await evalCode(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27 }));
    `);
    await sleep(600);

    // 5. Execute Search for Mawsynram, Meghalaya
    await evalCode(`
      const input = document.querySelector('input[type="text"], input[placeholder*="Search"]');
      if (input) {
        input.value = "CANYOU LOACTIE THE PALCE WITH HIGER WTER REAIN FALL";
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const form = input.closest('form');
        if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    `);
    console.log('Dispatched search query: CANYOU LOACTIE THE PALCE WITH HIGER WTER REAIN FALL');
    // Wait for Meta AI live reasoning & 3D Earth flight
    await sleep(14000);
    await capture('ui_05_dossier_mawsynram_meghalaya.png');

    ws.close();
    chromeProcess.kill();
    console.log('Capture automation finished cleanly!');
  } catch (err) {
    console.error('Error during capture:', err);
    chromeProcess.kill();
  }
}

run();
