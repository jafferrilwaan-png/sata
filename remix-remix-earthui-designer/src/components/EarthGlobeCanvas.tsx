import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  NavTab,
  NasaGibsLayerMode,
  HotspotNode,
  FirmsAnomalyPoint,
  TelemetryArcDatum,
  PointOfViewTarget,
  NASA_GIBS_LAYERS,
  HOTSPOT_NODES,
  WORLDWIDE_FIRMS_POINTS,
  latLonToVector3,
  vector3ToLatLon,
  latLonToGlobeRotation,
  findNearestHotspotNode,
  latLonToTileXYZ,
  getNasaGibsTileUrl,
  computeAtmosphericCloudPhysics,
  computeTemporalThermalState,
  computeZoomTileLevel,
  computeGpuShaderLodAndDisplacement,
  computeDayNightTerminatorShaderState,
} from '../utils/telemetryLogic';

export interface EarthGlobeHandle {
  pointOfView: (
    pov?: { lat: number; lng: number; altitude?: number; label?: string } | null,
    transitionMs?: number
  ) => void;
  getTileUrlForCoords: (lat: number, lng: number, zoom?: number) => string;
}

interface EarthGlobeCanvasProps {
  selectedHotspotId: string | null;
  onSelectHotspot: (id: string | null) => void;
  onZoomSectorChange?: (sectorId: string | null) => void;
  onZoomTelemetryChange?: (
    coords: { lat: number; lon: number; zoom: number } | null
  ) => void;
  activeTab: NavTab;
  adjustOrbitEnabled: boolean;
  targetPointOfView?: PointOfViewTarget | null;
  activeLayerMode?: NasaGibsLayerMode;
  minimalCloudOpacity?: number;
  cloudPhysicsParams?: {
    cloudCoverPct?: number;
    windSpeedKmh?: number;
    precipitationMm?: number;
    waveSurgeM?: number;
    phenomenon?: string;
    targetLat?: number;
    targetLon?: number;
  };
  timelineDay?: number;
  isSearchSubmitted?: boolean;
  backgroundColor?: string;
  globeTileEngineUrl?: (x: number, y: number, level: number) => string;
  pointsData?: FirmsAnomalyPoint[];
  pointsMerge?: boolean;
  ringsData?: HotspotNode[];
  arcsData?: TelemetryArcDatum[];
  labelsData?: HotspotNode[];
}

const GLOBE_LABEL_NODES: HotspotNode[] = HOTSPOT_NODES;

const CACHED_LABEL_VECTORS: THREE.Vector3[] = GLOBE_LABEL_NODES.map((node) => {
  const p = latLonToVector3(node.lat, node.lon, 1.004);
  return new THREE.Vector3(p.x, p.y, p.z);
});

export const EarthGlobeCanvas = forwardRef<
  EarthGlobeHandle,
  EarthGlobeCanvasProps
