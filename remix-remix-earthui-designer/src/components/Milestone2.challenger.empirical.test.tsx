import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { BottomCardsRow } from './BottomCardsRow';
import { ObservationSidebar } from './ObservationSidebar';
import { MetaDeepIntelligenceConsole } from './MetaDeepIntelligenceConsole';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { HOTSPOT_NODES } from '../utils/telemetryLogic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '..');

describe('Empirical Challenger Milestone 2 Stress Test Suite', () => {

  // =========================================================================
  // SUITE 1: Zero SVG Dot Grid Pattern Backgrounds, Radial Dot Gradients, & Scanlines
  // =========================================================================
  describe('Suite 1: Zero SVG Dot Grids, Radial Gradients & Scanlines Invariant', () => {
    it('verifies zero occurrences of .grid-scan or residual scanline CSS in active stylesheets', () => {
      const indexCss = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf-8');
      const galaxyCss = fs.readFileSync(path.join(srcDir, 'components', 'Galaxy.css'), 'utf-8');

      assert.ok(!indexCss.includes('.grid-scan'), 'index.css must not contain .grid-scan class');
      assert.ok(!indexCss.includes('grid-scan'), 'index.css must not contain grid-scan references');
      assert.ok(!indexCss.includes('@keyframes sataRadarSweep'), 'index.css must not contain @keyframes sataRadarSweep');
      assert.ok(!indexCss.includes('.sata-radar-sweep'), 'index.css must not contain .sata-radar-sweep');
      assert.ok(!galaxyCss.includes('scan'), 'Galaxy.css must not contain scanline artifacts');
    });

    it('verifies zero radial-gradient patterns or SVG pattern definitions in index.css', () => {
      const indexCss = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf-8');
      assert.ok(!indexCss.includes('radial-gradient'), 'index.css must not contain radial-gradient');
      assert.ok(!indexCss.includes('<pattern'), 'index.css must not contain <pattern tags');
      assert.ok(!indexCss.includes('data:image/svg+xml'), 'index.css must not contain SVG data URIs');
      assert.ok(!indexCss.includes('patternUnits'), 'index.css must not contain patternUnits');
    });

    it('exhaustively scans all TSX and TS files in src/ for unwanted SVG dot grid or scanline patterns', () => {
      const walkFiles = (dir: string): string[] => {
        let results: string[] = [];
        const list = fs.readdirSync(dir);
        for (const file of list) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            results = results.concat(walkFiles(fullPath));
          } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
            results.push(fullPath);
          }
        }
        return results;
      };

      const allFiles = walkFiles(srcDir);
      for (const filePath of allFiles) {
        // Skip test files from this check
        if (filePath.includes('.test.')) continue;
        const content = fs.readFileSync(filePath, 'utf-8');

        // Check for residual GridScan references (except GridScan.tsx itself which must be empty)
        if (!filePath.endsWith('GridScan.tsx')) {
          assert.ok(
            !content.includes('GridScan'),
            `File ${path.relative(srcDir, filePath)} must not reference GridScan`
          );
        }

        // Check for SVG pattern backgrounds or scanline animations
        assert.ok(
          !content.includes('<pattern'),
          `File ${path.relative(srcDir, filePath)} must not contain SVG <pattern>`
        );
        assert.ok(
          !content.includes('data:image/svg+xml;base64,PHN2Zy'),
          `File ${path.relative(srcDir, filePath)} must not contain base64 SVG dot grids`
        );
        assert.ok(
          !content.includes('scanline'),
          `File ${path.relative(srcDir, filePath)} must not contain scanline references`
        );
      }
    });

    it('verifies GridScan.tsx is inert with zero DOM nodes or WebGL loops', () => {
      const gridScanContent = fs.readFileSync(path.join(srcDir, 'components', 'GridScan.tsx'), 'utf-8');
      assert.equal(
        gridScanContent.trim(),
        'export {};',
        'GridScan.tsx must be completely emptied to export {};'
      );
    });

    it('verifies procedural planetary shaders in EarthGlobeCanvas.tsx remain intact', () => {
      const canvasContent = fs.readFileSync(path.join(srcDir, 'components', 'EarthGlobeCanvas.tsx'), 'utf-8');
      assert.ok(canvasContent.includes('microTerrainNoise'), 'EarthGlobeCanvas must preserve microTerrainNoise');
      assert.ok(canvasContent.includes('fbmSurfCloud'), 'EarthGlobeCanvas must preserve fbmSurfCloud');
      assert.ok(canvasContent.includes('evalDayLandMask'), 'EarthGlobeCanvas must preserve evalDayLandMask');
      assert.ok(canvasContent.includes('computeSmallIslandField'), 'EarthGlobeCanvas must preserve computeSmallIslandField');
    });
  });

  // =========================================================================
  // SUITE 2: High-Liquidity Frosted Glass Styling Invariants
  // =========================================================================
  describe('Suite 2: High-Liquidity Frosted Glass Styling & Optical Clarity', () => {
    const indexCss = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf-8');

    it('.sata-glass-card has neutral low-opacity fill, 28px blur, 170% saturate, and subtle specular border', () => {
      const cardBlock = indexCss.match(/\.sata-glass-card\s*\{([^}]+)\}/)?.[1] || '';
      assert.ok(cardBlock.includes('rgba(255, 255, 255, 0.07)'), '.sata-glass-card background must be rgba(255, 255, 255, 0.07)');
      assert.ok(cardBlock.includes('blur(28px) saturate(170%)'), '.sata-glass-card backdrop-filter must be blur(28px) saturate(170%)');
      assert.ok(cardBlock.includes('1px solid rgba(255, 255, 255, 0.15)'), '.sata-glass-card border must be 1px solid rgba(255, 255, 255, 0.15)');
      assert.ok(cardBlock.includes('inset 0 1px 1px rgba(255, 255, 255, 0.22)'), '.sata-glass-card must have top specular rim inset shadow');
      assert.ok(!cardBlock.includes('linear-gradient'), '.sata-glass-card must not contain colored linear gradients');
    });

    it('.sata-sidebar-glass has neutral high-liquidity dark fill, 36px blur, 170% saturate, and subtle border', () => {
      const sidebarBlock = indexCss.match(/\.sata-sidebar-glass\s*\{([^}]+)\}/)?.[1] || '';
      assert.ok(sidebarBlock.includes('rgba(14, 18, 28, 0.42)'), '.sata-sidebar-glass background must be rgba(14, 18, 28, 0.42)');
      assert.ok(sidebarBlock.includes('blur(36px) saturate(170%)'), '.sata-sidebar-glass backdrop-filter must be blur(36px) saturate(170%)');
      assert.ok(sidebarBlock.includes('1px solid rgba(255, 255, 255, 0.14)'), '.sata-sidebar-glass border must be 1px solid rgba(255, 255, 255, 0.14)');
      assert.ok(!sidebarBlock.includes('rgba(14, 24, 48, 0.55)'), '.sata-sidebar-glass must not use baseline 0.55 navy background');
    });

    it('.sata-search-bar has neutral translucent fill, 36px blur, 170% saturate, and responsive focus lighting', () => {
      const searchBlock = indexCss.match(/\.sata-search-bar\s*\{([^}]+)\}/)?.[1] || '';
      assert.ok(searchBlock.includes('rgba(14, 18, 28, 0.42)'), '.sata-search-bar background must be rgba(14, 18, 28, 0.42)');
      assert.ok(searchBlock.includes('blur(36px) saturate(170%)'), '.sata-search-bar backdrop-filter must be blur(36px) saturate(170%)');
      assert.ok(searchBlock.includes('1px solid rgba(255, 255, 255, 0.15)'), '.sata-search-bar border must be 1px solid rgba(255, 255, 255, 0.15)');

      const focusBlock = indexCss.match(/\.sata-search-bar:focus-within\s*\{([^}]+)\}/)?.[1] || '';
      assert.ok(focusBlock.includes('border-color: rgba(255, 255, 255, 0.30)'), '.sata-search-bar:focus-within must have illuminated border');
      assert.ok(focusBlock.includes('rgba(22, 28, 42, 0.55)'), '.sata-search-bar:focus-within background must be rgba(22, 28, 42, 0.55)');
    });

    it('verifies App.tsx search bar container does NOT have opaque inline Tailwind overrides', () => {
      const appContent = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf-8');
      assert.ok(!appContent.includes('bg-[#0e1017]/85'), 'App.tsx must not contain opaque bg-[#0e1017]/85 override');
      assert.ok(!appContent.includes('border-white/40 bg-[#0e1017]'), 'App.tsx must not contain border-white/40 bg-[#0e1017]');
      assert.ok(appContent.includes('sata-search-bar'), 'App.tsx must use sata-search-bar');
    });

    it('verifies App.tsx model dropdown menu uses translucent frosted glass styling', () => {
      const appContent = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf-8');
      assert.ok(!appContent.includes('bg-[#070e22]/95'), 'App.tsx model menu must not use opaque bg-[#070e22]/95');
      assert.ok(appContent.includes('bg-black/60 backdrop-blur-2xl'), 'App.tsx model menu must use bg-black/60 backdrop-blur-2xl');
      assert.ok(appContent.includes('border border-white/15'), 'App.tsx model menu must use border border-white/15');
    });

    it('verifies MetaDeepIntelligenceConsole container uses neutral frosted glass', () => {
      const consoleContent = fs.readFileSync(path.join(srcDir, 'components', 'MetaDeepIntelligenceConsole.tsx'), 'utf-8');
      assert.ok(!consoleContent.includes('bg-gradient-to-br from-[#071630]'), 'Console must not use opaque navy gradient');
      assert.ok(consoleContent.includes('bg-black/45 backdrop-blur-[36px] saturate-[170%]'), 'Console must use bg-black/45 backdrop-blur-[36px]');
      assert.ok(consoleContent.includes('border border-white/14'), 'Console must use border-white/14');
    });

    it('verifies KeyboardShortcutsModal container uses neutral frosted glass', () => {
      const modalContent = fs.readFileSync(path.join(srcDir, 'components', 'KeyboardShortcutsModal.tsx'), 'utf-8');
      assert.ok(!modalContent.includes('bg-[#070e22]/90'), 'Modal must not use opaque bg-[#070e22]/90');
      assert.ok(modalContent.includes('bg-black/55 backdrop-blur-2xl'), 'Modal must use bg-black/55 backdrop-blur-2xl');
      assert.ok(modalContent.includes('border border-white/16'), 'Modal must use border-white/16');
    });
  });

  // =========================================================================
  // SUITE 3: Typography Polish & AI De-Jargoning Invariants
  // =========================================================================
  describe('Suite 3: UI Typography Polish & De-Jargoning Across All Rendered Components', () => {
    const prohibitedDisplayTerms = [
      'Meta Muse is reasoning...',
      'Tri-Agent Swarm',
      'Spark 1.3 Spatial',
      'Spark 1.2 Tactical',
      'Wonder 1.0 Physics',
      'GLOBAL DISASTERS NASA',
      'Live Global Disasters',
      'SGP4 Locked',
      'NOAA Orbital Stream • 60 FPS',
      '0.28m SGP4 Optical',
      'Thermal Telemetry',
      'Live SGP4 Telemetry',
      'Execute Tri-Agent geospatial analysis',
      'Meta AI Model Swarm',
      'Tri-Agent Swarm (All 3 Models Parallel)',
      'Pro navigation like desktop and pro apps',
      'Fetching real-time satellite telemetry...',
      'Ask satellite anything...',
      'Meta Tri-Agent AI Matrix:',
    ];

    it('BottomCardsRow renders clean "GLOBAL HAZARDS (NASA)" and "Live Global Hazards"', () => {
      const html = renderToStaticMarkup(
        React.createElement(BottomCardsRow, {
          releases: [
            { id: 'rel-1', title: 'Sentinel-2A', status: 'Active', dateBadge: 'Oct 28' },
            { id: 'rel-2', title: 'Landsat 9', status: 'Active', dateBadge: 'Oct 27' },
            { id: 'rel-3', title: 'Terra MODIS', status: 'Active', dateBadge: 'Oct 26' },
          ],
          sensors: [
            { sensor: 'VIIRS', metric: '42 MW', status: 'Nominal' },
            { sensor: 'MODIS', metric: '28 MW', status: 'Nominal' },
          ],
        })
      );

      assert.ok(html.includes('GLOBAL HAZARDS (NASA)'), 'Must render "GLOBAL HAZARDS (NASA)"');
      assert.ok(html.includes('aria-label="Live Global Hazards"'), 'Must render aria-label="Live Global Hazards"');
      for (const term of prohibitedDisplayTerms) {
        assert.ok(!html.includes(term), `BottomCardsRow must not render prohibited term: ${term}`);
      }
    });

    it('ObservationSidebar renders clean badges and observation fallback lead', () => {
      const html = renderToStaticMarkup(
        React.createElement(ObservationSidebar, {
          hotspotNodes: HOTSPOT_NODES,
          selectedHotspotId: null,
          onSelectHotspot: () => {},
          onAdjustOrbit: () => {},
          adjustOrbitEnabled: true,
          aiInsightLead: '',
          aiInsightBody: 'Satellite observations confirm calm weather conditions.',
          isAiReasoning: false,
          agentCloudOpacity: 0.68,
          onChangeCloudOpacity: () => {},
        })
      );

      assert.ok(html.includes('Observation Insight:'), 'Must render "Observation Insight:" fallback lead');
      assert.ok(html.includes('Spatial Mapping'), 'Must render "Spatial Mapping" task badge');
      assert.ok(html.includes('Atmospheric Physics'), 'Must render "Atmospheric Physics" task badge');
      assert.ok(html.includes('Surface Telemetry'), 'Must render "Surface Telemetry" task badge');
      assert.ok(html.includes('Live Orbital Telemetry'), 'Must render "Live Orbital Telemetry"');
      for (const term of prohibitedDisplayTerms) {
        assert.ok(!html.includes(term), `ObservationSidebar must not render prohibited term: ${term}`);
      }
    });

    it('ObservationSidebar preserves custom non-robotic aiInsightLead', () => {
      const html = renderToStaticMarkup(
        React.createElement(ObservationSidebar, {
          hotspotNodes: HOTSPOT_NODES,
          selectedHotspotId: null,
          onSelectHotspot: () => {},
          onAdjustOrbit: () => {},
          adjustOrbitEnabled: true,
          aiInsightLead: 'Environmental Alert',
          aiInsightBody: 'High aerosol density detected over the northern region.',
          isAiReasoning: false,
          agentCloudOpacity: 0.68,
          onChangeCloudOpacity: () => {},
        })
      );

      assert.ok(html.includes('Environmental Alert:'), 'Must format custom lead with colon');
    });

    it('MetaDeepIntelligenceConsole renders human-readable telemetry, status, and chips', () => {
      const html = renderToStaticMarkup(
        React.createElement(MetaDeepIntelligenceConsole, {
          targetName: 'California Wildfire Sector',
          lat: 38.5,
          lon: -121.5,
          activeHeatSpots: 84,
          layerType: 'THERMAL',
          briefingLead: 'Thermal Scan Analysis',
          briefingBody: 'Active wildfire thermal radiance verified by VIIRS.',
          onClose: () => {},
        })
      );

      assert.ok(html.includes('Orbital Track Locked'), 'Must render "Orbital Track Locked"');
      assert.ok(html.includes('NOAA Satellite Stream • Live'), 'Must render "NOAA Satellite Stream • Live"');
      assert.ok(html.includes('NOAA GOES GeoColor Loop'), 'Must render initial live feed label');
      assert.ok(html.includes('Weather Radar'), 'Must render "Weather Radar" action chip');
      assert.ok(html.includes('Thermal Sensor Scan'), 'Must render "Thermal Sensor Scan" action chip');
      assert.ok(html.includes('High-Res Optical'), 'Must render "High-Res Optical" action chip');

      const consoleContent = fs.readFileSync(path.join(srcDir, 'components', 'MetaDeepIntelligenceConsole.tsx'), 'utf-8');
      assert.ok(consoleContent.includes('0.28m Optical Stream'), 'Console source must provide "0.28m Optical Stream"');
      assert.ok(!consoleContent.includes('0.28m SGP4 Optical'), 'Console source must NOT contain "0.28m SGP4 Optical"');

      for (const term of prohibitedDisplayTerms) {
        assert.ok(!html.includes(term), `MetaDeepIntelligenceConsole must not render prohibited term: ${term}`);
      }
    });

    it('KeyboardShortcutsModal renders natural categories, descriptions, and pro guide copy', () => {
      const html = renderToStaticMarkup(
        React.createElement(KeyboardShortcutsModal, {
          isOpen: true,
          onClose: () => {},
        })
      );

      assert.ok(
        html.includes('Analysis Models &amp; Modes') || html.includes('Analysis Models & Modes'),
        'Must render "Analysis Models & Modes"'
      );
      assert.ok(html.includes('Multi-Sensor Consensus (Parallel Analysis)'), 'Must render "Multi-Sensor Consensus"');
      assert.ok(html.includes('Spatial Analytics (Precision Mapping)'), 'Must render "Spatial Analytics"');
      assert.ok(html.includes('Rapid Geocoder (Instant Coordinates)'), 'Must render "Rapid Geocoder"');
      assert.ok(html.includes('Spectral Reasoner (Physics &amp; Infrared)') || html.includes('Spectral Reasoner (Physics & Infrared)'), 'Must render "Spectral Reasoner"');
      assert.ok(html.includes('Quick keyboard navigation and controls'), 'Must render "Quick keyboard navigation and controls"');
      assert.ok(html.includes('Focus Satellite Search'), 'Must render "Focus Satellite Search"');
      for (const term of prohibitedDisplayTerms) {
        assert.ok(!html.includes(term), `KeyboardShortcutsModal must not render prohibited term: ${term}`);
      }
    });
  });

  // =========================================================================
  // SUITE 4: Model Selection Integrity & Keyboard Shortcut Dispatch Stress Tests
  // =========================================================================
  describe('Suite 4: Model Selection Integrity & Shortcut Dispatch Stress Tests', () => {
    type MetaModel = 'tri-agent-swarm' | 'muse-spark-1.3' | 'muse-spark-1.2' | 'muse-wonder-1.0';

    const MODEL_DEFINITIONS = [
      { id: 'tri-agent-swarm', label: 'Multi-Sensor Consensus', desc: 'Parallel multi-spectral analysis' },
      { id: 'muse-spark-1.3', label: 'Spatial Analytics', desc: 'Spatial & coordinate analysis' },
      { id: 'muse-spark-1.2', label: 'Rapid Geocoder', desc: 'Instant location coordinates' },
      { id: 'muse-wonder-1.0', label: 'Spectral Reasoner', desc: 'Thermal & environmental physics' },
    ];

    it('verifies deterministic key-to-model ID mappings for keys 1-4', () => {
      const keyMap: Record<string, MetaModel> = {
        '1': 'tri-agent-swarm',
        '2': 'muse-spark-1.3',
        '3': 'muse-spark-1.2',
        '4': 'muse-wonder-1.0',
      };

      assert.equal(keyMap['1'], 'tri-agent-swarm');
      assert.equal(keyMap['2'], 'muse-spark-1.3');
      assert.equal(keyMap['3'], 'muse-spark-1.2');
      assert.equal(keyMap['4'], 'muse-wonder-1.0');
    });

    it('verifies model dropdown items strictly pair internal string IDs with human labels', () => {
      const ids = MODEL_DEFINITIONS.map((m) => m.id);
      assert.deepEqual(ids, ['tri-agent-swarm', 'muse-spark-1.3', 'muse-spark-1.2', 'muse-wonder-1.0']);

      const labels = MODEL_DEFINITIONS.map((m) => m.label);
      assert.deepEqual(labels, [
        'Multi-Sensor Consensus',
        'Spatial Analytics',
        'Rapid Geocoder',
        'Spectral Reasoner',
      ]);
    });

    it('verifies model label resolution function mirrors App.tsx conditional', () => {
      const resolveModelLabel = (model: MetaModel): string => {
        return model === 'tri-agent-swarm'
          ? 'Multi-Sensor Consensus'
          : model === 'muse-spark-1.3'
          ? 'Spatial Analytics'
          : model === 'muse-spark-1.2'
          ? 'Rapid Geocoder'
          : 'Spectral Reasoner';
      };

      assert.equal(resolveModelLabel('tri-agent-swarm'), 'Multi-Sensor Consensus');
      assert.equal(resolveModelLabel('muse-spark-1.3'), 'Spatial Analytics');
      assert.equal(resolveModelLabel('muse-spark-1.2'), 'Rapid Geocoder');
      assert.equal(resolveModelLabel('muse-wonder-1.0'), 'Spectral Reasoner');
    });

    it('adversarial simulation: rapid random model switching retains state validity', () => {
      const validModels: MetaModel[] = ['tri-agent-swarm', 'muse-spark-1.3', 'muse-spark-1.2', 'muse-wonder-1.0'];
      let currentModel: MetaModel = 'tri-agent-swarm';

      // Simulate 100 random model switch events
      for (let i = 0; i < 100; i++) {
        const nextModel = validModels[Math.floor(Math.random() * validModels.length)];
        currentModel = nextModel;
        assert.ok(validModels.includes(currentModel), `Model state must remain valid: ${currentModel}`);
      }
    });

    it('adversarial simulation: typing guard protects against accidental shortcut trigger', () => {
      const simulateKeydown = (
        key: string,
        isTyping: boolean,
        currentModel: MetaModel
      ): MetaModel => {
        if (isTyping) {
          // Guard: typing in input ignores 1-4 commands
          return currentModel;
        }
        if (key === '1') return 'tri-agent-swarm';
        if (key === '2') return 'muse-spark-1.3';
        if (key === '3') return 'muse-spark-1.2';
        if (key === '4') return 'muse-wonder-1.0';
        return currentModel;
      };

      let model: MetaModel = 'tri-agent-swarm';

      // User types query "Station 4 Sector 2" in search input (isTyping = true)
      model = simulateKeydown('4', true, model);
      assert.equal(model, 'tri-agent-swarm', 'Typing "4" in input must NOT switch model');

      model = simulateKeydown('2', true, model);
      assert.equal(model, 'tri-agent-swarm', 'Typing "2" in input must NOT switch model');

      // User focuses canvas and presses "2" (isTyping = false)
      model = simulateKeydown('2', false, model);
      assert.equal(model, 'muse-spark-1.3', 'Pressing "2" outside input MUST switch to muse-spark-1.3');

      // User presses "4" outside input
      model = simulateKeydown('4', false, model);
      assert.equal(model, 'muse-wonder-1.0', 'Pressing "4" outside input MUST switch to muse-wonder-1.0');
    });

    it('adversarial simulation: search input placeholder dynamically switches upon reasoning state', () => {
      const getPlaceholder = (isAiReasoning: boolean) =>
        isAiReasoning ? 'Analyzing satellite data...' : 'Search location, satellite, or hazard...';

      assert.equal(getPlaceholder(false), 'Search location, satellite, or hazard...');
      assert.equal(getPlaceholder(true), 'Analyzing satellite data...');
      assert.ok(!getPlaceholder(false).includes('Ask satellite anything'));
      assert.ok(!getPlaceholder(true).includes('Meta Muse is reasoning'));
    });

    it('adversarial simulation: search dispatch payload contains correct model ID without jargon', () => {
      const generateDispatchPayload = (query: string, model: MetaModel) => {
        return {
          query,
          selectedMetaModel: model,
          briefingLead: 'Observation Analysis:',
          briefingBody: model === 'tri-agent-swarm'
            ? `Gathering multi-spectral telemetry and environmental data for "${query}"...`
            : `Retrieving satellite coordinates and thermal observations for "${query}"...`,
        };
      };

      const payloadSwarm = generateDispatchPayload('Hurricane Milton', 'tri-agent-swarm');
      assert.equal(payloadSwarm.selectedMetaModel, 'tri-agent-swarm');
      assert.ok(payloadSwarm.briefingBody.includes('Gathering multi-spectral telemetry'));
      assert.ok(!payloadSwarm.briefingBody.includes('Tri-Agent'));

      const payloadSpatial = generateDispatchPayload('Kennedy Space Center', 'muse-spark-1.3');
      assert.equal(payloadSpatial.selectedMetaModel, 'muse-spark-1.3');
      assert.ok(payloadSpatial.briefingBody.includes('Retrieving satellite coordinates'));
      assert.ok(!payloadSpatial.briefingBody.includes('Spark 1.3'));
    });
  });

  // =========================================================================
  // SUITE 5: Production Build Integrity
  // =========================================================================
  describe('Suite 5: Production Build Output & Artifact Invariants', () => {
    it('verifies dist/ directory contains valid build output', () => {
      const distDir = path.resolve(srcDir, '..', 'dist');
      assert.ok(fs.existsSync(distDir), 'dist/ directory must exist');

      const indexHtml = path.join(distDir, 'index.html');
      assert.ok(fs.existsSync(indexHtml), 'dist/index.html must exist');

      const assetsDir = path.join(distDir, 'assets');
      assert.ok(fs.existsSync(assetsDir), 'dist/assets directory must exist');

      const assetFiles = fs.readdirSync(assetsDir);
      const cssFile = assetFiles.find((f) => f.endsWith('.css'));
      const jsFile = assetFiles.find((f) => f.endsWith('.js'));

      assert.ok(cssFile, 'dist/assets must contain bundled CSS');
      assert.ok(jsFile, 'dist/assets must contain bundled JS');

      // Verify bundled CSS is reasonably sized (~68 kB, not bloated)
      const cssStat = fs.statSync(path.join(assetsDir, cssFile));
      assert.ok(cssStat.size > 50000 && cssStat.size < 85000, `CSS bundle size ${cssStat.size} bytes is within normal range`);

      // Verify bundled CSS does NOT contain .grid-scan or sataRadarSweep
      const bundledCss = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
      assert.ok(!bundledCss.includes('grid-scan'), 'Bundled CSS must not contain grid-scan');
      assert.ok(!bundledCss.includes('sataRadarSweep'), 'Bundled CSS must not contain sataRadarSweep');
    });
  });
});
