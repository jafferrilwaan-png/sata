const fs = require('fs');
const file = 'remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let src = fs.readFileSync(file, 'utf8');

// 1. Update ChatMessage interface
src = src.replace(
  'export interface ChatMessage {\r\n  id: string;\r\n  sender: \'user\' | \'meta\';\r\n  text: string;\r\n  attachmentName?: string;',
  `export interface ChatMessage {\r\n  id: string;\r\n  sender: 'user' | 'meta';\r\n  text: string;\r\n  thinkingSteps?: string[];\r\n  recommendations?: { category: string; action: string }[];\r\n  attachmentName?: string;`
);

src = src.replace(
  'export interface ChatMessage {\n  id: string;\n  sender: \'user\' | \'meta\';\n  text: string;\n  attachmentName?: string;',
  `export interface ChatMessage {\n  id: string;\n  sender: 'user' | 'meta';\n  text: string;\n  thinkingSteps?: string[];\n  recommendations?: { category: string; action: string }[];\n  attachmentName?: string;`
);

// 2. Pass thinkingSteps and recommendations into agentReply
src = src.replace(
  'const agentReply: ChatMessage = {\r\n          id: `ai-${Date.now()}`,\r\n          sender: \'meta\',\r\n          text: replyText,\r\n          timestamp: new Date().toLocaleTimeString([], { hour: \'2-digit\', minute: \'2-digit\' }),\r\n          generatedImagery,\r\n        };',
  `const agentReply: ChatMessage = {\r\n          id: \`ai-\${Date.now()}\`,\r\n          sender: 'meta',\r\n          text: replyText,\r\n          thinkingSteps: metaData?.thinkingSteps,\r\n          recommendations: metaData?.recommendations,\r\n          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),\r\n          generatedImagery,\r\n        };`
);

src = src.replace(
  'const agentReply: ChatMessage = {\n          id: `ai-${Date.now()}`,\n          sender: \'meta\',\n          text: replyText,\n          timestamp: new Date().toLocaleTimeString([], { hour: \'2-digit\', minute: \'2-digit\' }),\n          generatedImagery,\n        };',
  `const agentReply: ChatMessage = {\n          id: \`ai-\${Date.now()}\`,\n          sender: 'meta',\n          text: replyText,\n          thinkingSteps: metaData?.thinkingSteps,\n          recommendations: metaData?.recommendations,\n          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),\n          generatedImagery,\n        };`
);

// 3. Render thinkingSteps and recommendations inside message card
const renderTarget = '{/* Clean Observation Text First */}\r\n                    <RichTelemetryText content={m.text} />';
const renderTargetLF = '{/* Clean Observation Text First */}\n                    <RichTelemetryText content={m.text} />';

const replacement = `{/* Meta AI Thinking Steps */}
                    {m.thinkingSteps && m.thinkingSteps.length > 0 && (
                      <div className="rounded-[14px] bg-white/[0.03] border border-white/10 p-3 text-[11px] font-mono text-white/70">
                        <div className="flex items-center gap-2 text-emerald-400 font-sans font-medium text-[11px] mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Meta AI Multi-Agent Extended Reasoning</span>
                        </div>
                        <div className="space-y-1 pl-2 border-l border-emerald-500/30">
                          {m.thinkingSteps.map((step, idx) => (
                            <div key={idx} className="text-white/60">
                              • {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clean Observation Text First */}
                    <RichTelemetryText content={m.text} />

                    {/* Actionable Intelligence Recommendations */}
                    {m.recommendations && m.recommendations.length > 0 && (
                      <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-white/80">
                          Actionable Intelligence Recommendations
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {m.recommendations.map((rec, rIdx) => (
                            <div key={rIdx} className="p-2.5 rounded-[12px] bg-white/[0.04] border border-white/10 text-[11px] flex flex-col gap-0.5">
                              <span className="text-sky-400 font-medium font-mono text-[10px] uppercase tracking-wider">
                                {rec.category}
                              </span>
                              <span className="text-white/90 leading-relaxed">
                                {rec.action}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}`;

if (src.includes(renderTarget)) {
  src = src.replace(renderTarget, replacement);
} else if (src.includes(renderTargetLF)) {
  src = src.replace(renderTargetLF, replacement);
}

fs.writeFileSync(file, src, 'utf8');
console.log('Successfully updated MetaDeepIntelligenceConsole with thinking and recommendations!');
