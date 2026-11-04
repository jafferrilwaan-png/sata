const fs = require('fs');
const path = require('path');

const appPath = path.resolve('remix-remix-earthui-designer/src/App.tsx');
let code = fs.readFileSync(appPath, 'utf8');

// Replacement for the main section
const mainStartPattern = /<main className="relative z-20 shrink-0[\s\S]*?<\/AnimatePresence>\s*<\/main>/;

const replacementMain = `<main className="relative z-20 shrink-0 sm:shrink sm:flex-1 flex flex-col sm:flex-row items-stretch justify-start sm:justify-between px-3 sm:px-5 lg:px-8 pb-5 sm:pb-4 pt-1 gap-3 sm:gap-3.5 lg:gap-5 sm:min-h-0 pointer-events-none">
        {/* Main Content Workspace Grid - Always preserves the pristine Search Bar, Bottom Cards, and Observation Sidebar */}
        <div className="w-full h-full flex flex-col sm:flex-row items-stretch justify-start sm:justify-between gap-3 sm:gap-3.5 lg:gap-5 pointer-events-none">
          {/* Left & Center Column: Search Bar & Bottom 3 Glass Cards */}
          <div className="relative shrink-0 sm:shrink sm:flex-1 flex flex-col justify-start sm:justify-end gap-3 sm:gap-3.5 min-w-0 sm:min-h-0">
            <div className="pointer-events-auto w-full flex justify-center mb-1">
              {renderSearchBar("sata-command-search-input")}
            </div>
            <div className="pointer-events-auto w-full shrink-0">
              <BottomCardsRow
                releases={displayObservationData.matchedReleases}
                sensors={displayObservationData.matchedSensors}
                liveIncidents={currentDisplayedIncidents}
                onSelectIncident={handleSelectIncident}
              />
            </div>
          </div>

          {/* Right Column: ObservationSidebar */}
          <div className="flex pointer-events-auto w-full sm:w-auto h-auto sm:h-full sm:min-h-0 shrink-0">
            <ObservationSidebar
              activeHeatSpots={displayObservationData.activeHeatSpots}
              aiInsightLead={displayObservationData.aiInsightLead}
              aiInsightBody={displayObservationData.aiInsightBody}
              adjustOrbitEnabled={adjustOrbitEnabled}
              onToggleAdjustOrbit={() =>
                setAdjustOrbitEnabled((prev) => !prev)
              }
              selectedTimelineDay={selectedTimelineDay}
              onSelectTimelineDay={setSelectedTimelineDay}
              isPlayingTimeline={isPlayingTimeline}
              onTogglePlayTimeline={() =>
                setIsPlayingTimeline((prev) => !prev)
              }
              liveOrbits={liveOrbits}
              onSelectOrbitSatellite={(sat) => {
                setSelectedSatellite(sat);
                const satCoords: Record<string, { lat: number; lon: number }> = {
                  'Cartosat-3': { lat: 21.15, lon: 79.08 },
                  'Sentinel-3': { lat: 43.71, lon: 10.40 },
                  'NOAA-20': { lat: 28.57, lon: -80.65 },
                  'ISS (ZARYA)': { lat: 14.80, lon: 88.50 },
                };
                const c = satCoords[sat.satellite_name] || { lat: 20, lon: 78 };
                globeRef.current?.pointOfView(
                  { lat: c.lat, lng: c.lon, altitude: 2.1, label: sat.satellite_name },
                  1500
                );
              }}
              liveIncidents={currentDisplayedIncidents}
              onSelectIncident={handleSelectIncident}
              detectedCount={liveIncidents.length}
            />
          </div>
        </div>

        {/* Floating Intelligence Dossier on Left (Never hides the search bar or dashboard cards) */}
        <AnimatePresence>
          {isSearchSubmitted && (
            <motion.div
              key="floating-workspace-dossier"
              initial={{ opacity: 0, x: -30, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-3 sm:left-6 top-[68px] z-30 pointer-events-auto w-[clamp(320px,36vw,500px)] max-h-[calc(100vh-230px)] flex flex-col shadow-[0_24px_70px_rgba(0,0,0,0.8)]"
            >
              <MetaDeepIntelligenceConsole
                targetName={liveAiDispatchState?.targetName || customGeocodedPlace?.name || searchQuery || 'Target Observation Sector'}
                lat={liveAiDispatchState?.lat ?? customGeocodedPlace?.lat ?? 20}
                lon={liveAiDispatchState?.lon ?? customGeocodedPlace?.lon ?? 78}
                briefingLead={liveAiDispatchState?.briefingLead || displayObservationData.aiInsightLead}
                briefingBody={liveAiDispatchState?.briefingBody || displayObservationData.aiInsightBody}
                thinkingSteps={liveAiDispatchState?.thinkingSteps}
                recommendations={liveAiDispatchState?.recommendations}
                selectedMetaModel={selectedMetaModel}
                onSelectMetaModel={setSelectedMetaModel}
                onApplyLayer={(layer) => {
                  setActiveLayerMode(layer as NasaGibsLayerMode);
                }}
                onNavigateTo={(targetName, lat, lon, altitude) => {
                  setCustomGeocodedPlace({ name: targetName, region: 'SECTOR TARGET', lat, lon });
                  setLiveAiDispatchState((prev) =>
                    prev
                      ? { ...prev, targetName, lat, lon, zoomAltitude: altitude || 1.8 }
                      : ({
                          targetName,
                          lat,
                          lon,
                          zoomAltitude: altitude || 1.8,
                          layerType: 'ORBITAL',
                          briefingSummary: '',
                          briefingLead: 'Observation Analysis',
                          briefingBody: '',
                          severity: 'STABLE',
                          phenomenon: 'THERMAL',
                          source: 'meta-live',
                          latencyMs: 0,
                        } as any)
                  );
                  globeRef.current?.pointOfView({ lat, lng: lon, altitude: altitude || 1.8, label: targetName }, 2000);
                }}
                onClose={() => {
                  setIsSearchSubmitted(false);
                  setSearchQuery('');
                  setLiveAiDispatchState(null);
                  setSelectedHotspotId(null);
                  setAgentInsightOverride(null);
                  setActiveLayerMode('MODIS_TRUE_COLOR_TERRAIN');
                  setActiveSimulation(null);
                  globeRef.current?.pointOfView({ lat: 20, lng: 78, altitude: 2.4, label: 'Overview' }, 1800);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>`;

if (mainStartPattern.test(code)) {
  code = code.replace(mainStartPattern, replacementMain);
  fs.writeFileSync(appPath, code, 'utf8');
  console.log('SUCCESS: Persistent dashboard restored in App.tsx!');
} else {
  console.error('ERROR: mainStartPattern did not match!');
}
