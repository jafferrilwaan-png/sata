import test from 'node:test';
import assert from 'node:assert/strict';
import {
  latLonToVector3,
  vector3ToLatLon,
  latLonToGlobeRotation,
  latLonToTileXYZ,
  getNasaGibsTileUrl,
  parseLayerModeFromQuery,
  buildTelemetryArcs,
  evaluateObservationQuery,
  computeAtmosphericCloudPhysics,
  computeTemporalThermalState,
  getNextTimelinePlaybackDay,
  SEVEN_DAY_TIMELINE_STEPS,
  tileFractionToLatLon,
  tileXYZToLatLonBounds,
  computeZoomTileLevel,
  computeGpuShaderLodAndDisplacement,
  computeDayNightTerminatorShaderState,
  getVisibleTileGrid,
  getMultiSourceMapTileUrls,
  FIRMS_THERMAL_POINTS,
  WORLDWIDE_FIRMS_POINTS,
  NASA_GIBS_LAYERS,
  GLB_MODELS,
  HOTSPOT_NODES,
  RECENT_ACCIDENTS,
  RELEASES_LIST,
  SENSOR_TELEMETRY_ROWS,
} from './telemetryLogic';
import {
  computeSubsolarEphemeris,
  computeLocalSolarTelemetry,
  runAutonomousEarthAgent,
} from '../agent/autonomousAgent';

test('default observation query matches exact reference UI text and 84 heat spots', () => {
  const res = evaluateObservationQuery('', null, true);
  assert.equal(res.activeHeatSpots, 84);
  assert.ok(
    res.aiInsightLead === 'Meta Muse:' || res.aiInsightLead === 'Llama 4:',
    'Must be Meta Muse: or Llama 4:'
  );
  assert.ok(res.aiInsightBody.length > 10, 'Insight body must be non-empty');
  assert.equal(res.matchedReleases.length, 3);
  assert.equal(res.matchedSensors.length, 4);
  assert.equal(res.targetPointOfView, null);
});

test('toggling orbit adjustment updates active heat spot calibration', () => {
  const enabled = evaluateObservationQuery('', null, true);
  const disabled = evaluateObservationQuery('', null, false);
  assert.equal(enabled.activeHeatSpots, 84);
  assert.equal(disabled.activeHeatSpots, 79);
});

test('selecting a hotspot node updates active heat spots, insight summary, and pointOfView', () => {
  const target = HOTSPOT_NODES[0];
  const res = evaluateObservationQuery('', target.id, true);
  assert.equal(res.activeHeatSpots, target.intensitySpots);
  assert.ok(res.aiInsightBody.includes(target.name));
  assert.ok(res.targetPointOfView);
  assert.equal(res.targetPointOfView?.lat, target.lat);
  assert.equal(res.targetPointOfView?.lng, target.lon);
});

test('querying Chennai returns autonomous pointOfView coordinates [13.0827, 80.2707]', () => {
  const res = evaluateObservationQuery('Show thermal hotspots near Chennai', null, true);
  assert.equal(res.activeHeatSpots, 84);
  assert.ok(res.targetPointOfView);
  assert.equal(res.targetPointOfView?.lat, 13.0827);
  assert.equal(res.targetPointOfView?.lng, 80.2707);
});

test('querying any Indian state/city or world city resolves exact coordinates and dynamic telemetry', () => {
  const mumbai = evaluateObservationQuery('Mumbai', null, true);
  assert.ok(mumbai.targetPointOfView);
  assert.ok(Math.abs(mumbai.targetPointOfView!.lat - 19.076) < 0.01);
  assert.ok(mumbai.aiInsightBody.includes('Mumbai'));

  const delhi = evaluateObservationQuery('New Delhi', null, true);
  assert.ok(delhi.targetPointOfView);
  assert.ok(Math.abs(delhi.targetPointOfView!.lat - 28.6139) < 0.01);

  const tokyo = evaluateObservationQuery('Tokyo', null, true);
  assert.ok(tokyo.targetPointOfView);
  assert.ok(Math.abs(tokyo.targetPointOfView!.lat - 35.6762) < 0.01);

  const nyc = evaluateObservationQuery('New York', null, true);
  assert.ok(nyc.targetPointOfView);
  assert.ok(Math.abs(nyc.targetPointOfView!.lat - 40.7128) < 0.01);

  const amazon = evaluateObservationQuery('Amazon', null, true);
  assert.ok(amazon.targetPointOfView);
  assert.equal(amazon.activeHeatSpots, 96);
});

