const fs = require('fs');

const consPath = 'd:/GAME/remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let cons = fs.readFileSync(consPath, 'utf8');

const targetHook = `  // Sync initial voice message if it arrives with media URL
  useEffect(() => {
    if (initialVoiceMessage?.audioUrl) {
      setMessages((prev) => {
        if (prev.length > 0 && prev[0].id === 'initial-user-msg') {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            audioUrl: initialVoiceMessage.audioUrl,
            audioDuration: initialVoiceMessage.duration,
            text: initialVoiceMessage.transcript || updated[0].text,
          };
          return updated;
        }
        return prev;
      });
    }
  }, [initialVoiceMessage]);`;

const addedHook = `  // Sync initial voice message if it arrives with media URL
  useEffect(() => {
    if (initialVoiceMessage?.audioUrl) {
      setMessages((prev) => {
        if (prev.length > 0 && prev[0].id === 'initial-user-msg') {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            audioUrl: initialVoiceMessage.audioUrl,
            audioDuration: initialVoiceMessage.duration,
            text: initialVoiceMessage.transcript || updated[0].text,
          };
          return updated;
        }
        return prev;
      });
    }
  }, [initialVoiceMessage]);

  // Dynamically sync real-time multi-agent response when /api/llama-reason finishes
  useEffect(() => {
    if (briefingBody) {
      const cleanBody = (briefingBody || briefingLead || 'Satellite telemetry synchronized.').replace(/^(?:Llama 4|Meta Muse):\\s*/i, '');
      setMessages((prev) => {
        if (prev.length > 1 && prev[1].id === 'initial-meta-msg') {
          if (prev[1].text !== cleanBody) {
            const updated = [...prev];
            updated[1] = {
              ...updated[1],
              text: cleanBody,
              thinkingSteps: thinkingSteps && thinkingSteps.length > 0 ? thinkingSteps : updated[1].thinkingSteps,
              recommendations: recommendations && recommendations.length > 0 ? recommendations : updated[1].recommendations,
            };
            return updated;
          }
        }
        return prev;
      });
    }
  }, [briefingBody, briefingLead, thinkingSteps, recommendations]);`;

if (cons.includes(targetHook)) {
  cons = cons.replace(targetHook, addedHook);
  fs.writeFileSync(consPath, cons, 'utf8');
  console.log('✅ Added dynamic briefingBody sync effect to MetaDeepIntelligenceConsole.tsx!');
} else {
  console.log('❌ Could not locate targetHook');
}
