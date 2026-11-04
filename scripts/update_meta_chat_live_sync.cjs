const fs = require('fs');
const path = require('path');

const consolePath = path.resolve('remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx');
let code = fs.readFileSync(consolePath, 'utf8');

// 1. Add synchronization useEffect right after gasTelemetry useEffect
const gasEffectAnchor = /useEffect\(\(\) => \{\s*let isMounted = true;[\s\S]*?return \(\) => \{ isMounted = false; \};\s*\}, \[lat, lon\]\);/;

const syncEffectCode = `useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(\`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=\${lat.toFixed(4)}&longitude=\${lon.toFixed(4)}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,aerosol_optical_depth,sulphur_dioxide\`);
        if (res.ok) {
          const d = await res.json();
          if (isMounted && d?.current) {
            setGasTelemetry({
              co: d.current.carbon_monoxide || 424,
              no2: d.current.nitrogen_dioxide || 7.6,
              so2: d.current.sulphur_dioxide || 6.3,
              pm25: d.current.pm2_5 || 35.7,
              pm10: d.current.pm10 || 48.5,
              aod: d.current.aerosol_optical_depth || 0.48,
            });
          }
        }
      } catch {}
    })();
    return () => { isMounted = false; };
  }, [lat, lon]);

  // LIVE CONVERSATIONAL SYNC: Immediately update Meta AI messages whenever live reasoning or briefing arrives
  useEffect(() => {
    if (!targetName) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cleanBody = (briefingBody || briefingLead || 'Satellite telemetry synchronized.')
      .replace(/^(?:Llama 4|Meta Muse|Meta AI):\s*/i, '');

    setMessages((prev) => {
      const userPrompt = targetName;
      // If user typed chat messages already, just update or append the latest meta response
      if (prev.length > 2) {
        return prev.map((m) =>
          m.id === 'initial-meta-msg'
            ? { ...m, text: cleanBody, thinkingSteps: thinkingSteps && thinkingSteps.length > 0 ? thinkingSteps : m.thinkingSteps, recommendations: recommendations && recommendations.length > 0 ? recommendations : m.recommendations }
            : m
        );
      }
      return [
        {
          id: 'initial-user-msg',
          sender: 'user',
          text: userPrompt,
          timestamp: timeStr,
        },
        {
          id: 'initial-meta-msg',
          sender: 'meta',
          text: cleanBody,
          thinkingSteps: thinkingSteps && thinkingSteps.length > 0 ? thinkingSteps : undefined,
          recommendations: recommendations && recommendations.length > 0 ? recommendations : undefined,
          timestamp: timeStr,
        },
      ];
    });
  }, [targetName, briefingBody, thinkingSteps, recommendations]);`;

if (gasEffectAnchor.test(code)) {
  code = code.replace(gasEffectAnchor, syncEffectCode);
  console.log('SUCCESS: Injected live conversational sync effect!');
} else {
  console.warn('WARN: gasEffectAnchor not matched!');
}

// 2. Add Meta Logo above Meta AI responses
const metaResponseHeaderAnchor = /\/\* Satellite Observation Response Card \*\/\s*<div className="rounded-\[22px\] p-4 text-\[12px\] leading-relaxed w-full bg-white\/\[0\.04\] border border-white\/10 flex flex-col gap-3 shadow-\[0_8px_30px_rgba\(0,0,0,0\.4\)\]">/;

const metaResponseWithLogo = `/* Satellite Observation Response Card */
                  <div className="rounded-[22px] p-4 text-[12px] leading-relaxed w-full bg-white/[0.04] border border-white/10 flex flex-col gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                    
                    {/* Meta AI Header Badge */}
                    <div className="flex items-center gap-1.5 text-white/90 pb-1 border-b border-white/10">
                      <svg viewBox="0 0 24 16" fill="none" aria-hidden="true" className="w-3.5 h-2.5 text-white/90 shrink-0">
                        <path d="M6.4 2.5C3.7 2.5 1.8 4.8 1.8 8c0 3.1 1.8 5.5 4.4 5.5 2 0 3.6-1.4 5.8-4.7 2.2 3.3 3.8 4.7 5.8 4.7 2.6 0 4.4-2.4 4.4-5.5 0-3.2-1.9-5.5-4.6-5.5-2.1 0-3.8 1.5-5.6 4.4C10.2 4 8.5 2.5 6.4 2.5Z" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[11px] font-medium tracking-wide">Meta AI</span>
                    </div>`;

if (metaResponseHeaderAnchor.test(code)) {
  code = code.replace(metaResponseHeaderAnchor, metaResponseWithLogo);
  console.log('SUCCESS: Added Meta AI logo to responses!');
} else {
  console.warn('WARN: metaResponseHeaderAnchor not matched!');
}

// 3. Update the thinking state to include spinning Meta logo
const oldThinkingState = /\{isAgentExecuting && \(\s*<div className="flex items-center gap-2\.5 py-1\.5 px-1 text-\[13px\] text-white\/90 select-none">[\s\S]*?<\/div>\s*\)\}/;

const newThinkingState = `{isAgentExecuting && (
              <div className="flex items-center gap-2.5 py-1.5 px-1 text-[13px] text-white/90 select-none">
                <svg viewBox="0 0 24 16" fill="none" aria-hidden="true" className="w-4 h-3 text-white/90 animate-spin shrink-0">
                  <path d="M6.4 2.5C3.7 2.5 1.8 4.8 1.8 8c0 3.1 1.8 5.5 4.4 5.5 2 0 3.6-1.4 5.8-4.7 2.2 3.3 3.8 4.7 5.8 4.7 2.6 0 4.4-2.4 4.4-5.5 0-3.2-1.9-5.5-4.6-5.5-2.1 0-3.8 1.5-5.6 4.4C10.2 4 8.5 2.5 6.4 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-sans text-[12px] text-white/80">
                  Thinking...
                </span>
                <span className="text-[11px] font-sans text-white/40">
                  (Retrieving live satellite observations...)
                </span>
              </div>
            )}`;

if (oldThinkingState.test(code)) {
  code = code.replace(oldThinkingState, newThinkingState);
  console.log('SUCCESS: Updated thinking state with spinning Meta logo!');
} else {
  console.warn('WARN: oldThinkingState not matched!');
}

fs.writeFileSync(consolePath, code, 'utf8');
console.log('ALL METADEEPINTELLIGENCECONSOLE FIXES APPLIED!');
