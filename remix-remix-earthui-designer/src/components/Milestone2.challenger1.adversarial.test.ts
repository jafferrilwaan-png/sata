import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import components for static DOM testing
import { BottomCardsRow } from './BottomCardsRow';
import { ObservationSidebar } from './ObservationSidebar';
import { MetaDeepIntelligenceConsole } from './MetaDeepIntelligenceConsole';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

const ROOT_SRC = path.resolve(__dirname, '..');
const INDEX_CSS_FILE = path.resolve(ROOT_SRC, 'index.css');
const APP_TSX_FILE = path.resolve(ROOT_SRC, 'App.tsx');
const EARTH_GLOBE_CANVAS_FILE = path.resolve(__dirname, 'EarthGlobeCanvas.tsx');
const GRID_SCAN_FILE = path.resolve(__dirname, 'GridScan.tsx');

describe('Adversarial Stress Test: Milestone 2 (Frosted Glass Aesthetic & Typography Polish)', () => {
  const indexCss = fs.readFileSync(INDEX_CSS_FILE, 'utf8');
  const appTsx = fs.readFileSync(APP_TSX_FILE, 'utf8');
  const bottomCardsTsx = fs.readFileSync(path.resolve(__dirname, 'BottomCardsRow.tsx'), 'utf8');
  const observationSidebarTsx = fs.readFileSync(path.resolve(__dirname, 'ObservationSidebar.tsx'), 'utf8');
  const consoleTsx = fs.readFileSync(path.resolve(__dirname, 'MetaDeepIntelligenceConsole.tsx'), 'utf8');
  const shortcutsTsx = fs.readFileSync(path.resolve(__dirname, 'KeyboardShortcutsModal.tsx'), 'utf8');

  // =========================================================================
  // SECTION 1: Frosted Glass Aesthetic & Translucency Stress Tests
  // =========================================================================
  describe('Suite 1: High-Liquidity Frosted Glass Aesthetic & Specular Borders', () => {
    it('.sata-glass-card uses genuine neutral translucent background and blur >= 24px', () => {
      const match = indexCss.match(/\.sata-glass-card\s*\{([\s\S]*?)\}/);
      assert.ok(match, '.sata-glass-card rule must exist in index.css');
      const css = match[1];

      // Must be translucent white with alpha between 0.05 and 0.12
      assert.match(
        css,
        /background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[5-9]|0\.1[0-2]\)/,
        'Expected neutral translucent background rgba(255, 255, 255, 0.05-0.12)'
      );
      // No artificial cyan/blue gradients
      assert.doesNotMatch(css, /linear-gradient\(.*(?:rgba\(22,|rgba\(10,|rgba\(4,)/, 'Must not contain blue gradient');
      assert.doesNotMatch(css, /#070e22|#0e1017/, 'Must not contain opaque navy hex codes');

      // Blur must be at least 24px
      assert.match(css, /backdrop-filter:[^;]*blur\((?:2[4-9]|3\d|4\d)px\)/, 'backdrop-filter blur must be >= 24px');
      assert.match(css, /-webkit-backdrop-filter:[^;]*blur\((?:2[4-9]|3\d|4\d)px\)/, '-webkit-backdrop-filter blur must be >= 24px');

      // Saturation boost
      assert.match(css, /saturate\((?:1[5-9]\d|200)%\)/, 'Must have saturation boost >= 150%');

      // Specular border and inset specular highlight
      assert.match(css, /border:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255,\s*0\.1[0-9]\)/, 'Must have subtle 1px white border');
      assert.match(css, /inset\s+0\s+1px.*rgba\(255,\s*255,\s*255,\s*0\.[1-3]\d\)/, 'Must have inset specular highlight');
    });

    it('.sata-sidebar-glass uses neutral obsidian translucency (alpha <= 0.45) and blur >= 32px', () => {
      const match = indexCss.match(/\.sata-sidebar-glass\s*\{([\s\S]*?)\}/);
      assert.ok(match, '.sata-sidebar-glass rule must exist in index.css');
      const css = match[1];

      // Must have translucent dark background with alpha <= 0.45
      assert.match(
        css,
        /background:\s*rgba\(14,\s*18,\s*28,\s*0\.(?:3\d|4[0-5])\)/,
        'Expected translucent obsidian background rgba(14, 18, 28, 0.35-0.45)'
      );
      // Blur >= 32px
      assert.match(css, /backdrop-filter:[^;]*blur\((?:3[2-9]|[4-5]\d)px\)/, 'backdrop-filter blur must be >= 32px');
      assert.match(css, /saturate\((?:1[5-9]\d|200)%\)/, 'Must have saturation boost >= 150%');
      assert.match(css, /border:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255,\s*0\.1[0-9]\)/, 'Must have subtle 1px white border');
    });

    it('.sata-search-bar uses translucent obsidian background and blur >= 32px', () => {
      const match = indexCss.match(/\.sata-search-bar\s*\{([\s\S]*?)\}/);
      assert.ok(match, '.sata-search-bar rule must exist in index.css');
      const css = match[1];

      assert.match(
        css,
        /background:\s*rgba\(14,\s*18,\s*28,\s*0\.(?:3\d|4[0-5])\)/,
        'Expected translucent background'
      );
      assert.match(css, /backdrop-filter:[^;]*blur\((?:3[2-9]|[4-5]\d)px\)/, 'backdrop-filter blur must be >= 32px');
    });

    it('App.tsx search bar does NOT contain opaque masking overrides', () => {
      // Must not contain bg-[#0e1017]/85 or border-white/40 on the search bar
      assert.equal(appTsx.includes('bg-[#0e1017]/85'), false, 'Search bar must not have bg-[#0e1017]/85 override');
      assert.equal(appTsx.includes('bg-[#0e1017]'), false, 'App.tsx must not contain bg-[#0e1017]');

      // Search bar form element must use sata-search-bar
      assert.match(
        appTsx,
        /<form[\s\S]*?className="[^"]*sata-search-bar[^"]*"/,
        'Search bar container must use .sata-search-bar class'
      );
    });

    it('App.tsx model dropdown uses translucent obsidian glass (bg-black/60) with backdrop-blur-2xl', () => {
      assert.equal(appTsx.includes('bg-[#070e22]/95'), false, 'Dropdown must not use opaque bg-[#070e22]/95');
      assert.match(
        appTsx,
        /isModelMenuOpen\s*&&\s*\([\s\S]*?className="[^"]*bg-black\/60[^"]*backdrop-blur-2xl/,
        'Model dropdown must use bg-black/60 and backdrop-blur-2xl'
      );
    });

    it('MetaDeepIntelligenceConsole uses translucent obsidian glass (bg-black/45, blur 36px, saturate 170%)', () => {
      assert.equal(consoleTsx.includes('from-[#071630]/75'), false, 'Must not use opaque gradient from-[#071630]/75');
      assert.equal(consoleTsx.includes('to-[#040d1a]/80'), false, 'Must not use opaque gradient to-[#040d1a]/80');
      assert.match(
        consoleTsx,
        /<aside[^>]*className="[^"]*bg-black\/45[^"]*backdrop-blur-\[36px\][^"]*saturate-\[170%\]/,
        'Console must use bg-black/45 backdrop-blur-[36px] saturate-[170%]'
      );
    });

    it('KeyboardShortcutsModal uses translucent frosted glass (bg-black/55, backdrop-blur-2xl)', () => {
      assert.equal(shortcutsTsx.includes('bg-[#070e22]/90'), false, 'Modal must not use opaque bg-[#070e22]/90');
      assert.ok(shortcutsTsx.includes('bg-black/55'), 'Modal dialog must use bg-black/55');
      assert.ok(shortcutsTsx.includes('backdrop-blur-2xl'), 'Modal dialog must use backdrop-blur-2xl');
      assert.ok(shortcutsTsx.includes('border-white/16'), 'Modal dialog must use border-white/16');
    });
  });

  // =========================================================================
  // SECTION 2: Residual SVG Patterns, Dot Grids & Scanlines Stress Tests
  // =========================================================================
  describe('Suite 2: Absolute Elimination of Residual SVG Patterns, Dot Grids & Scanlines', () => {
    it('index.css has ZERO occurrences of .grid-scan rules', () => {
      assert.equal(indexCss.includes('.grid-scan'), false, 'index.css must not contain .grid-scan');
    });

    it('index.css has ZERO occurrences of sataRadarSweep keyframes or class', () => {
      assert.equal(indexCss.includes('sataRadarSweep'), false, 'index.css must not contain sataRadarSweep');
      assert.equal(indexCss.includes('sata-radar-sweep'), false, 'index.css must not contain .sata-radar-sweep');
    });

    it('index.css has ZERO radial-gradient or repeating-gradient dot patterns', () => {
      assert.equal(indexCss.includes('radial-gradient'), false, 'index.css must not contain radial-gradient');
      assert.doesNotMatch(indexCss, /repeating-(?:linear|radial)-gradient/i, 'index.css must not contain repeating gradients');
    });

    it('No SVG pattern tags or SVG data URIs across all UI components', () => {
      const files = [
        INDEX_CSS_FILE,
        APP_TSX_FILE,
        path.resolve(__dirname, 'BottomCardsRow.tsx'),
        path.resolve(__dirname, 'ObservationSidebar.tsx'),
        path.resolve(__dirname, 'MetaDeepIntelligenceConsole.tsx'),
        path.resolve(__dirname, 'KeyboardShortcutsModal.tsx'),
        path.resolve(__dirname, 'TopNavbar.tsx'),
      ];

      for (const f of files) {
        const content = fs.readFileSync(f, 'utf8');
        assert.equal(content.includes('<pattern'), false, `${path.basename(f)} must not contain SVG <pattern>`);
        assert.doesNotMatch(content, /data:image\/svg\+xml/i, `${path.basename(f)} must not contain SVG data URIs`);
        assert.doesNotMatch(content, /url\(#\w+\)/i, `${path.basename(f)} must not contain SVG url(#...) fill`);
      }
    });

    it('GridScan.tsx is completely empty (export {};) and not used anywhere in App.tsx', () => {
      const gridContent = fs.readFileSync(GRID_SCAN_FILE, 'utf8').trim();
      assert.equal(gridContent, 'export {};', 'GridScan.tsx must be defused to "export {};"');
      assert.equal(appTsx.includes('GridScan'), false, 'App.tsx must not import or render GridScan');
    });

    it('EarthGlobeCanvas.tsx WebGL terrain shaders are completely intact', () => {
      const globeContent = fs.readFileSync(EARTH_GLOBE_CANVAS_FILE, 'utf8');
      assert.ok(globeContent.includes('microTerrainNoise'), 'EarthGlobeCanvas must retain microTerrainNoise');
      assert.ok(globeContent.includes('noise2DSurf'), 'EarthGlobeCanvas must retain noise2DSurf');
      assert.ok(globeContent.includes('fbmSurfCloud'), 'EarthGlobeCanvas must retain fbmSurfCloud');
      assert.ok(globeContent.includes('evalDayLandMask'), 'EarthGlobeCanvas must retain evalDayLandMask');
      assert.ok(globeContent.includes('computeSmallIslandField'), 'EarthGlobeCanvas must retain computeSmallIslandField');
    });
  });

  // =========================================================================
  // SECTION 3: Typography Polish & AI De-Jargoning Tests
  // =========================================================================
  describe('Suite 3: Typography Polish, AI De-Jargoning & Internal ID Preservation', () => {
    const FORBIDDEN_JARGON = [
      'Meta Muse is reasoning...',
      'Tri-Agent Swarm',
      'Meta Tri-Agent AI Matrix:',
      'Spark 1.3 Spatial',
      'Wonder 1.0 Physics',
      'Spark 1.2 Tactical',
      'Pro navigation like desktop and pro apps',
      'GLOBAL DISASTERS NASA',
      'SGP4 Locked',
      'Live SGP4 Telemetry',
      '0.28m SGP4 Optical',
      'Fetching real-time satellite telemetry...',
      'Thermal Telemetry',
      'NOAA Orbital Stream • 60 FPS',
    ];

    it('All UI component files are completely free from forbidden robotic jargon in display copy', () => {
      const filesToCheck = [
        { name: 'App.tsx', content: appTsx },
        { name: 'BottomCardsRow.tsx', content: bottomCardsTsx },
        { name: 'ObservationSidebar.tsx', content: observationSidebarTsx },
        { name: 'MetaDeepIntelligenceConsole.tsx', content: consoleTsx },
        { name: 'KeyboardShortcutsModal.tsx', content: shortcutsTsx },
      ];

      for (const file of filesToCheck) {
        for (const jargon of FORBIDDEN_JARGON) {
          assert.equal(
            file.content.includes(`'${jargon}'`) || file.content.includes(`"${jargon}"`),
            false,
            `${file.name} must not contain forbidden jargon string: "${jargon}"`
          );
        }
      }
    });

    it('App.tsx uses human-readable model labels while preserving internal model IDs', () => {
      // Must preserve exact string IDs in state and handlers
      assert.ok(appTsx.includes("'tri-agent-swarm'"), 'App.tsx must preserve id tri-agent-swarm');
      assert.ok(appTsx.includes("'muse-spark-1.3'"), 'App.tsx must preserve id muse-spark-1.3');
      assert.ok(appTsx.includes("'muse-spark-1.2'"), 'App.tsx must preserve id muse-spark-1.2');
      assert.ok(appTsx.includes("'muse-wonder-1.0'"), 'App.tsx must preserve id muse-wonder-1.0');

      // Must display human-readable labels
      assert.ok(appTsx.includes("'Multi-Sensor Consensus'"), 'App.tsx must display "Multi-Sensor Consensus"');
      assert.ok(appTsx.includes("'Spatial Analytics'"), 'App.tsx must display "Spatial Analytics"');
      assert.ok(appTsx.includes("'Rapid Geocoder'"), 'App.tsx must display "Rapid Geocoder"');
      assert.ok(appTsx.includes("'Spectral Reasoner'"), 'App.tsx must display "Spectral Reasoner"');

      // Search placeholder
      assert.ok(appTsx.includes("'Analyzing satellite data...'"), 'App.tsx must use clean reasoning placeholder');
      assert.ok(appTsx.includes("'Search location, satellite, or hazard...'"), 'App.tsx must use clean idle placeholder');
    });

    it('BottomCardsRow displays "GLOBAL HAZARDS (NASA)" and "Live Global Hazards"', () => {
      assert.ok(bottomCardsTsx.includes('GLOBAL HAZARDS (NASA)'), 'Must have heading "GLOBAL HAZARDS (NASA)"');
      assert.ok(bottomCardsTsx.includes('aria-label="Live Global Hazards"'), 'Must have aria-label="Live Global Hazards"');
    });

    it('ObservationSidebar displays clean telemetry and insight labels', () => {
      assert.ok(observationSidebarTsx.includes("'Observation Insight:'"), 'Must have fallback "Observation Insight:"');
      assert.ok(observationSidebarTsx.includes('Spatial Mapping'), 'Must have badge "Spatial Mapping"');
      assert.ok(observationSidebarTsx.includes('Atmospheric Physics'), 'Must have badge "Atmospheric Physics"');
      assert.ok(observationSidebarTsx.includes('Surface Telemetry'), 'Must have badge "Surface Telemetry"');
      assert.ok(observationSidebarTsx.includes('Live Orbital Telemetry'), 'Must have label "Live Orbital Telemetry"');
    });

    it('MetaDeepIntelligenceConsole displays clean human copy', () => {
      assert.ok(consoleTsx.includes('Orbital Track Locked'), 'Must display "Orbital Track Locked"');
      assert.ok(consoleTsx.includes('NOAA Satellite Stream • Live'), 'Must display "NOAA Satellite Stream • Live"');
      assert.ok(consoleTsx.includes('0.28m Optical Stream'), 'Must display "0.28m Optical Stream"');
      assert.ok(consoleTsx.includes('Thermal Sensor Scan'), 'Must display "Thermal Sensor Scan"');
      assert.ok(consoleTsx.includes('Retrieving live satellite observations...'), 'Must display clean loading string');
    });

    it('KeyboardShortcutsModal displays human-readable shortcut guide', () => {
      assert.ok(shortcutsTsx.includes("'Analysis Models & Modes'"), 'Must display section "Analysis Models & Modes"');
      assert.ok(shortcutsTsx.includes("'Multi-Sensor Consensus (Parallel Analysis)'"), 'Must display Multi-Sensor Consensus');
      assert.ok(shortcutsTsx.includes("'Spatial Analytics (Precision Mapping)'"), 'Must display Spatial Analytics');
      assert.ok(shortcutsTsx.includes("'Rapid Geocoder (Instant Coordinates)'"), 'Must display Rapid Geocoder');
      assert.ok(shortcutsTsx.includes("'Spectral Reasoner (Physics & Infrared)'"), 'Must display Spectral Reasoner');
      assert.ok(shortcutsTsx.includes('Quick keyboard navigation and controls'), 'Must display clean subtitle');
    });
  });

  // =========================================================================
  // SECTION 4: DOM Static Rendering Verification
  // =========================================================================
  describe('Suite 4: DOM Static Markup & Hierarchy Verification', () => {
    it('BottomCardsRow renders 3 glass cards without crashing when given complete props', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(BottomCardsRow, {
          releases: [
            {
              id: 'rel-1',
              dateBadge: 'OCT 28',
              providerLine1: 'NASA FIRMS VIIRS',
              providerLine2: 'Direct Radiative FRP Pass',
              statusText: 'PROCESSED',
            },
          ],
          sensors: [
            {
              id: 'sens-1',
              sensorName: 'VIIRS Thermal Radiance',
              valueText: '42.8 W/m²',
              statusText: 'NOMINAL',
            },
          ],
          liveIncidents: [],
          onSelectIncident: () => {},
        })
      );

      assert.ok(html.includes('GLOBAL HAZARDS (NASA)'), 'Must render GLOBAL HAZARDS (NASA)');
      assert.ok(html.includes('sata-glass-card'), 'Must render sata-glass-card');
      const glassCardCount = (html.match(/sata-glass-card/g) || []).length;
      assert.equal(glassCardCount, 3, 'Must render exactly 3 sata-glass-card elements');
    });

    it('ObservationSidebar renders sata-sidebar-glass and sata-ai-card cleanly', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ObservationSidebar, {
          activeHeatSpots: 84,
          aiInsightLead: '',
          aiInsightBody: 'Multiple active thermal clusters detected in agricultural region.',
          adjustOrbitEnabled: false,
          onToggleAdjustOrbit: () => {},
          selectedTimelineDay: 28,
          onSelectTimelineDay: () => {},
        })
      );

      assert.ok(html.includes('sata-sidebar-glass'), 'Root must include sata-sidebar-glass');
      assert.ok(html.includes('sata-ai-card'), 'Must include sata-ai-card');
      assert.ok(html.includes('Observation Insight:'), 'Empty aiInsightLead must fallback to Observation Insight:');
      assert.ok(html.includes('Spatial Mapping'), 'Must render Spatial Mapping');
      assert.ok(html.includes('Live Orbital Telemetry'), 'Must render Live Orbital Telemetry');
    });

    it('MetaDeepIntelligenceConsole renders obsidian glass container and header cleanly', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MetaDeepIntelligenceConsole, {
          targetName: 'Wildfire South Tank Trail',
          lat: 31.0858,
          lon: -89.0978,
          briefingLead: 'Thermal Analysis',
          briefingBody: 'High-intensity thermal anomalies detected by VIIRS sensor.',
          onClose: () => {},
          isAgentExecuting: false,
        })
      );

      assert.ok(html.includes('bg-black/45'), 'Container must have bg-black/45');
      assert.ok(html.includes('backdrop-blur-[36px]'), 'Container must have backdrop-blur-[36px]');
      assert.ok(html.includes('Orbital Track Locked'), 'Header must show Orbital Track Locked');
      assert.ok(html.includes('Thermal Sensor Scan'), 'Action chips must show Thermal Sensor Scan');
    });

    it('KeyboardShortcutsModal renders clean dialog surface and shortcut items', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(KeyboardShortcutsModal, {
          isOpen: true,
          onClose: () => {},
        })
      );

      assert.ok(html.includes('bg-black/55'), 'Dialog must have bg-black/55');
      assert.ok(html.includes('backdrop-blur-2xl'), 'Dialog must have backdrop-blur-2xl');
      assert.ok(html.includes('Analysis Models &amp; Modes') || html.includes('Analysis Models & Modes'));
      assert.ok(html.includes('Multi-Sensor Consensus (Parallel Analysis)'));
    });
  });
});
