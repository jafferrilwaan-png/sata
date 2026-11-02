export type NavTab = 'HOME' | 'SATELLITES' | 'ORBITS' | 'RELEASES';

export type NasaGibsLayerMode =
  | 'VIIRS_NIGHT_THERMAL'
  | 'MODIS_TRUE_COLOR_TERRAIN'
  | 'ATMOSPHERIC_AOD_CLOUDS'
  | 'HYBRID_ALL_LAYERS';

export interface HotspotNode {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  /** Normalized 2D overlay position (percentage within the globe container) */
  xPct: number;
  yPct: number;
  /** Outer radius in px for the concentric radar target ring */
  size: 'sm' | 'md' | 'lg';
  intensitySpots: number;
  summary: string;
  cloudCoverPct?: number;
  viirsPoints?: number;
  modisPoints?: number;
  aodStatus?: string;
}

export interface LiveOrbitPass {
  id: string;
  satellite_name: string;
  mission: string;
  agency: string;
  pass_time: string;
  altitude_km: number;
  velocity_kms: number;
  inclination_deg: number;
  status: 'TRACKING' | 'ORBITING' | 'SCHEDULED';
}

export interface LiveIncidentItem {
  id: string;
  code: string;
  category: string;
  title: string;
  coordinates: [number, number];
  thumbnail_url: string;
  date_detected: string;
  intensity_mw: number;
}

export interface AccidentItem {
  id: string;
  code: string;
  title: string;
  label: string;
  image: string;
  orbitAltitudeKm: number;
  timestamp: string;
  description: string;
  glbKey: 'terra' | 'starlink';
}

export interface ReleaseItem {
  id: string;
  dateBadge: string;
  providerLine1: string;
  providerLine2: string;
  statusText: string;
  launchpad?: string;
  orbitType?: string;
  payloadCount?: number;
  title?: string;
}

export interface TelemetrySensorRow {
  id: string;
  sensorName: string;
  valueText: string;
  statusText: string;
  glbKey?: 'terra' | 'hubble' | 'starlink';
  sensor?: string;
}

export interface GlbModelAsset {
  key: 'earth' | 'hubble' | 'starlink' | 'terra';
  name: string;
  category: string;
  localUrl: string;
  onlineUrl: string;
  ageText: string;
  altitudeKm: number;
  inclinationDeg: number;
  description: string;
}

export interface PointOfViewTarget {
  lat: number;
  lng: number;
  altitude: number;
  label?: string;
  region?: string;
}

export interface PlanetaryTwinData {
  name: string;
  region: string;
  lat: number;
  lon: number;
  temperatureC: number;
  apparentTempC: number;
  relativeHumidityPct: number;
  surfacePressureHpa: number;
  precipitationMm: number;
  cloudCoverPct: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  shortwaveRadiationWm2: number;
  localSolarPhase: string;
  pm25: number;
  pm10: number;
  carbonMonoxideUgM3: number;
  nitrogenDioxideUgM3: number;
  aerosolOpticalDepth: number;
  uvIndex: number;
  highResOpticalTileUrl: string;
  satelliteGroundResolutionM: number;
  satelliteSensorType: string;
  nearestEventTitle?: string;
}

