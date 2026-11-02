/**
 * NASA GIBS (Global Imagery Browse Services) & Earth Observation Tile Layer Helpers
 * 100% Free Public Services - Zero Rate Limits & Zero Billing Requirements
 */

export interface GibsLayerConfig {
  id: string;
  name: string;
  format: "jpg" | "png";
  tileMatrixSet: string;
  time?: string;
  baseUrl: string;
}

export const NASA_GIBS_LAYERS = {
  // NASA Black Marble Night Lights (Day/Night Band - VIIRS)
  BLACK_MARBLE: {
    id: "VIIRS_SNPP_DayNightBand_AtSensor_M15",
    name: "NASA VIIRS Black Marble Night Lights",
    tileUrlTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_DayNightBand_AtSensor_M15/default/{time}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg",
    highResTextureUrl:
      "https://unpkg.com/three-globe/example/img/earth-night.jpg", // High-fidelity dark obsidian night texture
  },

  // Blue Marble Next Generation
  BLUE_MARBLE: {
    id: "BlueMarble_NextGeneration",
    name: "NASA Blue Marble NG",
    tileUrlTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/{time}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg",
    highResTextureUrl:
      "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  },

  // Active Thermal Fires Raster Layer
  MODIS_THERMAL_ANOMALIES: {
    id: "MODIS_Terra_Thermal_Anomalies_All",
    name: "NASA MODIS Terra Thermal Anomalies",
    tileUrlTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Thermal_Anomalies_All/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
  },
};

/**
 * Returns the recommended high-performance textures for react-globe.gl
 */
export function getRecommendedGlobeTextures() {
  return {
    globeImageUrl: NASA_GIBS_LAYERS.BLACK_MARBLE.highResTextureUrl,
    bumpImageUrl: "https://unpkg.com/three-globe/example/img/earth-topology.png",
    backgroundUri: null, // Transparent/Ultra-dark Obsidian #030712
    atmosphereColor: "#38bdf8",
    atmosphereAltitude: 0.15,
  };
}
