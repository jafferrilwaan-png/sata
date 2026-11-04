const http = require('http');

const data = JSON.stringify({ query: 'simulate snowfall scenario on Thar desert' });

const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/api/llama-reason',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const parsed = JSON.parse(body);
    console.log('Target:', parsed.targetName);
    console.log('Briefing:', parsed.briefingSummary?.slice(0, 150));
    console.log('Thinking steps:', parsed.thinkingSteps?.length);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