test('specific towns and districts never false-match unrelated cities like Nagpur or Chennai', () => {
  const tiruppur = evaluateObservationQuery('Tiruppur', null, true);
  assert.ok(tiruppur.targetPointOfView);
  assert.equal(tiruppur.targetPointOfView?.label, 'Tiruppur, Tamil Nadu');
  assert.ok(Math.abs(tiruppur.targetPointOfView!.lat - 11.1085) < 0.01);

  const tenkasi = evaluateObservationQuery('Tenkasi, Tamil Nadu', null, true);
  assert.ok(tenkasi.targetPointOfView);
  assert.equal(tenkasi.targetPointOfView?.label, 'Tenkasi, Tamil Nadu');
  assert.ok(Math.abs(tenkasi.targetPointOfView!.lat - 8.9594) < 0.01);

  const nagercoil = evaluateObservationQuery('Nagercoil', null, true);
  assert.ok(nagercoil.targetPointOfView);
  assert.equal(nagercoil.targetPointOfView?.label, 'Nagercoil, Tamil Nadu');

  // Partial 3-letter substring "pur" must NOT hijack to Nagpur
  const partialPur = evaluateObservationQuery('pur', null, true);
  assert.equal(partialPur.targetPointOfView, null);
});

test('FIRMS_THERMAL_POINTS contains 84 core anomalies and WORLDWIDE_FIRMS_POINTS covers all continents', () => {
  assert.equal(FIRMS_THERMAL_POINTS.length, 84);
  assert.ok(WORLDWIDE_FIRMS_POINTS.length >= 200);
  assert.ok(NASA_GIBS_LAYERS.blackMarbleNightLights.wmtsUrl.includes('VIIRS_CityLights_2012'));
});

test('latLonToVector3, vector3ToLatLon, and latLonToGlobeRotation are mathematically consistent', () => {
  const radius = 5;
  const pt = latLonToVector3(13.0827, 80.2707, radius); // Chennai
  const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y + pt.z * pt.z);
  assert.ok(Math.abs(dist - radius) < 1e-6);

  const inv = vector3ToLatLon(pt.x, pt.y, pt.z);
  assert.ok(Math.abs(inv.lat - 13.0827) < 1e-4);
  assert.ok(Math.abs(inv.lon - 80.2707) < 1e-4);

  const rot = latLonToGlobeRotation(13.0827, 80.2707, 1.8);
  assert.ok(Math.abs(rot.rotY - -(Math.PI / 2 + (80.2707 * Math.PI) / 180)) < 1e-6);
  assert.ok(Math.abs(rot.rotX - (13.0827 * Math.PI) / 180) < 1e-6);

  const tirunelveli = evaluateObservationQuery('Tirunelveli', null, true);
  assert.ok(tirunelveli.targetPointOfView);
  assert.ok(Math.abs(tirunelveli.targetPointOfView!.lat - 8.7139) < 0.01);
  assert.ok(Math.abs(tirunelveli.targetPointOfView!.lng - 77.7567) < 0.01);
});

test('GLB model registry and reference UI datasets are complete', () => {
  assert.ok(GLB_MODELS.earth.localUrl.endsWith('.glb'));
  assert.ok(GLB_MODELS.hubble.onlineUrl.includes('Hubble'));
  assert.equal(RECENT_ACCIDENTS[0].label, 'IND-01 - Fire');
  assert.equal(RECENT_ACCIDENTS[1].label, 'IDN-04 - Explosion');
  assert.equal(RELEASES_LIST[0].dateBadge, 'Jan 15');
  assert.equal(RELEASES_LIST[1].dateBadge, 'Feb 05');
  assert.equal(RELEASES_LIST[2].dateBadge, 'Mar 20');
  assert.equal(SENSOR_TELEMETRY_ROWS[3].valueText, '34%');
});

test('NASA GIBS EPSG:3857 tile URLs, query layer parser, and telemetry arcs work accurately', () => {
  const xyz = latLonToTileXYZ(13.0827, 80.2707, 5);
  assert.equal(xyz.z, 5);
  const url = getNasaGibsTileUrl(xyz.x, xyz.y, xyz.z, 'VIIRS_NIGHT_THERMAL');
  assert.ok(url.startsWith('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/'));
  assert.ok(url.includes(`/5/${xyz.y}/${xyz.x}.`));

  assert.equal(
    parseLayerModeFromQuery('Show thermal hotspots near Chennai'),
    'VIIRS_NIGHT_THERMAL'
  );
  assert.equal(
    parseLayerModeFromQuery('Show true color terrain in Mumbai'),
    'MODIS_TRUE_COLOR_TERRAIN'
  );
  assert.equal(
    parseLayerModeFromQuery('Show cloud cover near Tokyo'),
    'ATMOSPHERIC_AOD_CLOUDS'
  );

  const arcs = buildTelemetryArcs({ lat: 19.076, lng: 72.8777, altitude: 1.38, label: 'Mumbai' });
  assert.equal(arcs.length, 4);
  assert.equal(arcs[0].startLat, 19.076);
});

