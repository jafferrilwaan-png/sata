const fs = require('fs');
const p = 'd:/GAME/remix-remix-earthui-designer/src/App.tsx';
let c = fs.readFileSync(p, 'utf8');

const targetStr = `      <SatelliteTelemetryModal
        satellite={selectedSatellite}
        onClose={() => setSelectedSatellite(null)}
        onNextSatellite={() => {
          const defaultSats: LiveOrbitPass[] = [
            { id: 'sat-cartosat-3', satellite_name: 'Cartosat-3', mission: 'ISRO Earth Observation Sun-Synchronous LEO', agency: 'ISRO', pass_time: '2026-10-28 08:42 UTC', altitude_km: 505, velocity_kms: 7.59, inclination_deg: 97.5, status: 'TRACKING' },
            { id: 'sat-sentinel-3', satellite_name: 'Sentinel-3', mission: 'Copernicus Ocean and Land Surface Mission', agency: 'ESA', pass_time: '2026-10-28 09:15 UTC', altitude_km: 814, velocity_kms: 7.44, inclination_deg: 98.65, status: 'ORBITING' },
            { id: 'sat-noaa-20', satellite_name: 'NOAA-20', mission: 'JPSS Polar Environmental Satellite VIIRS/CrIS', agency: 'NOAA', pass_time: '2026-10-28 09:38 UTC', altitude_km: 824, velocity_kms: 7.43, inclination_deg: 98.7, status: 'TRACKING' },
            { id: 'sat-iss', satellite_name: 'ISS (ZARYA)', mission: 'International Space Station Microgravity Lab', agency: 'NASA', pass_time: '2026-10-28 10:04 UTC', altitude_km: 418, velocity_kms: 7.66, inclination_deg: 51.64, status: 'TRACKING' },
          ];
          const list = liveOrbits.length > 0 ? liveOrbits : defaultSats;
          const currIdx = selectedSatellite ? list.findIndex(s => s.satellite_name === selectedSatellite.satellite_name) : 0;
          const nextSat = list[(currIdx + 1) % list.length];
          setSelectedSatellite(nextSat);
        }}
      />`;

const replStr = `      <SatelliteTelemetryModal
        satellite={selectedSatellite}
        onClose={() => setSelectedSatellite(null)}
        onNextSatellite={() => {
          const defaultSats: LiveOrbitPass[] = [
            { id: 'sat-cartosat-3', satellite_name: 'Cartosat-3 (High-Res 0.28m Optical)', mission: 'ISRO PSLV-C47 Sun-Synchronous LEO', agency: 'ISRO', pass_time: '14:22:10 UTC', altitude_km: 508, velocity_kms: 7.61, inclination_deg: 97.4, status: 'TRACKING' },
            { id: 'sat-sentinel-3', satellite_name: 'Sentinel-3 (SLSTR Thermal & Ocean Radiometer)', mission: 'Copernicus Ocean & Land Environmental Mission', agency: 'ESA', pass_time: '14:48:30 UTC', altitude_km: 814, velocity_kms: 7.44, inclination_deg: 98.65, status: 'TRACKING' },
            { id: 'sat-noaa-20', satellite_name: 'NOAA-20 (VIIRS 375m Multi-Spectral Radiometer)', mission: 'JPSS Polar Environmental Satellite VIIRS/CrIS', agency: 'NOAA', pass_time: '15:12:05 UTC', altitude_km: 824, velocity_kms: 7.43, inclination_deg: 98.7, status: 'TRACKING' },
            { id: 'sat-iss', satellite_name: 'ISS (Zarya Orbiting Laboratory)', mission: 'International Space Station Microgravity Research', agency: 'NASA', pass_time: '15:35:40 UTC', altitude_km: 418, velocity_kms: 7.66, inclination_deg: 51.64, status: 'TRACKING' },
            { id: 'sat-landsat-9', satellite_name: 'Landsat-9 (OLI-2 & TIRS-2 Thermal Infrared)', mission: 'USGS/NASA Planetary Resource Surveillance', agency: 'USGS/NASA', pass_time: '15:58:12 UTC', altitude_km: 705, velocity_kms: 7.50, inclination_deg: 98.2, status: 'TRACKING' },
          ];
          const currIdx = selectedSatellite
            ? defaultSats.findIndex(s =>
                s.id === selectedSatellite.id ||
                s.satellite_name.toLowerCase().includes(selectedSatellite.satellite_name.split(' ')[0].toLowerCase()) ||
                selectedSatellite.satellite_name.toLowerCase().includes(s.satellite_name.split(' ')[0].toLowerCase())
              )
            : 0;
          const nextIdx = (currIdx >= 0 ? currIdx + 1 : 1) % defaultSats.length;
          const nextSat = defaultSats[nextIdx];
          setSelectedSatellite(nextSat);

          const satLocMap: Record<string, { lat: number; lng: number }> = {
            'sat-cartosat-3': { lat: 21.15, lng: 79.08 },
            'sat-sentinel-3': { lat: 43.71, lng: 10.40 },
            'sat-noaa-20': { lat: 28.57, lng: -80.65 },
            'sat-iss': { lat: 14.80, lng: 88.50 },
            'sat-landsat-9': { lat: 34.05, lng: -118.24 },
          };
          const targetCoords = satLocMap[nextSat.id] || { lat: 20, lng: 78 };
          globeRef.current?.pointOfView({ lat: targetCoords.lat, lng: targetCoords.lng, altitude: 2.1, label: nextSat.satellite_name }, 1200);
        }}
      />`;

c = c.replace(targetStr.replace(/\r\n/g, '\n'), replStr);
c = c.replace(targetStr.replace(/\n/g, '\r\n'), replStr.replace(/\n/g, '\r\n'));

fs.writeFileSync(p, c, 'utf8');
console.log('Successfully updated onNextSatellite in App.tsx!');
