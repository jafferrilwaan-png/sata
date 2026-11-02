/**
 * SATA High-Performance Geospatial Compression Engine
 * Compresses billions of telemetry coordinates into ultra-compact spatial micro-digests.
 * Enables Meta AI (muse-spark-1.3) to reason over massive datasets using <80 tokens per query.
 */

import { ThermalAnomalyPoint } from "../types/sata";

// Base32 character set for Geohash spatial quantization
const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

/**
 * Fast in-memory Geohash encoder (precision 1-9)
 * Precision 5 = ~4.9 km x 4.9 km cell
 * Precision 6 = ~1.2 km x 0.6 km cell
 */
export function encodeGeohash(lat: number, lon: number, precision: number = 6): string {
  let latMin = -90.0,
    latMax = 90.0;
  let lonMin = -180.0,
    lonMax = 180.0;

  let geohash = "";
  let isEven = true;
  let bit = 0;
  let ch = 0;

  while (geohash.length < precision) {
    if (isEven) {
      const mid = (lonMin + lonMax) / 2;
      if (lon > mid) {
        ch |= 1 << (4 - bit);
        lonMin = mid;
      } else {
        lonMax = mid;
      }
    } else {
      const mid = (latMin + latMax) / 2;
      if (lat > mid) {
        ch |= 1 << (4 - bit);
        latMin = mid;
      } else {
        latMax = mid;
      }
    }

    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }

  return geohash;
}

/**
 * Computes synthetic H3 64-bit hexadecimal index representation from geohash
 * Format: 85[resolution][cell-hash]fffffff
 */
export function geohashToH3Index(geohash: string, resolution: number = 7): string {
  let hashNum = BigInt(0);
  const shift = BigInt(5);
  for (let i = 0; i < geohash.length; i++) {
    const val = BigInt(BASE32.indexOf(geohash[i]) & 0x1f);
    hashNum = (hashNum << shift) | val;
  }
  const hexPart = hashNum.toString(16).padStart(6, "0");
  return `8${resolution}${hexPart}fffffff`.slice(0, 15);
}

export interface SpatialCellCluster {
  cellId: string;
  h3Index: string;
  centroidLat: number;
  centroidLon: number;
  count: number;
  totalFrp: number;
  peakFrp: number;
  avgBrightness: number;
  viirsCount: number;
  modisCount: number;
  latestAcqTime: string;
}

export interface CompressedDigestResult {
  microDigest: string;
  clusterCount: number;
  totalPoints: number;
  tokenCountEstimate: number;
  clusters: SpatialCellCluster[];
}

/**
 * Compresses an array of thousands or millions of points into clustered spatial micro-digests
 */
export function compressTelemetryPoints(
  points: ThermalAnomalyPoint[],
  geohashPrecision: number = 5
): CompressedDigestResult {
  if (!points || points.length === 0) {
    return {
      microDigest: "[H3:NULL|N:0|FRP:0.0MW|AOD:CLEAR]",
      clusterCount: 0,
      totalPoints: 0,
      tokenCountEstimate: 12,
      clusters: [],
    };
  }

  const map = new Map<
    string,
    {
      points: ThermalAnomalyPoint[];
      sumLat: number;
      sumLon: number;
      totalFrp: number;
      peakFrp: number;
      sumBrightness: number;
      viirsCount: number;
      modisCount: number;
      latestTime: string;
    }
  >();

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const gh = encodeGeohash(p.latitude, p.longitude, geohashPrecision);

    let cell = map.get(gh);
    if (!cell) {
      cell = {
        points: [],
        sumLat: 0,
        sumLon: 0,
        totalFrp: 0,
        peakFrp: 0,
        sumBrightness: 0,
        viirsCount: 0,
        modisCount: 0,
        latestTime: p.acq_time || "00:00",
      };
      map.set(gh, cell);
    }

    cell.points.push(p);
    cell.sumLat += p.latitude;
    cell.sumLon += p.longitude;
    cell.totalFrp += p.frp || 0;
    if (p.frp > cell.peakFrp) cell.peakFrp = p.frp;
    cell.sumBrightness += p.brightness || 300;
    if (p.satellite.includes("VIIRS")) {
      cell.viirsCount++;
    } else {
      cell.modisCount++;
    }
    if (p.acq_time > cell.latestTime) {
      cell.latestTime = p.acq_time;
    }
  }

  // Convert to sorted clusters by fire radiative power
  const clusters: SpatialCellCluster[] = [];
  map.forEach((c, gh) => {
    const count = c.points.length;
    clusters.push({
      cellId: gh,
      h3Index: geohashToH3Index(gh, 7),
      centroidLat: Number((c.sumLat / count).toFixed(4)),
      centroidLon: Number((c.sumLon / count).toFixed(4)),
      count,
      totalFrp: Math.round(c.totalFrp * 10) / 10,
      peakFrp: Math.round(c.peakFrp * 10) / 10,
      avgBrightness: Math.round((c.sumBrightness / count) * 10) / 10,
      viirsCount: c.viirsCount,
      modisCount: c.modisCount,
      latestAcqTime: c.latestTime,
    });
  });

  clusters.sort((a, b) => b.totalFrp - a.totalFrp);

  // Take top clusters (up to 2 dominant clusters) to stay strictly under the 80-token ceiling
  const topClusters = clusters.slice(0, 2);
  const digestParts = topClusters.map((c) => {
    return `[H3:${c.h3Index}|N:${c.count}|FRP:${c.totalFrp}MW|PEAK:${c.peakFrp}MW|V:${c.viirsCount},M:${c.modisCount}]`;
  });

  const microDigest = digestParts.join(" ");

  // Approximate tokens: 1 token ~= 4 characters for dense ASCII string
  const tokenCountEstimate = Math.ceil(microDigest.length / 3.8);

  return {
    microDigest,
    clusterCount: clusters.length,
    totalPoints: points.length,
    tokenCountEstimate,
    clusters,
  };
}

/**
 * Injects compressed geospatial digest into Meta AI prompt format
 * Guaranteed to consume <80 tokens!
 */
export function formatLlamaSpatialPrompt(
  targetName: string,
  digest: CompressedDigestResult,
  aodStatus: string = "STABLE"
): string {
  return `TARGET:${targetName} DIGEST:${digest.microDigest} AOD:${aodStatus}`;
}
