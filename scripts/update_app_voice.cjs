const fs = require('fs');
const path = require('path');

const appFile = path.resolve(__dirname, '../remix-remix-earthui-designer/src/App.tsx');
let content = fs.readFileSync(appFile, 'utf8');

// 1. Add imports if not present
if (!content.includes("from './hooks/useVoiceRecorder'")) {
  content = content.replace(
    "import Galaxy from './components/Galaxy';",
    "import Galaxy from './components/Galaxy';\r\nimport { useVoiceRecorder } from './hooks/useVoiceRecorder';\r\nimport { VoiceRecordingIndicator } from './components/VoiceRecordingIndicator';"
  );
}

// 2. Replace toggleVoiceRecognition and isListening
const oldVoiceFnRegex = /const toggleVoiceRecognition = \(\) => \{[\s\S]*?^  \};/m;
const newVoiceLogic = `  const mainVoiceRecorder = useVoiceRecorder();
  const [activeVoiceMessage, setActiveVoiceMessage] = useState<{
    audioUrl: string;
    duration: number;
    transcript: string;
  } | null>(null);

  const isListening = mainVoiceRecorder.isRecording;

  const handleFinishMainVoice = async () => {
    const res = await mainVoiceRecorder.stopRecording();
    if (!res) return;

    const transcript = res.transcript || 'Global planetary observation query';
    setSearchQuery(transcript);
    setActiveVoiceMessage({
      audioUrl: res.url,
      duration: res.duration,
      transcript: transcript,
    });

    try {
      const formData = new FormData();
      formData.append('audio', res.blob, 'voice_query.webm');
      formData.append('transcript', transcript);
      formData.append('duration', res.duration.toString());
      formData.append('model', selectedMetaModel);
      fetch('/api/meta-voice', {
        method: 'POST',
        body: formData,
      }).catch((e) => console.warn('Meta voice call error:', e));
    } catch (e) {
      console.warn('Voice submit error:', e);
    }

    handleExecuteSearch(transcript);
  };

  const toggleVoiceRecognition = () => {
    if (mainVoiceRecorder.isRecording) {
      handleFinishMainVoice();
    } else {
      mainVoiceRecorder.startRecording();
    }
  };`;

content = content.replace(oldVoiceFnRegex, newVoiceLogic);

// 3. Update handleExecuteSearch signature
content = content.replace(
  'const handleExecuteSearch = async (e?: React.FormEvent) => {\r\n    e?.preventDefault();\r\n    const q = searchQuery.trim();',
  `const handleExecuteSearch = async (overrideQueryOrEvent?: string | React.FormEvent, e?: React.FormEvent) => {
    let q = searchQuery.trim();
    if (typeof overrideQueryOrEvent === 'string') {
      q = overrideQueryOrEvent.trim();
      setSearchQuery(q);
    } else if (overrideQueryOrEvent && 'preventDefault' in overrideQueryOrEvent) {
      overrideQueryOrEvent.preventDefault();
    }
    e?.preventDefault();`
);

// Also handle LF version just in case
content = content.replace(
  'const handleExecuteSearch = async (e?: React.FormEvent) => {\n    e?.preventDefault();\n    const q = searchQuery.trim();',
  `const handleExecuteSearch = async (overrideQueryOrEvent?: string | React.FormEvent, e?: React.FormEvent) => {
    let q = searchQuery.trim();
    if (typeof overrideQueryOrEvent === 'string') {
      q = overrideQueryOrEvent.trim();
      setSearchQuery(q);
    } else if (overrideQueryOrEvent && 'preventDefault' in overrideQueryOrEvent) {
      overrideQueryOrEvent.preventDefault();
    }
    e?.preventDefault();`
);

// 4. Update the search bar input block to include VoiceRecordingIndicator when recording
const oldInputRegex = /<div className="relative flex-1 flex items-center min-w-0 pr-2">[\s\S]*?<\/kbd>\s*\)\s*\}\s*<\/div>/;
const newInputBlock = `<div className="relative flex-1 flex items-center min-w-0 pr-2">
        {mainVoiceRecorder.isRecording ? (
          <div className="flex-1 flex items-center py-0.5">
            <VoiceRecordingIndicator
              duration={mainVoiceRecorder.recordingDuration}
              onStop={handleFinishMainVoice}
              onCancel={mainVoiceRecorder.cancelRecording}
            />
          </div>
        ) : (
          <>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleExecuteSearch();
                }
              }}
              placeholder="Search planet, coordinates, satellite, or hazard..."
              aria-label="Search earth locations or sensors"
              className="w-full bg-transparent text-[12px] sm:text-[13.5px] font-light text-white placeholder-[#a1a1aa] focus:outline-none tracking-[0.01em]"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                  setIsSearchSubmitted(false);
                  setLiveAiDispatchState(null);
                  setAgentInsightOverride(null);
                  setActiveVoiceMessage(null);
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear Search"
                title="Clear search text"
                className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3 h-3 stroke-[2]" />
              </button>
            ) : (
              <kbd
                aria-hidden="true"
                className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[9.5px] font-mono font-medium text-white/35 bg-white/[0.06] border border-white/10 rounded-[5px] select-none pointer-events-none"
              >
                ⌘K
              </kbd>
            )}
          </>
        )}
      </div>`;

content = content.replace(oldInputRegex, newInputBlock);

// 5. Update Voice Search button styling to animate-pulse red when recording
content = content.replace(
  `isListening
              ? 'sata-date-pill text-white shadow-[0_0_14px_rgba(56,189,248,0.35)]'
              : 'sata-glass-btn text-[#e4e4e7] hover:text-white'`,
  `mainVoiceRecorder.isRecording
              ? 'bg-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.5)] animate-pulse'
              : 'sata-glass-btn text-[#e4e4e7] hover:text-white'`
);

content = content.replace(
  `title={isListening ? 'Listening... Speak your query' : 'Ask with voice'}`,
  `title={mainVoiceRecorder.isRecording ? 'Finish and send voice recording' : 'Record voice with Meta AI'}`
);

// 6. Pass initialVoiceMessage into MetaDeepIntelligenceConsole
if (!content.includes('initialVoiceMessage={activeVoiceMessage || undefined}')) {
  content = content.replace(
    '<MetaDeepIntelligenceConsole',
    '<MetaDeepIntelligenceConsole\r\n                initialVoiceMessage={activeVoiceMessage || undefined}'
  );
}

fs.writeFileSync(appFile, content, 'utf8');
console.log('App.tsx successfully updated with real voice recording!');
