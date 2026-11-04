const fs = require('fs');
const path = require('path');

const appFile = path.resolve(__dirname, '../remix-remix-earthui-designer/src/App.tsx');
let content = fs.readFileSync(appFile, 'utf8');

// Find <main ...> and replace the entire <main> block until </main>
const mainStart = content.indexOf('<main className="relative z-20');
const mainEnd = content.indexOf('</main>', mainStart);

if (mainStart === -1 || mainEnd === -1) {
  console.error('Could not find <main> block in App.tsx');
  process.exit(1);
}

const newMainBlock = `<main className="relative z-20 shrink-0 sm:shrink sm:flex-1 flex flex-col sm:flex-row items-stretch justify-start sm:justify-between px-3 sm:px-5 lg:px-8 pb-5 sm:pb-4 pt-1 gap-3 sm:gap-3.5 lg:gap-5 sm:min-h-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {isSearchSubmitted ? (
            <motion.div
              key="workspace-dossier-mode"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex flex-col sm:flex-row items-stretch justify-start sm:justify-between gap-3 sm:gap-3.5 lg:gap-5 pointer-events-none"
            >
              {/* LEFT COLUMN: Wide, Full-Height Meta Deep Intelligence Console */}
              <div className="flex pointer-events-auto w-full sm:w-[500px] lg:w-[540px] xl:w-[580px] h-full sm:min-h-0 shrink-0">
                <MetaDeepIntelligenceConsole
                  initialVoiceMessage={activeVoiceMessage || undefined}
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
              </div>

              {/* Earth Area on Right: Open space so Earth is fully showcased and interactive */}
              <div className="hidden sm:flex flex-1 min-w-0 pointer-events-none" />
            </motion.div>
          ) : (
            <motion.div
              key="workspace-home-mode"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex flex-col sm:flex-row items-stretch justify-start sm:justify-between gap-3 sm:gap-3.5 lg:gap-5 pointer-events-none"
            >
              {/* Home Mode Left & Center Column: Search Bar & Bottom 3 Glass Cards */}
              <div className="relative shrink-0 sm:shrink sm:flex-1 flex flex-col justify-start sm:justify-end gap-3 sm:gap-3.5 min-w-0 sm:min-h-0">
                <div className="pointer-events-auto w-full flex justify-center mb-1">
                  {!isSearchSubmitted ? renderSearchBar("sata-command-search-input-bottom") : null}
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

              {/* Home Mode Right Column: ObservationSidebar */}
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
                    const satCoords = {
                      'Cartosat-3': { lat: 21.15, lon: 79.08 },
                      'Sentinel-3': { lat: 43.71, lon: 10.40 },
                      'NOAA-20': { lat: 28.57, lon: -80.65 },
                      'ISS (ZARYA)': { lat: 14.80, lon: 88.50 },
                    };
                    const c = (satCoords as any)[sat.satellite_name] || { lat: 20, lon: 78 };
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
            </motion.div>
          )}
        </AnimatePresence>`;

content = content.substring(0, mainStart) + newMainBlock + '\n      ' + content.substring(mainEnd);
fs.writeFileSync(appFile, content, 'utf8');
console.log('App.tsx main workspace cleanly updated with 2 modes (home and dossier)!');
