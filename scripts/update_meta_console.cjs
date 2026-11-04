const fs = require('fs');
const filePath = 'remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Ensure icons ChevronRight, ChevronDown are imported
code = code.replace(
  /import\s*\{\s*([\s\S]*?)\s*\}\s*from\s*'lucide-react';/,
  (match, p1) => {
    const icons = p1.split(',').map(s => s.trim()).filter(Boolean);
    if (!icons.includes('ChevronRight')) icons.push('ChevronRight');
    if (!icons.includes('ChevronDown')) icons.push('ChevronDown');
    return `import {\n  ${icons.join(',\n  ')},\n} from 'lucide-react';`;
  }
);

// 2. Add ThinkingAccordion component before RichTelemetryText if not already present
if (!code.includes('const ThinkingAccordion')) {
  const accordionDef = `
const ThinkingAccordion: React.FC<{ steps: string[] }> = ({ steps }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!steps || steps.length === 0) return null;
  return (
    <div className="my-1.5 w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white/80 transition-colors py-0.5 cursor-pointer select-none font-sans"
      >
        <ChevronRight className={\`w-3.5 h-3.5 transition-transform duration-200 \${isOpen ? 'rotate-90' : ''}\`} />
        <span>Thought process ({steps.length} steps)</span>
      </button>
      {isOpen && (
        <div className="mt-1.5 pl-3 border-l-2 border-white/10 space-y-1.5 py-1 text-[11.5px] text-white/70 font-sans leading-relaxed select-text">
          {steps.map((step, idx) => (
            <div key={idx} className="text-white/75">
              {step.replace(/^[•\\-\\*]\\s*/, '')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
`;
  code = code.replace(/const RichTelemetryText:/, accordionDef + '\nconst RichTelemetryText:');
}

// 3. Initialize messages with targetName prompt & briefing response if messages is empty
const messagesInitTarget = `  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([]);`;

const messagesInitReplacement = `  // Conversation history: initialized with the active search prompt and Meta AI response
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const initialQuery = targetName || 'Global Observation';
    const initialReply = (briefingBody || briefingLead || 'Satellite telemetry synchronized.').replace(/^(?:Llama 4|Meta Muse):\\s*/i, '');
    return [
      {
        id: 'initial-user-msg',
        sender: 'user',
        text: initialQuery,
        timestamp: initialTime,
      },
      {
        id: 'initial-meta-msg',
        sender: 'meta',
        text: initialReply,
        thinkingSteps: thinkingSteps && thinkingSteps.length > 0 ? thinkingSteps : undefined,
        recommendations: recommendations && recommendations.length > 0 ? recommendations : undefined,
        timestamp: initialTime,
      },
    ];
  });`;

if (code.includes(messagesInitTarget)) {
  code = code.replace(messagesInitTarget, messagesInitReplacement);
}

// 4. Update the render section: remove static briefing & green multi-agent box, keep clean chat list
// Look for lines 607 to 653: Primary Observation Briefing through Actionable Strategic Recommendations
const staticBoxesPattern = /\{\/\*\s*Primary Observation Briefing[\s\S]*?\{\/\*\s*Clean Satellite Feed Bar/m;
if (staticBoxesPattern.test(code)) {
  code = code.replace(
    staticBoxesPattern,
    `{/* Clean Satellite Feed Bar`
  );
}

// 5. Replace green dots and green text in Meta AI Reasoning State
code = code.replace(
  /<span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" \/>[\s\S]*?<span className="font-medium tracking-wide text-white">[\s\S]*?Meta AI reasoning\.\.\.[\s\S]*?<\/span>[\s\S]*?<span className="text-\[11px\] font-mono text-white\/50">[\s\S]*?\(Retrieving live satellite observations\.\.\.\)[\s\S]*?<\/span>/,
  `<div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin shrink-0" />
                <span className="font-sans text-[12px] text-white/70">
                  Thinking...
                </span>`
);

// 6. Replace thinking steps inside message rendering to use ThinkingAccordion instead of green dots/monospace
code = code.replace(
  /\{\/\*\s*Meta AI Thinking Steps\s*\*\/\}[\s\S]*?\{m\.thinkingSteps && m\.thinkingSteps\.length > 0 && \([\s\S]*?<\/div>\s*\}\)/,
  `{/* Meta AI Thinking Steps */}
                    {m.thinkingSteps && m.thinkingSteps.length > 0 && (
                      <ThinkingAccordion steps={m.thinkingSteps} />
                    )}`
);

// 7. Remove any remaining green dots / emerald badges
code = code.replace(/text-emerald-400\/90 font-sans text-\[11px\] font-medium/g, 'text-white/60 font-sans text-[11px]');
code = code.replace(/font-mono text-\[9\.5px\] text-emerald-400\/90 font-medium tracking-normal/g, 'font-mono text-[9.5px] text-white/60 font-medium');

// 8. Prevent false-color thermal trigger for normal searches like Riyadh
code = code.replace(
  /if \(wantsIR \|\| metaData\?\.layerType === 'THERMAL'\) \{[\s\S]*?onApplyLayer\?\.\('VIIRS_NIGHT_THERMAL'\);/g,
  `if (wantsIR) {
          onApplyLayer?.('VIIRS_NIGHT_THERMAL');`
);

// 9. Time calculation & greeting handler in executeObservationQuery
const queryCheckMarker = `const isNegativeVideo = qLower.includes('remove')`;
const timeHandlerCode = `
    const isTimeQuery = qLower.includes('time') || qLower.includes('clock') || qLower.includes('date');
    const isGreeting = /^(hi|hello|hey|greetings|hola)\\b/i.test(qLower.trim());
`;
if (!code.includes('isTimeQuery')) {
  code = code.replace(queryCheckMarker, timeHandlerCode + '\n    ' + queryCheckMarker);
}

// In executeObservationQuery response building:
const replyBuildingTarget = `if (metaData?.briefingSummary) {
          replyText = metaData.briefingSummary.replace(/^(Meta Muse|Llama 4):\\s*/i, '');
        }`;

const replyBuildingReplacement = `if (metaData?.briefingSummary) {
          replyText = metaData.briefingSummary.replace(/^(Meta Muse|Llama 4):\\s*/i, '');
        }

        if (isTimeQuery) {
          const isIndia = (resolvedLat >= 6 && resolvedLat <= 38 && resolvedLon >= 68 && resolvedLon <= 97);
          const tz = isIndia ? 'Asia/Kolkata' : 'UTC';
          const timeFormatted = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short',
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }).format(new Date());

          replyText = \`The current local time in **\${resolvedTargetName}** is **\${timeFormatted}** (\${isIndia ? 'Indian Standard Time, UTC+5:30' : 'UTC'}).\\n\\n\` +
            \`• **Coordinates:** \${Math.abs(resolvedLat).toFixed(2)}° \${resolvedLat >= 0 ? 'N' : 'S'}, \${Math.abs(resolvedLon).toFixed(2)}° \${resolvedLon >= 0 ? 'E' : 'W'}\\n\` +
            \`• **Solar Status:** Real-time insolation synchronized with orbital pass geometry.\\n\\n\` +
            (replyText || '');
        } else if (isGreeting) {
          replyText = \`Hello! I am Meta AI for SATA. How can I assist you with real-time planetary observations, satellite tracking, or environmental data today?\`;
        }`;

if (code.includes(replyBuildingTarget)) {
  code = code.replace(replyBuildingTarget, replyBuildingReplacement);
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated MetaDeepIntelligenceConsole.tsx');
