const fs = require('fs');

const consPath = 'd:/GAME/remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let cons = fs.readFileSync(consPath, 'utf8');

const startIdx = cons.indexOf('const RichTelemetryText: React.FC');
const endMarker = 'return <div className="space-y-0.5 w-full">{elements}</div>;\n};';
const endMarkerCRLF = 'return <div className="space-y-0.5 w-full">{elements}</div>;\r\n};';

let endIdx = -1;
if (cons.indexOf(endMarker) !== -1) {
  endIdx = cons.indexOf(endMarker) + endMarker.length;
} else if (cons.indexOf(endMarkerCRLF) !== -1) {
  endIdx = cons.indexOf(endMarkerCRLF) + endMarkerCRLF.length;
}

console.log('startIdx:', startIdx, 'endIdx:', endIdx);

const newRichTelemetry = `const renderFormattedInline = (text: string): React.ReactNode => {
  if (!text) return null;
  const parts = text.split(/(\\*\\*[^*]+\\*\\*|\\*[^*]+\\*|\`[^\`]+\`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white tracking-tight">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic text-white/90">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('\`') && part.endsWith('\`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

const RichTelemetryText: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\\n');
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const flushTable = (key: number) => {
    if (tableRows.length === 0) return null;
    const header = tableRows[0];
    const rows = tableRows.slice(1);
    tableRows = [];
    return (
      <div key={\`tbl-\${key}\`} className="my-2.5 overflow-x-auto rounded-[14px] border border-white/15 bg-white/[0.03]">
        <table className="w-full text-left text-[10.5px] border-collapse font-mono">
          <thead>
            <tr className="border-b border-white/12 bg-white/[0.06] text-white/80">
              {header.map((cell, idx) => (
                <th key={idx} className="p-2 font-medium tracking-wider uppercase whitespace-nowrap">{renderFormattedInline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-white/8 hover:bg-white/[0.04] transition-colors text-white/90">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2 whitespace-nowrap">{renderFormattedInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (trimmed.includes('---')) return;
      inTable = true;
      const cells = trimmed.slice(1, -1).split('|').map((c) => c.trim());
      tableRows.push(cells);
    } else {
      if (inTable) {
        elements.push(flushTable(idx));
        inTable = false;
      }
      if (!trimmed) {
        elements.push(<div key={\`sp-\${idx}\`} className="h-2" />);
      } else if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
        elements.push(
          <h4 key={\`h-\${idx}\`} className="text-[12.5px] font-semibold text-white tracking-wide mt-2 mb-1">
            {renderFormattedInline(trimmed.replace(/^#+\\s*/, ''))}
          </h4>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemContent = trimmed.replace(/^[-*]\\s*/, '');
        elements.push(
          <div key={\`li-\${idx}\`} className="text-white/85 text-[12px] leading-relaxed my-1.5 pl-3 border-l-2 border-white/20">
            <span>{renderFormattedInline(itemContent)}</span>
          </div>
        );
      } else {
        const pContent = trimmed.replace(/^(?:Llama 4|Meta Muse):\\s*/i, '');
        elements.push(
          <p key={\`p-\${idx}\`} className="text-white/90 font-normal leading-[1.75] text-[12.5px] my-1.5">
            {renderFormattedInline(pContent)}
          </p>
        );
      }
    }
  });

  if (inTable) {
    elements.push(flushTable(9999));
  }

  return <div className="space-y-0.5 w-full">{elements}</div>;
};`;

if (startIdx !== -1 && endIdx !== -1) {
  cons = cons.slice(0, startIdx) + newRichTelemetry + cons.slice(endIdx);
  fs.writeFileSync(consPath, cons, 'utf8');
  console.log('✅ Successfully replaced RichTelemetryText with renderFormattedInline!');
} else {
  console.log('❌ Could not find startIdx or endIdx');
}
