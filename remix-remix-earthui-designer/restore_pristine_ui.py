with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Restore Earth stage to be centered (never cut off!)
target_earth = '''<div
        className={`pointer-events-none relative w-full h-[250px] shrink-0 sm:h-auto sm:fixed sm:inset-0 z-10 flex items-center transition-all duration-700 ease-out ${
          isSearchSubmitted
            ? 'sm:justify-start sm:pl-[4vw] lg:pl-[8vw]'
            : 'sm:justify-center'
        }`}
      >'''

replacement_earth = '''<div className="pointer-events-none relative w-full h-[250px] shrink-0 sm:h-auto sm:fixed sm:inset-0 z-10 flex items-center justify-center">'''

if target_earth in code:
    code = code.replace(target_earth, replacement_earth, 1)
    print('Earth container restored to center!')
else:
    print('Target earth not found, checking alternatives...')

# 2. In <main...>, remove MetaDeepIntelligenceConsole and use pristine ObservationSidebar
import re

main_pattern = r'<main className="relative z-20 shrink-0 sm:shrink sm:flex-1 flex flex-col sm:flex-row items-stretch justify-start sm:justify-between px-3 sm:px-5 lg:px-8 pb-5 sm:pb-4 pt-1 gap-3 sm:gap-3.5 lg:gap-5 sm:min-h-0 pointer-events-none">.*?</main>'

new_main = '''<main className="relative z-20 shrink-0 sm:shrink sm:flex-1 flex flex-col sm:flex-row items-stretch justify-start sm:justify-between px-3 sm:px-5 lg:px-8 pb-5 sm:pb-4 pt-1 gap-3 sm:gap-3.5 lg:gap-5 sm:min-h-0 pointer-events-none">
        {/* Left & Center Column: Search Bar & Bottom 3 Glass Cards */}
        <div className="relative shrink-0 sm:shrink sm:flex-1 flex flex-col justify-start sm:justify-end gap-3 sm:gap-3.5 min-w-0 sm:min-h-0">
          {!isSearchSubmitted && (
            <div className="pointer-events-auto w-full flex justify-center mb-1">
              {renderSearchBar("sata-command-search-bottom")}
            </div>
          )}
          <div className="pointer-events-auto w-full shrink-0">
            <BottomCardsRow
              releases={displayObservationData.matchedReleases}
              sensors={displayObservationData.matchedSensors}
              liveIncidents={currentDisplayedIncidents}
              onSelectIncident={handleSelectIncident}
            />
          </div>
        </div>

        {/* Right Column: Pristine OBSERVATION BRIEFING Sidebar */}
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
              globeRef.current?.pointOfView(
                { lat: 20, lng: 78, altitude: 2.4, label: sat.satellite_name },
                2000
              );
            }}
            liveIncidents={currentDisplayedIncidents}
            onSelectIncident={handleSelectIncident}
            detectedCount={liveAiDispatchState ? liveAiDispatchState.activeHeatSpots : liveIncidents.length}
          />
        </div>
      </main>'''

match = re.search(main_pattern, code, re.DOTALL)
if match:
    code = code[:match.start()] + new_main + code[match.end():]
    print('Restored pristine main and ObservationSidebar!')
else:
    print('Main pattern did not match!')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
