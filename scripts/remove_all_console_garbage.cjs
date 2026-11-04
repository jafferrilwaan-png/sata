const fs = require('fs');
const path = require('path');

const file = path.resolve('remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Remove the entire Satellite Feed Bar (lines 723 - 810)
const feedBarRegex = /\{\/\* Clean Satellite Feed Bar[\s\S]*?\{\/\* Observation Conversation Thread \*\/\}/;
const cleanThreadStart = `{/* Observation Conversation Thread */}`;

if (feedBarRegex.test(code)) {
  code = code.replace(feedBarRegex, cleanThreadStart);
  console.log('SUCCESS: Removed satellite feed bar and stream clutter!');
} else {
  console.warn('WARN: feedBarRegex not matched!');
}

// 2. Remove ThinkingAccordion from response cards
const thinkingRegex = /\{\/\* Meta AI Thinking Steps \*\/\}[\s\S]*?\{\/\* Clean Observation Text First \*\/\}/;
if (thinkingRegex.test(code)) {
  code = code.replace(thinkingRegex, '{/* Clean Observation Text First */}');
  console.log('SUCCESS: Removed thinking steps accordion box from response cards!');
} else {
  console.warn('WARN: thinkingRegex not matched!');
}

// 3. Remove Actionable Intelligence Recommendations cards
const recsRegex = /\{\/\* Actionable Intelligence Recommendations \*\/\}[\s\S]*?\{\/\* Requested Satellite Imagery Frame/;
if (recsRegex.test(code)) {
  code = code.replace(recsRegex, '{/* Requested Satellite Imagery Frame');
  console.log('SUCCESS: Removed Actionable Intelligence Recommendations cards!');
} else {
  console.warn('WARN: recsRegex not matched!');
}

// 4. Remove metadata, captions, sensors, resolution and coordinates beneath the image
const imgMetadataRegex = /\{\/\* All Metadata, Captions, Sensors, and Resolution sit CLEANLY BENEATH the Image \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\)\}/;
const cleanImgOnly = `</div>
                    )}`;

if (imgMetadataRegex.test(code)) {
  code = code.replace(imgMetadataRegex, cleanImgOnly);
  console.log('SUCCESS: Removed coordinates and metadata box beneath the image!');
} else {
  console.warn('WARN: imgMetadataRegex not matched!');
}

// 5. Add smart, direct human answer for "is it true image", "real image", "fake image"
const queryCheckAnchor = /if \(isTimeQuery\) \{/;
const smartImageAuthCheck = `const isImageAuth = (qLower.includes('true') || qLower.includes('real') || qLower.includes('fake') || qLower.includes('actual') || qLower.includes('authentic') || qLower.includes('generated') || qLower.includes('ai')) && (qLower.includes('image') || qLower.includes('iamge') || qLower.includes('photo') || qLower.includes('pic') || qLower.includes('picture'));
        if (isImageAuth) {
          replyText = "Yes, this is an authentic, real-world true-color satellite observation captured by NASA's MODIS sensor on the Terra satellite. It is real earth observation imagery from NASA GIBS, not an AI-generated image.";
        } else if (isTimeQuery) {`;

if (queryCheckAnchor.test(code)) {
  code = code.replace(queryCheckAnchor, smartImageAuthCheck);
  console.log('SUCCESS: Added direct human answer for image authenticity query!');
} else {
  console.warn('WARN: queryCheckAnchor not matched!');
}

fs.writeFileSync(file, code, 'utf8');
console.log('ALL GARBAGE CLEANED FROM METADEEPINTELLIGENCECONSOLE.TSX!');
