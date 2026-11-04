const fs = require('fs');
const path = require('path');

// 1. Update App.tsx
const appFile = path.resolve(__dirname, '../remix-remix-earthui-designer/src/App.tsx');
let appContent = fs.readFileSync(appFile, 'utf8');

// Replace plain <form in renderSearchBar with <motion.form layout layoutId="sata-command-search-bar" ...>
appContent = appContent.replace(
  `  const renderSearchBar = (inputId: string = 'sata-command-search-input') => (
    <form
      id="sata-command-search-bar"`,
  `  const renderSearchBar = (inputId: string = 'sata-command-search-input') => (
    <motion.form
      layout
      layoutId="sata-command-search-bar"
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      id="sata-command-search-bar"`
);

// Close motion.form
appContent = appContent.replace(
  `        </div>
      </div>
    </form>
  );`,
  `        </div>
      </div>
    </motion.form>
  );`
);

// TopNavbar children: render search bar when isSearchSubmitted is true!
appContent = appContent.replace(
  `<TopNavbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'SATELLITES') {
              const defaultSat = {
                satellite_name: 'Cartosat-3',
                norad_id: 44804,
                latitude: 21.15,
                longitude: 79.08,
                altitude_km: 505,
                velocity_kms: 7.59,
                inclination_deg: 97.5,
                status: 'TRACKING',
              };
              const activeSat = liveOrbits[0] || defaultSat;
              setSelectedSatellite(activeSat);
              globeRef.current?.pointOfView({ lat: 21.15, lng: 79.08, altitude: 2.1, label: activeSat.satellite_name }, 1200);
            } else if (tab === 'ORBITS') {
              setAdjustOrbitEnabled(true);
              globeRef.current?.pointOfView({ lat: 14.8, lng: 88.5, altitude: 3.1 }, 1200);
            } else if (tab === 'RELEASES') {
              document.querySelector('section[aria-label="Upcoming Releases"]')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onFocusSearch={handleFocusSearch}
          onOpenNotifications={() => setIsAlertsModalOpen(true)}
          githubUrl="https://github.com"
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
          unreadAlertsCount={temporalState.activeHeatSpots}
        >
          {null}
        </TopNavbar>`,
  `<TopNavbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'SATELLITES') {
              const defaultSat = {
                satellite_name: 'Cartosat-3',
                norad_id: 44804,
                latitude: 21.15,
                longitude: 79.08,
                altitude_km: 505,
                velocity_kms: 7.59,
                inclination_deg: 97.5,
                status: 'TRACKING',
              };
              const activeSat = liveOrbits[0] || defaultSat;
              setSelectedSatellite(activeSat);
              globeRef.current?.pointOfView({ lat: 21.15, lng: 79.08, altitude: 2.1, label: activeSat.satellite_name }, 1200);
            } else if (tab === 'ORBITS') {
              setAdjustOrbitEnabled(true);
              globeRef.current?.pointOfView({ lat: 14.8, lng: 88.5, altitude: 3.1 }, 1200);
            } else if (tab === 'RELEASES') {
              document.querySelector('section[aria-label="Upcoming Releases"]')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onFocusSearch={handleFocusSearch}
          onOpenNotifications={() => setIsAlertsModalOpen(true)}
          githubUrl="https://github.com"
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
          unreadAlertsCount={temporalState.activeHeatSpots}
        >
          {isSearchSubmitted ? renderSearchBar("sata-command-search-input-top") : null}
        </TopNavbar>`
);

// Bottom bar: only render when NOT isSearchSubmitted!
appContent = appContent.replace(
  `<div className="pointer-events-auto w-full flex justify-center mb-1">
              {renderSearchBar("sata-command-search-input")}
            </div>`,
  `<div className="pointer-events-auto w-full flex justify-center mb-1">
              {!isSearchSubmitted ? renderSearchBar("sata-command-search-input-bottom") : null}
            </div>`
);

fs.writeFileSync(appFile, appContent, 'utf8');
console.log('App.tsx search bar animated docking successfully restored!');

// 2. Update EarthGlobeCanvas.tsx for 100% continent and ocean daylight illumination
const globeFile = path.resolve(__dirname, '../remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx');
let globeContent = fs.readFileSync(globeFile, 'utf8');

// Ensure coastline classification captures 100% of continents (including Australia's interior)
globeContent = globeContent.replace(
  `float coastLow = mix(0.22, 0.34, uZoomDetail);
            float coastHigh = mix(0.74, 0.44, uZoomDetail);
            float landMask = smoothstep(coastLow, coastHigh, combinedLandField);`,
  `float coastLow = 0.20;
            float coastHigh = 0.42;
            float landMask = smoothstep(coastLow, coastHigh, combinedLandField);`
);

