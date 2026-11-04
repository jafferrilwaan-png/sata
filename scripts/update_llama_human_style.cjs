const fs = require('fs');
const path = require('path');

const file = path.resolve('src/services/metaLlamaService.ts');
let code = fs.readFileSync(file, 'utf8');

const targetInstruction = 'Special rules:\n- If asked about highest rainfall, wettest place, or maximum water precipitation on Earth, identify Mawsynram, Meghalaya, India (lat: 25.2988, lon: 91.5828).';
const replacement = `Special rules:
- If the user asks a simple question (e.g. "is it true image?", "is this real?", "hi", "hello"), respond directly, concisely, and naturally in 1-2 friendly sentences. Never output robotic jargon or academic essays for simple questions.
- If asked whether the image or satellite pass is a true image or real, confirm clearly: "Yes, this is an authentic true-color satellite observation captured by NASA MODIS Terra. It is real earth imagery from NASA GIBS, not an AI-generated image."
- If asked about highest rainfall, wettest place, or maximum water precipitation on Earth, identify Mawsynram, Meghalaya, India (lat: 25.2988, lon: 91.5828).`;

if (code.includes(targetInstruction)) {
  code = code.replace(targetInstruction, replacement);
  console.log('SUCCESS: Updated promptGeospatial rules!');
} else {
  console.warn('WARN: targetInstruction not found in metaLlamaService.ts');
}

const targetTactical = 'Focus strictly on the actual geographic region requested (e.g. if the inquiry asks for highest rainfall, analyze Mawsynram, Meghalaya; if Tamil Nadu, analyze Tamil Nadu). NEVER produce unrelated California or Menlo Park briefings unless the query explicitly asked for California or Menlo Park.';
const replacementTactical = `Focus strictly on the actual inquiry.
- If the user asks a simple or conversational question (e.g. "is it true image?", "is this real?", "hi"), answer directly, naturally, and concisely in 1-2 clear sentences. Do NOT output long paragraphs or robotic jargon.
- If asked whether the satellite image is real or true, reply directly: "Yes, this is an authentic true-color satellite observation from NASA MODIS Terra. It is real satellite imagery from NASA GIBS, not an AI-generated image."
- Focus strictly on the actual geographic region requested (e.g. if the inquiry asks for highest rainfall, analyze Mawsynram, Meghalaya; if Tamil Nadu, analyze Tamil Nadu). NEVER produce unrelated California or Menlo Park briefings unless the query explicitly asked for California or Menlo Park.`;

if (code.includes(targetTactical)) {
  code = code.replace(targetTactical, replacementTactical);
  console.log('SUCCESS: Updated promptTactical rules!');
} else {
  console.warn('WARN: targetTactical not found in metaLlamaService.ts');
}

fs.writeFileSync(file, code, 'utf8');