test('/agent autonomous leader and Research/Implement/Verify subagents compute real-time morning/day/night Earth sync', async () => {
  // At 02:00 UTC, India (80.27°E) is at ~07:21 local solar time -> MORNING!
  const morningUtcMs = Date.UTC(2026, 5, 15, 2, 0, 0);
  const chennaiSolar = computeLocalSolarTelemetry(13.0827, 80.2707, morningUtcMs);
  assert.equal(chennaiSolar.phase, 'MORNING');
  assert.equal(chennaiSolar.isDaylight, true);

  // At 02:00 UTC, New York (-74.0°W) is at ~21:04 local solar time -> NIGHT!
  const nycSolar = computeLocalSolarTelemetry(40.7128, -74.006, morningUtcMs);
  assert.equal(nycSolar.phase, 'NIGHT');
  assert.equal(nycSolar.isDaylight, false);

  const eph = computeSubsolarEphemeris(morningUtcMs);
  assert.ok(eph.subsolarLat > 20 && eph.subsolarLat < 24);

  const agentResult = await runAutonomousEarthAgent({
    query: 'Tirunelveli, Tamil Nadu',
    nowMs: morningUtcMs,
    enableNetworkFetch: false,
  });
  assert.equal(agentResult.agent, '/agent');
  assert.equal(agentResult.leaderStatus, 'SYNCHRONIZED');
  assert.equal(agentResult.research.subagent, 'research');
  assert.equal(agentResult.implement.subagent, 'implement');
  assert.equal(agentResult.verify.subagent, 'verify');
  assert.equal(agentResult.verify.status, 'VERIFIED');
  assert.equal(agentResult.verify.uiUnchanged, true);
  assert.equal(agentResult.verify.noConcentricRings, true);
  assert.equal(agentResult.verify.noRandomGlobeDots, true);
  assert.equal(agentResult.verify.minimalCloudVerified, true);
  assert.ok(agentResult.verify.coordinateRoundTripErrorDeg < 1e-4);
});

test('computeAtmosphericCloudPhysics models 3-cell real-world winds, Coriolis vorticity, and minimal clean opacity', () => {
  // Tropical Trade Winds at 10°N: Easterly (zonal < 0), equatorward convergence (meridional < 0), N. Hemisphere Coriolis (> 0)
  const tropics = computeAtmosphericCloudPhysics({
    elapsedSec: 100,
    dtSec: 0.05,
    layerMode: 'VIIRS_NIGHT_THERMAL',
    baseMinimalOpacity: 0.09,
    sampleLatDeg: 10,
  });
  assert.ok(tropics.zonalVelocityAtLat < 0, 'Tropical Hadley cell should produce Easterly trade winds');
  assert.ok(tropics.meridionalVelocityAtLat < 0, 'Northern Hadley branch converges southward toward equator');
  assert.ok(tropics.coriolisSignAtLat > 0, 'Northern hemisphere Coriolis parameter is positive');
  assert.equal(tropics.targetOpacity, 0.09);
  assert.equal(tropics.maxFragmentAlpha, 0.16);
  assert.ok(
    tropics.rotationDegPerFrame > 0 && tropics.rotationDegPerFrame < 1.0,
    'Cloud rotation per frame must be a positive sub-degree increment (< 1.0 deg/frame)'
  );
  assert.ok(tropics.deltaRotationY > 0 && tropics.deltaRotationY < Math.PI / 180);

  // Mid-Latitude Ferrel Cell at 45°N: Prevailing Westerlies (zonal > 0)
  const midLat = computeAtmosphericCloudPhysics({
    elapsedSec: 100,
    dtSec: 0.05,
    layerMode: 'VIIRS_NIGHT_THERMAL',
    baseMinimalOpacity: 0.09,
    sampleLatDeg: 45,
  });
  assert.ok(midLat.zonalVelocityAtLat > 0, 'Mid-latitude Ferrel cell should produce prevailing Westerlies');

  // Southern Hemisphere Polar Cell at 75°S: Polar Easterlies (zonal < 0), negative Coriolis sign
  const polarSouth = computeAtmosphericCloudPhysics({
    elapsedSec: 100,
    dtSec: 0.05,
    layerMode: 'ATMOSPHERIC_AOD_CLOUDS',
    baseMinimalOpacity: 0.09,
    sampleLatDeg: -75,
  });
  assert.ok(polarSouth.zonalVelocityAtLat < 0, 'Polar cell should produce Polar Easterlies');
  assert.ok(polarSouth.coriolisSignAtLat < 0, 'Southern hemisphere Coriolis parameter is negative');
  assert.equal(polarSouth.targetOpacity, 0.18);
});

