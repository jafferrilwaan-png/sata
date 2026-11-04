const fs = require('fs');
const p = 'd:/GAME/remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Add renderFormattedInline and update RichTelemetryText
const oldRichTelemetry = `const RichTelemetryText: React.FC<{ content: string }> = ({ content }) => {
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
                <th key={idx} className="p-2 font-medium tracking-wider uppercase whitespace-nowrap">{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-white/8 hover:bg-white/[0.04] transition-colors text-white/90">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2 whitespace-nowrap">{cell}</td>
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
      if (trimmed.includes('---')) return; // skip markdown divider
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
            {trimmed.replace(/^#+\\s*/, '')}
          </h4>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={\`li-\${idx}\`} className="text-white/85 text-[12px] leading-relaxed my-1 pl-2.5 border-l border-white/15">
            <span>{trimmed.replace(/^[-*]\\s*/, '')}</span>
          </div>
        );
      } else {
        elements.push(
          <p key={\`p-\${idx}\`} className="text-white/90 font-normal leading-[1.75] text-[12.5px] my-1.5">{trimmed.replace(/^(?:Llama 4|Meta Muse):\\s*/i, "")}</p>
        );
      }
    }
  });

  if (inTable) {
    elements.push(flushTable(9999));
  }

  return <div className="space-y-0.5 w-full">{elements}</div>;
};`;

const newRichTelemetry = `const renderFormattedInline = (text: string) => {
  if (!text) return null;
  // Parse **bold**, *italic*, and \`code\` cleanly
  const parts = text.split(/(\\b\\*\\*[^*]+\\*\\*|\\*\\*[^*]+\\*\\*|\`[^\`]+\`|\\*[^*]+\\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white tracking-tight">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('\`') && part.endsWith('\`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-200 font-mono text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic text-white/80">
          {part.slice(1, -1)}
        </em>
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
      if (trimmed.includes('---')) return; // skip markdown divider
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
        elements.push(
          <div key={\`li-\${idx}\`} className="text-white/85 text-[12px] leading-relaxed my-1 pl-2.5 border-l border-white/15">
            <span>{renderFormattedInline(trimmed.replace(/^[-*]\\s*/, ''))}</span>
          </div>
        );
      } else {
        elements.push(
          <p key={\`p-\${idx}\`} className="text-white/90 font-normal leading-[1.75] text-[12.5px] my-1.5">
            {renderFormattedInline(trimmed.replace(/^(?:Llama 4|Meta Muse):\\s*/i, ""))}
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

c = c.replace(oldRichTelemetry.replace(/\r\n/g, '\n'), newRichTelemetry);
c = c.replace(oldRichTelemetry.replace(/\n/g, '\r\n'), newRichTelemetry.replace(/\n/g, '\r\n'));

// 2. Add handlePaste function
const oldHandleFileChange = `  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };`;

const newHandleFileChange = `  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            const fileName = file.name && file.name !== 'image.png'
              ? file.name
              : \`pasted_satellite_imagery_\${Date.now().toString().slice(-4)}.png\`;
            setSelectedFileName(fileName);
            return;
          }
        }
      }
    }
  };`;

c = c.replace(oldHandleFileChange.replace(/\r\n/g, '\n'), newHandleFileChange);
c = c.replace(oldHandleFileChange.replace(/\n/g, '\r\n'), newHandleFileChange.replace(/\n/g, '\r\n'));

// 3. Connect onPaste in input & form
c = c.replace(
  'onPaste={(e) => e.stopPropagation()}',
  'onPaste={(e) => { e.stopPropagation(); handlePaste(e); }}'
);
c = c.replace(
  '<form\n        onSubmit={handleSendChat}',
  '<form\n        onSubmit={handleSendChat}\n        onPaste={handlePaste}'
);
c = c.replace(
  '<form\r\n        onSubmit={handleSendChat}',
  '<form\r\n        onSubmit={handleSendChat}\r\n        onPaste={handlePaste}'
);

fs.writeFileSync(p, c, 'utf8');
console.log('Successfully updated MetaDeepIntelligenceConsole.tsx!');
