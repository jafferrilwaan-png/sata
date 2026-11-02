import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update loadTelemetryAndIncidents to fetch /api/firms as well every 60 seconds
sync_target = '''    // Real-Time ISRO Orbit Pass & NASA EONET Incidents Telemetry Sync
    useEffect(() => {
      let isMounted = true;
      async function loadTelemetryAndIncidents() {
        try {
          const [orbitsRes, incidentsRes] = await Promise.all([
            fetch('/api/orbits'),
            fetch('/api/incidents'),
          ]);
          if (orbitsRes.ok && isMounted) {
            const data = await orbitsRes.json();
            if (data?.passes && Array.isArray(data.passes) && data.passes.length > 0) {
              setLiveOrbits(data.passes);
            }
          }
          if (incidentsRes.ok && isMounted) {
            const data = await incidentsRes.json();
            if (data?.incidents && Array.isArray(data.incidents) && data.incidents.length > 0) {
              setLiveIncidents(data.incidents);
            }
          }
        } catch (e) {
          console.warn('Telemetry & Incidents sync error', e);
        }
      }
      loadTelemetryAndIncidents();
      const interval = window.setInterval(loadTelemetryAndIncidents, 60000);
      return () => {
        isMounted = false;
        window.clearInterval(interval);
      };
    }, []);'''

sync_replacement = '''    // Real-Time ISRO Orbit Pass, NASA EONET Incidents & NASA FIRMS Telemetry Sync (Every Minute)
    useEffect(() => {
      let isMounted = true;
      async function loadTelemetryAndIncidents() {
        try {
          const [orbitsRes, incidentsRes, firmsRes] = await Promise.all([
            fetch('/api/orbits'),
            fetch('/api/incidents'),
            fetch('/api/firms'),
          ]);
          if (orbitsRes.ok && isMounted) {
            const data = await orbitsRes.json();
            if (data?.passes && Array.isArray(data.passes) && data.passes.length > 0) {
              setLiveOrbits(data.passes);
            }
          }
          if (incidentsRes.ok && isMounted) {
            const data = await incidentsRes.json();
            if (data?.incidents && Array.isArray(data.incidents) && data.incidents.length > 0) {
              setLiveIncidents(data.incidents);
            }
          }
          if (firmsRes.ok && isMounted) {
            const data = await firmsRes.json();
            if (data?.points && Array.isArray(data.points) && data.points.length > 0) {
              setLiveFirmsPoints(data.points);
            }
          }
        } catch (e) {
          console.warn('Live minute satellite telemetry sync error', e);
        }
      }
      loadTelemetryAndIncidents();
      const interval = window.setInterval(loadTelemetryAndIncidents, 60000);
      return () => {
        isMounted = false;
        window.clearInterval(interval);
      };
    }, []);'''

if sync_target in code:
    code = code.replace(sync_target, sync_replacement, 1)
    print('Updated live minute satellite sync in App.tsx!')
else:
    print('Sync target not found!')

# 2. Update right column to show MetaDeepIntelligenceConsole when isSearchSubmitted is true
right_col_target = '''        {/* Right Column: Pristine OBSERVATION BRIEFING Sidebar */}
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
        </div>'''

right_col_replacement = '''        {/* Right Column: ObservationSidebar in home mode; MetaDeepIntelligenceConsole on search submitted */}
        <div className="flex pointer-events-auto w-full sm:w-auto h-auto sm:h-full sm:min-h-0 shrink-0">
          {isSearchSubmitted ? (
            <MetaDeepIntelligenceConsole
              targetName={liveAiDispatchState?.targetName || searchQuery || 'Target Observation Sector'}
              lat={liveAiDispatchState?.lat || 20}
              lon={liveAiDispatchState?.lon || 78}
              activeHeatSpots={liveAiDispatchState?.activeHeatSpots || displayObservationData.activeHeatSpots}
              layerType={liveAiDispatchState?.layerType || 'Geospatial Sector'}
              briefingLead={liveAiDispatchState?.briefingLead || displayObservationData.aiInsightLead}
              briefingBody={liveAiDispatchState?.briefingBody || displayObservationData.aiInsightBody}
              telemetry={liveAiDispatchState?.telemetry}
              environmentalPhysics={liveAiDispatchState?.environmentalPhysics}
              onClose={() => {
                setIsSearchSubmitted(false);
                setSearchQuery('');
                setLiveAiDispatchState(null);
                setSelectedHotspotId(null);
                setAgentInsightOverride(null);
                globeRef.current?.pointOfView({ lat: 20, lng: 78, altitude: 2.4, label: 'Overview' }, 2000);
              }}
              onTrackSatellite={(sat) => {
                globeRef.current?.pointOfView(
                  { lat: 20, lng: 78, altitude: 2.4, label: sat },
                  2000
                );
              }}
              onSimulateTimeline={() => {
                setIsPlayingTimeline((prev) => !prev);
              }}
              onToggleLayer={() => {
                setActiveLayerMode((prev) =>
                  prev === 'VIIRS_NIGHT_THERMAL'
                    ? 'MODIS_TRUE_COLOR_TERRAIN'
                    : 'VIIRS_NIGHT_THERMAL'
                );
              }}
            />
          ) : (
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
          )}
        </div>'''

if right_col_target in code:
    code = code.replace(right_col_target, right_col_replacement, 1)
    print('Updated right column conditional rendering in App.tsx!')
else:
    print('Right col target not found!')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
