export interface ArchivedMissionQuery {
  query: string;
  response: string;
  time: string;
}

export interface MissionArchiveFolder {
  id: string;
  title: string;
  sector: string;
  lat: number;
  lon: number;
  altitude: number;
  layer: string;
  sensor: string;
  timestamp: string;
  date: string;
  summary: string;
  queries: ArchivedMissionQuery[];
}

export const DEFAULT_ARCHIVE_FOLDERS: MissionArchiveFolder[] = [
  {
    id: 'mission-india-highres',
    title: 'India Submeter Optical Pass',
    sector: 'Indian Subcontinent (Peninsular & Deccan)',
    lat: 20.59,
    lon: 78.96,
    altitude: 1.28,
    layer: 'MODIS_TRUE_COLOR_TERRAIN',
    sensor: 'ISRO Cartosat-3 (0.28m GSD) + Sentinel-3',
    timestamp: '21:15 UTC',
    date: 'Nov 03, 2026',
    summary: 'Submeter panchromatic and 1.12m multi-spectral true-color satellite reconnaissance across India with along-track stereo 3D terrain elevation.',
    queries: [
      {
        query: 'HIGH-RES FOR INDIA WITH CLEAR RESOLUTION OF 3D',
        response: 'Cartosat-3 submeter nadir pass locked at 0.28m resolution over India. 3D digital elevation model synchronized with clear-sky atmospheric transmission.',
        time: '21:12 UTC',
      },
      {
        query: 'High-Resolution Optical Pass',
        response: 'Active 0.28m optical downlink confirmed. Multi-spectral reflectance calibrated for topography, canopy, and urban sectors.',
        time: '21:15 UTC',
      },
    ],
  },
  {
    id: 'mission-sydney-radar',
    title: 'Sydney Coastal Surveillance',
    sector: 'New South Wales, Australia',
    lat: -33.86,
    lon: 151.21,
    altitude: 1.28,
    layer: 'MODIS_TRUE_COLOR_TERRAIN',
    sensor: 'NOAA-20 VIIRS + Doppler Weather Radar',
    timestamp: '20:35 UTC',
    date: 'Nov 03, 2026',
    summary: 'Coastal marine boundary observation, Tasman Sea sea-surface temperature, and high-definition orbital tracking across Sydney Harbour basin.',
    queries: [
      {
        query: 'Sydney, Australia',
        response: 'Geospatial lock established over Sydney (33.86° S, 151.21° E). Surface temperature 22°C with calm coastal sea breezes.',
        time: '20:35 UTC',
      },
    ],
  },
  {
    id: 'mission-mawsynram-precip',
    title: 'Mawsynram Extreme Hydrology',
    sector: 'East Khasi Hills, Meghalaya, India',
    lat: 25.30,
    lon: 91.58,
    altitude: 1.28,
    layer: 'ATMOSPHERIC_AOD_CLOUDS',
    sensor: 'NASA GPM Dual-Frequency Radar + INSAT-3DR',
    timestamp: '19:42 UTC',
    date: 'Nov 03, 2026',
    summary: 'Orographic condensation study over the wettest inhabited sector on Earth (11,872mm annual precipitation) with deep cloud column vorticity.',
    queries: [
      {
        query: 'Which place has highest rainfall on Earth?',
        response: 'Mawsynram, Meghalaya officially records the highest annual rainfall on Earth due to intense Bay of Bengal monsoon moisture trapped in deep plateau valleys.',
        time: '19:42 UTC',
      },
    ],
  },
  {
    id: 'mission-bay-bengal-cyclone',
    title: 'Bay of Bengal Deep Depression',
    sector: 'Bay of Bengal Marine Sector',
    lat: 15.00,
    lon: 88.00,
    altitude: 1.28,
    layer: 'VIIRS_NIGHT_THERMAL',
    sensor: 'ISRO Oceansat-3 Ku-Band Scatterometer',
    timestamp: '18:50 UTC',
    date: 'Nov 03, 2026',
    summary: 'Oceanic thermal boundary scan, Ku-band scatterometer surface wind field velocity, and cyclonic vortex atmospheric moisture detection.',
    queries: [
      {
        query: 'Bay of Bengal cyclonic circulation',
        response: 'Central pressure 985 hPa, max sustained winds 165 km/h. Sea surface temperatures monitored at 29.4°C across marine swath.',
        time: '18:50 UTC',
      },
    ],
  },
];

export function saveMissionChatToArchive(params: {
  title: string;
  sector?: string;
  lat: number;
  lon: number;
  altitude?: number;
  layer?: string;
  sensor?: string;
  query: string;
  response: string;
}) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('sata_mission_archive_folders');
    let folders: MissionArchiveFolder[] = raw ? JSON.parse(raw) : [...DEFAULT_ARCHIVE_FOLDERS];
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC';
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    // Look for existing folder by title or match query
    const cleanTitle = params.title.trim() || params.query.trim();
    const existingIdx = folders.findIndex(
      (f) => f.title.toLowerCase() === cleanTitle.toLowerCase() || f.queries.some(q => q.query.toLowerCase() === params.query.toLowerCase())
    );

    if (existingIdx !== -1) {
      folders[existingIdx].queries.push({
        query: params.query,
        response: params.response,
        time: timeStr,
      });
      folders[existingIdx].timestamp = timeStr;
      folders[existingIdx].summary = params.response.slice(0, 160) + '...';
      const [moved] = folders.splice(existingIdx, 1);
      folders.unshift(moved);
    } else {
      const newFolder: MissionArchiveFolder = {
        id: `mission-${Date.now()}`,
        title: cleanTitle,
        sector: params.sector || `${Math.abs(params.lat).toFixed(1)}°${params.lat >= 0 ? 'N' : 'S'}, ${Math.abs(params.lon).toFixed(1)}°${params.lon >= 0 ? 'E' : 'W'}`,
        lat: params.lat,
        lon: params.lon,
        altitude: params.altitude || 1.28,
        layer: params.layer || 'MODIS_TRUE_COLOR_TERRAIN',
        sensor: params.sensor || 'ISRO Cartosat-3 / Sentinel-3 Multi-Spectral',
        timestamp: timeStr,
        date: dateStr,
        summary: params.response.slice(0, 160) + '...',
        queries: [
          {
            query: params.query,
            response: params.response,
            time: timeStr,
          },
        ],
      };
      folders.unshift(newFolder);
    }

    folders = folders.slice(0, 40);
    localStorage.setItem('sata_mission_archive_folders', JSON.stringify(folders));
    window.dispatchEvent(new CustomEvent('sata-history-updated'));
  } catch (e) {
    console.warn('Failed to save to mission archive:', e);
  }
}
