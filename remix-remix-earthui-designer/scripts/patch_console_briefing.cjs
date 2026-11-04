const fs = require('fs');
const file = 'remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let src = fs.readFileSync(file, 'utf8');

// 1. Add thinkingSteps and recommendations to MetaDeepIntelligenceConsoleProps
src = src.replace(
  'export interface MetaDeepIntelligenceConsoleProps {\r\n  targetName: string;\r\n  lat: number;\r\n  lon: number;\r\n  briefingLead: string;\r\n  briefingBody: string;',
  `export interface MetaDeepIntelligenceConsoleProps {\r\n  targetName: string;\r\n  lat: number;\r\n  lon: number;\r\n  briefingLead: string;\r\n  briefingBody: string;\r\n  thinkingSteps?: string[];\r\n  recommendations?: { category: string; action: string }[];`
);

src = src.replace(
  'export interface MetaDeepIntelligenceConsoleProps {\n  targetName: string;\n  lat: number;\n  lon: number;\n  briefingLead: string;\n  briefingBody: string;',
  `export interface MetaDeepIntelligenceConsoleProps {\n  targetName: string;\n  lat: number;\n  lon: number;\n  briefingLead: string;\n  briefingBody: string;\n  thinkingSteps?: string[];\n  recommendations?: { category: string; action: string }[];`
);

// 2. Destructure thinkingSteps and recommendations in component
src = src.replace(
  'briefingLead,\r\n  briefingBody,',
  'briefingLead,\r\n  briefingBody,\r\n  thinkingSteps,\r\n  recommendations,'
);

src = src.replace(
  'briefingLead,\n  briefingBody,',
  'briefingLead,\n  briefingBody,\n  thinkingSteps,\n  recommendations,'
);

// 3. Add displayThinking and displayRecommendations
const hooksTarget = '  const messagesEndRef = useRef<HTMLDivElement>(null);';
const hooksTargetLF = '  const messagesEndRef = useRef<HTMLDivElement>(null);';

const defaultsCode = `  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayThinking = thinkingSteps || [
    \`Geospatial Lock: Triangulated target coordinates for \${targetName} at \${latStr}, \${lonStr}.\`,
    \`Sensor Downlink: Synchronized multi-spectral radiometry across Cartosat-3 and NASA VIIRS.\`,
    \`Planetary Physics: Evaluated atmospheric column moisture, thermal flux, and dispersion vectors.\`,
    \`Operational Synthesis: Formulated prioritized recommendations for response deployment.\`,
  ];

  const displayRecommendations = recommendations || [
    {
      category: 'Satellite Constellation Tasking',
      action: \`Lock Cartosat-3 0.28m optical camera and INSAT-3DR Doppler radiometer over \${targetName}.\`,
    },
    {
      category: 'Emergency & Ground Action',
      action: 'Maintain active sensor watch; coordinate telemetry downlink with local meteorological and disaster monitoring agencies.',
    },
    {
      category: 'Environmental Risk Mitigation',
      action: 'Establish continuous thermal and atmospheric AOD buffer corridor with 6-hour predictive tracking.',
    },
  ];`;

src = src.replace(hooksTarget, defaultsCode);

// 4. Render thinking chain and recommendations in Primary Briefing section
const briefingTarget = `        {/* Clean Satellite Feed Bar — Collapsible on Demand (Zero Unsolicited Viewports) */}`;
const cardsToAdd = `{/* Meta AI Multi-Agent Extended Reasoning Chain */}
        <div className="rounded-[18px] bg-white/[0.03] border border-white/10 p-3.5 text-[11px] font-mono text-white/70">
          <div className="flex items-center gap-2 text-emerald-400 font-sans font-medium text-[11px] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Meta AI Multi-Agent Extended Reasoning</span>
          </div>
          <div className="space-y-1 pl-2 border-l border-emerald-500/30">
            {displayThinking.map((step, idx) => (
              <div key={idx} className="text-white/60">
                • {step}
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Strategic Recommendations */}
        <div className="rounded-[20px] p-4 bg-white/[0.04] border border-white/10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[10.5px] uppercase tracking-wider font-semibold text-white/80">
            <span>Actionable Intelligence Recommendations</span>
            <span className="text-[9.5px] font-mono text-sky-400 font-normal">Active Protocol</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {displayRecommendations.map((rec, rIdx) => (
              <div key={rIdx} className="p-3 rounded-[14px] bg-white/[0.04] border border-white/10 text-[11.5px] flex flex-col gap-1">
                <span className="text-sky-400 font-medium font-mono text-[10px] uppercase tracking-wider">
                  {rec.category}
                </span>
                <span className="text-white/90 leading-relaxed font-sans">
                  {rec.action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clean Satellite Feed Bar — Collapsible on Demand (Zero Unsolicited Viewports) */}`;

src = src.replace(briefingTarget, cardsToAdd);

fs.writeFileSync(file, src, 'utf8');
console.log('Updated MetaDeepIntelligenceConsole with primary thinking & recommendation cards!');