test('7-day historical timeline playback scrub animates NASA GIBS thermal dates, intensities, and heat spot counts', () => {
  const refUtcMs = Date.UTC(2026, 9, 28, 12, 0, 0); // 2026-10-28

  // Default reference day 28 preserves exact 84 active heat spots and 57% thumb position
  const liveState = computeTemporalThermalState(28, 84, refUtcMs);
  assert.equal(liveState.timelineDay, 28);
  assert.equal(liveState.activeHeatSpots, 84);
  assert.equal(liveState.thumbPct, 57);
  assert.equal(liveState.thermalIntensityScale, 1.0);
  assert.equal(liveState.isoDate, '2026-10-27');

  // Scrubbing back to day 10 (T-6D) shifts ISO date, thumbPct, thermalIntensityScale, and heat spots
  const pastState = computeTemporalThermalState(10, 84, refUtcMs);
  assert.equal(pastState.timelineDay, 10);
  assert.equal(pastState.daysAgo, 6);
  assert.equal(pastState.isoDate, '2026-10-22');
  assert.equal(pastState.relativeLabel, 'T-6D');
  assert.notEqual(pastState.activeHeatSpots, liveState.activeHeatSpots);
  assert.notEqual(pastState.thermalIntensityScale, liveState.thermalIntensityScale);

  // Dated NASA GIBS tile URL injects the scrubbed historical ISO date
  const datedTileUrl = getNasaGibsTileUrl(16, 12, 5, 'HYBRID_ALL_LAYERS', pastState.isoDate);
  assert.ok(datedTileUrl.includes(`/default/${pastState.isoDate}/`));

  // Playback loop steps through all 7 timeline steps and wraps cleanly
  assert.equal(SEVEN_DAY_TIMELINE_STEPS.length, 7);
  assert.equal(getNextTimelinePlaybackDay(10), 14);
  assert.equal(getNextTimelinePlaybackDay(28), 31);
  assert.equal(getNextTimelinePlaybackDay(31), 10);
});

test('spherical slippy-map tile projection, watermark-free NASA/Esri URLs, and land/island gazetteer accuracy', () => {
  // At default orbital distance (4.22), tileZoom is 0
  const farZoom = computeZoomTileLevel(4.22);
  assert.equal(farZoom.tileZoom, 0);
  assert.equal(farZoom.tileBlendOpacity, 0);

  // When zoomed in to regional/city view (1.8), tileZoom >= 7 and blend opacity > 0.7
  const closeZoom = computeZoomTileLevel(1.8);
  assert.ok(closeZoom.tileZoom >= 7);
  assert.ok(closeZoom.tileBlendOpacity > 0.7);

  // Verify Surat (21.1702°N, 72.8311°E) tile bounds contain Surat's exact coordinates
  const suratXYZ = latLonToTileXYZ(21.1702, 72.8311, 7);
  const bounds = tileXYZToLatLonBounds(suratXYZ.x, suratXYZ.y, 7);
  assert.ok(bounds.northLat >= 21.1702 && bounds.southLat <= 21.1702);
  assert.ok(bounds.eastLon >= 72.8311 && bounds.westLon <= 72.8311);

  const centerFrac = tileFractionToLatLon(suratXYZ.x, suratXYZ.y, 7, 0.5, 0.5);
  assert.equal(centerFrac.lat, bounds.centerLat);
  assert.equal(centerFrac.lon, bounds.centerLon);

  const grid = getVisibleTileGrid(21.1702, 72.8311, 7, 1);
  assert.equal(grid.length, 9);

  const urls = getMultiSourceMapTileUrls(suratXYZ.x, suratXYZ.y, 7, 'VIIRS_NIGHT_THERMAL', '2026-10-27');
  assert.ok(urls.satelliteTileUrl.includes(`/7/${suratXYZ.y}/${suratXYZ.x}`));
  assert.ok(urls.roadsTileUrl.includes(`/7/${suratXYZ.y}/${suratXYZ.x}`));
  assert.ok(urls.labelsTileUrl.includes(`/7/${suratXYZ.y}/${suratXYZ.x}`));
  assert.ok(urls.nasaGibsUrl.startsWith('https://gibs.earthdata.nasa.gov/'));

  // Verify HOTSPOT_NODES includes small islands (Lakshadweep, Andaman, Diu, Rameswaram, Maldives) and zero ocean-basin labels
  assert.ok(HOTSPOT_NODES.some((n) => n.name.includes('Lakshadweep')));
  assert.ok(HOTSPOT_NODES.some((n) => n.name.includes('Andaman')));
  assert.ok(HOTSPOT_NODES.some((n) => n.name.includes('Diu Island')));
  assert.ok(HOTSPOT_NODES.some((n) => n.name.includes('Rameswaram')));
  assert.ok(!HOTSPOT_NODES.some((n) => n.name === 'Arabian Sea West'));
});

