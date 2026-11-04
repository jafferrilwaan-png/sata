const fs = require('fs');
const filePath = 'remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetBlock = `{/* Meta AI Thinking Steps */}
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
                    )}`;

const replacementBlock = `{/* Meta AI Thinking Steps */}
                    {m.thinkingSteps && m.thinkingSteps.length > 0 && (
                      <ThinkingAccordion steps={m.thinkingSteps} />
                    )}`;

if (code.includes(targetBlock)) {
  code = code.replace(targetBlock, replacementBlock);
  console.log('Successfully replaced thinking block!');
} else {
  // Try regex replace
  const rx = /\{\/\* Meta AI Thinking Steps \*\/\}[\s\S]*?\{m\.thinkingSteps\.map[\s\S]*?<\/div>\s*<\/div>\s*\}\)/;
  if (rx.test(code)) {
    code = code.replace(rx, replacementBlock);
    console.log('Successfully replaced thinking block via regex!');
  } else {
    console.log('Could not find thinking block');
  }
}

fs.writeFileSync(filePath, code, 'utf8');
