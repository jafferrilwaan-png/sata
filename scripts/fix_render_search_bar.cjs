const fs = require('fs');
let code = fs.readFileSync('remix-remix-earthui-designer/src/App.tsx', 'utf8');

const target = /const renderSearchBar = \(inputId: string = 'sata-command-search-input'\) => \([\s\S]*?aria-label="Reset to Home Orbit"/;

const replacement = `const renderSearchBar = (inputId: string = 'sata-command-search-input') => (
    <form
      id="sata-command-search-bar"
      onSubmit={handleExecuteSearch}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        searchInputRef.current?.focus();
      }}
      className="pointer-events-auto sata-search-bar h-[36px] sm:h-[40px] rounded-full px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-2.5 transition-[box-shadow,border-color,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-text w-full max-w-[580px]"
    >
      <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsSearchSubmitted(false);
            setSearchQuery('');
            setLiveAiDispatchState(null);
            setSelectedHotspotId(null);
            setAgentInsightOverride(null);
            setActiveLayerMode('MODIS_TRUE_COLOR_TERRAIN');
            setActiveSimulation(null);
            globeRef.current?.pointOfView({ lat: 20, lng: 78, altitude: 2.4, label: 'Overview' }, 1800);
          }}
          aria-label="Reset to Home Orbit"`;

if (target.test(code)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('remix-remix-earthui-designer/src/App.tsx', code, 'utf8');
  console.log('renderSearchBar JSX fixed successfully');
} else {
  console.log('Target not found');
}