// Ensure ocean is never a pitch-black abyss
globeContent = globeContent.replace(
  `float oceanLight = (uModisTrueColorBlend > 0.5) ? 0.95 : clamp(realTimeDaylight * uSunlitRadiance, 0.0, 1.0);
            vec3 deepOcean = mix(
              (uModisTrueColorBlend > 0.5 ? vec3(0.018, 0.088, 0.20) : nightOcean),
              sunlitOcean,
              oceanLight
            );`,
  `float oceanLight = clamp(max(0.92, realTimeDaylight * uSunlitRadiance), 0.0, 1.0);
            vec3 deepOcean = mix(
              vec3(0.018, 0.088, 0.20),
              sunlitOcean,
              oceanLight
            );`
);

// Ensure continents are NEVER pitch black
globeContent = globeContent.replace(
  `vec3 nightContinent = mix(
                vec3(0.007, 0.015, 0.034),
                vec3(0.022, 0.048, 0.086),
                uZoomDetail * (0.55 + 0.45 * microTerrainNoise) + realTimeDaylight * 0.22
              ) * displacedRelief;
              finalCol = mix(deepOcean, nightContinent, landMask);`,
  `vec3 nightContinent = dayCol * displacedRelief * 0.92;
              finalCol = mix(deepOcean, nightContinent, landMask);`
);

// Daylight factor locked to minimum 0.92 so land is ALWAYS illuminated with natural daylight
globeContent = globeContent.replace(
  `float daylightFactor = (uModisTrueColorBlend > 0.5) ? 1.0 : realTimeDaylight;
              float solarLandIllum = 0.80 + 0.35 * pow(sunDiffuse, 0.70);
              vec3 sunlitTerrain = dayCol * displacedRelief * solarLandIllum;
              vec3 ambientSurfaceLand = dayCol * displacedRelief * 0.85;
              vec3 daySurfaceLand = mix(ambientSurfaceLand, sunlitTerrain, daylightFactor);
              finalCol = mix(finalCol, daySurfaceLand, landMask);`,
  `float daylightFactor = clamp(max(0.92, realTimeDaylight), 0.0, 1.0);
              float solarLandIllum = 0.88 + 0.32 * pow(sunDiffuse, 0.70);
              vec3 sunlitTerrain = dayCol * displacedRelief * solarLandIllum;
              vec3 ambientSurfaceLand = dayCol * displacedRelief * 0.92;
              vec3 daySurfaceLand = mix(ambientSurfaceLand, sunlitTerrain, daylightFactor);
              finalCol = mix(finalCol, daySurfaceLand, landMask);`
);

// Thermal mode highlight without darkening land
globeContent = globeContent.replace(
  `if (uIrThermalMode > 0.01) {
              // Subtle False-Color Infrared / Thermal Radiometry (VIIRS / Sentinel-3 SLSTR)
              float lum = dot(finalCol, vec3(0.299, 0.587, 0.114));
              vec3 thermalWarm = vec3(1.0, 0.45, 0.15) * smoothstep(0.75, 0.98, lum) * 0.65;
              vec3 thermalCool = vec3(0.04, 0.10, 0.20) * smoothstep(0.25, 0.0, lum);
              vec3 irRgb = mix(finalCol, thermalCool + thermalWarm, 0.45);
              finalCol = mix(finalCol, irRgb, uIrThermalMode * 0.50);
            }`,
  `if (uIrThermalMode > 0.01) {
              // Delicate thermal radiant highlights over true-color terrain without darkening land
              float lum = dot(finalCol, vec3(0.299, 0.587, 0.114));
              vec3 thermalWarm = vec3(1.0, 0.45, 0.15) * smoothstep(0.75, 0.98, lum) * 0.40;
              finalCol += thermalWarm * uIrThermalMode * 0.35;
            }`
);

// Cloud shell: ensure clouds are softly translucent rather than dark opaque shields
globeContent = globeContent.replace(
  `vec3 nightCloudCol = vec3(0.06, 0.10, 0.18);
            vec3 twilightCloudCol = vec3(0.98, 0.85, 0.72);
            vec3 dayCloudCol = vec3(1.0, 1.0, 1.0);

            vec3 cloudCol = mix(nightCloudCol, dayCloudCol, max(max(sunLit, rimLight * 0.45), 0.85));`,
  `vec3 nightCloudCol = vec3(0.75, 0.82, 0.92);
            vec3 twilightCloudCol = vec3(0.98, 0.85, 0.72);
            vec3 dayCloudCol = vec3(1.0, 1.0, 1.0);

            vec3 cloudCol = mix(nightCloudCol, dayCloudCol, 0.88);`
);

fs.writeFileSync(globeFile, globeContent, 'utf8');
console.log('EarthGlobeCanvas.tsx continent lighting successfully updated!');