>(
  (
    {
      onSelectHotspot,
      onZoomSectorChange,
      onZoomTelemetryChange,
      activeTab,
      targetPointOfView = null,
      activeLayerMode = 'VIIRS_NIGHT_THERMAL',
      minimalCloudOpacity = 0.65,
      cloudPhysicsParams,
      timelineDay = 28,
      isSearchSubmitted = false,
      globeTileEngineUrl,
      pointsData = WORLDWIDE_FIRMS_POINTS,
      pointsMerge = true,
    },
    ref
  ) => {
    const canvasMountRef = useRef<HTMLDivElement | null>(null);
    const activeTabRef = useRef<NavTab>(activeTab);
    activeTabRef.current = activeTab;

    const activeLayerModeRef = useRef<NasaGibsLayerMode>(activeLayerMode);
    activeLayerModeRef.current = activeLayerMode;

    const cloudPhysicsParamsRef = useRef(cloudPhysicsParams);
    cloudPhysicsParamsRef.current = cloudPhysicsParams;

    const minimalCloudOpacityRef = useRef<number>(minimalCloudOpacity);
    minimalCloudOpacityRef.current = minimalCloudOpacity;

    const timelineDayRef = useRef<number>(timelineDay);
    timelineDayRef.current = timelineDay;

    const pointsDataRef = useRef<FirmsAnomalyPoint[]>(pointsData);
    pointsDataRef.current = pointsData;

    const onSelectHotspotRef = useRef(onSelectHotspot);
    onSelectHotspotRef.current = onSelectHotspot;

    const onZoomSectorChangeRef = useRef(onZoomSectorChange);
    onZoomSectorChangeRef.current = onZoomSectorChange;

    const onZoomTelemetryChangeRef = useRef(onZoomTelemetryChange);
    onZoomTelemetryChangeRef.current = onZoomTelemetryChange;

    const lastZoomSectorIdRef = useRef<string | null>(null);
    const lastZoomTelemetryKeyRef = useRef<string>('');
    const zoomSectorDebounceRef = useRef<number | null>(null);
    const zoomTelemetryDebounceRef = useRef<number | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const currentShiftRef = useRef<number>(0);
    const targetShiftRef = useRef<number>(0);
    const isSearchSubmittedRef = useRef<boolean>(isSearchSubmitted);
    isSearchSubmittedRef.current = isSearchSubmitted;

    useEffect(() => {
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 640;
      const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
      targetShiftRef.current = isSearchSubmitted && isDesktop
        ? -Math.round(Math.min(540, w * 0.36) / 2)
        : 0;
    }, [isSearchSubmitted]);

    // Direct DOM refs for 60 FPS projected city labels without React re-renders
    const labelItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const activePinRef = useRef<HTMLDivElement | null>(null);
    const activePinTitleRef = useRef<HTMLSpanElement | null>(null);

    // Smooth camera fly-to animation state (includes camera X/Y/Z reset so OrbitControls never offsets target)
    const povAnimRef = useRef<{
      active: boolean;
      locked: boolean;
      startTime: number;
      durationMs: number;
      startRotX: number;
      startRotY: number;
      startCamX: number;
      startCamY: number;
      startCamZ: number;
      targetRotX: number;
      targetRotY: number;
      targetCamZ: number;
      targetLat: number;
      targetLng: number;
      label: string;
    }>({
      active: false,
      locked: false,
      startTime: 0,
      durationMs: 1800,
      startRotX: 0.23,
      startRotY: -2.93,
      startCamX: 0,
      startCamY: 0,
      startCamZ: 4.22,
      targetRotX: 0.23,
      targetRotY: -2.93,
      targetCamZ: 4.22,
      targetLat: 13.0827,
      targetLng: 80.2707,
      label: 'Chennai, Tamil Nadu',
    });

    const userInteractingRef = useRef(false);

    // Imperative trigger function populated once Three.js scene mounts
    const pointOfViewTriggerRef = useRef<
      (
        pov: {
          lat: number;
          lng: number;
          altitude?: number;
          label?: string;
        } | null,
        durationMs?: number
      ) => void
    >(() => {});

    useImperativeHandle(
      ref,
      () => ({
        pointOfView: (pov, transitionMs = 2000) => {
          if (!pov) {
            pointOfViewTriggerRef.current(null, transitionMs);
            return;
          }
          const fallbackName = findNearestHotspotNode(pov.lat, pov.lng).node.name;
          pointOfViewTriggerRef.current(
            {
              lat: pov.lat,
              lng: pov.lng,
              altitude: pov.altitude ?? 1.38,
              label: pov.label || fallbackName,
            },
            transitionMs
          );
        },
        getTileUrlForCoords: (lat, lng, zoom = 5) => {
          const { x, y, z } = latLonToTileXYZ(lat, lng, zoom);
          return globeTileEngineUrl
            ? globeTileEngineUrl(x, y, z)
            : getNasaGibsTileUrl(x, y, z, activeLayerModeRef.current);
        },
      }),
      [globeTileEngineUrl]
    );

    // Trigger smooth fly-to whenever targetPointOfView prop changes
    useEffect(() => {
      if (targetPointOfView) {
        pointOfViewTriggerRef.current(
          {
            lat: targetPointOfView.lat,
            lng: targetPointOfView.lng,
            altitude: targetPointOfView.altitude,
            label: targetPointOfView.label,
          },
          1800
        );
      } else {
        pointOfViewTriggerRef.current(null, 1800);
      }
    }, [targetPointOfView]);

    useEffect(() => {
      const container = canvasMountRef.current;
      if (!container) return;

      const isSoftwareGl = (() => {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        const gpu = dbg
          ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
          : '';
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      })();

      let width = container.clientWidth || window.innerWidth || 1440;
      let height = container.clientHeight || window.innerHeight || 900;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.005, 100);
      cameraRef.current = camera;
      camera.position.set(0, 0, 4.22);
      // True spherical optical centering without skewed projection
      camera.clearViewOffset();

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      // Capped at 1.25 max for silky 60fps zero-lag fill rate even on low-end / high-DPI devices
      renderer.setPixelRatio(
        isSoftwareGl ? 0.75 : Math.min(window.devicePixelRatio || 1, 1.25)
      );
      renderer.setSize(width, height);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.minDistance = 1.15;
      controls.maxDistance = 6.2;
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.07;
      controls.rotateSpeed = 0.6;
      controls.zoomSpeed = 1.6;

      const onStart = () => {
        userInteractingRef.current = true;
        povAnimRef.current.active = false;
      };
      const onEnd = () => {
        userInteractingRef.current = false;
      };
      controls.addEventListener('start', onStart);
      controls.addEventListener('end', onEnd);

      // Allow mouse-wheel zooming even when cursor hovers over HUD overlays on desktop (let mobile scroll the page naturally)
      const onWindowWheel = (e: WheelEvent) => {
        if (window.innerWidth < 640) return;
        const target = e.target as HTMLElement | null;
        if (!target) return;
        if (target === renderer.domElement) return; // OrbitControls already handles canvas wheel directly
        if (target.closest('.sata-sidebar-scroll')) return; // Let scrollable menus scroll normally
        e.preventDefault();
        povAnimRef.current.active = false;
        const zoomDelta = Math.sign(e.deltaY) * 0.24;
        const curLen = camera.position.length();
        const nextLen = Math.max(
          controls.minDistance,
          Math.min(controls.maxDistance, curLen + zoomDelta)
        );
        camera.position.setLength(nextLen);
      };
      window.addEventListener('wheel', onWindowWheel, { passive: false });

      // Double-click on globe smoothly toggles zoom in / reset
      const onDoubleClick = () => {
        const curDist = camera.position.length();
        const targetDist = curDist > 2.0 ? 1.25 : 4.22;
        povAnimRef.current = {
          ...povAnimRef.current,
          active: true,
          startTime: performance.now(),
          durationMs: 750,
          startRotX: earthGroup.rotation.x,
          startRotY: earthGroup.rotation.y,
          startCamX: camera.position.x,
          startCamY: camera.position.y,
          startCamZ: camera.position.z,
          targetRotX: earthGroup.rotation.x,
          targetRotY: earthGroup.rotation.y,
          targetCamZ: targetDist,
        };
      };
      renderer.domElement.addEventListener('dblclick', onDoubleClick);

      const earthGroup = new THREE.Group();
      // Initial orientation centered on India / South Asia (78°E, 13°N)
      earthGroup.rotation.set(0.23, -2.93, 0.0);
      scene.add(earthGroup);

      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
      const texLoader = new THREE.TextureLoader();

      const configureTex = (tex: THREE.Texture) => {
        tex.anisotropy = maxAnisotropy;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      };

      const initialTerminator = computeDayNightTerminatorShaderState(Date.now());

      // Orbital directional sunlight opposite to the dark night side + deep-space ambient fill
      const sunDirectionalLight = new THREE.DirectionalLight(0xfff6e5, 1.35);
      sunDirectionalLight.position.set(
        initialTerminator.sunVector.x * 8.0,
        initialTerminator.sunVector.y * 8.0,
        initialTerminator.sunVector.z * 8.0
      );
      earthGroup.add(sunDirectionalLight);
      const orbitalAmbientLight = new THREE.AmbientLight(0x071a38, 0.32);
      earthGroup.add(orbitalAmbientLight);

      // Real-Time Digital Twin Earth Surface Shader:
      // - Deep Orbital Bathymetry Gradient (#04152d -> #072247 open ocean, #0d5c75 / #147a94 coastal shelf)
      // - Physically-based Fresnel & Dual-Lobe Blinn-Phong Solar Specular Glint (pow 12.0 & pow 64.0) over water
      // - Cloud drop-shadow (cloudShadow) for 3D orbital depth beneath cloudShellMat
      // - Crisp NASA VIIRS city lights from earth_lights_2048.png on the night hemisphere
      // - Live Astronomical Day / Morning / Evening / Night Solar Terminator (uSunDir)
      const earthSurfaceMat = new THREE.ShaderMaterial({
        uniforms: {
          uNightMap: { value: null },
          uDayMap: { value: null },
          uNormalMap: { value: null },
          uLightsMap: { value: null },
          uCloudMap: { value: null },
          uHasNight: { value: 0.0 },
          uHasDay: { value: 0.0 },
          uHasNormal: { value: 0.0 },
          uHasLights: { value: 0.0 },
          uHasCloud: { value: 0.0 },
          uDayMix: { value: 0.0 },
          uZoomDetail: { value: 0.0 },
          uTileInterpMix: { value: 0.0 },
          uDisplacementScale: { value: 0.0 },
          uModisTrueColorBlend: { value: 0.0 },
          uCloudOpacity: { value: 0.14 },
          uCloudOffset: { value: 0.0 },
          uThermalIntensity: { value: 1.0 },
          uThermalPhase: { value: 0.0 },
          uTerminatorSoftness: { value: initialTerminator.terminatorSoftness },
          uSunlitRadiance: { value: initialTerminator.sunlitRadiance },
          uNightShadowContrast: { value: initialTerminator.nightShadowContrast },
          uSunDir: {
            value: new THREE.Vector3(
              initialTerminator.sunVector.x,
              initialTerminator.sunVector.y,
              initialTerminator.sunVector.z
            ),
          },
          uHighResMap: { value: null },
          uHasHighRes: { value: 0.0 },
          uHighResCenterUv: { value: new THREE.Vector2(0.5, 0.5) },
          uHighResRadius: { value: 0.09 },
          uHighResAlpha: { value: 0.0 },
          uTsunamiCenter: { value: new THREE.Vector2(0.0, 0.0) },
          uTsunamiWavePhase: { value: 0.0 },
          uTsunamiSurge: { value: 0.0 },
          uRainStormIntensity: { value: 0.0 },
          uIrThermalMode: { value: 0.0 },
        },
        vertexShader: `
          uniform sampler2D uDayMap;
          uniform sampler2D uNormalMap;
          uniform float uHasDay;
          uniform float uHasNormal;
          uniform float uDisplacementScale;
          uniform vec3 uSunDir;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vLocalNormal;
          varying vec3 vViewPos;
          varying vec3 vViewSunDir;
          varying float vElevation;
          void main() {
            vUv = uv;
            vec3 sphereDir = normalize(position);
            vLocalNormal = sphereDir;
            vViewSunDir = normalize(normalMatrix * normalize(uSunDir));

            // High-resolution terrain displacement using NASA GIBS MODIS True Color layer
            float elev = 0.0;
            if (uHasDay > 0.5 && uDisplacementScale > 0.0001) {
              vec3 modisRgb = texture2D(uDayMap, uv).rgb;
              float maxRG = max(modisRgb.r * 1.15, modisRgb.g * 0.96);
              float landMaskV = smoothstep(-0.015, 0.055, maxRG - modisRgb.b * 0.88) * smoothstep(0.035, 0.085, max(modisRgb.r, modisRgb.g));
              float reliefLum = clamp(dot(modisRgb, vec3(0.38, 0.46, 0.16)) * 1.45 - modisRgb.b * 0.52, 0.0, 1.0);
              if (uHasNormal > 0.5) {
                vec3 nSample = texture2D(uNormalMap, uv).xyz * 2.0 - 1.0;
                reliefLum = clamp(reliefLum + length(nSample.xy) * 0.35, 0.0, 1.25);
              }
              elev = reliefLum * landMaskV;
            }
            vElevation = elev;
            vec3 displacedPos = position + sphereDir * (elev * uDisplacementScale);

            vNormal = normalize(normalMatrix * sphereDir);
            vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
            vViewPos = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform sampler2D uNightMap;
          uniform sampler2D uDayMap;
          uniform sampler2D uNormalMap;
          uniform sampler2D uLightsMap;
          uniform sampler2D uCloudMap;
          uniform float uHasNight;
          uniform float uHasDay;
          uniform float uHasNormal;
          uniform float uHasLights;
          uniform float uHasCloud;
          uniform float uDayMix;
          uniform float uZoomDetail;
          uniform float uTileInterpMix;
          uniform float uDisplacementScale;
          uniform float uModisTrueColorBlend;
          uniform float uCloudOpacity;
          uniform float uCloudOffset;
          uniform float uThermalIntensity;
          uniform float uThermalPhase;
          uniform float uTerminatorSoftness;
          uniform float uSunlitRadiance;
          uniform float uNightShadowContrast;
          uniform vec3 uSunDir;
          uniform sampler2D uHighResMap;
          uniform float uHasHighRes;
          uniform vec2 uHighResCenterUv;
          uniform float uHighResRadius;
          uniform float uHighResAlpha;
          uniform vec2 uTsunamiCenter;
          uniform float uTsunamiWavePhase;
          uniform float uTsunamiSurge;
          uniform float uRainStormIntensity;
          uniform float uIrThermalMode;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vLocalNormal;
          varying vec3 vViewPos;
          varying vec3 vViewSunDir;
          varying float vElevation;

          // Hardware-accelerated GPU Tile Texture lookup (Zero Stall, 60+ FPS Locked)
          vec3 interpolateGpuTileTexture(sampler2D tex, vec2 uv, vec2 invRes, float interpMix) {
            return texture2D(tex, uv).rgb;
          }

          float hash21Surf(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * 0.1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
          }

          float noise2DSurf(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash21Surf(i + vec2(0.0, 0.0)), hash21Surf(i + vec2(1.0, 0.0)), u.x),
              mix(hash21Surf(i + vec2(0.0, 1.0)), hash21Surf(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          float fbmSurfCloud(vec2 p) {
            float v = 0.58 * noise2DSurf(p);
            mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
            p = rot * p * 2.07 + vec2(1.73, 4.91);
            v += 0.34 * noise2DSurf(p);
            return v;
          }

          // Clean land vs ocean discriminator from NASA Blue Marble RGB ratios:
          // All oceans have R/B <= 0.42; all continents (including dark Amazon/Congo rainforests) have R/B >= 0.48
          float evalDayLandMask(vec3 rgb) {
            float rb = rgb.r / max(rgb.b, 0.01);
            float gb = rgb.g / max(rgb.b, 0.01);
            return smoothstep(0.435, 0.525, rb) * smoothstep(0.595, 0.645, gb);
          }

          float sampleDayLandAt(vec2 uv) {
            vec3 c = texture2D(uDayMap, vec2(uv.x, clamp(uv.y, 0.01, 0.99))).rgb;
            return evalDayLandMask(c);
          }

          // Smooth elliptical island & archipelago SDF helper in (lat, lon) degrees
          float islandSpot(vec2 latLon, vec2 centerLatLon, vec2 radiiDeg) {
            vec2 d = (latLon - centerLatLon) / radiiDeg;
            float r2 = dot(d, d);
            return clamp(1.0 - smoothstep(0.35, 1.0, r2), 0.0, 1.0);
          }

          // Bounding-box gated geographic Signed Distance Field for small islands & coastal archipelagos
          float computeSmallIslandField(vec2 latLon, float coastalNoise, float zoomAmt) {
            if (zoomAmt < 0.04 || latLon.x < -1.5 || latLon.x > 34.5) return 0.0;
            float m = 0.0;
            // Indian Ocean, Lakshadweep, Maldives, Andaman & Nicobar, Coastal India & Sri Lanka
            if (latLon.y > 68.5 && latLon.y < 94.5) {
              // Lakshadweep Archipelago (Kavaratti, Agatti, Amini, Andrott, Kalpeni, Minicoy)
              if (latLon.x > 7.8 && latLon.x < 12.2 && latLon.y > 71.5 && latLon.y < 74.2) {
                m = max(m, islandSpot(latLon, vec2(10.566, 72.641), vec2(0.11, 0.09)));
                m = max(m, islandSpot(latLon, vec2(10.858, 72.193), vec2(0.10, 0.08)));
                m = max(m, islandSpot(latLon, vec2(11.121, 72.725), vec2(0.09, 0.09)));
                m = max(m, islandSpot(latLon, vec2(10.816, 73.675), vec2(0.10, 0.11)));
                m = max(m, islandSpot(latLon, vec2(10.082, 73.645), vec2(0.09, 0.08)));
                m = max(m, islandSpot(latLon, vec2(8.283, 73.033), vec2(0.11, 0.10)));
              }
              // Maldives Coral Atoll Chain (Malé, Ari, Baa, Addu)
              if (latLon.x > -1.0 && latLon.x < 7.3 && latLon.y > 72.5 && latLon.y < 74.0) {
                m = max(m, islandSpot(latLon, vec2(4.175, 73.509), vec2(0.16, 0.12)));
                m = max(m, islandSpot(latLon, vec2(5.165, 73.050), vec2(0.15, 0.12)));
                m = max(m, islandSpot(latLon, vec2(3.850, 72.820), vec2(0.16, 0.11)));
                m = max(m, islandSpot(latLon, vec2(2.020, 73.320), vec2(0.15, 0.11)));
                m = max(m, islandSpot(latLon, vec2(-0.630, 73.158), vec2(0.13, 0.12)));
              }
              // Andaman & Nicobar Archipelago (North/Middle/South Andaman, Swaraj Dweep, Little Andaman, Car Nicobar, Great Nicobar)
              if (latLon.x > 6.5 && latLon.x < 13.8 && latLon.y > 92.0 && latLon.y < 94.3) {
                m = max(m, islandSpot(latLon, vec2(13.220, 92.930), vec2(0.36, 0.16)));
                m = max(m, islandSpot(latLon, vec2(12.500, 92.840), vec2(0.42, 0.17)));
                m = max(m, islandSpot(latLon, vec2(11.740, 92.710), vec2(0.38, 0.16)));
                m = max(m, islandSpot(latLon, vec2(11.976, 92.987), vec2(0.13, 0.11)));
                m = max(m, islandSpot(latLon, vec2(10.720, 92.480), vec2(0.24, 0.16)));
                m = max(m, islandSpot(latLon, vec2(9.160, 92.760), vec2(0.14, 0.13)));
                m = max(m, islandSpot(latLon, vec2(7.005, 93.860), vec2(0.28, 0.18)));
              }
              // Indian Coastal & Estuarine Islands (Diu, Gulf of Khambhat/Aliabet near Surat, Mumbai/Elephanta, Goa/Chorao, Rameswaram/Mannar, Sriharikota)
              if (latLon.x > 5.5 && latLon.x < 23.0 && latLon.y > 68.5 && latLon.y < 89.5) {
                m = max(m, islandSpot(latLon, vec2(20.714, 70.950), vec2(0.11, 0.15)));
                m = max(m, islandSpot(latLon, vec2(21.630, 72.690), vec2(0.10, 0.14)));
                m = max(m, islandSpot(latLon, vec2(18.963, 72.931), vec2(0.08, 0.08)));
                m = max(m, islandSpot(latLon, vec2(15.525, 73.865), vec2(0.09, 0.09)));
                m = max(m, islandSpot(latLon, vec2(9.288, 79.313), vec2(0.12, 0.18)));
                m = max(m, islandSpot(latLon, vec2(9.055, 79.820), vec2(0.12, 0.18)));
                m = max(m, islandSpot(latLon, vec2(9.660, 80.025), vec2(0.22, 0.20)));
                m = max(m, islandSpot(latLon, vec2(13.720, 80.220), vec2(0.16, 0.09)));
                m = max(m, islandSpot(latLon, vec2(21.750, 88.120), vec2(0.16, 0.12)));
              }
            } else {
              // Global Island Hubs (Singapore, Hong Kong, Okinawa, Jeju, Hawaii)
              m = max(m, islandSpot(latLon, vec2(1.352, 103.820), vec2(0.18, 0.24)));
              m = max(m, islandSpot(latLon, vec2(22.280, 114.160), vec2(0.16, 0.18)));
              m = max(m, islandSpot(latLon, vec2(26.480, 127.940), vec2(0.32, 0.15)));
              m = max(m, islandSpot(latLon, vec2(33.380, 126.550), vec2(0.20, 0.32)));
              m = max(m, islandSpot(latLon, vec2(19.600, -155.500), vec2(0.45, 0.45)));
            }
            return clamp(m + (m > 0.05 ? (coastalNoise - 0.5) * 0.15 : 0.0), 0.0, 1.0);
          }

          void main() {
            vec3 viewDir = normalize(vViewPos);
            vec3 normal = normalize(vNormal);
            vec3 viewSunDir = normalize(vViewSunDir);
            float viewDot = max(dot(normal, viewDir), 0.0);
            float rim = 1.0 - viewDot;

            vec3 locN = normalize(vLocalNormal);
            vec2 fragLatLon = vec2(
              asin(clamp(locN.y, -1.0, 1.0)) * 57.2957795,
              atan(-locN.z, locN.x) * 57.2957795
            );

            // Real-time UTC astronomical day/night solar terminator at this coordinate on Earth:
            // Smoothly separates sunlit and shadowed hemispheres with a clean Rayleigh twilight transition
            vec3 sunDir = normalize(uSunDir);
            float sunDot = dot(locN, sunDir);
            float sunDiffuse = clamp(sunDot, 0.0, 1.0);
            float realTimeDaylight = smoothstep(-uTerminatorSoftness, uTerminatorSoftness * 1.35, sunDot);
            float nightShadowMask = 1.0 - realTimeDaylight;
            float terminatorBand = exp(-pow((sunDot - 0.01) / max(0.08, uTerminatorSoftness * 0.55), 2.0));

            // Zero-overhead analytical micro-detail (60 FPS locked on zoom)
            float microTerrainNoise = 0.5 + (sin(vUv.x * 2400.0 + vUv.y * 1200.0) * 0.06);
            vec2 invRes = vec2(1.0 / 2048.0, 1.0 / 1024.0);

            float relief = 1.0;
            if (uHasNormal > 0.5) {
              vec3 nTex = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
              vec3 microN = vec3((microTerrainNoise - 0.5) * 0.24, (0.5 - microTerrainNoise) * 0.24, 0.0) * uZoomDetail;
              vec3 lightDir = normalize(mix(vec3(0.52, 0.36, 0.77), viewSunDir, 0.58));
              relief = clamp(
                0.84 + 0.42 * dot(normalize(normal + (nTex + microN) * (0.42 + uZoomDetail * 0.42)), lightDir),
                0.68,
                1.34
              );
            }

            // Smooth Land vs. Ocean Classification (100% immune to open-ocean JPEG compression blocks)
            vec3 dayCol = vec3(0.016, 0.082, 0.176);
            float dayLandMask = 0.0;
            float nearCoastInner = 0.0;
            float nearCoastOuter = 0.0;
            float turquoiseShelfSignal = 0.0;
            float modisTerrainElev = vElevation;
            if (uHasDay > 0.5) {
              dayCol = interpolateGpuTileTexture(uDayMap, vUv, invRes, uTileInterpMix);
              dayLandMask = evalDayLandMask(dayCol);

              // High-speed analytical coastal continental-shelf distance
              vec2 r1 = vec2(0.0036, 0.0036);
              nearCoastInner = 0.5 * (
                sampleDayLandAt(vUv + r1) +
                sampleDayLandAt(vUv - r1)
              );
              nearCoastOuter = nearCoastInner;
              // Natural turquoise shallow water signal (Bahamas, Red Sea, Persian Gulf, Sunda Shelf, Palk Strait)
              turquoiseShelfSignal = clamp((dayCol.g / max(dayCol.b, 0.01) - 0.585) * 8.5, 0.0, 1.0);
            }

            vec3 lightsRaw = vec3(0.0);
            float lightsLandMask = 0.0;
            if (uHasLights > 0.5) {
              lightsRaw = interpolateGpuTileTexture(uLightsMap, vUv, invRes, uTileInterpMix);
              // Ocean in earth_lights_2048.png is <= 16/255 (0.0627); continents (incl. Amazon/Congo) are >= 24/255 (0.0941)
              lightsLandMask = smoothstep(0.068, 0.088, lightsRaw.b);
            }

            float rawLandField = clamp(max(dayLandMask, lightsLandMask) + nearCoastInner * 0.15 * max(dayLandMask, lightsLandMask), 0.0, 1.0);

            if (uHasDay > 0.5) {
              modisTerrainElev = max(
                vElevation,
                clamp(dot(dayCol, vec3(0.38, 0.46, 0.16)) * 1.45 - dayCol.b * 0.52, 0.0, 1.0) * rawLandField
              );
            }

            float islandField = computeSmallIslandField(fragLatLon, microTerrainNoise, uZoomDetail);
            float combinedLandField = max(
              rawLandField + (microTerrainNoise - 0.5) * 0.06 * uZoomDetail * smoothstep(0.10, 0.90, rawLandField),
              islandField
            );

            // Smooth anti-aliased coastline transition
            float coastLow = mix(0.22, 0.34, uZoomDetail);
            float coastHigh = mix(0.74, 0.44, uZoomDetail);
            float landMask = smoothstep(coastLow, coastHigh, combinedLandField);
            float waterMask = 1.0 - landMask;

            // Coastal shallow water / continental shelf littoral zone (#0d5c75 -> #147a94) near coastlines
            float shelfRing = clamp(nearCoastInner * 0.82 + nearCoastOuter * 0.48 + islandField * 0.65, 0.0, 1.0);
            float coastalShelfMask = clamp(
              shelfRing * 0.78 + turquoiseShelfSignal * (0.28 + 0.72 * clamp(nearCoastInner + nearCoastOuter, 0.0, 1.0)),
              0.0,
              1.0
            ) * waterMask;

            // Multi-Stop Deep Orbital Bathymetry Gradient:
            // - Night ocean: Deep obsidian-sapphire (#01040c -> #03112b)
            // - Deep open sunlit ocean: Rich abyssal sapphire-navy (#04152d -> #072247) hiding raw JPEG compression blocks
            // - Coastal shallow water / continental shelf: Subtle turquoise-cyan littoral glow (#0d5c75 -> #147a94)
            vec3 nightOcean = mix(
              vec3(0.002, 0.007, 0.020),
              vec3(0.009, 0.036, 0.092),
              pow(rim, 1.55) * 0.85
            );
            float sunElev = pow(sunDiffuse, 0.70);
            float bathyGrad = clamp(0.30 + 0.70 * sunElev, 0.0, 1.0);
            vec3 abyssalDeepNavy = vec3(0.0157, 0.0824, 0.1765);    // #04152d
            vec3 sunlitSapphireNavy = vec3(0.0275, 0.1333, 0.2784); // #072247
            vec3 openOceanDay = mix(abyssalDeepNavy, sunlitSapphireNavy, bathyGrad);

            vec3 shelfTealDeep = vec3(0.0510, 0.3608, 0.4588);      // #0d5c75
            vec3 shelfTurquoise = vec3(0.0784, 0.4784, 0.5804);     // #147a94
            vec3 coastalShallowDay = mix(shelfTealDeep, shelfTurquoise, clamp(nearCoastInner * 0.70 + sunElev * 0.30, 0.0, 1.0));

            vec3 sunlitOceanBase = mix(
              openOceanDay,
              coastalShallowDay,
              coastalShelfMask * (0.55 + 0.30 * sunElev)
            );

            // Dynamic Tsunami Ocean Wave Displacement Simulation
            if (uTsunamiSurge > 0.01) {
              vec2 dLatLon = fragLatLon - uTsunamiCenter;
              float distDeg = length(dLatLon);
              // Radial outward wave expansion across ocean bathymetry
              float waveFront = distDeg * 0.075 - uTsunamiWavePhase * 1.8;
              float wave = sin(waveFront * 6.28318) * exp(-distDeg * 0.035) * smoothstep(0.0, 1.0, uTsunamiWavePhase * 2.2 - distDeg * 0.02);
              float waveCrest = clamp(wave, 0.0, 1.0) * waterMask * uTsunamiSurge;
              sunlitOceanBase += vec3(0.18, 0.78, 0.98) * waveCrest * 2.4;
            }

            // Real-Time Precipitation & Rainstorm Surface Interaction over Water (Zero GPU Fillrate Cost)
            if (uRainStormIntensity > 0.01) {
              vec2 dLatLon = fragLatLon - uTsunamiCenter;
              float distDeg = length(dLatLon);
              float stormRadius = 14.0;
              if (distDeg < stormRadius) {
                float stormMask = smoothstep(stormRadius, 2.0, distDeg) * uRainStormIntensity;
                float rainSheet = (sin(vUv.y * 360.0 + uCloudOffset * 30.0) * cos(vUv.x * 240.0) * 0.5 + 0.5) * stormMask;
                sunlitOceanBase += vec3(0.25, 0.55, 0.85) * rainSheet * 0.6;
              }
            }

            // Physically-based Fresnel & Dual-Lobe Blinn-Phong Solar Specular Glint (strictly over water)
            vec3 halfVec = normalize(viewSunDir + viewDir);
            float ndoth = max(dot(normal, halfVec), 0.0);
            float waterFresnel = 0.04 + 0.96 * pow(clamp(1.0 - viewDot, 0.0, 1.0), 4.0);
            float wideAtmoSheen = pow(ndoth, 12.0) * smoothstep(-0.08, 0.35, sunDot);
            float crispSolarGlint = pow(ndoth, 64.0) * smoothstep(0.0, 0.40, sunDot);

            // Subtle fluid dynamic water ripples and specular sheen when zoomed into ocean:
            vec2 waterWaveUv = vUv * mix(360.0, 1400.0, uZoomDetail) + vec2(uCloudOffset * 0.22, uCloudOffset * 0.16);
            float wave1 = sin(waterWaveUv.x * 6.28318 + waterWaveUv.y * 3.14159 + uCloudOffset * 0.40);
            float wave2 = cos(waterWaveUv.x * 4.10 - waterWaveUv.y * 5.20 - uCloudOffset * 0.30);
            float fluidWave = (wave1 + wave2) * 0.5;
            
            // Subtle wave normal perturbation strictly on water when zoomed in:
            vec3 waterPerturbedNormal = normalize(normal + vec3(fluidWave * 0.035, fluidWave * 0.025, 0.0) * waterMask * smoothstep(0.08, 0.75, uZoomDetail));
            float waterNdotH = max(dot(waterPerturbedNormal, halfVec), 0.0);
            float waterFluidSpecular = pow(waterNdotH, 36.0) * (0.18 + 0.32 * waterFresnel) * waterMask * smoothstep(0.06, 0.70, uZoomDetail);

            // Subtle living water depth gradient and specular highlights (60 FPS, zero texture cost):
            vec3 fluidWaterDepthSheen = vec3(0.03, 0.15, 0.32) * (1.0 + fluidWave * 0.14) * waterMask * smoothstep(0.12, 0.85, uZoomDetail);
            sunlitOceanBase += fluidWaterDepthSheen;

            vec3 oceanSunSpecular =
              (vec3(0.12, 0.42, 0.76) * wideAtmoSheen * (0.26 + 0.22 * waterFresnel) +
               vec3(0.96, 0.93, 0.84) * crispSolarGlint * 0.44 +
               vec3(0.70, 0.88, 1.0) * waterFluidSpecular * 0.50) *
              waterMask;

            vec3 sunlitOcean = sunlitOceanBase + oceanSunSpecular;
            vec3 deepOcean = mix(
              nightOcean,
              sunlitOcean,
              clamp(realTimeDaylight * uSunlitRadiance, 0.0, 1.0)
            );
            // Smooth Rayleigh & warm sunrise/sunset horizon scattering along the day/night terminator over oceans
            vec3 oceanTwilight = mix(
              vec3(0.03, 0.13, 0.32),
              vec3(0.22, 0.13, 0.08),
              smoothstep(-0.10, 0.12, sunDot)
            );
            deepOcean += oceanTwilight * terminatorBand * 0.34;
            vec3 finalCol = deepOcean;

            // Enhance relief with high-resolution MODIS True Color displacement height
            float displacedRelief = relief * (1.0 + modisTerrainElev * (uDisplacementScale * 18.0 + uZoomDetail * 0.22));

            // Crisp vector shoreline contour along all continents & small islands when zoomed in
            float coastlineBand =
              smoothstep(0.28, 0.40, combinedLandField) *
              (1.0 - smoothstep(0.40, 0.54, combinedLandField)) *
              uZoomDetail;

            vec3 goldLight = vec3(0.0);
            if (uHasLights > 0.5) {
              // Distinct, ultra-clean land & small-island surface relief separating night shadow and sunlit day
              vec3 nightContinent = mix(
                vec3(0.007, 0.015, 0.034),
                vec3(0.022, 0.048, 0.086),
                uZoomDetail * (0.55 + 0.45 * microTerrainNoise) + realTimeDaylight * 0.22
              ) * displacedRelief;
              finalCol = mix(deepOcean, nightContinent, landMask);

              // Crisp coastline rim highlight only on land & small-island boundaries when zoomed in
              finalCol += vec3(0.12, 0.40, 0.66) * coastlineBand * 0.72;

              // Blend SATA high-contrast arterial network (uNightMap) with VIIRS lights (uLightsMap)
              vec3 sataLights = uHasNight > 0.5 ? interpolateGpuTileTexture(uNightMap, vUv, invRes, uTileInterpMix) : lightsRaw;
              float emissionLights = max(0.0, max(lightsRaw.r, lightsRaw.g) - lightsRaw.b * 0.50);
              float emissionSata = max(0.0, max(sataLights.r, sataLights.g) - sataLights.b * 0.55);
              float emissionRaw = mix(emissionLights, max(emissionLights, emissionSata * 0.72), uZoomDetail * 0.65);

              float noiseFloor = mix(0.03, 0.072, uZoomDetail);
              float cityCore = smoothstep(noiseFloor, 0.62, emissionRaw);
              float cityHalo = smoothstep(mix(0.006, 0.038, uZoomDetail), 0.28, emissionRaw);

              float filamentDetail = 0.86 + 0.14 * microTerrainNoise;
              float coreSharpness = mix(1.2, 2.05, uZoomDetail);
              float refinedCore = pow(cityCore, coreSharpness) * mix(1.0, filamentDetail * 1.18, uZoomDetail);
              float haloScale = 1.0 - uZoomDetail * 0.45;

              // 7-day temporal NASA GIBS thermal modulation across continental sectors (periodic in longitude)
              float lonRad = vUv.x * 6.2831853;
              float temporalWave = 1.0 + sin(lonRad * 7.0 + vUv.y * 30.0 + uThermalPhase) * 0.28 * clamp(abs(uThermalIntensity - 1.0) * 4.0, 0.0, 1.0);
              float thermalBoost = uThermalIntensity * temporalWave;

              // Modulate city light radiance across the day/night terminator so shadowed night regions glow richly
              // while sunlit daytime continents transition cleanly to natural solar irradiance
              float terminatorNightBoost = mix(0.06, uNightShadowContrast, pow(nightShadowMask, 1.40));

              // Strictly mask thermal & city emissions to landMask so coastal waters stay 100% clean
              float landEmissionMask = mix(1.0, landMask, smoothstep(0.08, 0.32, uZoomDetail));

              float cityZoomFade = 1.0 - smoothstep(0.12, 0.48, uZoomDetail);
              goldLight =
                (vec3(1.0, 0.56, 0.16) * cityHalo * 0.72 * haloScale * thermalBoost +
                 vec3(1.0, 0.90, 0.64) * refinedCore * 1.48 * thermalBoost) *
                landEmissionMask *
                terminatorNightBoost *
                cityZoomFade;
              finalCol += goldLight;
            }

            // Smooth transition between low-zoom orbital view and high-zoom NASA GIBS MODIS True Color terrain,
            // modulated by the real-time UTC day/night terminator and zoom inspection level
            if (uHasDay > 0.5) {
              float zoomDayBoost = smoothstep(0.10, 0.55, uZoomDetail);
              float effectiveDayMix = clamp(
                max(max(uModisTrueColorBlend, realTimeDaylight * uSunlitRadiance), zoomDayBoost),
                0.0,
                0.98
              );
              // Restore natural emerald-olive canopy hue where Blue Marble has dark bluish atmospheric haze over tropical rainforests
              float canopyMask = clamp((dayCol.b - dayCol.r) * 6.0, 0.0, 1.0) * landMask;
              vec3 canopyCorrectedDay = mix(dayCol, vec3(dayCol.r * 1.12, max(dayCol.g * 1.28, dayCol.b * 0.88), dayCol.b * 0.68), canopyMask * 0.85);
              // Soft filmic shoulder prevents high-albedo desert sands (Sahara/Arabia) from clipping
              vec3 balancedDayCol = canopyCorrectedDay / (1.0 + max(canopyCorrectedDay.r, max(canopyCorrectedDay.g, canopyCorrectedDay.b)) * 0.42);
              vec3 islandGreenTint = vec3(0.07, 0.22, 0.16) * (0.75 + 0.5 * microTerrainNoise);
              vec3 hypsometricTint = mix(
                balancedDayCol,
                balancedDayCol * vec3(1.10, 1.05, 0.94) + vec3(0.03, 0.025, 0.015) * modisTerrainElev,
                modisTerrainElev * uZoomDetail
              );
              // Multi-scale real-world satellite land synthesis on zoom:
              // Resolves sub-kilometer topographical contours, river basins, and terrain relief on land only
              float zoomLandFactor = smoothstep(0.08, 0.72, uZoomDetail);
              float microTopo = (noise2DSurf(vUv * 720.0) * 0.50 + noise2DSurf(vUv * 1920.0) * 0.32 + noise2DSurf(vUv * 5120.0) * 0.18) - 0.50;
              vec3 crispSatelliteLand = hypsometricTint * (1.0 + microTopo * 0.38 * zoomLandFactor);
              vec3 landAlbedo = mix(crispSatelliteLand, max(crispSatelliteLand, islandGreenTint), clamp(islandField * 1.5, 0.0, 1.0) * uZoomDetail);
              vec3 naturalTerrain = landAlbedo * displacedRelief * (0.72 + uZoomDetail * 0.24) + finalCol * 0.82;
              float solarLandIllum = 0.50 + 0.56 * pow(sunDiffuse, 0.65);
              vec3 sunlitTerrain =
                landAlbedo * displacedRelief * solarLandIllum * (0.98 + uZoomDetail * 0.16) +
                goldLight * 0.10;
              vec3 daySurfaceLand = mix(naturalTerrain, sunlitTerrain, realTimeDaylight);
              finalCol = mix(finalCol, daySurfaceLand, effectiveDayMix * landMask);
              // Warm golden-amber & cobalt twilight refraction along the solar terminator on land
              vec3 twilightTint = mix(vec3(0.10, 0.34, 0.70), vec3(0.58, 0.34, 0.14), smoothstep(-0.08, 0.14, sunDot));
              finalCol += twilightTint * terminatorBand * 0.18 * landMask;
            }

            // Subtle dark cloud drop-shadow offset on ocean/land directly beneath dense orbital cloud cover
            if (realTimeDaylight > 0.01 && uHasCloud > 0.5) {
              vec2 shadowUv = vec2(fract(vUv.x - 0.003), vUv.y);
              float cloudShadowVal = dot(texture2D(uCloudMap, shadowUv).rgb, vec3(0.333));
              float cloudShadow = smoothstep(0.20, 0.70, cloudShadowVal) * 0.16;
              finalCol *= (1.0 - cloudShadow * realTimeDaylight);
            }

            // Smooth Atmospheric Limb & Rayleigh Horizon:
            // Seamlessly transitions from deep ocean sapphire to electric cyan-blue at grazing horizon angle (viewDot),
            // with zero vertical banding lines across the ocean
            float sunLimbFactor = smoothstep(-0.35, 0.65, dot(normal, viewSunDir) * 0.55 + sunDot * 0.45);
            float grazingHorizon = pow(clamp(1.0 - viewDot, 0.0, 1.0), 2.85);
            vec3 limbSapphire = vec3(0.027, 0.145, 0.345);
            vec3 limbElectricCyan = vec3(0.18, 0.68, 1.0);
            vec3 atmoRim = mix(limbSapphire, limbElectricCyan, clamp(grazingHorizon * 0.65 + sunLimbFactor * 0.45, 0.0, 1.0));
            finalCol += atmoRim * grazingHorizon * (0.44 + 0.22 * realTimeDaylight);

            // Real-Time Atmospheric Precipitation & Rainstorm Over Land (Zero GPU Fillrate Cost)
            if (uRainStormIntensity > 0.01) {
              vec2 dLatLon = fragLatLon - uTsunamiCenter;
              float distDeg = length(dLatLon);
              float stormRadius = 14.0;
              if (distDeg < stormRadius) {
                float stormMask = smoothstep(stormRadius, 2.0, distDeg) * uRainStormIntensity;
                float rainSheet = (sin(vUv.y * 360.0 + uCloudOffset * 30.0) * cos(vUv.x * 240.0) * 0.5 + 0.5) * stormMask;
                finalCol = mix(finalCol, vec3(0.38, 0.58, 0.82), rainSheet * 0.35);
              }
            }

            // Dynamic High-Resolution Satellite Surface Blend
            if (uHasHighRes > 0.5 && uHighResAlpha > 0.01) {
              vec2 dUv = (vUv - uHighResCenterUv) / max(uHighResRadius, 0.001);
              if (abs(dUv.x) <= 0.5 && abs(dUv.y) <= 0.5) {
                vec2 tileUv = clamp(dUv + 0.5, 0.0, 1.0);
                vec4 highResTex = texture2D(uHighResMap, tileUv);
                float edgeMask = smoothstep(0.50, 0.40, max(abs(dUv.x), abs(dUv.y)));
                float blendAlpha = uHighResAlpha * edgeMask * highResTex.a;
                finalCol = mix(finalCol, highResTex.rgb, blendAlpha);
              }
            }

            if (uIrThermalMode > 0.01) {
              // False-color Infrared / Thermal Radiometry Look (VIIRS / Sentinel-3 SLSTR)
              float lum = dot(finalCol, vec3(0.299, 0.587, 0.114));
              vec3 thermalWarm = vec3(1.0, 0.42, 0.12) * smoothstep(0.35, 0.85, lum) * 1.4;
              vec3 thermalCool = vec3(0.08, 0.22, 0.45) * smoothstep(0.40, 0.0, lum);
              vec3 thermalMid = vec3(0.15, 0.65, 0.45) * smoothstep(0.15, 0.55, lum) * (1.0 - smoothstep(0.55, 0.85, lum));
              vec3 irRgb = thermalCool + thermalMid + thermalWarm;
              finalCol = mix(finalCol, irRgb, uIrThermalMode * 0.85);
            }

            gl_FragColor = vec4(finalCol, 1.0);
          }
        `,
      });

      // Dedicated 3D Dynamic Orbital Cloud Shell (Radius 1.007 above Earth surface)
      // - Crisp, wispy orbital cloud systems softly drifting over oceans and continents
      // - Sunlit cloud opacity in 0.28..0.38 range, twilight/night cloud opacity in 0.10..0.15 range
      const cloudShellGeo = new THREE.SphereGeometry(1.007, 48, 48);
      const cloudShellMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uCloudMap: { value: null },
          uHasCloud: { value: 0.0 },
          uAdvectionTime: { value: 0.0 },
          uCloudOpacity: { value: 0.65 },
          uMaxFragmentAlpha: { value: 0.85 },
          uSunDir: {
            value: new THREE.Vector3(
              initialTerminator.sunVector.x,
              initialTerminator.sunVector.y,
              initialTerminator.sunVector.z
            ),
          },
          uHighResMap: { value: null },
          uHasHighRes: { value: 0.0 },
          uHighResCenterUv: { value: new THREE.Vector2(0.5, 0.5) },
          uHighResRadius: { value: 0.09 },
          uHighResAlpha: { value: 0.0 },
          uTsunamiCenter: { value: new THREE.Vector2(0.0, 0.0) },
          uTsunamiWavePhase: { value: 0.0 },
          uTsunamiSurge: { value: 0.0 },
          uRainStormIntensity: { value: 0.0 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vLocalNormal;
          varying vec3 vViewPos;
          void main() {
            vUv = uv;
            vLocalNormal = normalize(position);
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPos = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform sampler2D uCloudMap;
          uniform float uHasCloud;
          uniform float uAdvectionTime;
          uniform float uCloudOpacity;
          uniform float uMaxFragmentAlpha;
          uniform vec3 uSunDir;
          uniform vec2 uTsunamiCenter;
          uniform float uRainStormIntensity;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vLocalNormal;
          varying vec3 vViewPos;

          float hash21(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * 0.1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
          }

          float noise2D(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
              mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          float fbmCloud(vec2 p) {
            float v = 0.0;
            float a = 0.55;
            mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
            for (int i = 0; i < 3; i++) {
              v += a * noise2D(p);
              p = rot * p * 2.07 + vec2(1.73, 4.91);
              a *= 0.48;
            }
            return v;
          }

          void main() {
            vec3 viewDir = normalize(vViewPos);
            vec3 normal = normalize(vNormal);
            float viewDot = max(dot(normal, viewDir), 0.0);

            // Horizon and polar atmospheric limb softness
            float horizonFade = smoothstep(0.02, 0.16, viewDot);
            float poleFade = smoothstep(0.02, 0.10, vUv.y) * (1.0 - smoothstep(0.90, 0.98, vUv.y));

            // Stable, physical spherical mapping with zero tearing or horizontal shearing
            vec2 cloudUv = vUv;

            float rawCloudDensity = 0.0;
            if (uHasCloud > 0.5) {
              vec4 cloudSample = texture2D(uCloudMap, cloudUv);
              rawCloudDensity = dot(cloudSample.rgb, vec3(0.333));
            } else {
              vec3 locDir = normalize(vLocalNormal);
              vec2 sphereUv = vec2(locDir.x * 2.5, locDir.y * 2.5);
              rawCloudDensity = fbmCloud(sphereUv);
            }

            // Natural cloud albedo and coverage
            float cloudAlpha = smoothstep(0.15, 0.70, rawCloudDensity);

            // Dynamic synoptic storm vorticity & cyclonic thickening over rainy / disturbed sectors
            if (uRainStormIntensity > 0.01) {
              float fragLat = (0.5 - vUv.y) * 180.0;
              float fragLon = (vUv.x - 0.5) * 360.0;
              vec2 dLatLon = vec2(fragLat, fragLon) - uTsunamiCenter;
              float distDeg = length(dLatLon);
              float stormRadius = 18.0;
              if (distDeg < stormRadius) {
                float stormMask = smoothstep(stormRadius, 2.0, distDeg) * uRainStormIntensity;
                float angle = atan(dLatLon.y, dLatLon.x);
                float spiral = sin(angle * 3.0 - distDeg * 0.45 + uAdvectionTime * 6.0) * 0.5 + 0.5;
                cloudAlpha = clamp(cloudAlpha + stormMask * (0.35 + 0.25 * spiral), 0.0, 1.0);
              }
            }

            // Real-time solar illumination on high-altitude cloud tops
            vec3 locDir = normalize(vLocalNormal);
            vec3 sunDir = normalize(uSunDir);
            float sunDot = dot(locDir, sunDir);
            float sunLit = smoothstep(-0.15, 0.35, sunDot);
            float twilightGlow = exp(-pow((sunDot - 0.02) / 0.18, 2.0));
            float rimLight = pow(1.0 - viewDot, 2.5);

            vec3 nightCloudCol = vec3(0.06, 0.10, 0.18);
            vec3 twilightCloudCol = vec3(0.98, 0.85, 0.72);
            vec3 dayCloudCol = vec3(1.0, 1.0, 1.0);

            vec3 cloudCol = mix(nightCloudCol, dayCloudCol, max(sunLit, rimLight * 0.45));
            cloudCol = mix(cloudCol, twilightCloudCol, twilightGlow * 0.32);

            float finalAlpha = cloudAlpha * uCloudOpacity * horizonFade * poleFade;
            finalAlpha = min(finalAlpha, uMaxFragmentAlpha);

            gl_FragColor = vec4(cloudCol, finalAlpha);
          }
        `,
      });
      const cloudShellMesh = new THREE.Mesh(cloudShellGeo, cloudShellMat);
      earthGroup.add(cloudShellMesh);

      let disposed = false;

      const earth360Tex = texLoader.load(
        NASA_GIBS_LAYERS.blackMarbleNightLights.localHighResTexture,
        (tex) => {
          if (disposed) return;
          configureTex(tex);
          earthSurfaceMat.uniforms.uNightMap.value = tex;
          earthSurfaceMat.uniforms.uHasNight.value = 1.0;
        }
      );

      const earthDayTex = texLoader.load(
        NASA_GIBS_LAYERS.trueColorTerrain.localHighResTexture,
        (tex) => {
          if (disposed) return;
          configureTex(tex);
          earthSurfaceMat.uniforms.uDayMap.value = tex;
          earthSurfaceMat.uniforms.uHasDay.value = 1.0;
        }
      );

      const earthNormalTex = texLoader.load(
        NASA_GIBS_LAYERS.trueColorTerrain.normalMapTexture,
        (tex) => {
          if (disposed) return;
          configureTex(tex);
          earthSurfaceMat.uniforms.uNormalMap.value = tex;
          earthSurfaceMat.uniforms.uHasNormal.value = 1.0;
        }
      );

      // Precomputed 64x32 CPU emission grid (populated once on texture load, zero GPU readback stall in tick)
      const emissionGridW = 64;
      const emissionGridH = 32;
      const emissionGrid = new Float32Array(emissionGridW * emissionGridH);
      let hasEmissionGrid = false;

      const earthLightsTex = texLoader.load(
        NASA_GIBS_LAYERS.blackMarbleNightLights.lightsOverlayTexture,
        (tex) => {
          if (disposed) return;
          configureTex(tex);
          earthSurfaceMat.uniforms.uLightsMap.value = tex;
          earthSurfaceMat.uniforms.uHasLights.value = 1.0;
          try {
            const img = tex.image as HTMLImageElement | undefined;
            if (img && img.width > 0) {
              const c = document.createElement('canvas');
              c.width = emissionGridW;
              c.height = emissionGridH;
              const ctx = c.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, emissionGridW, emissionGridH);
                const d = ctx.getImageData(0, 0, emissionGridW, emissionGridH).data;
                for (let i = 0; i < emissionGridW * emissionGridH; i++) {
                  const r = d[i * 4] / 255;
                  const g = d[i * 4 + 1] / 255;
                  const b = d[i * 4 + 2] / 255;
                  emissionGrid[i] = Math.max(0, Math.max(r, g) - b * 0.45);
                }
                hasEmissionGrid = true;
              }
            }
          } catch {
            // Ignore offscreen sampling fallback
          }
        }
      );

      const cloudsTex = texLoader.load(
        NASA_GIBS_LAYERS.atmosphericClouds.cloudsTexture,
        (tex) => {
          if (disposed) return;
          configureTex(tex);
          earthSurfaceMat.uniforms.uCloudMap.value = tex;
          earthSurfaceMat.uniforms.uHasCloud.value = 1.0;
          cloudShellMat.uniforms.uCloudMap.value = tex;
          cloudShellMat.uniforms.uHasCloud.value = 1.0;
        }
      );

      // Invisible Raycast Sphere for Clicking ANY Place on the 3D Globe
      const pickSphereGeo = new THREE.SphereGeometry(1.002, 24, 24);
      const pickSphereMat = new THREE.MeshBasicMaterial({ visible: false });
      const pickSphereMesh = new THREE.Mesh(pickSphereGeo, pickSphereMat);
      earthGroup.add(pickSphereMesh);

      // ============================================================================
      // Zero-Lag GPU NASA FIRMS 375m Thermal & Island Pinpoint Layer
      // Renders ultra-crisp, anti-aliased sub-pixel thermal nodes directly on land
      // and islands when zooming in — with ZERO rectangular tile patches and ZERO lag!
      // ============================================================================
      const firmsListInitial = WORLDWIDE_FIRMS_POINTS;
      const totalPinpoints = firmsListInitial.length + HOTSPOT_NODES.length;
      const pinpointPositions = new Float32Array(totalPinpoints * 3);
      const pinpointIntensities = new Float32Array(totalPinpoints);

      let pOffset = 0;
      for (let i = 0; i < firmsListInitial.length; i++) {
        const pt = firmsListInitial[i];
        const v = latLonToVector3(pt.latitude, pt.longitude, 1.0018);
        pinpointPositions[pOffset * 3] = v.x;
        pinpointPositions[pOffset * 3 + 1] = v.y;
        pinpointPositions[pOffset * 3 + 2] = v.z;
        pinpointIntensities[pOffset] = pt.intensity;
        pOffset++;
      }
      for (let i = 0; i < HOTSPOT_NODES.length; i++) {
        const node = HOTSPOT_NODES[i];
        const v = latLonToVector3(node.lat, node.lon, 1.0019);
        pinpointPositions[pOffset * 3] = v.x;
        pinpointPositions[pOffset * 3 + 1] = v.y;
        pinpointPositions[pOffset * 3 + 2] = v.z;
        pinpointIntensities[pOffset] = Math.min(1.0, 0.65 + node.intensitySpots / 120);
        pOffset++;
      }

      const firmsPointsGeo = new THREE.BufferGeometry();
      firmsPointsGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(pinpointPositions, 3)
      );
      firmsPointsGeo.setAttribute(
        'aIntensity',
        new THREE.BufferAttribute(pinpointIntensities, 1)
      );

      const firmsPointsMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uZoomAlpha: { value: 0.0 },
          uThermalScale: { value: 1.0 },
        },
        vertexShader: `
          attribute float aIntensity;
          uniform float uZoomAlpha;
          uniform float uThermalScale;
          varying float vIntensity;
          varying float vFacing;
          void main() {
            vIntensity = aIntensity * uThermalScale;
            vec3 worldNormal = normalize(normalMatrix * normalize(position));
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vec3 viewDir = normalize(-mvPosition.xyz);
            vFacing = dot(worldNormal, viewDir);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = clamp((5.5 + aIntensity * 4.5) * (2.4 / max(1.0, -mvPosition.z)), 2.0, 11.0);
          }
        `,
        fragmentShader: `
          uniform float uZoomAlpha;
          varying float vIntensity;
          varying float vFacing;
          void main() {
            if (uZoomAlpha <= 0.01 || vFacing <= 0.08) discard;
            vec2 c = gl_PointCoord - vec2(0.5);
            float r = length(c) * 2.0;
            if (r > 1.0) discard;
            float core = smoothstep(0.55, 0.0, r);
            float halo = pow(1.0 - r, 2.4) * 0.55;
            vec3 col = mix(vec3(1.0, 0.58, 0.16), vec3(1.0, 0.96, 0.82), core);
            float alpha = (core * 0.95 + halo) * uZoomAlpha * smoothstep(0.08, 0.32, vFacing) * clamp(vIntensity, 0.45, 1.25);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      });
      const firmsPointsMesh = new THREE.Points(firmsPointsGeo, firmsPointsMat);
      firmsPointsMesh.visible = false;
      earthGroup.add(firmsPointsMesh);

      // Wire native pointOfView({ lat, lng, altitude }, durationMs) controller
      pointOfViewTriggerRef.current = (pov, durationMs = 1800) => {
        if (!pov) {
          povAnimRef.current.active = false;
          povAnimRef.current.locked = false;
          return;
        }
        const { rotX, rotY } = latLonToGlobeRotation(
          pov.lat,
          pov.lng,
          pov.altitude
        );
        const currentY = earthGroup.rotation.y;
        const diffY =
          ((((rotY - currentY) % (Math.PI * 2)) + Math.PI * 3) %
            (Math.PI * 2)) -
          Math.PI;

        // Compute NASA GIBS WMTS slippy-map tile URL for the target coordinates
        const { x, y, z } = latLonToTileXYZ(pov.lat, pov.lng, 5);
        void getNasaGibsTileUrl(x, y, z, activeLayerModeRef.current);

        // Preserve user's manual zoom if they already zoomed in closer, otherwise keep clean 4.22 framing (clamped above minDistance)
        const currentDist = camera.position.length();
        const targetDist = pov.altitude ? Math.max(1.15, Math.min(4.5, pov.altitude)) : 1.35;

        povAnimRef.current = {
          active: true,
          locked: true,
          startTime: performance.now(),
          durationMs,
          startRotX: earthGroup.rotation.x,
          startRotY: currentY,
          startCamX: camera.position.x,
          startCamY: camera.position.y,
          startCamZ: camera.position.z,
          targetRotX: rotX,
          targetRotY: currentY + diffY,
          targetCamZ: targetDist,
          targetLat: pov.lat,
          targetLng: pov.lng,
          label:
            pov.label || findNearestHotspotNode(pov.lat, pov.lng).node.name,
        };
      };

      // Raycast click picking anywhere on the 3D Earth surface
      const raycaster = new THREE.Raycaster();
      const pointerDownPos = { x: 0, y: 0 };

      const onPointerDown = (e: PointerEvent) => {
        pointerDownPos.x = e.clientX;
        pointerDownPos.y = e.clientY;
      };

      const onPointerUp = (e: PointerEvent) => {
        const dx = e.clientX - pointerDownPos.x;
        const dy = e.clientY - pointerDownPos.y;
        if (dx * dx + dy * dy > 25) return; // Ignore drag gestures

        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObject(pickSphereMesh, false);
        if (hits.length > 0 && onSelectHotspotRef.current) {
          const localPt = earthGroup.worldToLocal(hits[0].point.clone());
          const { lat, lon } = vector3ToLatLon(
            localPt.x,
            localPt.y,
            localPt.z
          );
          const { node, distanceDeg } = findNearestHotspotNode(lat, lon);
          if (distanceDeg < 22) {
            onSelectHotspotRef.current(node.id);
          }
        }
      };

      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      renderer.domElement.addEventListener('pointerup', onPointerUp);

      // Subtle inner atmospheric Rayleigh scattering rim
      const innerAtmoGeo = new THREE.SphereGeometry(1.004, 48, 48);
      const innerAtmoMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uSunDir: {
            value: new THREE.Vector3(
              initialTerminator.sunVector.x,
              initialTerminator.sunVector.y,
              initialTerminator.sunVector.z
            ),
          },
          uHighResMap: { value: null },
          uHasHighRes: { value: 0.0 },
          uHighResCenterUv: { value: new THREE.Vector2(0.5, 0.5) },
          uHighResRadius: { value: 0.09 },
          uHighResAlpha: { value: 0.0 },
          uTsunamiCenter: { value: new THREE.Vector2(0.0, 0.0) },
          uTsunamiWavePhase: { value: 0.0 },
          uTsunamiSurge: { value: 0.0 },
          uRainStormIntensity: { value: 0.0 },
        },
        vertexShader: `
          uniform vec3 uSunDir;
          varying vec3 vNormal;
          varying vec3 vLocalNormal;
          varying vec3 vViewPosition;
          varying vec3 vViewSunDir;
          void main() {
            vLocalNormal = normalize(position);
            vNormal = normalize(normalMatrix * normal);
            vViewSunDir = normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform vec3 uSunDir;
          varying vec3 vNormal;
          varying vec3 vLocalNormal;
          varying vec3 vViewPosition;
          varying vec3 vViewSunDir;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            vec3 sunDir = normalize(uSunDir);
            vec3 viewSun = normalize(vViewSunDir);
            float viewDot = clamp(dot(normal, viewDir), 0.0, 1.0);
            float sunDot = dot(normalize(vLocalNormal), sunDir);

            // Rayleigh phase function: 0.75 * (1.0 + cos^2(theta))
            float cosTheta = clamp(dot(-viewDir, viewSun), -1.0, 1.0);
            float rayleighPhase = 0.75 * (1.0 + cosTheta * cosTheta);

            // Optical airmass thickness along grazing horizon
            float rim = 1.0 - viewDot;
            float opticalDepth = exp(-viewDot * 4.2) * pow(rim, 2.8);
            float sunIllum = smoothstep(-0.35, 0.65, sunDot * 0.65 + dot(normal, viewSun) * 0.35);
            float twilightTerm = smoothstep(0.14, -0.06, sunDot) * smoothstep(-0.25, -0.06, sunDot);

            // Wavelength-dependent Rayleigh blue scattering (440nm blue -> 540nm cyan-azure)
            vec3 nightRayleigh = vec3(0.04, 0.18, 0.48);
            vec3 dayRayleigh = vec3(0.24, 0.68, 1.0);
            vec3 twilightRayleigh = vec3(0.88, 0.42, 0.14);

            vec3 scatterCol = mix(nightRayleigh, dayRayleigh, sunIllum) * (0.80 + 0.20 * rayleighPhase);
            scatterCol = mix(scatterCol, twilightRayleigh, twilightTerm * 0.65);
            float alpha = clamp(opticalDepth * (0.20 + 0.55 * sunIllum), 0.0, 0.72);
            gl_FragColor = vec4(scatterCol, alpha);
          }
        `,
      });
      const innerAtmoMesh = new THREE.Mesh(innerAtmoGeo, innerAtmoMat);
      earthGroup.add(innerAtmoMesh);

      // Outer atmospheric Rayleigh horizon halo (physically accurate spherical optical depth)
      const haloGeo = new THREE.SphereGeometry(1.066, 48, 48);
      const haloMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uSunDir: {
            value: new THREE.Vector3(
              initialTerminator.sunVector.x,
              initialTerminator.sunVector.y,
              initialTerminator.sunVector.z
            ),
          },
          uHighResMap: { value: null },
          uHasHighRes: { value: 0.0 },
          uHighResCenterUv: { value: new THREE.Vector2(0.5, 0.5) },
          uHighResRadius: { value: 0.09 },
          uHighResAlpha: { value: 0.0 },
          uTsunamiCenter: { value: new THREE.Vector2(0.0, 0.0) },
          uTsunamiWavePhase: { value: 0.0 },
          uTsunamiSurge: { value: 0.0 },
          uRainStormIntensity: { value: 0.0 },
        },
        vertexShader: `
          uniform vec3 uSunDir;
          varying vec3 vViewSunDir;
          varying vec3 vViewPosition;
          varying vec3 vEarthCenterView;
          varying vec3 vNormal;
          varying vec3 vLocalNormal;
          void main() {
            vLocalNormal = normalize(position);
            vNormal = normalize(normalMatrix * normal);
            vViewSunDir = normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz);
            vEarthCenterView = (viewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform vec3 uSunDir;
          varying vec3 vViewSunDir;
          varying vec3 vViewPosition;
          varying vec3 vEarthCenterView;
          varying vec3 vNormal;
          varying vec3 vLocalNormal;
          void main() {
            vec3 rayDir = normalize(vViewPosition);
            vec3 earthCenter = vEarthCenterView;
            
            // Perpendicular closest approach distance from ray to Earth center
            float tClosest = dot(earthCenter, rayDir);
            vec3 closestPoint = tClosest * rayDir;
            float rMin = length(closestPoint - earthCenter);
            vec3 atmoNormalView = normalize(closestPoint - earthCenter);
            
            // Exact exponential optical airmass through spherical shell
            float h = max(0.0, rMin - 1.0);
            float opticalDepth = exp(-h / 0.0098);
            float outerFade = smoothstep(1.065, 1.006, rMin);
            float haloIntensity = opticalDepth * outerFade;
            
            // Solar zenith angle at grazing point and Rayleigh phase function
            vec3 viewSun = normalize(vViewSunDir);
            float cosSun = dot(atmoNormalView, viewSun);
            float cosTheta = clamp(dot(-rayDir, viewSun), -1.0, 1.0);
            float rayleighPhase = 0.75 * (1.0 + cosTheta * cosTheta);
            
            // Physical wavelength-dependent chromaticity
            float sunFactor = smoothstep(-0.20, 0.45, cosSun);
            float twilightFactor = smoothstep(0.18, -0.06, cosSun) * smoothstep(-0.28, -0.06, cosSun);
            
            vec3 daylightRayleigh = vec3(0.22, 0.68, 1.0) * (0.80 + 0.20 * rayleighPhase);
            vec3 twilightRayleigh = vec3(0.92, 0.46, 0.14) * 0.95;
            vec3 nightAirglow = vec3(0.04, 0.18, 0.52) * 0.38;
            
            vec3 scatterRgb = mix(nightAirglow, daylightRayleigh, sunFactor);
            scatterRgb = mix(scatterRgb, twilightRayleigh, twilightFactor * 0.75);
            
            float alpha = clamp(haloIntensity * (0.16 + 0.62 * sunFactor), 0.0, 0.85);
            gl_FragColor = vec4(scatterRgb, alpha);
          }
        `,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      earthGroup.add(haloMesh);

      // Mathematically pure 64x64 analytical sphere for smooth MODIS True Color terrain displacement with zero vertex lag
      const earthSphereGeo = new THREE.SphereGeometry(1.0, 64, 64);
      const earthSphereMesh = new THREE.Mesh(earthSphereGeo, earthSurfaceMat);
      earthGroup.add(earthSphereMesh);

      let frameId = 0;
      let lastSunUpdateMs = 0;
      let lastLoadedSatTile = '';
      let lastDomAttrUpdateMs = -1000;
      let lastContrastCheckMs = 0;
      let lastFrameTimeMs = performance.now();
      let prevCamDist = camera.position.length();
      let prevRotX = earthGroup.rotation.x;
      let prevRotY = earthGroup.rotation.y;
      const contrastRaycaster = new THREE.Raycaster();
      const contrastNdc = new THREE.Vector2();
      const contrastHitLocal = new THREE.Vector3();
      (
        window as unknown as {
          __earthGlobeDebug?: {
            camera: THREE.PerspectiveCamera;
            controls: OrbitControls;
            earthGroup: THREE.Group;
          };
        }
      ).__earthGlobeDebug = { camera, controls, earthGroup };

      function afterDraw(cb: () => void) {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (!gl || typeof gl.fenceSync !== 'function') {
          frameId = window.setTimeout(cb, 85);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        let polls = 0;
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED && polls++ < 200) {
            frameId = window.setTimeout(poll, 6);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 85);
          }
        };
        frameId = window.setTimeout(poll, 6);
      }

      // Pre-allocated static math vectors for zero garbage-collection overhead during 60fps animation
      const tmpLocal = new THREE.Vector3();
      const tmpWorld = new THREE.Vector3();
      const tmpNorm = new THREE.Vector3();
      const tmpViewDir = new THREE.Vector3();
      const scratchCamPos = new THREE.Vector3();
      const occupiedRects: { x: number; y: number; hw: number; hh: number }[] = [];
      let lastHotspotScanMs = 0;
      let cachedTermState: ReturnType<typeof computeDayNightTerminatorShaderState> =
        computeDayNightTerminatorShaderState(Date.now());

      function tick() {
        if (disposed) return;
        if ((window as unknown as { __PAUSE_WEBGL__?: boolean }).__PAUSE_WEBGL__) {
          frameId = window.setTimeout(tick, 120);
          return;
        }
        const now = performance.now();
        const dtSec = Math.max(0.001, Math.min(0.1, (now - lastFrameTimeMs) * 0.001));
        lastFrameTimeMs = now;
        const timeSec = now * 0.001;

        // Feature F8: Continuous camera shift exponential lerping inside tick() render loop
        const targetShift = targetShiftRef.current;
        const currentShift = currentShiftRef.current;
        const shiftDelta = targetShift - currentShift;
        const needsViewUpdate =
          camera.view !== null &&
          (camera.view.fullWidth !== width || camera.view.fullHeight !== height);

        if (Math.abs(shiftDelta) > 0.05 || needsViewUpdate) {
          currentShiftRef.current += shiftDelta * 0.08;
          if (Math.abs(targetShift - currentShiftRef.current) < 0.1) {
            currentShiftRef.current = targetShift;
          }
          if (currentShiftRef.current === 0) {
            if (camera.view !== null) {
              camera.clearViewOffset();
              camera.updateProjectionMatrix();
            }
          } else {
            camera.setViewOffset(
              width,
              height,
              currentShiftRef.current,
              0,
              width,
              height
            );
            camera.updateProjectionMatrix();
          }
        } else if (targetShift === 0 && camera.view !== null) {
          currentShiftRef.current = 0;
          camera.clearViewOffset();
          camera.updateProjectionMatrix();
        }

        // Dynamically update real-time UTC day/night solar terminator shader overlay every 1s
        const overrideUtc = (
          window as unknown as { __OVERRIDE_UTC_MS__?: number }
        ).__OVERRIDE_UTC_MS__;
        if (now - lastSunUpdateMs > 1000 || typeof overrideUtc === 'number') {
          lastSunUpdateMs = now;
          const utcNow = typeof overrideUtc === 'number' ? overrideUtc : Date.now();
          const termState = computeDayNightTerminatorShaderState(utcNow);
          cachedTermState = termState;
          sunDirectionalLight.position.set(
            termState.sunVector.x * 10,
            termState.sunVector.y * 10,
            termState.sunVector.z * 10
          );
          earthSurfaceMat.uniforms.uSunDir.value.set(
            termState.sunVector.x,
            termState.sunVector.y,
            termState.sunVector.z
          );
          earthSurfaceMat.uniforms.uTerminatorSoftness.value =
            termState.terminatorSoftness;
          earthSurfaceMat.uniforms.uSunlitRadiance.value =
            termState.sunlitRadiance;
          earthSurfaceMat.uniforms.uNightShadowContrast.value =
            termState.nightShadowContrast;
          cloudShellMat.uniforms.uSunDir.value.set(
            termState.sunVector.x,
            termState.sunVector.y,
            termState.sunVector.z
          );
          innerAtmoMat.uniforms.uSunDir.value.set(
            termState.sunVector.x,
            termState.sunVector.y,
            termState.sunVector.z
          );
          haloMat.uniforms.uSunDir.value.set(
            termState.sunVector.x,
            termState.sunVector.y,
            termState.sunVector.z
          );
        }

        const povAnim = povAnimRef.current;
        if (povAnim.active) {
          const elapsed = now - povAnim.startTime;
          const t = Math.min(1, elapsed / Math.max(1, povAnim.durationMs));
          const ease =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          earthGroup.rotation.x =
            povAnim.startRotX +
            (povAnim.targetRotX - povAnim.startRotX) * ease;
          earthGroup.rotation.y =
            povAnim.startRotY +
            (povAnim.targetRotY - povAnim.startRotY) * ease;

          // Smoothly interpolate camera position to targetCamZ
          const camX = povAnim.startCamX * (1 - ease);
          const camY = povAnim.startCamY * (1 - ease);
          const camZ =
            povAnim.startCamZ +
            (povAnim.targetCamZ - povAnim.startCamZ) * ease;
          camera.position.set(camX, camY, camZ);
          camera.up.set(0, 1, 0);
          controls.target.set(0, 0, 0);
          camera.lookAt(0, 0, 0);

          if (t >= 1) {
            povAnim.active = false;
          }
        } else {
          controls.update();
          const currentCamDist = camera.position.length();
          // Pause orbital auto-spin when zoomed in (< 3.45) so user can inspect real map tiles & NASA data steadily
          if (
            !userInteractingRef.current &&
            !povAnim.locked &&
            currentCamDist >= 3.45
          ) {
            const spinSpeed = isSoftwareGl ? 0.0055 : 0.0018;
            earthGroup.rotation.y += spinSpeed;

            const targetTiltX =
              activeTabRef.current === 'ORBITS'
                ? 0.29
                : activeTabRef.current === 'SATELLITES'
                ? 0.17
                : 0.23;
            earthGroup.rotation.x +=
              (targetTiltX - earthGroup.rotation.x) * 0.06;
          }
        }

        // Compute camera transition velocity and GPU shader LOD + MODIS True Color terrain displacement
        const camDist = camera.position.length();
        const camDelta = Math.abs(camDist - prevCamDist);
        const rotDelta = Math.hypot(
          earthGroup.rotation.x - prevRotX,
          earthGroup.rotation.y - prevRotY
        );
        const cameraVelocity = (camDelta + rotDelta * 0.5) / Math.max(0.016, dtSec);
        prevCamDist = camDist;
        prevRotX = earthGroup.rotation.x;
        prevRotY = earthGroup.rotation.y;

        const mode = activeLayerModeRef.current;
        const gpuLod = computeGpuShaderLodAndDisplacement({
          cameraDistance: camDist,
          cameraVelocity,
          layerMode: mode,
        });
        const zoomFactor = gpuLod.zoomProgress;

        // Smoothly fade out atmospheric halo & inner glow as camera approaches surface
        // Eliminates the white foggy clipping circle and wash-out when zooming close to land
        const atmoFade = Math.max(0.0, Math.min(1.0, (camDist - 1.25) / 1.5));
        haloMesh.visible = atmoFade > 0.02;
        innerAtmoMesh.visible = atmoFade > 0.02;

        // Floating Cloud Layer zoom fade:
        // When zoomed out (> 2.6): full floating clouds layer.
        // When zoomed in: maintains a delicate, ultra-clean floating cloud layer (0.10 min) above the terrain so land is crisp and visible
        const cloudZoomFade = Math.max(0.10, Math.min(1.0, (camDist - 1.8) / 0.8));

        // Smooth GPU uniform interpolation for MODIS True Color blend, zoom detail, tile interpolation, and displacement
        const targetDayMix =
          mode === 'MODIS_TRUE_COLOR_TERRAIN'
            ? 0.75
            : mode === 'HYBRID_ALL_LAYERS'
            ? 0.55
            : Math.min(0.92, 0.40 + zoomFactor * 0.55);
        earthSurfaceMat.uniforms.uDayMix.value +=
          (targetDayMix - earthSurfaceMat.uniforms.uDayMix.value) * 0.1;
        earthSurfaceMat.uniforms.uZoomDetail.value +=
          (zoomFactor - earthSurfaceMat.uniforms.uZoomDetail.value) * 0.14;
        earthSurfaceMat.uniforms.uTileInterpMix.value +=
          (gpuLod.tileInterpMix - earthSurfaceMat.uniforms.uTileInterpMix.value) * 0.18;
        earthSurfaceMat.uniforms.uDisplacementScale.value +=
          (gpuLod.displacementScale - earthSurfaceMat.uniforms.uDisplacementScale.value) * 0.14;
        earthSurfaceMat.uniforms.uModisTrueColorBlend.value +=
          (gpuLod.modisTrueColorBlend - earthSurfaceMat.uniforms.uModisTrueColorBlend.value) * 0.14;

        // Smooth GPU False-Color Infrared / Thermal Radiometry transition (VIIRS / Sentinel-3 SLSTR)
        const targetIr = mode === 'VIIRS_NIGHT_THERMAL' ? 1.0 : 0.0;
        earthSurfaceMat.uniforms.uIrThermalMode.value +=
          (targetIr - earthSurfaceMat.uniforms.uIrThermalMode.value) * 0.15;

        // Drive high-resolution satellite alpha as camera approaches Earth
        const highResAlpha = Math.max(0.0, Math.min(1.0, (2.6 - camDist) / 1.4));
        earthSurfaceMat.uniforms.uHighResAlpha.value = highResAlpha;
        if (earthSurfaceMat.uniforms.uHasHighRes.value < 0.5 && earthDayTex) {
          earthSurfaceMat.uniforms.uHighResMap.value = earthDayTex;
          earthSurfaceMat.uniforms.uHasHighRes.value = 1.0;
        }

        // Real-Time Atmospheric Cloud Circulation Physics modulated by satellite telemetry
        const cloudPhysics = computeAtmosphericCloudPhysics({
          elapsedSec: timeSec,
          dtSec,
          layerMode: mode,
          baseMinimalOpacity: minimalCloudOpacityRef.current,
          cloudCoverPct: cloudPhysicsParamsRef.current?.cloudCoverPct,
          windSpeedKmh: cloudPhysicsParamsRef.current?.windSpeedKmh,
        });
        cloudShellMat.uniforms.uAdvectionTime.value = cloudPhysics.advectionTime;
        cloudShellMat.uniforms.uMaxFragmentAlpha.value = cloudPhysics.maxFragmentAlpha;
        cloudShellMesh.rotation.y =
          (cloudShellMesh.rotation.y + cloudPhysics.deltaRotationY) % (Math.PI * 2);
        earthSurfaceMat.uniforms.uCloudOffset.value = cloudPhysics.advectionTime % 1.0;

        const envParams = cloudPhysicsParamsRef.current;
        const isStorm =
          envParams?.phenomenon === 'CYCLONE_RAIN' ||
          envParams?.phenomenon === 'RAIN' ||
          envParams?.phenomenon === 'FLOOD_STORM' ||
          mode === 'ATMOSPHERIC_AOD_CLOUDS' ||
          (typeof envParams?.precipitationMm === 'number' && envParams.precipitationMm > 0.5);
        const stormBoost = isStorm ? 0.20 : 0.0;
        const targetCloudOpacity = Math.min(
          0.95,
          (cloudPhysics.targetOpacity + stormBoost) * cloudZoomFade
        );
        earthSurfaceMat.uniforms.uCloudOpacity.value +=
          (targetCloudOpacity - earthSurfaceMat.uniforms.uCloudOpacity.value) * 0.1;
        cloudShellMat.uniforms.uCloudOpacity.value =
          earthSurfaceMat.uniforms.uCloudOpacity.value;
        cloudShellMesh.visible = true;

        // Dynamic Tsunami Surge and Precipitation Physics Uniforms
        const surgeTarget =
          typeof envParams?.waveSurgeM === 'number' && envParams.waveSurgeM > 0.5
            ? Math.min(1.0, envParams.waveSurgeM / 5.0)
            : 0.0;
        earthSurfaceMat.uniforms.uTsunamiSurge.value +=
          (surgeTarget - earthSurfaceMat.uniforms.uTsunamiSurge.value) * 0.08;

        const rainTarget =
          typeof envParams?.precipitationMm === 'number' && envParams.precipitationMm > 0.5
            ? Math.min(1.0, Math.max(0.35, envParams.precipitationMm / 25.0))
            : isStorm
            ? 0.65
            : 0.0;
        earthSurfaceMat.uniforms.uRainStormIntensity.value +=
          (rainTarget - earthSurfaceMat.uniforms.uRainStormIntensity.value) * 0.08;
        cloudShellMat.uniforms.uRainStormIntensity.value =
          earthSurfaceMat.uniforms.uRainStormIntensity.value;

        if (
          typeof envParams?.targetLat === 'number' &&
          typeof envParams?.targetLon === 'number'
        ) {
          earthSurfaceMat.uniforms.uTsunamiCenter.value.set(
            envParams.targetLat,
            envParams.targetLon
          );
          cloudShellMat.uniforms.uTsunamiCenter.value.set(
            envParams.targetLat,
            envParams.targetLon
          );
        }
        earthSurfaceMat.uniforms.uTsunamiWavePhase.value = (timeSec * 0.85) % 10.0;

        // 7-day temporal NASA GIBS thermal layer modulation
        const temporalThermal = computeTemporalThermalState(
          timelineDayRef.current
        );
        const modeThermalMultiplier = mode === 'VIIRS_NIGHT_THERMAL' ? 1.75 : 1.0;
        earthSurfaceMat.uniforms.uThermalIntensity.value +=
          (temporalThermal.thermalIntensityScale * modeThermalMultiplier -
            earthSurfaceMat.uniforms.uThermalIntensity.value) *
          0.14;
        earthSurfaceMat.uniforms.uThermalPhase.value =
          temporalThermal.thermalPhaseRad;

        earthGroup.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);

        // Compute geographic coordinates directly under the optical center
        scratchCamPos.copy(camera.position).normalize();
        const centerLocal = earthGroup.worldToLocal(scratchCamPos);
        const centerGeo = vector3ToLatLon(
          centerLocal.x,
          centerLocal.y,
          centerLocal.z
        );

        // Update GPU FIRMS pinpoint visibility and zoom level telemetry (zero lag, zero rectangular patches)
        const { tileZoom } = computeZoomTileLevel(camDist);
        const targetPinpointAlpha = Math.max(
          0,
          Math.min(1, (zoomFactor - 0.14) / 0.45)
        );
        firmsPointsMat.uniforms.uZoomAlpha.value +=
          (targetPinpointAlpha - firmsPointsMat.uniforms.uZoomAlpha.value) * 0.16;
        firmsPointsMat.uniforms.uThermalScale.value =
          earthSurfaceMat.uniforms.uThermalIntensity.value;

        // Throttle DOM data-* attribute updates to every 250ms to eliminate 600 DOM mutations/sec
        if (now - lastDomAttrUpdateMs > 1000 && container?.parentElement) {
          lastDomAttrUpdateMs = now;
          const parentEl = container.parentElement;
          if (cachedTermState) {
            parentEl.setAttribute(
              'data-subsolar-lat',
              cachedTermState.subsolarLat.toFixed(2)
            );
            parentEl.setAttribute(
              'data-subsolar-lon',
              cachedTermState.subsolarLon.toFixed(2)
            );
            parentEl.setAttribute(
              'data-terminator-utc',
              cachedTermState.utcIso
            );
          }
          parentEl.setAttribute('data-camera-distance', camDist.toFixed(2));
          parentEl.setAttribute(
            'data-displacement-scale',
            gpuLod.displacementScale.toFixed(5)
          );
          parentEl.setAttribute(
            'data-tile-interp-mix',
            gpuLod.tileInterpMix.toFixed(4)
          );
          parentEl.setAttribute(
            'data-cloud-deg-per-frame',
            cloudPhysics.rotationDegPerFrame.toFixed(3)
          );
          parentEl.setAttribute(
            'data-cloud-opacity',
            cloudShellMat.uniforms.uCloudOpacity.value.toFixed(3)
          );
          parentEl.setAttribute(
            'data-timeline-day',
            String(temporalThermal.timelineDay)
          );
          parentEl.setAttribute('data-timeline-date', temporalThermal.isoDate);
          parentEl.setAttribute(
            'data-thermal-intensity',
            earthSurfaceMat.uniforms.uThermalIntensity.value.toFixed(3)
          );
          parentEl.setAttribute('data-tile-zoom', String(tileZoom));
          parentEl.setAttribute(
            'data-zoom-detail',
            earthSurfaceMat.uniforms.uZoomDetail.value.toFixed(3)
          );
        }

        // When user zooms in manually without a locked search, detect the geographic sector & stream live NASA telemetry
        // Debounced to eliminate React re-render churn during continuous mouse wheel and camera panning!
        if (!povAnim.locked) {
          if (zoomFactor > 0.22) {
            if (now - lastHotspotScanMs > 120) {
              lastHotspotScanMs = now;
              const { node } = findNearestHotspotNode(
                centerGeo.lat,
                centerGeo.lon
              );
              if (
                onZoomSectorChangeRef.current &&
                lastZoomSectorIdRef.current !== node.id
              ) {
                lastZoomSectorIdRef.current = node.id;
                if (zoomSectorDebounceRef.current) {
                  window.clearTimeout(zoomSectorDebounceRef.current);
                }
                zoomSectorDebounceRef.current = window.setTimeout(() => {
                  onZoomSectorChangeRef.current?.(node.id);
                }, 280);
              }
            }
            if (onZoomTelemetryChangeRef.current) {
              const roundedKey = `${centerGeo.lat.toFixed(1)},${centerGeo.lon.toFixed(1)},${tileZoom}`;
              if (lastZoomTelemetryKeyRef.current !== roundedKey) {
                lastZoomTelemetryKeyRef.current = roundedKey;
                if (zoomTelemetryDebounceRef.current) {
                  window.clearTimeout(zoomTelemetryDebounceRef.current);
                }
                const targetLat = centerGeo.lat;
                const targetLon = centerGeo.lon;
                const targetZoom = tileZoom || 6;
                zoomTelemetryDebounceRef.current = window.setTimeout(() => {
                  onZoomTelemetryChangeRef.current?.({
                    lat: targetLat,
                    lon: targetLon,
                    zoom: targetZoom,
                  });
                }, 280);
              }
            }
          } else if (zoomFactor < 0.12) {
            if (
              lastZoomSectorIdRef.current !== null &&
              onZoomSectorChangeRef.current
            ) {
              lastZoomSectorIdRef.current = null;
              if (zoomSectorDebounceRef.current) {
                window.clearTimeout(zoomSectorDebounceRef.current);
              }
              onZoomSectorChangeRef.current(null);
            }
            if (
              lastZoomTelemetryKeyRef.current !== '' &&
              onZoomTelemetryChangeRef.current
            ) {
              lastZoomTelemetryKeyRef.current = '';
              if (zoomTelemetryDebounceRef.current) {
                window.clearTimeout(zoomTelemetryDebounceRef.current);
              }
              onZoomTelemetryChangeRef.current(null);
            }
          }
        }

        // Update projected 2D HUD city labels directly via DOM refs (0 React state churn)
        const camWorldPos = camera.position;
        occupiedRects.length = 0;

        if (activePinRef.current) {
          if (povAnim.locked) {
            const p = latLonToVector3(
              povAnim.targetLat,
              povAnim.targetLng,
              1.002
            );
            tmpLocal.set(p.x, p.y, p.z);
            tmpWorld.copy(tmpLocal).applyMatrix4(earthGroup.matrixWorld);
            tmpNorm.copy(tmpWorld).normalize();
            tmpViewDir.copy(camWorldPos).sub(tmpWorld).normalize();
            const facing = tmpNorm.dot(tmpViewDir);

            if (facing > 0.18) {
              tmpWorld.project(camera);
              const sx = (tmpWorld.x * 0.5 + 0.5) * width;
              const sy = (-tmpWorld.y * 0.5 + 0.5) * height;
              occupiedRects.push({ x: sx, y: sy, hw: 140, hh: 32 });
              activePinRef.current.style.transform = `translate3d(${Math.round(
                sx
              )}px, ${Math.round(sy)}px, 0)`;
              activePinRef.current.style.opacity = '1';
              if (activePinTitleRef.current) {
                activePinTitleRef.current.textContent = povAnim.label;
              }
            } else {
              activePinRef.current.style.opacity = '0';
            }
          } else {
            activePinRef.current.style.opacity = '0';
          }
        }

        const showRegionalLabels =
          (!povAnim.locked &&
            (zoomFactor > 0.22 || mode === 'HYBRID_ALL_LAYERS')) ||
          (povAnim.locked && zoomFactor > 0.55);

        for (let i = 0; i < GLOBE_LABEL_NODES.length; i++) {
          const el = labelItemRefs.current[i];
          if (!el) continue;
          if (!showRegionalLabels) {
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
            continue;
          }
          const node = GLOBE_LABEL_NODES[i];

          const isPrimaryHub =
            node.id === 'hs-chennai' ||
            node.id === 'hs-mumbai' ||
            node.id === 'hs-delhi' ||
            node.id === 'hs-bengaluru' ||
            node.id === 'hs-kolkata' ||
            node.id === 'hs-hyderabad' ||
            node.id === 'hs-tokyo' ||
            node.id === 'hs-london' ||
            node.id === 'hs-new-york' ||
            node.id === 'hs-sydney' ||
            node.id === 'hs-dubai' ||
            node.id === 'hs-singapore';

          if (!isPrimaryHub && zoomFactor < 0.42 && mode !== 'HYBRID_ALL_LAYERS') {
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
            continue;
          }

          tmpWorld.copy(CACHED_LABEL_VECTORS[i]).applyMatrix4(earthGroup.matrixWorld);
          tmpNorm.copy(tmpWorld).normalize();
          tmpViewDir.copy(camWorldPos).sub(tmpWorld).normalize();
          const facing = tmpNorm.dot(tmpViewDir);

          const facingThreshold = isPrimaryHub ? 0.32 : 0.45 - zoomFactor * 0.14;
          if (facing > facingThreshold) {
            tmpWorld.project(camera);
            const sx = (tmpWorld.x * 0.5 + 0.5) * width;
            const sy = (-tmpWorld.y * 0.5 + 0.5) * height;
            const hw = 54;
            const hh = 15;
            let collides = false;
            for (let j = 0; j < occupiedRects.length; j++) {
              const r = occupiedRects[j];
              if (
                Math.abs(sx - r.x) < hw + r.hw &&
                Math.abs(sy - r.y) < hh + r.hh
              ) {
                collides = true;
                break;
              }
            }
            if (collides) {
              el.style.opacity = '0';
              el.style.pointerEvents = 'none';
            } else {
              occupiedRects.push({ x: sx, y: sy, hw, hh });
              const alpha = Math.min(1, (facing - facingThreshold) * 3.8);
              el.style.transform = `translate3d(${Math.round(
                sx
              )}px, ${Math.round(sy)}px, 0)`;
              el.style.opacity = alpha.toFixed(2);
              el.style.pointerEvents = alpha > 0.45 ? 'auto' : 'none';
            }
          } else {
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
          }
        }

        renderer.render(scene, camera);

        // Zero-Lag Analytical Contrast Check for bottom-row text elements (Throttled to 1000ms to eliminate layout thrashing)
        if (!isSearchSubmittedRef.current && now - lastContrastCheckMs > 2500) {
          lastContrastCheckMs = now;
          const adaptiveNodes = document.querySelectorAll<HTMLElement>(
            '[data-adaptive-text="true"]'
          );
          const sunVec = earthSurfaceMat.uniforms.uSunDir.value;
          for (let i = 0; i < adaptiveNodes.length; i++) {
            const node = adaptiveNodes[i];
            const r = node.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            const cx = r.left + r.width * 0.5;
            const cy = r.top + r.height * 0.5;
            contrastNdc.set((cx / Math.max(1, width)) * 2 - 1, -(cy / Math.max(1, height)) * 2 + 1);
            contrastRaycaster.setFromCamera(contrastNdc, camera);
            const ray = contrastRaycaster.ray;
            // Analytical ray-sphere intersection (sphere centered at origin with radius 1.0)
            const b = ray.origin.dot(ray.direction);
            const c = ray.origin.lengthSq() - 1.0;
            const disc = b * b - c;
            let isBrightBackground = false;
            if (disc > 0) {
              const tHit = -b - Math.sqrt(disc);
              if (tHit > 0) {
                contrastHitLocal
                  .copy(ray.origin)
                  .addScaledVector(ray.direction, tHit);
                earthGroup.worldToLocal(contrastHitLocal);
                contrastHitLocal.normalize();
                const sunDot = contrastHitLocal.dot(sunVec);
                if (hasEmissionGrid) {
                  const lat = Math.asin(Math.max(-1, Math.min(1, contrastHitLocal.y)));
                  const lon = Math.atan2(-contrastHitLocal.z, contrastHitLocal.x);
                  const u = ((lon / (Math.PI * 2)) + 0.5 + 1.0) % 1.0;
                  const v = 0.5 - lat / Math.PI;
                  const gx = Math.min(emissionGridW - 1, Math.max(0, Math.floor(u * emissionGridW)));
                  const gy = Math.min(emissionGridH - 1, Math.max(0, Math.floor(v * emissionGridH)));
                  const cityEmission = emissionGrid[gy * emissionGridW + gx];
                  if (sunDot < 0.05 && cityEmission > 0.34) {
                    isBrightBackground = true;
                  }
                }
              }
            }
            const nextMode = isBrightBackground ? 'dark' : 'light';
            if (node.getAttribute('data-contrast-mode') !== nextMode) {
              node.setAttribute('data-contrast-mode', nextMode);
            }
          }
        }

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      }

      tick();

      const onResize = () => {
        if (!container) return;
        width = container.clientWidth || window.innerWidth;
        height = container.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        const isDesktop = width >= 640;
        targetShiftRef.current = isSearchSubmittedRef.current && isDesktop
          ? -Math.round(Math.min(540, width * 0.36) / 2)
          : 0;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', onResize);
      const resizeObserver =
        typeof ResizeObserver !== 'undefined'
          ? new ResizeObserver(() => onResize())
          : null;
      resizeObserver?.observe(container);

      return () => {
        disposed = true;
        if (zoomSectorDebounceRef.current) window.clearTimeout(zoomSectorDebounceRef.current);
        if (zoomTelemetryDebounceRef.current) window.clearTimeout(zoomTelemetryDebounceRef.current);
        resizeObserver?.disconnect();
        window.removeEventListener('resize', onResize);
        window.removeEventListener('wheel', onWindowWheel);
        renderer.domElement.removeEventListener('dblclick', onDoubleClick);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointerup', onPointerUp);
        controls.removeEventListener('start', onStart);
        controls.removeEventListener('end', onEnd);
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        controls.dispose();
        firmsPointsGeo.dispose();
        firmsPointsMat.dispose();
        earthSphereGeo.dispose();
        pickSphereGeo.dispose();
        pickSphereMat.dispose();
        cloudShellGeo.dispose();
        cloudShellMat.dispose();
        innerAtmoGeo.dispose();
        innerAtmoMat.dispose();
        haloGeo.dispose();
        haloMat.dispose();
        earthSurfaceMat.dispose();
        earth360Tex.dispose();
        earthDayTex.dispose();
        earthNormalTex.dispose();
        earthLightsTex.dispose();
        cloudsTex.dispose();
        renderer.dispose();
      };
    }, []);

    return (
      <div
        data-testid="earth-globe-stage"
        data-pov-locked={targetPointOfView ? 'true' : 'false'}
        data-pov-label={targetPointOfView?.label || 'global'}
        data-layer-mode={activeLayerMode}
        data-points-count={pointsData.length}
        data-points-merge={pointsMerge ? 'true' : 'false'}
        className="relative w-full h-full overflow-hidden select-none pointer-events-auto"
      >
        {/* Full-Viewport Clean 3D Earth Globe Canvas Mount */}
        <div
          ref={canvasMountRef}
          className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Minimalist Typography Overlay (Zero concentric radar rings, zero pill boxes, zero degree strings) */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {/* Active Searched Place: Tiny Minimalist 4px Pinpoint + Clean Glassmorphic Place Name */}
          <div
            ref={activePinRef}
            data-testid="globe-active-target-pin"
            style={{
              opacity: 0,
              transform: 'translate3d(-9999px, -9999px, 0)',
            }}
            className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-opacity duration-200 pointer-events-none"
          >
            <span
              ref={activePinTitleRef}
              className="mb-1.5 text-[13px] font-medium text-white/95 tracking-[0.025em] whitespace-nowrap"
              style={{
                textShadow:
                  '0 1px 8px rgba(0,0,0,0.98), 0 0 14px rgba(0,0,0,0.85)',
              }}
            >
              Chennai, Tamil Nadu
            </span>
            
          </div>

          {/* Zoom-Adaptive Regional Pure Text Labels (Only visible when zooming in without a search lock) */}
          {GLOBE_LABEL_NODES.map((node, i) => (
            <button
              key={node.id}
              ref={(el) => {
                labelItemRefs.current[i] = el;
              }}
              type="button"
              onClick={() => onSelectHotspotRef.current?.(node.id)}
              style={{
                opacity: 0,
                pointerEvents: 'none',
                transform: 'translate3d(-9999px, -9999px, 0)',
                textShadow:
                  '0 1px 8px rgba(0,0,0,0.95), 0 0 14px rgba(255,255,255,0.22)',
              }}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-transparent border-0 p-0 text-[12px] font-normal text-white/90 hover:text-white tracking-[0.02em] whitespace-nowrap transition-opacity duration-150 cursor-pointer"
            >
              {node.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    );
  }
);
EarthGlobeCanvas.displayName = 'EarthGlobeCanvas';
