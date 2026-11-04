const fs = require('fs');

console.log('=== UPDATING TO ULTRA-TRANSPARENT CRYSTAL FROSTED GLASS ===');

// 1. Update index.css
const cssPath = 'd:/GAME/remix-remix-earthui-designer/src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Replace .sata-glass-card, .sata-sidebar-glass, .sata-ai-card, .sata-search-bar with pure transparent glass
css = css.replace(
  /\.sata-glass-card\s*\{[\s\S]*?\.sata-glass-card:hover\s*\{[\s\S]*?\}\s*\}/,
  `.sata-glass-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 16px 40px -8px rgba(0, 0, 0, 0.35),
    inset 0 1px 1.5px rgba(255, 255, 255, 0.25);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.sata-glass-card:hover {
  background: rgba(255, 255, 255, 0.10);
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow:
    0 20px 48px -8px rgba(0, 0, 0, 0.45),
    inset 0 1px 2px rgba(255, 255, 255, 0.35);
}`
);

css = css.replace(
  /\.sata-sidebar-glass\s*\{[\s\S]*?\}/,
  `.sata-sidebar-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.40),
    inset 0 1px 1.5px rgba(255, 255, 255, 0.25);
}`
);

css = css.replace(
  /\.sata-ai-card\s*\{[\s\S]*?\}/,
  `.sata-ai-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(170%);
  -webkit-backdrop-filter: blur(20px) saturate(170%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.20),
    0 8px 24px -4px rgba(0, 0, 0, 0.25);
}`
);

css = css.replace(
  /\.sata-search-bar\s*\{[\s\S]*?\.sata-search-bar:focus-within\s*\{[\s\S]*?\}/,
  `.sata-search-bar {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.20);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 1.5px rgba(255, 255, 255, 0.28);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.sata-search-bar:focus-within {
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.45),
    inset 0 1.5px 2px rgba(255, 255, 255, 0.40);
}`
);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✅ Updated index.css with pure transparent frosted glass styles');

// 2. Update MetaDeepIntelligenceConsole.tsx
const consPath = 'd:/GAME/remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let cons = fs.readFileSync(consPath, 'utf8');

cons = cons.replace(
  'border border-white/14 bg-black/45 backdrop-blur-[36px]',
  'border border-white/20 bg-white/[0.06] backdrop-blur-[30px]'
);

cons = cons.replace(
  'bg-white/[0.08] border border-white/15 text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)]',
  'bg-white/[0.08] border border-white/20 text-white backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
);

cons = cons.replace(
  'bg-white/[0.04] border border-white/10 flex flex-col gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
  'bg-white/[0.04] border border-white/15 flex flex-col gap-3 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
);

fs.writeFileSync(consPath, cons, 'utf8');
console.log('✅ Updated MetaDeepIntelligenceConsole.tsx with pure transparent frosted glass styles');

console.log('=== ULTRA-TRANSPARENT GLASS COMPLETE ===');
