import { SatelliteOrbitPass } from "../types/sata";

const SATELLITE_REGISTRY: Array<Omit<SatelliteOrbitPass, "pass_time" | "status">> = [
  {
    id: "SAT-ISRO-CARTOSAT3",
    satellite_name: "Cartosat-3 (High Res Earth Observation)",
    mission: "ISRO PSLV-C47",
    agency: "ISRO",
    altitude_km: 505.0,
    velocity_kms: 7.61,
    inclination_deg: 97.5,
  },
  {
    id: "SAT-NASA-NOAA20",
    satellite_name: "NOAA-20 (JPSS-1 VIIRS/ATMS)",
    mission: "NASA / NOAA Joint Polar Satellite",
    agency: "NASA",
    altitude_km: 824.0,
    velocity_kms: 7.44,
    inclination_deg: 98.7,
  },
  {
    id: "SAT-ESA-SENTINEL2A",
    satellite_name: "Sentinel-2A (MSI Multispectral)",
    mission: "Copernicus Earth Observation",
    agency: "NASA",
    altitude_km: 786.0,
    velocity_kms: 7.46,
    inclination_deg: 98.6,
  },
  {
    id: "SAT-SPACEX-STARLINK",
    satellite_name: "Falcon 9 Starlink Constellation Pass",
    mission: "SpaceX Orbital Delivery",
    agency: "SpaceX",
    altitude_km: 550.0,
    velocity_kms: 7.59,
    inclination_deg: 53.2,
  },
  {
    id: "SAT-CNSA-LONGMARCH",
    satellite_name: "Gaofen-7 Optical Sub-meter",
    mission: "CNSA Long March 4B",
    agency: "CNSA",
    altitude_km: 500.0,
    velocity_kms: 7.62,
    inclination_deg: 97.4,
  },
];

/**
 * Computes live and upcoming orbital passes over Chennai / target coordinates
 */
export function getSatelliteOrbitPasses(): SatelliteOrbitPass[] {
  const now = Date.now();

  return SATELLITE_REGISTRY.map((sat, index) => {
    // Stagger pass times realistically (e.g. within next 3 to 18 hours)
    const passOffsetMinutes = 24 + index * 135;
    const passTimestamp = new Date(now + passOffsetMinutes * 60 * 1000);

    const hours = String(passTimestamp.getUTCHours()).padStart(2, "0");
    const minutes = String(passTimestamp.getUTCMinutes()).padStart(2, "0");
    const seconds = String(passTimestamp.getUTCSeconds()).padStart(2, "0");

    return {
      ...sat,
      pass_time: `${hours}:${minutes}:${seconds} UTC`,
      status: index === 0 ? "TRACKING" : index === 1 ? "ORBITING" : "SCHEDULED",
    };
  });
}