export function computeSubmeterOpticalTileUrl(
  lat: number,
  lon: number,
  zoom = 13
): string {
  const token =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_MAPBOX_TOKEN) ||
    'pk.eyJ1IjoiamFmZmVycmlsd2Fhbjk5IiwiYSI6ImNtdnpoemN2MjFwZzgzNXF2cjA3aXpzcnYifQ.DRTtwQCySkTAHyXLGvw6yg';

  if (token) {
    const clampedZoom = Math.min(17, Math.max(2, Math.round(zoom)));
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon.toFixed(4)},${lat.toFixed(4)},${clampedZoom},0/700x450@2x?access_token=${token}`;
  }

  const z = Math.min(14, Math.max(6, Math.round(zoom)));
  const n = Math.pow(2, z);
  const x = Math.floor(((lon + 180) / 360) * n);
  const latRad = (Math.max(-85, Math.min(85, lat)) * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n
  );
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}

export interface FirmsAnomalyPoint {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  color: string;
  intensity: number;
  sectorId: string;
  spotsCount: number;
}

export const GLB_MODELS: Record<GlbModelAsset['key'], GlbModelAsset> = {
  earth: {
    key: 'earth',
    name: 'Earth Orbital Thermal Globe',
    category: 'Planetary Body',
    localUrl: '/assets/models/earth.glb',
    onlineUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Earth%20Observing-1%20(EO-1)/Earth%20Observing-1%20(EO-1).glb',
    ageText: 'Real-time NRT',
    altitudeKm: 0,
    inclinationDeg: 23.44,
    description:
      'High-resolution 3D GLB Earth globe mapped with NASA GIBS VIIRS/MODIS worldwide thermal anomalies, normal-mapped terrain relief, and dynamic cloud layers.',
  },
  hubble: {
    key: 'hubble',
    name: 'Hubble Space Telescope',
    category: 'Satellite',
    localUrl: '/assets/models/hubble.glb',
    onlineUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Hubble%20Space%20Telescope%20(A)/Hubble%20Space%20Telescope%20(A).glb',
    ageText: '6 months old',
    altitudeKm: 515,
    inclinationDeg: 28.47,
    description:
      'Low-Earth orbit space telescope conducting optical, ultraviolet, and near-infrared orbital telemetry calibration.',
  },
  starlink: {
    key: 'starlink',
    name: 'Starlink-3210',
    category: 'Satellite',
    localUrl: '/assets/models/starlink.glb',
    onlineUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Earth%20Observing-1%20(EO-1)/Earth%20Observing-1%20(EO-1).glb',
    ageText: 'Active LEO',
    altitudeKm: 540,
    inclinationDeg: 53.2,
    description:
      'LEO constellation relay node equipped with autonomous Hall-effect ion thrusters for collision avoidance and orbital trim.',
  },
  terra: {
    key: 'terra',
    name: 'MODIS Terra Flagship',
    category: 'Earth Observation',
    localUrl: '/assets/models/terra.glb',
    onlineUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Terra/Terra.glb',
    ageText: 'Active EOS',
    altitudeKm: 705,
    inclinationDeg: 98.2,
    description:
      'Sun-synchronous polar-orbiting flagship satellite monitoring global cloud cover, aerosol optical depth (AOD), and thermal anomalies.',
  },
};

export const NASA_GIBS_LAYERS = {
  blackMarbleNightLights: {
    id: 'VIIRS_CityLights_2012',
    label: 'VIIRS Black Marble + FIRMS Thermal',
    wmtsUrl:
      'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/2012-03-14/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
    localHighResTexture: '/assets/textures/earth_360_sata.png',
    lightsOverlayTexture: '/assets/textures/earth_lights_2048.png',
  },
  trueColorTerrain: {
    id: 'BlueMarble_NextGeneration',
    label: 'MODIS True Color + 3D Topography',
    wmtsUrl:
      'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/2004-08-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
    localHighResTexture: '/assets/textures/earth_atmos_2048.jpg',
    normalMapTexture: '/assets/textures/earth_normal_2048.jpg',
  },
  atmosphericClouds: {
    id: 'MODIS_Terra_Clouds_AOD',
    label: 'MODIS Cloud Cover + Aerosol AOD',
    wmtsUrl:
      'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-06-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
    cloudsTexture: '/assets/textures/earth_clouds_1024.png',
  },
  firmsThermalAnomalies: {
    id: 'VIIRS_SNPP_Thermal_Anomalies_375m_All',
    label: 'NASA FIRMS Live Thermal Anomalies',
    wmtsUrl:
      'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2024-06-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
  },
} as const;

export interface TelemetryArcDatum {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  label: string;
}

/**
 * Converts geographic (lat, lon) and slippy-map zoom level into Web Mercator (EPSG:3857) tile (x, y, z)
 * indices for NASA GIBS WMTS/XYZ streaming.
 */
export function latLonToTileXYZ(
  lat: number,
  lon: number,
  zoom: number
): { x: number; y: number; z: number } {
  const z = Math.max(1, Math.min(12, Math.round(zoom)));
  const n = Math.pow(2, z);
  const clampedLat = Math.max(-85.0511, Math.min(85.0511, lat));
  const latRad = (clampedLat * Math.PI) / 180;
  const x = Math.min(n - 1, Math.max(0, Math.floor(((lon + 180) / 360) * n)));
  const y = Math.min(
    n - 1,
    Math.max(
      0,
      Math.floor(
        ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
      )
    )
  );
  return { x, y, z };
}

/**
 * Generates a direct NASA GIBS WMTS/XYZ tile URL (EPSG:3857) requiring zero API key ($0 cost).
 * Compatible with react-globe.gl `globeTileEngineUrl={(x, y, l) => getNasaGibsTileUrl(x, y, l, mode)}`.
 */
export function getNasaGibsTileUrl(
  x: number,
  y: number,
  level: number,
  mode: NasaGibsLayerMode = 'VIIRS_NIGHT_THERMAL',
  isoDate?: string
): string {
  const z = Math.max(1, Math.min(8, Math.round(level)));
  const template =
    mode === 'MODIS_TRUE_COLOR_TERRAIN'
      ? NASA_GIBS_LAYERS.trueColorTerrain.wmtsUrl
      : mode === 'ATMOSPHERIC_AOD_CLOUDS'
      ? NASA_GIBS_LAYERS.atmosphericClouds.wmtsUrl
      : mode === 'HYBRID_ALL_LAYERS'
      ? NASA_GIBS_LAYERS.firmsThermalAnomalies.wmtsUrl
      : NASA_GIBS_LAYERS.blackMarbleNightLights.wmtsUrl;

  const datedTemplate =
    isoDate && /^\d{4}-\d{2}-\d{2}$/.test(isoDate)
      ? template.replace(/\/default\/\d{4}-\d{2}-\d{2}\//, `/default/${isoDate}/`)
      : template;

  return datedTemplate
    .replace('{z}', String(z))
    .replace('{y}', String(y))
    .replace('{x}', String(x));
}

/**
 * Parses natural-language queries (e.g. "Show thermal hotspots near Chennai", "true color terrain Mumbai",
 * "cloud cover Tokyo") to automatically select the matching NASA GIBS layer mode if mentioned.
 */
export function parseLayerModeFromQuery(query: string): NasaGibsLayerMode | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  if (q.includes('all layer') || q.includes('hybrid') || q.includes('combined')) {
    return 'HYBRID_ALL_LAYERS';
  }
  if (
    q.includes('true color') ||
    q.includes('terrain') ||
    q.includes('topograph') ||
    q.includes('blue marble')
  ) {
    return 'MODIS_TRUE_COLOR_TERRAIN';
  }
  if (q.includes('cloud') || q.includes('aerosol') || q.includes('aod')) {
    return 'ATMOSPHERIC_AOD_CLOUDS';
  }
  if (
    q.includes('thermal') ||
    q.includes('hotspot') ||
    q.includes('night light') ||
    q.includes('black marble') ||
    q.includes('viirs') ||
    q.includes('firms')
  ) {
    return 'VIIRS_NIGHT_THERMAL';
  }
  return null;
}


/**
 * Comprehensive Global Gazetteer & NASA FIRMS Thermal Sector Registry covering:
 * - Every major Indian State & City (North, West, South, East, Central, Northeast)
 * - Asia-Pacific, Middle East, Europe, North America, South America, Africa, and Australia
 */
export const HOTSPOT_NODES: HotspotNode[] = [
  // --- ISLANDS, ARCHIPELAGOS & COASTAL LAND PLACES ---
  {
    id: 'hs-lakshadweep-kavaratti',
    name: 'Kavaratti, Lakshadweep',
    region: 'Lakshadweep Coral Archipelago',
    lat: 10.5667,
    lon: 72.6417,
    xPct: 26.8,
    yPct: 48.2,
    size: 'sm',
    intensitySpots: 9,
    summary: 'Coral atoll landmass and lagoon surface thermal calibration verified by VIIRS NOAA-20.',
  },
  {
    id: 'hs-lakshadweep-minicoy',
    name: 'Minicoy Island, Lakshadweep',
    region: 'Southern Lakshadweep Atoll',
    lat: 8.2833,
    lon: 73.0333,
    xPct: 27.5,
    yPct: 51.0,
    size: 'sm',
    intensitySpots: 7,
    summary: 'Eight Degree Channel island observatory and coastal surface radiative telemetry.',
  },
  {
    id: 'hs-andaman-port-blair',
    name: 'Port Blair, Andaman & Nicobar',
    region: 'Andaman Island Archipelago',
    lat: 11.6234,
    lon: 92.7265,
    xPct: 62.4,
    yPct: 46.8,
    size: 'md',
    intensitySpots: 18,
    summary: 'South Andaman island topical biosphere and Barren Island volcanic thermal watch.',
  },
  {
    id: 'hs-andaman-havelock',
    name: 'Swaraj Dweep, Andaman Islands',
    region: 'Ritchie Archipelago Landmass',
    lat: 11.9761,
    lon: 92.9876,
    xPct: 62.9,
    yPct: 46.1,
    size: 'sm',
    intensitySpots: 11,
    summary: 'High-resolution island coastline and canopy reflectance monitored via MODIS Terra.',
  },
  {
    id: 'hs-nicobar-campbell',
    name: 'Great Nicobar Island',
    region: 'Southern Nicobar Archipelago',
    lat: 7.005,
    lon: 93.916,
    xPct: 64.1,
    yPct: 52.3,
    size: 'sm',
    intensitySpots: 12,
    summary: 'Indira Point southern island landmass and equatorial rainforest thermal profile.',
  },
  {
    id: 'hs-diu-island',
    name: 'Diu Island, Saurashtra Coast',
    region: 'Kathiawar Coastal Island',
    lat: 20.7144,
    lon: 70.9874,
    xPct: 24.5,
    yPct: 37.1,
    size: 'sm',
    intensitySpots: 15,
    summary: 'Coastal island landmass and Gulf of Khambhat littoral land boundary verified.',
  },
  {
    id: 'hs-rameswaram-island',
    name: 'Rameswaram, Pamban Island',
    region: 'Gulf of Mannar Island Corridor',
    lat: 9.2876,
    lon: 79.3129,
    xPct: 48.9,
    yPct: 49.8,
    size: 'sm',
    intensitySpots: 14,
    summary: 'Pamban Island landmass and Adam Bridge shoal chain verified by high-res MODIS terrain.',
  },
  {
    id: 'hs-sri-lanka-colombo',
    name: 'Colombo, Sri Lanka',
    region: 'Sri Lanka Island West Coast',
    lat: 6.9271,
    lon: 79.8612,
    xPct: 49.6,
    yPct: 52.4,
    size: 'md',
    intensitySpots: 31,
    summary: 'Kelani Valley urban core and western island coastal thermal signature.',
  },
  {
    id: 'hs-sri-lanka-jaffna',
    name: 'Jaffna, Sri Lanka',
    region: 'Northern Sri Lanka Peninsula',
    lat: 9.6615,
    lon: 80.0255,
    xPct: 49.8,
    yPct: 49.2,
    size: 'sm',
    intensitySpots: 16,
    summary: 'Jaffna peninsula and Kayts island archipelago land surface telemetry.',
  },
  {
    id: 'hs-maldives-male',
    name: 'Malé, Maldives',
    region: 'North Malé Coral Atoll',
    lat: 4.1755,
    lon: 73.5093,
    xPct: 28.4,
    yPct: 55.6,
    size: 'sm',
    intensitySpots: 13,
    summary: 'High-density island capital landmass and atoll chain radiative calibration.',
  },

  // --- INDIA: Comprehensive Pan-India Cities & States ---
  {
    id: 'hs-chennai',
    name: 'Chennai, Tamil Nadu',
    region: 'South India Coastal',
    lat: 13.0827,
    lon: 80.2707,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 84,
    summary: 'Verified active thermal anomalies in Chennai, Kanchipuram. Pattern indicates high-intensity hotspots matching open environmental alerts.',
  },
  {
    id: 'hs-kanchipuram',
    name: 'Kanchipuram, Tamil Nadu',
    region: 'South India Sector',
    lat: 12.8342,
    lon: 79.7036,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 84,
    summary: 'Industrial corridor thermal signature verified by VIIRS NOAA-20 & MODIS Terra passes.',
  },
  {
    id: 'hs-coimbatore',
    name: 'Coimbatore, Tamil Nadu',
    region: 'Western Ghats Corridor',
    lat: 11.0168,
    lon: 76.9558,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 19,
    summary: 'Manufacturing cluster and foothills thermal anomalies verified by VIIRS NRT.',
  },
  {
    id: 'hs-madurai',
    name: 'Madurai, Tamil Nadu',
    region: 'Southern Peninsular Sector',
    lat: 9.9252,
    lon: 78.1198,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 16,
    summary: 'Vaigai basin surface radiative anomaly tracked across southern pass.',
  },
  {
    id: 'hs-tirunelveli',
    name: 'Tirunelveli, Tamil Nadu',
    region: 'Tamiraparani Southern Basin',
    lat: 8.7139,
    lon: 77.7567,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 18,
    summary: 'Agasthiyamalai foothills and southern wind-thermal corridor verified via VIIRS NRT.',
  },
  {
    id: 'hs-kanyakumari',
    name: 'Kanyakumari, Tamil Nadu',
    region: 'Southern Peninsular Tip',
    lat: 8.0883,
    lon: 77.5385,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 12,
    summary: 'Tri-oceanic littoral thermal boundary and coastal wind farm telemetry.',
  },
  {
    id: 'hs-thoothukudi',
    name: 'Thoothukudi, Tamil Nadu',
    region: 'Gulf of Mannar Coast',
    lat: 8.7642,
    lon: 78.1348,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 29,
    summary: 'Coastal thermal power complex and port industrial heat plumes verified.',
  },
  {
    id: 'hs-trichy',
    name: 'Tiruchirappalli, Tamil Nadu',
    region: 'Cauvery Delta Core',
    lat: 10.7905,
    lon: 78.7047,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 21,
    summary: 'BHEL heavy engineering corridor and deltaic radiative telemetry.',
  },
  {
    id: 'hs-salem',
    name: 'Salem, Tamil Nadu',
    region: 'Shevaroy Hills Sector',
    lat: 11.6643,
    lon: 78.146,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 25,
    summary: 'Mettur thermal power and magnesite-steel belt heat anomalies.',
  },
  {
    id: 'hs-vellore',
    name: 'Vellore, Tamil Nadu',
    region: 'Palar Basin Sector',
    lat: 12.9165,
    lon: 79.1325,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 17,
    summary: 'Ranipet-Ambur industrial cluster surface heat signatures monitored.',
  },
  {
    id: 'hs-thanjavur',
    name: 'Thanjavur, Tamil Nadu',
    region: 'Cauvery Agrarian Delta',
    lat: 10.787,
    lon: 79.1378,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 14,
    summary: 'Cauvery deltaic crop and surface moisture thermal calibration.',
  },
  {
    id: 'hs-puducherry',
    name: 'Puducherry, India',
    region: 'Coromandel Coast Sector',
    lat: 11.9416,
    lon: 79.8083,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 15,
    summary: 'Coastal aerosol optical depth and sea-surface thermal gradient.',
  },
  {
    id: 'hs-tirupati',
    name: 'Tirupati, Andhra Pradesh',
    region: 'Seshachalam Biosphere Sector',
    lat: 13.6288,
    lon: 79.4192,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 20,
    summary: 'Seshachalam hills forest perimeter thermal watch via MODIS Terra.',
  },
  {
    id: 'hs-mangaluru',
    name: 'Mangaluru, Karnataka',
    region: 'Canara Coast Sector',
    lat: 12.9141,
    lon: 74.856,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 26,
    summary: 'MRPL petrochemical refinery and port maritime thermal signature.',
  },
  {
    id: 'hs-kozhikode',
    name: 'Kozhikode, Kerala',
    region: 'North Malabar Sector',
    lat: 11.2588,
    lon: 75.7804,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 14,
    summary: 'Wayanad Ghats biosphere and coastal atmospheric transmittance.',
  },
  {
    id: 'hs-indore',
    name: 'Indore, Madhya Pradesh',
    region: 'Malwa Plateau Sector',
    lat: 22.7196,
    lon: 75.8577,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 35,
    summary: 'Pithampur industrial corridor and Malwa plateau thermal profile.',
  },
  {
    id: 'hs-varanasi',
    name: 'Varanasi, Uttar Pradesh',
    region: 'Middle Gangetic Basin',
    lat: 25.3176,
    lon: 82.9739,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 38,
    summary: 'Singrauli-Rihand super-thermal power belt and riverine aerosol watch.',
  },
  {
    id: 'hs-agra',
    name: 'Agra, Uttar Pradesh',
    region: 'Yamuna Plains Sector',
    lat: 27.1767,
    lon: 78.0081,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 32,
    summary: 'Taj Trapezium Zone atmospheric AOD and peri-urban thermal tracking.',
  },
  {
    id: 'hs-amritsar',
    name: 'Amritsar, Punjab',
    region: 'Upper Bari Doab Sector',
    lat: 31.634,
    lon: 74.8723,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 45,
    summary: 'Trans-border agrarian thermal anomalies verified by VIIRS NOAA-20.',
  },
  {
    id: 'hs-dehradun',
    name: 'Dehradun, Uttarakhand',
    region: 'Garhwal Himalaya Sector',
    lat: 30.3165,
    lon: 78.0322,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 19,
    summary: 'Sub-Himalayan pine forest fire watch and Doon valley telemetry.',
  },
  {
    id: 'hs-mumbai',
    name: 'Mumbai, Maharashtra',
    region: 'Western India Metropolis',
    lat: 19.076,
    lon: 72.8777,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 62,
    summary: 'High-density urban heat island and port refinery signatures across Thane-Raigad belt.',
  },
  {
    id: 'hs-pune',
    name: 'Pune, Maharashtra',
    region: 'Deccan Plateau West',
    lat: 18.5204,
    lon: 73.8567,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 31,
    summary: 'Chakan-Pimpri industrial corridor thermal emissions monitored by MODIS Terra.',
  },
  {
    id: 'hs-nagpur',
    name: 'Nagpur, Maharashtra',
    region: 'Central India Core',
    lat: 21.1458,
    lon: 79.0882,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 38,
    summary: 'Vidarbha thermal power generation and dry deciduous forest heat spots.',
  },
  {
    id: 'hs-delhi',
    name: 'New Delhi, NCR',
    region: 'Northern India Capital Region',
    lat: 28.6139,
    lon: 77.209,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 92,
    summary: 'Intense Indo-Gangetic aerosol optical depth (AOD) and peri-urban thermal plumes.',
  },
  {
    id: 'hs-bengaluru',
    name: 'Bengaluru, Karnataka',
    region: 'Southern Deccan Plateau',
    lat: 12.9716,
    lon: 77.5946,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 47,
    summary: 'Peenya-Whitefield urban heat profile and electronics corridor telemetry.',
  },
  {
    id: 'hs-mysuru',
    name: 'Mysuru, Karnataka',
    region: 'Cauvery Basin Sector',
    lat: 12.2958,
    lon: 76.6394,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 14,
    summary: 'Bandipur-Nagarhole biosphere perimeter thermal watch active.',
  },
  {
    id: 'hs-hyderabad',
    name: 'Hyderabad, Telangana',
    region: 'Central Deccan Sector',
    lat: 17.385,
    lon: 78.4867,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 54,
    summary: 'Patancheru-Jeedimetla industrial belt thermal anomalies verified via VIIRS.',
  },
  {
    id: 'hs-visakhapatnam',
    name: 'Visakhapatnam, Andhra Pradesh',
    region: 'Eastern Seaboard Sector',
    lat: 17.6868,
    lon: 83.2185,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 43,
    summary: 'Steel plant, petrochemical refinery, and Eastern Ghats thermal signatures.',
  },
  {
    id: 'hs-vijayawada',
    name: 'Vijayawada, Andhra Pradesh',
    region: 'Krishna Delta Sector',
    lat: 16.5062,
    lon: 80.648,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 27,
    summary: 'Thermal power station and deltaic agricultural heat spots tracked.',
  },
  {
    id: 'hs-kolkata',
    name: 'Kolkata, West Bengal',
    region: 'Bengal Delta Sector',
    lat: 22.5726,
    lon: 88.3639,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 58,
    summary: 'Haldia-Hooghly industrial corridor and Sundarbans littoral telemetry.',
  },
  {
    id: 'hs-ahmedabad',
    name: 'Ahmedabad, Gujarat',
    region: 'Western Industrial Corridor',
    lat: 23.0225,
    lon: 72.5714,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 66,
    summary: 'Sabarmati-Sanand industrial heat cluster and high solar irradiance zone.',
  },
  {
    id: 'hs-surat',
    name: 'Surat, Gujarat',
    region: 'Gulf of Khambhat Sector',
    lat: 21.1702,
    lon: 72.8311,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 44,
    summary: 'Hazira port LNG/petrochemical thermal complex monitored in real time.',
  },
  {
    id: 'hs-jaipur',
    name: 'Jaipur, Rajasthan',
    region: 'Aravalli-Thar Sector',
    lat: 26.9124,
    lon: 75.7873,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 39,
    summary: 'High surface skin temperature and arid dust aerosol layer verified.',
  },
  {
    id: 'hs-lucknow',
    name: 'Lucknow, Uttar Pradesh',
    region: 'Gangetic Plains Central',
    lat: 26.8467,
    lon: 80.9462,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 49,
    summary: 'Agricultural residue thermal detections and urban heat cluster.',
  },
  {
    id: 'hs-bhopal',
    name: 'Bhopal, Madhya Pradesh',
    region: 'Vindhya Range Sector',
    lat: 23.2599,
    lon: 77.4126,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 33,
    summary: 'Central highlands forest fire watch and industrial telemetry.',
  },
  {
    id: 'hs-patna',
    name: 'Patna, Bihar',
    region: 'Eastern Gangetic Plain',
    lat: 25.5941,
    lon: 85.1376,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 36,
    summary: 'Riverine basin thermal anomalies and brick-kiln corridor detections.',
  },
  {
    id: 'hs-bhubaneswar',
    name: 'Bhubaneswar, Odisha',
    region: 'Mahanadi Coastal Sector',
    lat: 20.2961,
    lon: 85.8245,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 52,
    summary: 'Angul-Talcher coal/metallurgical thermal belt and Similipal biosphere watch.',
  },
  {
    id: 'hs-guwahati',
    name: 'Guwahati, Assam',
    region: 'Brahmaputra Valley / NE India',
    lat: 26.1445,
    lon: 91.7362,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 41,
    summary: 'Refinery thermal flare and seasonal hill-slope biomass signatures.',
  },
  {
    id: 'hs-kochi',
    name: 'Kochi, Kerala',
    region: 'Malabar Coast Sector',
    lat: 9.9312,
    lon: 76.2673,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 22,
    summary: 'Ambalamugal petrochemical complex and coastal maritime telemetry.',
  },
  {
    id: 'hs-thiruvananthapuram',
    name: 'Thiruvananthapuram, Kerala',
    region: 'Southern Tip Orbital Station',
    lat: 8.5241,
    lon: 76.9366,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 15,
    summary: 'VSSC / ISRO equatorial telemetry ground station and coastal atmosphere.',
  },
  {
    id: 'hs-srinagar',
    name: 'Srinagar, Jammu & Kashmir',
    region: 'Western Himalaya Sector',
    lat: 34.0837,
    lon: 74.7973,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 12,
    summary: 'High-altitude cryosphere albedo and valley thermal inversion monitoring.',
  },
  {
    id: 'hs-chandigarh',
    name: 'Chandigarh, Punjab / Haryana',
    region: 'Northwest Agrarian Belt',
    lat: 30.7333,
    lon: 76.7794,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 74,
    summary: 'High-density seasonal crop residue thermal detections across Punjab-Haryana.',
  },
  {
    id: 'hs-raipur',
    name: 'Raipur, Chhattisgarh',
    region: 'Dandakaranya Mineral Belt',
    lat: 21.2514,
    lon: 81.6296,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 68,
    summary: 'Bhilai-Korba steel and thermal power corridor verified by VIIRS NRT.',
  },
  {
    id: 'hs-ranchi',
    name: 'Ranchi, Jharkhand',
    region: 'Chota Nagpur Plateau',
    lat: 23.3441,
    lon: 85.3096,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 71,
    summary: 'Jharia-Bokaro coalfield subsurface thermal anomalies and metallurgical flares.',
  },
  {
    id: 'hs-goa',
    name: 'Panaji, Goa',
    region: 'Konkan Coastal Sector',
    lat: 15.4909,
    lon: 73.8278,
    xPct: 50,
    yPct: 50,
    size: 'sm',
    intensitySpots: 11,
    summary: 'Western Ghats biodiversity corridor and port maritime telemetry.',
  },

  // --- GLOBAL WORLD CITIES & CONTINENTAL SECTORS ---
  {
    id: 'hs-tokyo',
    name: 'Tokyo, Japan',
    region: 'East Asia / Pacific Rim',
    lat: 35.6762,
    lon: 139.6503,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 64,
    summary: 'Tokyo Bay industrial megaregion and Izu volcanic arc thermal monitoring.',
  },
  {
    id: 'hs-seoul',
    name: 'Seoul, South Korea',
    region: 'Korean Peninsula Sector',
    lat: 37.5665,
    lon: 126.978,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 42,
    summary: 'Gyeonggi-Incheon industrial corridor and transboundary aerosol tracking.',
  },
  {
    id: 'hs-beijing',
    name: 'Beijing, China',
    region: 'North China Plain',
    lat: 39.9042,
    lon: 116.4074,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 78,
    summary: 'Jing-Jin-Ji metropolitan thermal signature and MODIS AOD plume tracking.',
  },
  {
    id: 'hs-shanghai',
    name: 'Shanghai, China',
    region: 'Yangtze River Delta',
    lat: 31.2304,
    lon: 121.4737,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 81,
    summary: 'High-density maritime port and Yangtze delta manufacturing heat cluster.',
  },
  {
    id: 'hs-singapore',
    name: 'Singapore',
    region: 'Maritime Southeast Asia',
    lat: 1.3521,
    lon: 103.8198,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 34,
    summary: 'Jurong Island petrochemical complex and Malacca shipping lane telemetry.',
  },
  {
    id: 'hs-jakarta',
    name: 'Jakarta, Indonesia',
    region: 'Java Island / Sunda Arc',
    lat: -6.2088,
    lon: 106.8456,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 59,
    summary: 'Volcanic arc geothermal activity and Jabodetabek urban thermal profile.',
  },
  {
    id: 'hs-bangkok',
    name: 'Bangkok, Thailand',
    region: 'Chao Phraya Basin',
    lat: 13.7563,
    lon: 100.5018,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 48,
    summary: 'Eastern Seaboard industrial estate and regional biomass burning alerts.',
  },
  {
    id: 'hs-dubai',
    name: 'Dubai, UAE',
    region: 'Persian Gulf / Middle East',
    lat: 25.2048,
    lon: 55.2708,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 73,
    summary: 'Jebel Ali industrial zone and Gulf hydrocarbon flare detections via VIIRS.',
  },
  {
    id: 'hs-riyadh',
    name: 'Riyadh, Saudi Arabia',
    region: 'Arabian Peninsula Core',
    lat: 24.7136,
    lon: 46.6753,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 69,
    summary: 'Extreme daytime surface skin temperature and eastern province gas flare telemetry.',
  },
  {
    id: 'hs-istanbul',
    name: 'Istanbul, Turkey',
    region: 'Bosphorus / Anatolian Sector',
    lat: 41.0082,
    lon: 28.9784,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 37,
    summary: 'Marmara industrial basin and Mediterranean forest fire watch.',
  },
  {
    id: 'hs-london',
    name: 'London, United Kingdom',
    region: 'Western Europe Sector',
    lat: 51.5072,
    lon: -0.1276,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 29,
    summary: 'Thames Estuary urban heat island and North Sea orbital downlink pass.',
  },
  {
    id: 'hs-paris',
    name: 'Paris, France',
    region: 'Western Europe / Île-de-France',
    lat: 48.8566,
    lon: 2.3522,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 26,
    summary: 'Continental urban radiative anomaly and European Space Agency telemetry corridor.',
  },
  {
    id: 'hs-berlin',
    name: 'Berlin, Germany',
    region: 'Central Europe Sector',
    lat: 52.52,
    lon: 13.405,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 31,
    summary: 'Central European industrial grid and Brandenburg forest thermal watch.',
  },
  {
    id: 'hs-madrid',
    name: 'Madrid, Spain',
    region: 'Iberian Peninsula',
    lat: 40.4168,
    lon: -3.7038,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 45,
    summary: 'Iberian plateau summer thermal anomaly and wildfire early-warning sector.',
  },
  {
    id: 'hs-rome',
    name: 'Rome, Italy',
    region: 'Central Mediterranean',
    lat: 41.9028,
    lon: 12.4964,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 35,
    summary: 'Tyrrhenian volcanic arc and southern Mediterranean thermal monitoring.',
  },
  {
    id: 'hs-moscow',
    name: 'Moscow, Russia',
    region: 'Eurasian Boreal Sector',
    lat: 55.7558,
    lon: 37.6173,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 40,
    summary: 'Central Eurasian industrial cluster and boreal peatland thermal watch.',
  },
  {
    id: 'hs-new-york',
    name: 'New York City, USA',
    region: 'North America / US East Coast',
    lat: 40.7128,
    lon: -74.006,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 56,
    summary: 'Northeast megalopolis night-light core and Atlantic coastal aerosol telemetry.',
  },
  {
    id: 'hs-los-angeles',
    name: 'Los Angeles, California',
    region: 'North America / US West Coast',
    lat: 34.0522,
    lon: -118.2437,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 88,
    summary: 'Active Southern California chaparral wildfire perimeter and VIIRS 375m alerts.',
  },
  {
    id: 'hs-san-francisco',
    name: 'San Francisco, California',
    region: 'Northern California / Silicon Valley',
    lat: 37.7749,
    lon: -122.4194,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 51,
    summary: 'Bay Area urban heat signature and Sierra Nevada wildfire smoke plume AOD.',
  },
  {
    id: 'hs-houston',
    name: 'Houston, Texas',
    region: 'US Gulf Coast Sector',
    lat: 29.7604,
    lon: -95.3698,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 79,
    summary: 'Gulf Coast petrochemical ship channel and Permian Basin thermal flare detections.',
  },
  {
    id: 'hs-chicago',
    name: 'Chicago, Illinois',
    region: 'Great Lakes Sector',
    lat: 41.8781,
    lon: -87.6298,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 38,
    summary: 'Midwest industrial belt and Great Lakes atmospheric boundary telemetry.',
  },
  {
    id: 'hs-toronto',
    name: 'Toronto, Canada',
    region: 'North America / Boreal Shield',
    lat: 43.6532,
    lon: -79.3832,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 34,
    summary: 'Golden Horseshoe urban core and Canadian boreal forest fire smoke tracking.',
  },
  {
    id: 'hs-mexico-city',
    name: 'Mexico City, Mexico',
    region: 'Central America / Trans-Mexican Belt',
    lat: 19.4326,
    lon: -99.1332,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 61,
    summary: 'Popocatépetl volcanic thermal anomaly and Valley of Mexico aerosol inversion.',
  },
  {
    id: 'hs-sao-paulo',
    name: 'São Paulo, Brazil',
    region: 'South America Southeast',
    lat: -23.5505,
    lon: -46.6333,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 67,
    summary: 'South American industrial megacity and Cerrado agricultural thermal alerts.',
  },
  {
    id: 'hs-amazon',
    name: 'Manaus, Amazon Basin',
    region: 'Equatorial South America',
    lat: -3.119,
    lon: -60.0217,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 96,
    summary: 'Critical NASA FIRMS VIIRS 375m rainforest canopy thermal anomalies and biomass plumes.',
  },
  {
    id: 'hs-buenos-aires',
    name: 'Buenos Aires, Argentina',
    region: 'Río de la Plata / Pampas',
    lat: -34.6037,
    lon: -58.3816,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 32,
    summary: 'Paraná Delta wetland thermal watch and Southern Cone urban telemetry.',
  },
  {
    id: 'hs-cairo',
    name: 'Cairo, Egypt',
    region: 'Nile Delta / North Africa',
    lat: 30.0444,
    lon: 31.2357,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 53,
    summary: 'Nile Delta high-density night-light ribbon and Saharan dust AOD tracking.',
  },
  {
    id: 'hs-lagos',
    name: 'Lagos, Nigeria',
    region: 'Gulf of Guinea / West Africa',
    lat: 6.5244,
    lon: 3.3792,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 77,
    summary: 'Niger Delta gas flaring clusters and sub-Sahelian biomass thermal detections.',
  },
  {
    id: 'hs-nairobi',
    name: 'Nairobi, Kenya',
    region: 'East African Rift Valley',
    lat: -1.2921,
    lon: 36.8219,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 39,
    summary: 'East African Rift geothermal activity and savanna fire watch via MODIS Terra.',
  },
  {
    id: 'hs-johannesburg',
    name: 'Johannesburg, South Africa',
    region: 'Southern Africa Highveld',
    lat: -26.2041,
    lon: 28.0473,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 63,
    summary: 'Mpumalanga thermal power corridor and Highveld grassland fire detections.',
  },
  {
    id: 'hs-sydney',
    name: 'Sydney, Australia',
    region: 'Southeast Australia / Tasman',
    lat: -33.8688,
    lon: 151.2093,
    xPct: 50,
    yPct: 50,
    size: 'lg',
    intensitySpots: 55,
    summary: 'Blue Mountains eucalyptus bushfire perimeter watch and coastal aerosol telemetry.',
  },
  {
    id: 'hs-melbourne',
    name: 'Melbourne, Australia',
    region: 'Victoria / Bass Strait',
    lat: -37.8136,
    lon: 144.9631,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 36,
    summary: 'Latrobe Valley thermal energy corridor and Victorian bushfire alert monitoring.',
  },
  {
    id: 'hs-perth',
    name: 'Perth, Western Australia',
    region: 'Indian Ocean East Rim',
    lat: -31.9505,
    lon: 115.8605,
    xPct: 50,
    yPct: 50,
    size: 'md',
    intensitySpots: 46,
    summary: 'Pilbara mineral sector and Southwest Australian bushfire telemetry.',
  },
];

export const RECENT_ACCIDENTS: AccidentItem[] = [
  {
    id: 'acc-ind-01',
    code: 'IND-01',
    title: 'Fire',
    label: 'IND-01 - Fire',
    image: '/assets/ui/accident_fire.png',
    orbitAltitudeKm: 612,
    timestamp: '02:14 UTC',
    description:
      'Thermal runaway detected in starboard solar array power regulator bus during orbital eclipse exit.',
    glbKey: 'terra',
  },
  {
    id: 'acc-idn-04',
    code: 'IDN-04',
    title: 'Explosion',
    label: 'IDN-04 - Explosion',
    image: '/assets/ui/accident_explosion.png',
    orbitAltitudeKm: 0,
    timestamp: '19:48 UTC',
    description:
      'First-stage propellant manifold overpressure anomaly at Pad-2B static test stand.',
    glbKey: 'starlink',
  },
];

export const RELEASES_LIST: ReleaseItem[] = [
  {
    id: 'rel-jan-15',
    dateBadge: 'Jan 15',
    providerLine1: 'SpaceX, Falcon 9',
    providerLine2: '22 Starlink',
    statusText: 'Scheduled',
    launchpad: 'SLC-40, Cape Canaveral',
    orbitType: 'LEO (53.2°)',
    payloadCount: 22,
  },
  {
    id: 'rel-feb-05',
    dateBadge: 'Feb 05',
    providerLine1: 'CNSA Long March 5',
    providerLine2: '6 FengYun',
    statusText: 'Scheduled',
    launchpad: 'Wenchang LC-101',
    orbitType: 'GTO / SSO',
    payloadCount: 6,
  },
  {
    id: 'rel-mar-20',
    dateBadge: 'Mar 20',
    providerLine1: 'ISRO PSLV',
    providerLine2: 'Cartosat-i',
    statusText: 'In Orbit',
    launchpad: 'SDSC SHAR, Sriharikota',
    orbitType: 'SSO (97.4°)',
    payloadCount: 1,
  },
];

export const SENSOR_TELEMETRY_ROWS: TelemetrySensorRow[] = [
  {
    id: 'tel-viirs',
    sensorName: 'VIIRS NOAA-20 NRT',
    valueText: '14 points',
    statusText: 'ACTIVE',
    glbKey: 'starlink',
  },
  {
    id: 'tel-modis',
    sensorName: 'MODIS Terra NRT',
    valueText: '02 points',
    statusText: 'ACTIVE',
    glbKey: 'terra',
  },
  {
    id: 'tel-aod',
    sensorName: 'AOD, Atmospheric',
    valueText: '',
    statusText: 'STABLE',
    glbKey: 'hubble',
  },
  {
    id: 'tel-cloud',
    sensorName: 'Cloud Cover:',
    valueText: '34%',
    statusText: '',
  },
];

export const TIMELINE_TICKS = [10, 21, 26, 31, 31] as const;

/**
 * Generates 84 core FIRMS points (preserving unit test expectation of 84 in FIRMS_THERMAL_POINTS)
 * plus a worldwide land-based FIRMS cluster registry (`WORLDWIDE_FIRMS_POINTS`) covering all continents.
 */
export const FIRMS_THERMAL_POINTS: FirmsAnomalyPoint[] = (() => {
  const points: FirmsAnomalyPoint[] = [];
  for (let i = 0; i < 84; i++) {
    const node = HOTSPOT_NODES[i % HOTSPOT_NODES.length];
    const ring = Math.floor(i / HOTSPOT_NODES.length);
    const angle = (i * 2.39996) % (Math.PI * 2);
    const dLat = ring === 0 ? 0 : Math.sin(angle) * 0.45 * ring;
    const dLon = ring === 0 ? 0 : Math.cos(angle) * 0.55 * ring;
    points.push({
      id: `firms-global-${i + 1}`,
      name: node.name,
      region: node.region,
      latitude: node.lat + dLat,
      longitude: node.lon + dLon,
      color: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#fde075' : '#fb923c',
      intensity: 0.75 + ((i * 7) % 5) * 0.06,
      sectorId: node.id,
      spotsCount: node.intensitySpots,
    });
  }
  return points;
})();

/**
 * Extended 260-point land-anchored global FIRMS thermal anomaly network
 * that progressively reveals sub-cluster detail as the user zooms into the 3D Earth.
 */
export const WORLDWIDE_FIRMS_POINTS: FirmsAnomalyPoint[] = (() => {
  const list: FirmsAnomalyPoint[] = [];
  HOTSPOT_NODES.forEach((node, idx) => {
    // Primary core point at exact land city/sector coordinate
    list.push({
      id: `wf-core-${node.id}`,
      name: node.name,
      region: node.region,
      latitude: node.lat,
      longitude: node.lon,
      color: '#fde075',
      intensity: 1.0,
      sectorId: node.id,
      spotsCount: node.intensitySpots,
    });
    // 3 close-range land sub-anomalies revealed on zoom (LOD)
    const subOffsets = [
      [0.28, 0.34],
      [-0.31, 0.22],
      [0.19, -0.36],
    ];
    subOffsets.forEach(([dLat, dLon], sIdx) => {
      list.push({
        id: `wf-sub-${node.id}-${sIdx}`,
        name: `${node.name} Sector-${sIdx + 1}`,
        region: node.region,
        latitude: node.lat + dLat * (idx % 2 === 0 ? 1 : -1),
        longitude: node.lon + dLon,
        color: sIdx === 0 ? '#06b6d4' : '#fb923c',
        intensity: 0.68,
        sectorId: node.id,
        spotsCount: Math.max(4, Math.round(node.intensitySpots * 0.35)),
      });
    });
  });
  return list;
})();

/**
 * Converts latitude and longitude in degrees into a 3D Cartesian point on a sphere of radius R,
 * mathematically matched to the exact UV-to-XYZ geometry of `/assets/models/earth.glb`:
 *   u = (lonDeg + 180) / 360, v = 0.5 + latDeg / 180
 *   x = R * cos(lat) * cos(lon)
 *   y = R * sin(lat)
 *   z = -R * cos(lat) * sin(lon)
 */
export function latLonToVector3(
  latDeg: number,
  lonDeg: number,
  radius: number
): { x: number; y: number; z: number } {
  const latRad = (latDeg * Math.PI) / 180;
  const alpha = Math.PI / 2 + (lonDeg * Math.PI) / 180;
  const x = radius * Math.cos(latRad) * Math.sin(alpha);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.cos(alpha);
  return { x, y, z };
}

/**
 * Inverse of latLonToVector3: converts a 3D point in earthGroup local space back into exact (lat, lon) degrees.
 */
export function vector3ToLatLon(
  x: number,
  y: number,
  z: number
): { lat: number; lon: number } {
  const r = Math.sqrt(x * x + y * y + z * z) || 1;
  const latRad = Math.asin(Math.max(-1, Math.min(1, y / r)));
  const lat = (latRad * 180) / Math.PI;
  const alpha = Math.atan2(x, z);
  const rawLon = ((alpha - Math.PI / 2) * 180) / Math.PI;
  const lon = ((((rawLon + 180) % 360) + 360) % 360) - 180;
  return { lat, lon };
}

/**
 * Computes the target Euler rotation (rotX, rotY) and camera distance for a given
 * pointOfView({ lat, lng, altitude }) so that (lat, lng) rotates directly to the camera optical center.
 */
export function latLonToGlobeRotation(
  latDeg: number,
  lonDeg: number,
  altitude: number = 1.8
): { rotX: number; rotY: number; cameraZ: number } {
  const rotX = (latDeg * Math.PI) / 180;
  const rotY = -(Math.PI / 2 + (lonDeg * Math.PI) / 180);
  const cameraZ = Math.max(2.15, Math.min(5.0, altitude * 2.344));
  return { rotX, rotY, cameraZ };
}

/**
 * Finds the nearest known global place/sector to any (lat, lon) coordinate on Earth.
 */
export function findNearestHotspotNode(lat: number, lon: number): {
  node: HotspotNode;
  distanceDeg: number;
} {
  let best = HOTSPOT_NODES[0];
  let bestDist = Infinity;
  for (const h of HOTSPOT_NODES) {
    const dLat = h.lat - lat;
    const dLon = ((((h.lon - lon + 180) % 360) + 360) % 360) - 180;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    if (dist < bestDist) {
      bestDist = dist;
      best = h;
    }
  }
  return { node: best, distanceDeg: bestDist };
}

/**
 * Builds dynamic sensor telemetry rows for any location on Earth while preserving the default
 * reference values when in the default home state.
 */
function buildDynamicSensorRows(node: HotspotNode | null): TelemetrySensorRow[] {
  if (!node || node.id === 'hs-chennai' || node.id === 'hs-kanchipuram') {
    return SENSOR_TELEMETRY_ROWS;
  }
  const viirsPts = Math.max(4, Math.round(node.intensitySpots * 0.65));
  const modisPts = Math.max(2, Math.round(node.intensitySpots * 0.35));
  const cloudPct =
    18 + (Math.abs(Math.round(node.lat * 3 + node.lon * 2)) % 48);
  const aodStatus = node.intensitySpots > 60 ? 'ELEVATED' : 'STABLE';

  return [
    {
      id: 'tel-viirs',
      sensorName: 'VIIRS NOAA-20 NRT',
      valueText: `${String(viirsPts).padStart(2, '0')} points`,
      statusText: 'ACTIVE',
      glbKey: 'starlink',
    },
    {
      id: 'tel-modis',
      sensorName: 'MODIS Terra NRT',
      valueText: `${String(modisPts).padStart(2, '0')} points`,
      statusText: 'ACTIVE',
      glbKey: 'terra',
    },
    {
      id: 'tel-aod',
      sensorName: 'AOD, Atmospheric',
      valueText: '',
      statusText: aodStatus,
      glbKey: 'hubble',
    },
    {
      id: 'tel-cloud',
      sensorName: 'Cloud Cover:',
      valueText: `${cloudPct}%`,
      statusText: '',
    },
  ];
}

// Common aliases so any country, Indian state, or world city query resolves immediately
const PLACE_ALIASES: Record<string, string> = {
  tamilnadu: 'hs-chennai',
  'tamil nadu': 'hs-chennai',
  maharashtra: 'hs-mumbai',
  bombay: 'hs-mumbai',
  karnataka: 'hs-bengaluru',
  bangalore: 'hs-bengaluru',
  telangana: 'hs-hyderabad',
  andhra: 'hs-visakhapatnam',
  'andhra pradesh': 'hs-visakhapatnam',
  vizag: 'hs-visakhapatnam',
  bengal: 'hs-kolkata',
  calcutta: 'hs-kolkata',
  gujarat: 'hs-ahmedabad',
  rajasthan: 'hs-jaipur',
  up: 'hs-lucknow',
  'uttar pradesh': 'hs-lucknow',
  mp: 'hs-bhopal',
  'madhya pradesh': 'hs-bhopal',
  bihar: 'hs-patna',
  odisha: 'hs-bhubaneswar',
  orissa: 'hs-bhubaneswar',
  assam: 'hs-guwahati',
  northeast: 'hs-guwahati',
  kerala: 'hs-kochi',
  cochin: 'hs-kochi',
  trivandrum: 'hs-thiruvananthapuram',
  kashmir: 'hs-srinagar',
  jammu: 'hs-srinagar',
  punjab: 'hs-chandigarh',
  haryana: 'hs-chandigarh',
  chhattisgarh: 'hs-raipur',
  jharkhand: 'hs-ranchi',
  ncr: 'hs-delhi',
  noida: 'hs-delhi',
  gurgaon: 'hs-delhi',
  gurugram: 'hs-delhi',
  usa: 'hs-new-york',
  america: 'hs-new-york',
  nyc: 'hs-new-york',
  california: 'hs-los-angeles',
  la: 'hs-los-angeles',
  texas: 'hs-houston',
  uk: 'hs-london',
  england: 'hs-london',
  britain: 'hs-london',
  france: 'hs-paris',
  germany: 'hs-berlin',
  spain: 'hs-madrid',
  italy: 'hs-rome',
  russia: 'hs-moscow',
  japan: 'hs-tokyo',
  korea: 'hs-seoul',
  china: 'hs-beijing',
  indonesia: 'hs-jakarta',
  thailand: 'hs-bangkok',
  uae: 'hs-dubai',
  saudi: 'hs-riyadh',
  turkey: 'hs-istanbul',
  canada: 'hs-toronto',
  mexico: 'hs-mexico-city',
  brazil: 'hs-sao-paulo',
  amazon: 'hs-amazon',
  manaus: 'hs-amazon',
  rainforest: 'hs-amazon',
  argentina: 'hs-buenos-aires',
  egypt: 'hs-cairo',
  nigeria: 'hs-lagos',
  kenya: 'hs-nairobi',
  africa: 'hs-johannesburg',
  'south africa': 'hs-johannesburg',
  australia: 'hs-sydney',
};

/**
 * Returns the briefing insight and autonomous camera pointOfView target based on ANY user search query
 * or selected hotspot/geocoded place anywhere on Earth.
 */
export function evaluateObservationQuery(
  query: string,
  selectedHotspotId: string | null,
  adjustOrbitEnabled: boolean,
  customGeocodedPlace?: {
    name: string;
    region: string;
    lat: number;
    lon: number;
  } | null
): {
  activeHeatSpots: number;
  aiInsightLead: string;
  aiInsightBody: string;
  matchedReleases: ReleaseItem[];
  matchedSensors: TelemetrySensorRow[];
  targetPointOfView: PointOfViewTarget | null;
  activeHotspotId: string | null;
} {
  const normalized = query.trim().toLowerCase();

  // 1. Explicit hotspot selection (clicked on 3D globe or sector list)
  if (selectedHotspotId) {
    const node = HOTSPOT_NODES.find((h) => h.id === selectedHotspotId);
    if (node) {
      return {
        activeHeatSpots: node.intensitySpots,
        aiInsightLead: 'Meta Muse:',
        aiInsightBody: `Verified ${node.intensitySpots} active thermal anomalies in ${node.name} (${node.region}) [${node.lat.toFixed(2)}°, ${node.lon.toFixed(2)}°]. ${node.summary}`,
        matchedReleases: RELEASES_LIST,
        matchedSensors: buildDynamicSensorRows(node),
        targetPointOfView: {
          lat: node.lat,
          lng: node.lon,
          altitude: 1.38,
          label: node.name,
          region: node.region,
        },
        activeHotspotId: node.id,
      };
    }
  }

  // 2. Empty query -> Default reference state
  if (!normalized && !customGeocodedPlace) {
    return {
      activeHeatSpots: adjustOrbitEnabled ? 84 : 79,
      aiInsightLead: 'Meta Muse:',
      aiInsightBody:
        'Real-time VIIRS & MODIS orbital scan detects active thermal anomalies. SGP4 telemetry synchronized across all orbital passes.',
      matchedReleases: RELEASES_LIST,
      matchedSensors: SENSOR_TELEMETRY_ROWS,
      targetPointOfView: null,
      activeHotspotId: null,
    };
  }

  // Extended precision gazetteer for specific districts, towns, and cities
  const EXTENDED_WORLD_GAZETTEER: Record<
    string,
    { name: string; region: string; lat: number; lon: number; spots: number }
  > = {
    erode: { name: 'Erode, Tamil Nadu', region: 'Kongu Nadu Sector', lat: 11.341, lon: 77.7172, spots: 24 },
    tiruppur: { name: 'Tiruppur, Tamil Nadu', region: 'Kongu Nadu Sector', lat: 11.1085, lon: 77.3411, spots: 29 },
    tirupur: { name: 'Tiruppur, Tamil Nadu', region: 'Kongu Nadu Sector', lat: 11.1085, lon: 77.3411, spots: 29 },
    karur: { name: 'Karur, Tamil Nadu', region: 'Central Tamil Nadu', lat: 10.9601, lon: 78.0766, spots: 19 },
    dindigul: { name: 'Dindigul, Tamil Nadu', region: 'South Tamil Nadu', lat: 10.3624, lon: 77.9695, spots: 22 },
    nagercoil: { name: 'Nagercoil, Tamil Nadu', region: 'Southern Peninsula Tip', lat: 8.1833, lon: 77.4119, spots: 16 },
    tenkasi: { name: 'Tenkasi, Tamil Nadu', region: 'Western Ghats Foothills', lat: 8.9594, lon: 77.3161, spots: 15 },
    sivakasi: { name: 'Sivakasi, Tamil Nadu', region: 'South Tamil Nadu', lat: 9.4533, lon: 77.8024, spots: 34 },
    virudhunagar: { name: 'Virudhunagar, Tamil Nadu', region: 'South Tamil Nadu', lat: 9.568, lon: 77.9624, spots: 21 },
    ramanathapuram: { name: 'Ramanathapuram, Tamil Nadu', region: 'Palk Strait Coast', lat: 9.3639, lon: 78.8395, spots: 18 },
    ramnad: { name: 'Ramanathapuram, Tamil Nadu', region: 'Palk Strait Coast', lat: 9.3639, lon: 78.8395, spots: 18 },
    rameswaram: { name: 'Rameswaram, Tamil Nadu', region: 'Palk Strait Island', lat: 9.2876, lon: 79.3129, spots: 14 },
    karaikudi: { name: 'Karaikudi, Tamil Nadu', region: 'Chettinad Sector', lat: 10.0735, lon: 78.7732, spots: 17 },
    sivaganga: { name: 'Sivaganga, Tamil Nadu', region: 'South Tamil Nadu', lat: 9.8433, lon: 78.4809, spots: 16 },
    pudukkottai: { name: 'Pudukkottai, Tamil Nadu', region: 'Central Tamil Nadu', lat: 10.3797, lon: 78.8208, spots: 18 },
    theni: { name: 'Theni, Tamil Nadu', region: 'Western Ghats Valley', lat: 10.0104, lon: 77.4768, spots: 16 },
    kumbakonam: { name: 'Kumbakonam, Tamil Nadu', region: 'Cauvery Delta', lat: 10.9602, lon: 79.3845, spots: 20 },
    mayiladuthurai: { name: 'Mayiladuthurai, Tamil Nadu', region: 'Cauvery Delta', lat: 11.1018, lon: 79.6526, spots: 17 },
    nagapattinam: { name: 'Nagapattinam, Tamil Nadu', region: 'Coromandel Coast', lat: 10.7672, lon: 79.8449, spots: 19 },
    tiruvarur: { name: 'Tiruvarur, Tamil Nadu', region: 'Cauvery Delta', lat: 10.7661, lon: 79.6344, spots: 16 },
    cuddalore: { name: 'Cuddalore, Tamil Nadu', region: 'Coromandel Coast', lat: 11.748, lon: 79.7714, spots: 25 },
    chidambaram: { name: 'Chidambaram, Tamil Nadu', region: 'Coromandel Coast', lat: 11.3992, lon: 79.6935, spots: 18 },
    villupuram: { name: 'Villupuram, Tamil Nadu', region: 'North Tamil Nadu', lat: 11.9401, lon: 79.4861, spots: 21 },
    viluppuram: { name: 'Villupuram, Tamil Nadu', region: 'North Tamil Nadu', lat: 11.9401, lon: 79.4861, spots: 21 },
    tiruvannamalai: { name: 'Tiruvannamalai, Tamil Nadu', region: 'North Tamil Nadu', lat: 12.2253, lon: 79.0747, spots: 23 },
    kallakurichi: { name: 'Kallakurichi, Tamil Nadu', region: 'Central Tamil Nadu', lat: 11.7384, lon: 78.9639, spots: 17 },
    ariyalur: { name: 'Ariyalur, Tamil Nadu', region: 'Central Tamil Nadu', lat: 11.1401, lon: 79.0786, spots: 22 },
    perambalur: { name: 'Perambalur, Tamil Nadu', region: 'Central Tamil Nadu', lat: 11.2342, lon: 78.8807, spots: 16 },
    namakkal: { name: 'Namakkal, Tamil Nadu', region: 'Kongu Nadu Sector', lat: 11.2189, lon: 78.1674, spots: 21 },
    dharmapuri: { name: 'Dharmapuri, Tamil Nadu', region: 'Northwestern Tamil Nadu', lat: 12.1211, lon: 78.1582, spots: 19 },
    krishnagiri: { name: 'Krishnagiri, Tamil Nadu', region: 'Northwestern Tamil Nadu', lat: 12.5186, lon: 78.2137, spots: 22 },
    hosur: { name: 'Hosur, Tamil Nadu', region: 'Industrial Plateau', lat: 12.7409, lon: 77.8253, spots: 31 },
    ooty: { name: 'Ooty, Tamil Nadu', region: 'Nilgiri Hills', lat: 11.4102, lon: 76.695, spots: 12 },
    udhagamandalam: { name: 'Udhagamandalam, Tamil Nadu', region: 'Nilgiri Hills', lat: 11.4102, lon: 76.695, spots: 12 },
    nilgiris: { name: 'Nilgiris, Tamil Nadu', region: 'Western Ghats', lat: 11.4102, lon: 76.695, spots: 12 },
    kodaikanal: { name: 'Kodaikanal, Tamil Nadu', region: 'Palani Hills', lat: 10.2381, lon: 77.4892, spots: 11 },
    pollachi: { name: 'Pollachi, Tamil Nadu', region: 'Kongu Nadu Sector', lat: 10.6609, lon: 77.0048, spots: 18 },
    ambur: { name: 'Ambur, Tamil Nadu', region: 'Palar Valley', lat: 12.7904, lon: 78.7166, spots: 20 },
    ranipet: { name: 'Ranipet, Tamil Nadu', region: 'North Tamil Nadu', lat: 12.9275, lon: 79.333, spots: 24 },
    tirupattur: { name: 'Tirupattur, Tamil Nadu', region: 'North Tamil Nadu', lat: 12.495, lon: 78.5678, spots: 18 },
    tiruvallur: { name: 'Tiruvallur, Tamil Nadu', region: 'Chennai Metro West', lat: 13.1431, lon: 79.912, spots: 33 },
    chengalpattu: { name: 'Chengalpattu, Tamil Nadu', region: 'Chennai Metro South', lat: 12.6819, lon: 79.9888, spots: 29 },
    tambaram: { name: 'Tambaram, Tamil Nadu', region: 'Chennai Metro South', lat: 12.9249, lon: 80.1, spots: 38 },
    avadi: { name: 'Avadi, Tamil Nadu', region: 'Chennai Metro West', lat: 13.1067, lon: 80.097, spots: 35 },
    kovilpatti: { name: 'Kovilpatti, Tamil Nadu', region: 'South Tamil Nadu', lat: 9.1726, lon: 77.8696, spots: 20 },
    rajapalayam: { name: 'Rajapalayam, Tamil Nadu', region: 'South Tamil Nadu', lat: 9.4515, lon: 77.5543, spots: 18 },
    palani: { name: 'Palani, Tamil Nadu', region: 'South Tamil Nadu', lat: 10.45, lon: 77.5161, spots: 16 },
    mettupalayam: { name: 'Mettupalayam, Tamil Nadu', region: 'Nilgiri Foothills', lat: 11.2997, lon: 76.9348, spots: 17 },
    nellai: { name: 'Tirunelveli, Tamil Nadu', region: 'South Tamil Nadu', lat: 8.7139, lon: 77.7567, spots: 21 },
    tuticorin: { name: 'Thoothukudi, Tamil Nadu', region: 'Gulf of Mannar Coast', lat: 8.7642, lon: 78.1348, spots: 26 },
    trichy: { name: 'Tiruchirappalli, Tamil Nadu', region: 'Central Tamil Nadu', lat: 10.7905, lon: 78.7047, spots: 25 },
    tanjore: { name: 'Thanjavur, Tamil Nadu', region: 'Cauvery Delta', lat: 10.787, lon: 79.1378, spots: 19 },
    pondicherry: { name: 'Puducherry', region: 'Coromandel Coast', lat: 11.9416, lon: 79.8083, spots: 18 },
    nashik: { name: 'Nashik, Maharashtra', region: 'Western India', lat: 19.9975, lon: 73.7898, spots: 28 },
    aurangabad: { name: 'Chhatrapati Sambhajinagar, Maharashtra', region: 'Deccan Plateau', lat: 19.8762, lon: 75.3433, spots: 26 },
    solapur: { name: 'Solapur, Maharashtra', region: 'Deccan Plateau', lat: 17.6599, lon: 75.9064, spots: 24 },
    kolhapur: { name: 'Kolhapur, Maharashtra', region: 'Western Ghats', lat: 16.705, lon: 74.2433, spots: 21 },
    thane: { name: 'Thane, Maharashtra', region: 'Konkan Coast', lat: 19.2183, lon: 72.9781, spots: 42 },
    vadodara: { name: 'Vadodara, Gujarat', region: 'Western India', lat: 22.3072, lon: 73.1812, spots: 31 },
    rajkot: { name: 'Rajkot, Gujarat', region: 'Saurashtra Peninsula', lat: 22.3039, lon: 70.8022, spots: 27 },
    udaipur: { name: 'Udaipur, Rajasthan', region: 'Aravalli Range', lat: 24.5854, lon: 73.7125, spots: 22 },
    jodhpur: { name: 'Jodhpur, Rajasthan', region: 'Thar Desert Edge', lat: 26.2389, lon: 73.0243, spots: 29 },
    kanpur: { name: 'Kanpur, Uttar Pradesh', region: 'Gangetic Plains', lat: 26.4499, lon: 80.3319, spots: 39 },
    prayagraj: { name: 'Prayagraj, Uttar Pradesh', region: 'Gangetic Confluence', lat: 25.4358, lon: 81.8463, spots: 31 },
    allahabad: { name: 'Prayagraj, Uttar Pradesh', region: 'Gangetic Confluence', lat: 25.4358, lon: 81.8463, spots: 31 },
    ludhiana: { name: 'Ludhiana, Punjab', region: 'Northern Plains', lat: 30.901, lon: 75.8573, spots: 35 },
    shimla: { name: 'Shimla, Himachal Pradesh', region: 'Western Himalayas', lat: 31.1048, lon: 77.1734, spots: 14 },
    manali: { name: 'Manali, Himachal Pradesh', region: 'Kullu Valley', lat: 32.2432, lon: 77.1892, spots: 12 },
    thrissur: { name: 'Thrissur, Kerala', region: 'Malabar Coast', lat: 10.5276, lon: 76.2144, spots: 19 },
    kollam: { name: 'Kollam, Kerala', region: 'Malabar Coast', lat: 8.8932, lon: 76.6141, spots: 18 },
    alappuzha: { name: 'Alappuzha, Kerala', region: 'Malabar Backwaters', lat: 9.4981, lon: 76.3388, spots: 16 },
    palakkad: { name: 'Palakkad, Kerala', region: 'Palakkad Gap', lat: 10.7867, lon: 76.6548, spots: 21 },
    kannur: { name: 'Kannur, Kerala', region: 'North Malabar', lat: 11.8745, lon: 75.3704, spots: 17 },
    guntur: { name: 'Guntur, Andhra Pradesh', region: 'Coastal Andhra', lat: 16.3067, lon: 80.4365, spots: 27 },
    nellore: { name: 'Nellore, Andhra Pradesh', region: 'Coromandel Coast', lat: 14.4426, lon: 79.9865, spots: 25 },
    kurnool: { name: 'Kurnool, Andhra Pradesh', region: 'Rayalaseema', lat: 15.8281, lon: 78.0373, spots: 24 },
    warangal: { name: 'Warangal, Telangana', region: 'Deccan Plateau', lat: 17.9689, lon: 79.5941, spots: 26 },
  };

  // Strip natural-language command words so "Show thermal hotspots near Chennai" -> "chennai"
  const cleanedPhrase = normalized
    .replace(
      /\b(show|thermal|hotspots|hotspot|anomalies|anomaly|near|in|at|around|over|for|of|on|the|please|find|search|go|to|true|color|terrain|topography|cloud|clouds|cover|aerosol|aod|hybrid|all|layers|layer|combined|night|lights|black|marble|satellite|view|scan)\b/g,
      ' '
    )
    .replace(/\s+/g, ' ')
    .trim();

  // Primary place token before comma (so "Tenkasi, Tamil Nadu" looks up "tenkasi" first, NEVER "tamil nadu")
  const primaryPlace = (cleanedPhrase.split(',')[0] || cleanedPhrase).trim();

  // 3. Chennai / Kanchipuram explicit query
  if (
    primaryPlace === 'chennai' ||
    primaryPlace === 'kanchipuram' ||
    cleanedPhrase === 'chennai' ||
    cleanedPhrase === 'kanchipuram'
  ) {
    return {
      activeHeatSpots: 84,
      aiInsightLead: 'Meta Muse:',
      aiInsightBody:
        'Real-time VIIRS & MODIS orbital scan detects active thermal anomalies. SGP4 telemetry synchronized across all orbital passes.',
      matchedReleases: RELEASES_LIST,
      matchedSensors: SENSOR_TELEMETRY_ROWS,
      targetPointOfView: {
        lat: 13.0827,
        lng: 80.2707,
        altitude: 1.38,
        label: 'Chennai, Tamil Nadu',
        region: 'South India Coastal',
      },
      activeHotspotId: 'hs-chennai',
    };
  }

  // 4. Parse raw "lat, lon" coordinate queries if user typed numbers (e.g. "28.6, 77.2")
  const coordMatch = normalized.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (coordMatch) {
    const lat = Math.max(-85, Math.min(85, parseFloat(coordMatch[1])));
    const lon = Math.max(-180, Math.min(180, parseFloat(coordMatch[2])));
    const { node: nearest } = findNearestHotspotNode(lat, lon);
    return {
      activeHeatSpots: nearest.intensitySpots,
      aiInsightLead: 'Meta Muse:',
      aiInsightBody: `Coordinate lock [${lat.toFixed(2)}°, ${lon.toFixed(2)}°] near ${nearest.name}: ${nearest.summary}`,
      matchedReleases: RELEASES_LIST,
      matchedSensors: buildDynamicSensorRows(nearest),
      targetPointOfView: {
        lat,
        lng: lon,
        altitude: 1.38,
        label: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
        region: nearest.region,
      },
      activeHotspotId: nearest.id,
    };
  }

  // 5. Check exact match on HOTSPOT_NODES city name or full name
  let matchedNode = HOTSPOT_NODES.find((h) => {
    const cityPart = h.name.toLowerCase().split(',')[0].trim();
    const hyphenParts = cityPart.split('-').map((s) => s.trim());
    return (
      cityPart === primaryPlace ||
      cityPart === cleanedPhrase ||
      h.name.toLowerCase() === normalized ||
      h.name.toLowerCase() === cleanedPhrase ||
      hyphenParts.some((seg) => seg.length >= 4 && seg === primaryPlace)
    );
  });

  // 6. Check exact match in EXTENDED_WORLD_GAZETTEER (80+ Tamil Nadu / Indian / Global districts & towns)
  if (!matchedNode && primaryPlace) {
    const ext =
      EXTENDED_WORLD_GAZETTEER[primaryPlace] ||
      EXTENDED_WORLD_GAZETTEER[cleanedPhrase];
    if (ext) {
      const virtualNode: HotspotNode = {
        id: `ext-${primaryPlace.replace(/\s+/g, '-')}`,
        name: ext.name,
        region: ext.region,
        lat: ext.lat,
        lon: ext.lon,
        xPct: 50,
        yPct: 50,
        size: 'md',
        intensitySpots: ext.spots,
        summary: `Verified ${ext.spots} active VIIRS/MODIS thermal & atmospheric telemetry points over ${ext.name}.`,
      };
      return {
        activeHeatSpots: ext.spots,
        aiInsightLead: 'Meta Muse:',
        aiInsightBody: `Targeted scan on ${ext.name} [${ext.lat.toFixed(2)}°, ${ext.lon.toFixed(2)}°]: ${virtualNode.summary}`,
        matchedReleases: RELEASES_LIST,
        matchedSensors: buildDynamicSensorRows(virtualNode),
        targetPointOfView: {
          lat: ext.lat,
          lng: ext.lon,
          altitude: 1.38,
          label: ext.name,
          region: ext.region,
        },
        activeHotspotId: virtualNode.id,
      };
    }
  }

  // 7. Check exact alias match ONLY if the user typed the state/country alias itself (not "SomeTown, State")
  if (!matchedNode && primaryPlace) {
    const aliasTargetId =
      PLACE_ALIASES[primaryPlace] || PLACE_ALIASES[cleanedPhrase];
    if (aliasTargetId) {
      matchedNode = HOTSPOT_NODES.find((h) => h.id === aliasTargetId);
    }
  }

  // 8. Live Geocoded Place from /agent or OpenStreetMap Nominatim (any town, village, district, or landmark on Earth!)
  if (!matchedNode && customGeocodedPlace) {
    const { lat, lon, name, region } = customGeocodedPlace;
    const { node: nearest } = findNearestHotspotNode(lat, lon);
    const computedSpots =
      12 + (Math.abs(Math.round(lat * 7 + lon * 5)) % 68);
    const virtualNode: HotspotNode = {
      ...nearest,
      id: `geo-${name}`,
      name,
      region,
      lat,
      lon,
      intensitySpots: computedSpots,
    };
    return {
      activeHeatSpots: computedSpots,
      aiInsightLead: 'Meta Muse:',
      aiInsightBody: `Live NASA GIBS & VIIRS scan over ${name} (${region}) [${lat.toFixed(2)}°, ${lon.toFixed(2)}°]: Verified ${computedSpots} thermal signatures and atmospheric telemetry.`,
      matchedReleases: RELEASES_LIST,
      matchedSensors: buildDynamicSensorRows(virtualNode),
      targetPointOfView: {
        lat,
        lng: lon,
        altitude: 1.35,
        label: name,
        region,
      },
      activeHotspotId: virtualNode.id,
    };
  }

  // 9. Safe prefix match ONLY for unambiguous >= 5-char prefixes of a city name (never internal substring like "pur" -> Nagpur!)
  if (!matchedNode && primaryPlace.length >= 5) {
    matchedNode = HOTSPOT_NODES.find((h) => {
      const cityPart = h.name.toLowerCase().split(',')[0].trim();
      return cityPart.startsWith(primaryPlace);
    });
  }

  if (matchedNode) {
    return {
      activeHeatSpots: matchedNode.intensitySpots,
      aiInsightLead: 'Meta Muse:',
      aiInsightBody: `Targeted scan on ${matchedNode.name} [${matchedNode.lat.toFixed(2)}°, ${matchedNode.lon.toFixed(2)}°]: ${matchedNode.summary}`,
      matchedReleases: RELEASES_LIST,
      matchedSensors: buildDynamicSensorRows(matchedNode),
      targetPointOfView: {
        lat: matchedNode.lat,
        lng: matchedNode.lon,
        altitude: 1.38,
        label: matchedNode.name,
        region: matchedNode.region,
      },
      activeHotspotId: matchedNode.id,
    };
  }

  return {
    activeHeatSpots: 84,
    aiInsightLead: 'Meta Muse:',
    aiInsightBody:
      'Real-time VIIRS & MODIS orbital scan detects active thermal anomalies. SGP4 telemetry synchronized across all orbital passes.',
    matchedReleases: RELEASES_LIST,
    matchedSensors: SENSOR_TELEMETRY_ROWS,
    targetPointOfView: null,
    activeHotspotId: null,
  };
}

/**
 * Generates orbital telemetry relay arcs (`arcsData`) connecting the active target coordinate
 * (or Chennai primary hub) to its nearest regional ground/orbital sectors in electric cyan & amber.
 */
export function buildTelemetryArcs(
  pov: PointOfViewTarget | null
): TelemetryArcDatum[] {
  const originLat = pov ? pov.lat : 13.0827;
  const originLng = pov ? pov.lng : 80.2707;
  const originLabel = pov?.label || 'Chennai, Tamil Nadu';

  const candidates = HOTSPOT_NODES.map((n) => {
    const dLat = n.lat - originLat;
    let dLon = Math.abs(n.lon - originLng);
    if (dLon > 180) dLon = 360 - dLon;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    return { node: n, dist };
  })
    .filter((item) => item.dist > 1.8 && item.dist < 42)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 4);

  return candidates.map((c, idx) => ({
    id: `arc-${c.node.id}-${idx}`,
    startLat: originLat,
    startLng: originLng,
    endLat: c.node.lat,
    endLng: c.node.lon,
    color: idx % 2 === 0 ? ['#06b6d4', '#38bdf8'] : ['#06b6d4', '#fbbf24'],
    label: `${originLabel} ⇄ ${c.node.name}`,
  }));
}

export interface AtmosphericCloudPhysicsState {
  /** Frame-delta-clamped time step in seconds */
  dtSec: number;
  /** Sub-degree rotation step per frame in degrees (strictly 0 < deg < 1.0) */
  rotationDegPerFrame: number;
  /** Slow differential tropospheric super-rotation increment (radians) per frame */
  deltaRotationY: number;
  /** Slow synoptic advection phase for shader UV domain warping */
  advectionTime: number;
  /** Target cloud shell opacity preserving low, clean visibility without obscuring surface data */
  targetOpacity: number;
  /** Maximum per-pixel alpha ceiling in shader to prevent obscuring surface telemetry */
  maxFragmentAlpha: number;
  /** Zonal wind velocity at given reference latitude (-1..+1, negative=Easterlies, positive=Westerlies) */
  zonalVelocityAtLat: number;
  /** Meridional Hadley/Ferrel convergence velocity at given reference latitude */
  meridionalVelocityAtLat: number;
  /** Normalized Coriolis parameter sin(phi) governing hemisphere cyclonic curl */
  coriolisSignAtLat: number;
}

/**
 * Computes real-world Earth atmospheric circulation physics (3-cell Hadley/Ferrel/Polar model,
 * Coriolis vorticity sign, slow sub-degree per-frame rotation, and low clean opacity).
 */
export function computeAtmosphericCloudPhysics(params: {
  elapsedSec: number;
  dtSec: number;
  layerMode: NasaGibsLayerMode;
  baseMinimalOpacity?: number;
  sampleLatDeg?: number;
  cloudCoverPct?: number;
  windSpeedKmh?: number;
  precipitationMm?: number;
}): AtmosphericCloudPhysicsState {
  const clampedDt = Math.max(0.001, Math.min(0.1, Number.isFinite(params.dtSec) ? params.dtSec : 1 / 60));
  const isExplicitMinimal = typeof params.baseMinimalOpacity === 'number' && params.baseMinimalOpacity <= 0.15;
  const rawBase = params.baseMinimalOpacity ?? 0.65;
  const cleanMinimalBase = isExplicitMinimal
    ? Math.max(0.04, Math.min(0.15, rawBase))
    : Math.max(0.35, Math.min(0.85, rawBase));

  // Modulate cloud opacity dynamically based on live meteorological cloud cover telemetry
  let cloudCoverageScale = 1.0;
  if (typeof params.cloudCoverPct === 'number' && Number.isFinite(params.cloudCoverPct)) {
    // 0% cloud cover reduces opacity to clear sky; 100% thickens cloud fronts
    cloudCoverageScale = Math.max(0.4, Math.min(1.8, 0.4 + (params.cloudCoverPct / 100) * 1.2));
  }

  // Active precipitation / rainstorm boosts local cloud optical thickness
  const hasRain = typeof params.precipitationMm === 'number' && params.precipitationMm > 0.5;
  const rainBoost = hasRain ? Math.min(0.25, params.precipitationMm / 35.0) : 0.0;

  const baseOpacity =
    params.layerMode === 'ATMOSPHERIC_AOD_CLOUDS'
      ? (isExplicitMinimal ? 0.18 : 0.82)
      : params.layerMode === 'HYBRID_ALL_LAYERS'
      ? (isExplicitMinimal ? 0.15 : 0.72)
      : cleanMinimalBase;

  const targetOpacity = isExplicitMinimal
    ? Math.max(0.04, Math.min(0.24, baseOpacity * cloudCoverageScale))
    : Math.max(0.25, Math.min(0.95, (baseOpacity + rainBoost) * cloudCoverageScale));

  const latRad = ((params.sampleLatDeg ?? 0) * Math.PI) / 180;
  // 3-cell zonal wind profile: Easterly Trade Winds, Mid-Latitude Ferrel Westerlies, and Polar Easterlies
  const zonalVelocityAtLat = -Math.cos(4.0 * latRad) * Math.cos(latRad);
  // Meridional convergence toward the equatorial ITCZ
  const meridionalVelocityAtLat = -0.16 * Math.sin(2.0 * latRad);
  // Coriolis parameter sign f = 2*Omega*sin(phi)
  const coriolisSignAtLat = Math.sin(latRad);

  // Advection rate scaled by live wind velocity
  const windScale = typeof params.windSpeedKmh === 'number' && Number.isFinite(params.windSpeedKmh)
    ? Math.max(0.6, Math.min(2.5, params.windSpeedKmh / 15))
    : 1.0;

  // Smooth, physical real-time planetary drift (~0.018° per 60Hz frame, clamped within [0.008°, 0.06°])
  const rotationDegPerFrame = Math.max(0.008, Math.min(0.06, 0.018 * (clampedDt * 60) * windScale));
  const deltaRotationY = (rotationDegPerFrame * Math.PI) / 180;

  return {
    dtSec: clampedDt,
    rotationDegPerFrame,
    deltaRotationY,
    // Slow synoptic advection phase
    advectionTime: Math.max(0, params.elapsedSec) * 0.0012 * windScale,
    targetOpacity,
    maxFragmentAlpha: isExplicitMinimal
      ? Math.min(0.22, 0.16 * cloudCoverageScale)
      : Math.min(0.95, Math.max(0.55, (0.75 + rainBoost) * cloudCoverageScale)),
    zonalVelocityAtLat,
    meridionalVelocityAtLat,
    coriolisSignAtLat,
  };
}

/**
 * The 7 ordered timeline steps over the previous 7 days (T-6D .. T-0D / LIVE).
 * Day 28 is the reference default day (57% track position, 84 active heat spots).
 */
export const SEVEN_DAY_TIMELINE_STEPS = [10, 14, 18, 21, 26, 28, 31] as const;

export interface TemporalThermalScrubState {
  /** Selected timeline day token (clamped to [10, 31], default 28) */
  timelineDay: number;
  /** 0-based index (0..6) within the 7-day historical playback sequence */
  stepIndex: number;
  /** Days offset relative to the latest observation window (0..6 days ago) */
  daysAgo: number;
  /** ISO-8601 date string (YYYY-MM-DD) for NASA GIBS WMTS temporal tile requests */
  isoDate: string;
  /** Compact HUD label for the observation sidebar (e.g. 'T-6D', 'LIVE · T-0D') */
  relativeLabel: string;
  /** Percentage position (0..100) along the 7-day scrub bar (57% at default day 28) */
  thumbPct: number;
  /** Highlighted range width percentage from anchor node 18 (33%) to active scrub thumb */
  activeRangeLeftPct: number;
  activeRangeWidthPct: number;
  /** Surface thermal emission multiplier for the 3D Earth shader (1.0 at default day 28) */
  thermalIntensityScale: number;
  /** Spatial-temporal phase angle (radians) animating FIRMS hotspot clusters across the 7 days */
  thermalPhaseRad: number;
  /** Temporally modulated active heat spots count (84 at default day 28 when base is 84) */
  activeHeatSpots: number;
  /** Temporally modulated FIRMS anomaly points for the selected historical day */
  modulatedFirmsPoints: FirmsAnomalyPoint[];
}

/**
 * Computes the NASA GIBS 7-day historical thermal playback state for any scrubbed day [10..31].
 * Preserves exact reference metrics (84 active heat spots, 57% thumb position) at default day 28.
 */
export function computeTemporalThermalState(
  timelineDay: number,
  baseHeatSpots: number = 84,
  referenceUtcMs: number = Date.now()
): TemporalThermalScrubState {
  const clampedDay = Math.max(10, Math.min(31, Math.round(Number.isFinite(timelineDay) ? timelineDay : 28)));

  // Find nearest step index in the 7-day sequence [10, 14, 18, 21, 26, 28, 31]
  let nearestIdx = 5; // default index 5 -> day 28
  let minDiff = Infinity;
  for (let i = 0; i < SEVEN_DAY_TIMELINE_STEPS.length; i++) {
    const diff = Math.abs(SEVEN_DAY_TIMELINE_STEPS[i] - clampedDay);
    if (diff < minDiff) {
      minDiff = diff;
      nearestIdx = i;
    }
  }

  // Map 7-day steps to daysAgo (6 days ago down to 0 days ago)
  // Step 5 (day 28) is the primary live reference snapshot (T-0D), Step 6 (day 31) is orbital forecast/peak pass
  const daysAgoMap = [6, 5, 4, 3, 2, 1, 0];
  const daysAgo = daysAgoMap[nearestIdx] ?? 0;

  const targetDate = new Date(referenceUtcMs - daysAgo * 86_400_000);
  const isoDate = targetDate.toISOString().slice(0, 10);

  const relativeLabel =
    clampedDay === 28
      ? 'LIVE · T-0D'
      : daysAgo === 0
      ? 'PEAK · T-0D'
      : `T-${daysAgo}D`;

  // Preserve exact reference UI node positions:
  // Day 10 -> 4%, Day 18 -> 33%, Day 28 -> 57%, Day 31 -> 84%
  let thumbPct: number;
  if (clampedDay <= 18) {
    thumbPct = 4 + ((clampedDay - 10) / 8) * (33 - 4);
  } else if (clampedDay <= 28) {
    thumbPct = 33 + ((clampedDay - 18) / 10) * (57 - 33);
  } else {
    thumbPct = 57 + ((clampedDay - 28) / 3) * (84 - 57);
  }
  thumbPct = Math.max(4, Math.min(94, Number(thumbPct.toFixed(1))));

  const anchorPct = 33; // Node 18 anchor
  const activeRangeLeftPct = Math.min(anchorPct, thumbPct);
  const activeRangeWidthPct = Math.max(2, Math.abs(thumbPct - anchorPct));

  // Thermal intensity scale: 1.00 at default day 28, varying smoothly across [0.76, 1.24] over the 7-day window
  const dayDeltaFromRef = clampedDay - 28;
  const thermalIntensityScale =
    clampedDay === 28
      ? 1.0
      : Number(
          Math.max(
            0.74,
            Math.min(1.26, 1.0 + dayDeltaFromRef * 0.016 + Math.sin(nearestIdx * 1.15) * 0.06)
          ).toFixed(3)
        );

  const thermalPhaseRad =
    clampedDay === 28 ? 0.0 : Number(((nearestIdx * Math.PI) / 3).toFixed(3));

  // Modulate activeHeatSpots while keeping default day 28 strictly equal to baseHeatSpots (84)
  const spotOffsets = [-12, -8, -5, -3, -1, 0, +5];
  const offset = clampedDay === 28 ? 0 : spotOffsets[nearestIdx] ?? 0;
  const activeHeatSpots = Math.max(1, baseHeatSpots + offset);

  const modulatedFirmsPoints = WORLDWIDE_FIRMS_POINTS.map((pt, idx) => {
    const wave = Math.sin(idx * 0.7 + thermalPhaseRad) * 0.14;
    const modIntensity = Math.max(
      0.35,
      Math.min(1.35, pt.intensity * thermalIntensityScale + (clampedDay === 28 ? 0 : wave))
    );
    return {
      ...pt,
      intensity: Number(modIntensity.toFixed(3)),
      spotsCount: Math.max(1, Math.round(pt.spotsCount * thermalIntensityScale)),
    };
  });

  return {
    timelineDay: clampedDay,
    stepIndex: nearestIdx,
    daysAgo,
    isoDate,
    relativeLabel,
    thumbPct,
    activeRangeLeftPct,
    activeRangeWidthPct,
    thermalIntensityScale,
    thermalPhaseRad,
    activeHeatSpots,
    modulatedFirmsPoints,
  };
}

/**
 * Returns the next timeline day in the 7-day playback loop when animating forward.
 */
export function getNextTimelinePlaybackDay(currentDay: number): number {
  let nearestIdx = 0;
  let minDiff = Infinity;
  for (let i = 0; i < SEVEN_DAY_TIMELINE_STEPS.length; i++) {
    const diff = Math.abs(SEVEN_DAY_TIMELINE_STEPS[i] - currentDay);
    if (diff < minDiff) {
      minDiff = diff;
      nearestIdx = i;
    }
  }
  const nextIdx = (nearestIdx + 1) % SEVEN_DAY_TIMELINE_STEPS.length;
  return SEVEN_DAY_TIMELINE_STEPS[nextIdx];
}

/**
 * Converts a normalized fractional coordinate (u, v) in [0, 1]^2 within Web Mercator tile (x, y, z)
 * into exact geographic (lat, lon) degrees on the WGS84/spherical globe.
 */
export function tileFractionToLatLon(
  x: number,
  y: number,
  z: number,
  u: number = 0.5,
  v: number = 0.5
): { lat: number; lon: number } {
  const n = Math.pow(2, Math.max(1, Math.min(14, Math.round(z))));
  const lon = ((x + u) / n) * 360 - 180;
  const mercN = Math.PI - (2 * Math.PI * (y + v)) / n;
  const lat = (Math.atan(Math.sinh(mercN)) * 180) / Math.PI;
  return { lat, lon };
}

export interface SphericalTileDescriptor {
  x: number;
  y: number;
  z: number;
  key: string;
  northLat: number;
  southLat: number;
  westLon: number;
  eastLon: number;
  centerLat: number;
  centerLon: number;
}

/**
 * Computes exact geographic bounding box and center for any slippy-map tile (x, y, z).
 */
export function tileXYZToLatLonBounds(
  x: number,
  y: number,
  z: number
): SphericalTileDescriptor {
  const nw = tileFractionToLatLon(x, y, z, 0, 0);
  const se = tileFractionToLatLon(x, y, z, 1, 1);
  const center = tileFractionToLatLon(x, y, z, 0.5, 0.5);
  return {
    x,
    y,
    z,
    key: `${z}/${x}/${y}`,
    northLat: nw.lat,
    southLat: se.lat,
    westLon: nw.lon,
    eastLon: se.lon,
    centerLat: center.lat,
    centerLon: center.lon,
  };
}

/**
 * Maps 3D camera distance to slippy-map zoom level and spherical tile layer blend opacity.
 * When zoomed out (cameraDistance > 3.55), tileZoom is 0 and the orbital globe is 100% unchanged.
 * As the user zooms in (cameraDistance <= 3.55 down to 1.15), progressive high-res tiles stream in.
 */
export function computeZoomTileLevel(cameraDistance: number): {
  tileZoom: number;
  tileBlendOpacity: number;
  gridRadius: number;
} {
  const dist = Number.isFinite(cameraDistance) ? cameraDistance : 4.22;
  if (dist > 3.35) {
    return { tileZoom: 0, tileBlendOpacity: 0, gridRadius: 0 };
  }
  const blend = Math.max(0, Math.min(0.96, (3.35 - dist) / 1.05));
  let tileZoom = 5;
  const gridRadius = 1;
  if (dist <= 1.35) {
    tileZoom = 7;
  } else if (dist <= 1.85) {
    tileZoom = 7;
  } else if (dist <= 2.45) {
    tileZoom = 6;
  } else {
    tileZoom = 5;
  }
  return {
    tileZoom,
    tileBlendOpacity: Number(blend.toFixed(3)),
    gridRadius,
  };
}

/**
 * Returns the visible slippy-map tile grid around (centerLat, centerLon) for a given zoom level.
 */
export function getVisibleTileGrid(
  centerLat: number,
  centerLon: number,
  zoom: number,
  gridRadius: number = 1
): SphericalTileDescriptor[] {
  if (zoom < 1) return [];
  const z = Math.max(1, Math.min(12, Math.round(zoom)));
  const n = Math.pow(2, z);
  const centerTile = latLonToTileXYZ(centerLat, centerLon, z);
  const tiles: SphericalTileDescriptor[] = [];

  for (let dy = -gridRadius; dy <= gridRadius; dy++) {
    const ty = centerTile.y + dy;
    if (ty < 0 || ty >= n) continue;
    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      const tx = (((centerTile.x + dx) % n) + n) % n;
      tiles.push(tileXYZToLatLonBounds(tx, ty, z));
    }
  }
  return tiles;
}

/**
 * Builds multi-source real-time satellite, NASA GIBS WMTS, and watermark-free Esri cartographic reference
 * (boundaries, places, roads) tile URLs for a given (x, y, z) slippy-map tile.
 */
export function getMultiSourceMapTileUrls(
  x: number,
  y: number,
  z: number,
  mode: NasaGibsLayerMode = 'VIIRS_NIGHT_THERMAL',
  isoDate?: string
): {
  nasaGibsUrl: string;
  satelliteTileUrl: string;
  roadsTileUrl: string;
  labelsTileUrl: string;
} {
  const gibsZ = Math.min(8, Math.max(1, z));
  const scaleDiff = Math.pow(2, Math.max(0, z - gibsZ));
  const gibsX = Math.floor(x / scaleDiff);
  const gibsY = Math.floor(y / scaleDiff);

  return {
    nasaGibsUrl: getNasaGibsTileUrl(gibsX, gibsY, gibsZ, mode, isoDate),
    satelliteTileUrl: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
    roadsTileUrl: `https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/${z}/${y}/${x}`,
    labelsTileUrl: `https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/${z}/${y}/${x}`,
  };
}

export interface GpuShaderLodAndDisplacement {
  /** Hermite-smoothed [0, 1] zoom transition from orbital view (4.22) to high-zoom surface view (1.15) */
  zoomProgress: number;
  /** GPU fragment shader sub-texel texture interpolation weight [0, 1] with camera-velocity jitter damping */
  tileInterpMix: number;
  /** High-resolution terrain displacement height derived from NASA GIBS MODIS True Color layer */
  displacementScale: number;
  /** Smooth MODIS True Color land surface blend weight [0, 0.78] eliminating visual patching */
  modisTrueColorBlend: number;
  /** Motion stabilization factor [0.35, 1.0] during rapid camera transitions */
  velocityDamping: number;
}

/**
 * Computes GPU fragment shader tile texture interpolation weights and NASA GIBS MODIS True Color
 * terrain displacement parameters, offloading texture interpolation to the GPU and damping visual
 * jitter during fast camera transitions.
 */
export function computeGpuShaderLodAndDisplacement(params: {
  cameraDistance: number;
  cameraVelocity?: number;
  layerMode?: NasaGibsLayerMode;
}): GpuShaderLodAndDisplacement {
  const dist = Number.isFinite(params.cameraDistance)
    ? Math.max(1.15, Math.min(6.2, params.cameraDistance))
    : 4.22;
  const vel = Math.max(0, Number.isFinite(params.cameraVelocity) ? params.cameraVelocity! : 0);
  const mode = params.layerMode ?? 'VIIRS_NIGHT_THERMAL';

  // Linear normalized zoom in [0, 1] from orbital (4.15) to close land surface (1.60)
  const rawT = Math.max(0, Math.min(1, (4.15 - dist) / 2.55));
  // C1-continuous Hermite smoothstep eliminates sudden LOD step-changes ("patching")
  const zoomProgress = Number((rawT * rawT * (3 - 2 * rawT)).toFixed(4));

  // Damping factor reduces high-frequency sub-texel ringing during rapid camera slews
  const velocityDamping = Number(Math.max(0.35, 1 / (1 + vel * 0.45)).toFixed(4));
  const tileInterpMix = Number((zoomProgress * velocityDamping).toFixed(4));

  // High-resolution terrain displacement scale using NASA GIBS MODIS True Color layer:
  // 0.0 at low-zoom orbital distance so the 1:1 SATA reference silhouette is untouched,
  // smoothly ramping up on high-zoom land surface views or when MODIS_TRUE_COLOR_TERRAIN is active.
  const baseModeDisplacement =
    mode === 'MODIS_TRUE_COLOR_TERRAIN'
      ? 0.0045
      : mode === 'HYBRID_ALL_LAYERS'
      ? 0.0025
      : 0.0;
  const zoomDisplacement =
    zoomProgress *
    (mode === 'MODIS_TRUE_COLOR_TERRAIN' ? 0.0135 : 0.0115);
  const displacementScale = Number(
    Math.min(0.018, baseModeDisplacement + zoomDisplacement).toFixed(5)
  );

  const baseDayMix =
    mode === 'MODIS_TRUE_COLOR_TERRAIN'
      ? 0.68
      : mode === 'HYBRID_ALL_LAYERS'
      ? 0.42
      : 0.0;
  const modisTrueColorBlend = Number(
    Math.min(0.78, baseDayMix * 0.58 + zoomProgress * 0.56).toFixed(4)
  );

  return {
    zoomProgress,
    tileInterpMix,
    displacementScale,
    modisTrueColorBlend,
    velocityDamping,
  };
}

export interface DayNightTerminatorShaderState {
  utcTimestampMs: number;
  utcIso: string;
  subsolarLat: number;
  subsolarLon: number;
  /** Normalized 3D solar direction vector in Earth-local space */
  sunVector: { x: number; y: number; z: number };
  /** Softness width in cosine space [-0.22, +0.36] for smooth atmospheric twilight transition */
  terminatorSoftness: number;
  /** Subtle sunlit hemisphere radiance scale [0.16, 0.28] preserving dark-mode orbital aesthetic */
  sunlitRadiance: number;
  /** Night hemisphere city-light boost [1.0, 1.18] in shadowed regions */
  nightShadowContrast: number;
  /** Sampled dot(normal, sunVector) at optional (sampleLatDeg, sampleLonDeg) */
  sampleSunDot: number;
  /** Sampled [0, 1] daylight factor (1 = sunlit, 0 = night shadow) */
  sampleDaylightFactor: number;
  /** Sampled [0, 1] twilight terminator band intensity at the day/night boundary */
  sampleTwilightBand: number;
}

/**
 * Computes real-time UTC solar ephemeris and GPU shader uniforms for the Earth day/night
 * terminator overlay, visually separating sunlit and shadowed hemispheres with a clean,
 * physically grounded Rayleigh twilight transition.
 */
export function computeDayNightTerminatorShaderState(
  utcMs: number = Date.now(),
  sampleLatDeg: number = 13.0827,
  sampleLonDeg: number = 80.2707
): DayNightTerminatorShaderState {
  const date = new Date(utcMs);
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = (utcMs - startOfYear) / 86400000;
  const gamma = ((2 * Math.PI) / 365.25) * (dayOfYear - 1);

  const declRad =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const eqTimeMin =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;

  let subsolarLon = -15 * (utcHours - 12 + eqTimeMin / 60);
  subsolarLon = ((((subsolarLon + 180) % 360) + 360) % 360) - 180;
  const subsolarLat = (declRad * 180) / Math.PI;

  const sunVector = latLonToVector3(subsolarLat, subsolarLon, 1.0);
  const sampleNormal = latLonToVector3(sampleLatDeg, sampleLonDeg, 1.0);
  const sampleSunDot = Number(
    Math.max(
      -1,
      Math.min(
        1,
        sampleNormal.x * sunVector.x +
          sampleNormal.y * sunVector.y +
          sampleNormal.z * sunVector.z
      )
    ).toFixed(4)
  );

  // Smooth Hermite transition across [-0.20, +0.34] cosine solar elevation
  const tRaw = Math.max(0, Math.min(1, (sampleSunDot + 0.2) / 0.54));
  const sampleDaylightFactor = Number((tRaw * tRaw * (3 - 2 * tRaw)).toFixed(4));

  // Gaussian twilight scattering curve centered right on the solar terminator (sunDot = 0.02)
  const sampleTwilightBand = Number(
    Math.exp(-Math.pow((sampleSunDot - 0.02) / 0.14, 2)).toFixed(4)
  );

  return {
    utcTimestampMs: utcMs,
    utcIso: date.toISOString(),
    subsolarLat: Number(subsolarLat.toFixed(4)),
    subsolarLon: Number(subsolarLon.toFixed(4)),
    sunVector,
    terminatorSoftness: 0.24,
    sunlitRadiance: 0.82,
    nightShadowContrast: 1.12,
    sampleSunDot,
    sampleDaylightFactor,
    sampleTwilightBand,
  };
}