test('GPU shader tile interpolation, MODIS True Color terrain displacement, and clean release status tags', () => {
  // Verify clean release status tags ("Scheduled", "In Orbit")
  assert.equal(RELEASES_LIST[0].statusText, 'Scheduled');
  assert.equal(RELEASES_LIST[1].statusText, 'Scheduled');
  assert.equal(RELEASES_LIST[2].statusText, 'In Orbit');

  // At default low-zoom orbital distance (4.22), displacement and tileInterpMix are 0 in VIIRS mode
  const orbital = computeGpuShaderLodAndDisplacement({
    cameraDistance: 4.22,
    cameraVelocity: 0,
    layerMode: 'VIIRS_NIGHT_THERMAL',
  });
  assert.equal(orbital.zoomProgress, 0);
  assert.equal(orbital.tileInterpMix, 0);
  assert.equal(orbital.displacementScale, 0);
  assert.equal(orbital.velocityDamping, 1);

  // At high-zoom land surface view (1.8), displacementScale and modisTrueColorBlend smoothly increase
  const zoomedSteady = computeGpuShaderLodAndDisplacement({
    cameraDistance: 1.8,
    cameraVelocity: 0,
    layerMode: 'MODIS_TRUE_COLOR_TERRAIN',
  });
  assert.ok(zoomedSteady.zoomProgress > 0.9);
  assert.ok(zoomedSteady.displacementScale > 0.015);
  assert.ok(zoomedSteady.modisTrueColorBlend > 0.7);
  assert.ok(zoomedSteady.tileInterpMix > 0.9);

  // During fast camera transition (high cameraVelocity), velocityDamping reduces tileInterpMix to prevent jitter
  const zoomedFastTransition = computeGpuShaderLodAndDisplacement({
    cameraDistance: 1.8,
    cameraVelocity: 3.5,
    layerMode: 'MODIS_TRUE_COLOR_TERRAIN',
  });
  assert.ok(zoomedFastTransition.velocityDamping < 0.5);
  assert.ok(zoomedFastTransition.tileInterpMix < zoomedSteady.tileInterpMix);
});

test('computeDayNightTerminatorShaderState dynamically updates sunlit, twilight, and night hemispheres from UTC time', () => {
  // At 06:30 UTC on June 21, Sun is directly over India (~80°E) -> Chennai is in bright daylight
  const indiaNoonUtc = Date.UTC(2026, 5, 21, 6, 30, 0);
  const dayState = computeDayNightTerminatorShaderState(indiaNoonUtc, 13.0827, 80.2707);
  assert.ok(dayState.sampleSunDot > 0.85, 'Chennai should have high positive solar elevation at 12:00 IST');
  assert.equal(dayState.sampleDaylightFactor, 1);

  // At 18:30 UTC on June 21, it is midnight in India -> Chennai is in deep night shadow
  const indiaMidnightUtc = Date.UTC(2026, 5, 21, 18, 30, 0);
  const nightState = computeDayNightTerminatorShaderState(indiaMidnightUtc, 13.0827, 80.2707);
  assert.ok(nightState.sampleSunDot < -0.75, 'Chennai should be in night hemisphere at 00:00 IST');
  assert.equal(nightState.sampleDaylightFactor, 0);

  // At 00:35 UTC on March 21 (Equinox), it is ~06:05 local solar sunrise in Chennai -> right on the twilight terminator
  const indiaSunriseUtc = Date.UTC(2026, 2, 21, 0, 35, 0);
  const twilightState = computeDayNightTerminatorShaderState(indiaSunriseUtc, 13.0827, 80.2707);
  assert.ok(Math.abs(twilightState.sampleSunDot) < 0.12, 'Sunrise should lie near the solar terminator (sunDot ~ 0)');
  assert.ok(twilightState.sampleTwilightBand > 0.75, 'Twilight band should peak along the day/night boundary');
});



