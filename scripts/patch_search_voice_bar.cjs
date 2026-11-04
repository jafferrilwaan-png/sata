const fs = require('fs');
const path = require('path');

const appFile = path.resolve(__dirname, '../remix-remix-earthui-designer/src/App.tsx');
let content = fs.readFileSync(appFile, 'utf8');

const isCRLF = content.includes('\r\n');
const lines = content.split(isCRLF ? '\r\n' : '\n');

// Find the start line: `<label htmlFor={inputId} className="sr-only">`
const startIdx = lines.findIndex(l => l.includes('<label htmlFor={inputId} className="sr-only">'));
// Find the end line: `</kbd>` followed by `)}` followed by `</div>`
let endIdx = -1;
for (let i = startIdx; i < lines.length; i++) {
  if (lines[i].includes('⌘K') && lines[i+1].includes('</kbd>') && lines[i+2].includes(')}')) {
    endIdx = i + 2;
    break;
  }
}

console.log('Found startIdx:', startIdx, 'endIdx:', endIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const replacementLines = [
    `        {mainVoiceRecorder.isRecording ? (`,
    `          <div className="flex-1 flex items-center py-0.5">`,
    `            <VoiceRecordingIndicator`,
    `              duration={mainVoiceRecorder.recordingDuration}`,
    `              onStop={handleFinishMainVoice}`,
    `              onCancel={mainVoiceRecorder.cancelRecording}`,
    `            />`,
    `          </div>`,
    `        ) : (`,
    `          <>`,
    ...lines.slice(startIdx, endIdx + 1),
    `          </>`,
    `        )}`
  ];

  lines.splice(startIdx, endIdx - startIdx + 1, ...replacementLines);
  fs.writeFileSync(appFile, lines.join(isCRLF ? '\r\n' : '\n'), 'utf8');
  console.log('Successfully inserted VoiceRecordingIndicator into search bar!');
} else {
  console.error('Indices not found!');
}
