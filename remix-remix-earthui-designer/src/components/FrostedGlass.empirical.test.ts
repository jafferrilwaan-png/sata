import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Component imports for empirical DOM rendering
import { BottomCardsRow } from './BottomCardsRow';
import { ObservationSidebar } from './ObservationSidebar';
import { MetaDeepIntelligenceConsole } from './MetaDeepIntelligenceConsole';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { TopNavbar } from './TopNavbar';
import { LiquidTimeline } from './LiquidTimeline';

const SRC_DIR = path.resolve(__dirname, '..');
const INDEX_CSS_PATH = path.resolve(SRC_DIR, 'index.css');
const APP_TSX_PATH = path.resolve(SRC_DIR, 'App.tsx');
const EARTH_GLOBE_CANVAS_PATH = path.resolve(__dirname, 'EarthGlobeCanvas.tsx');
const GRID_SCAN_PATH = path.resolve(__dirname, 'GridScan.tsx');

describe('Milestone 2: High-Liquidity Frosted Glass Aesthetic & Texture Elimination Empirical Suite', () => {
  const indexCss = fs.readFileSync(INDEX_CSS_PATH, 'utf8');
  const appTsx = fs.readFileSync(APP_TSX_PATH, 'utf8');

  // ---------------------------------------------------------------------------
  // SUITE 1: Texture Elimination & Zero Artifacts Invariant
  // ---------------------------------------------------------------------------
  describe('Suite 1: Texture Elimination & Zero Artifacts Invariant', () => {
    it('verifies ZERO occurrences of .grid-scan or grid-scan rules in index.css', () => {
      const match = indexCss.match(/\.grid-scan/);
      assert.equal(
        match,
        null,
        'index.css must not contain any .grid-scan class declarations'
      );
    });

    it('verifies ZERO occurrences of .sata-radar-sweep or @keyframes sataRadarSweep in index.css', () => {
      assert.equal(
        indexCss.includes('sataRadarSweep'),
        false,
        'index.css must not contain sataRadarSweep keyframes'
      );
      assert.equal(
        indexCss.includes('sata-radar-sweep'),
        false,
        'index.css must not contain .sata-radar-sweep class'
      );
    });

    it('verifies ZERO occurrences of radial-gradient in index.css', () => {
      assert.equal(
        indexCss.includes('radial-gradient'),
        false,
        'index.css must not contain radial-gradient patterns'
      );
    });

    it('verifies ZERO occurrences of repeating linear or radial gradients in index.css', () => {
      assert.equal(
        /repeating-(linear|radial)-gradient/i.test(indexCss),
        false,
        'index.css must not contain repeating gradient textures'
      );
    });

    it('verifies ZERO occurrences of SVG <pattern> tags or SVG data URIs in stylesheet and panel files', () => {
      const targetFiles = [
        INDEX_CSS_PATH,
        APP_TSX_PATH,
        path.resolve(__dirname, 'BottomCardsRow.tsx'),
        path.resolve(__dirname, 'ObservationSidebar.tsx'),
        path.resolve(__dirname, 'MetaDeepIntelligenceConsole.tsx'),
        path.resolve(__dirname, 'KeyboardShortcutsModal.tsx'),
        path.resolve(__dirname, 'TopNavbar.tsx'),
        path.resolve(__dirname, 'LiquidTimeline.tsx'),
      ];

      for (const filePath of targetFiles) {
        const content = fs.readFileSync(filePath, 'utf8');
        assert.equal(
          content.includes('<pattern'),
          false,
          `File ${path.basename(filePath)} must not contain SVG <pattern> elements`
        );
        assert.equal(
          /data:image\/svg\+xml/i.test(content),
          false,
          `File ${path.basename(filePath)} must not contain inline SVG data URIs`
        );
        assert.equal(
          /url\(#\w+\)/i.test(content),
          false,
          `File ${path.basename(filePath)} must not contain SVG url(#...) fill references`
        );
      }
    });

    it('verifies GridScan.tsx is completely pruned and orphaned logic eliminated', () => {
      const gridScanContent = fs.readFileSync(GRID_SCAN_PATH, 'utf8').trim();
      assert.ok(
        gridScanContent === 'export {};' || gridScanContent.length < 50,
        'GridScan.tsx must be completely defused to export {} with zero active shaders or DOM nodes'
      );
      assert.equal(
        gridScanContent.includes('face-api'),
        false,
        'GridScan.tsx must not contain face-api CDN hooks'
      );
      assert.equal(
        gridScanContent.includes('three'),
        false,
        'GridScan.tsx must not instantiate three.js scenes or canvas elements'
      );
    });

    it('verifies WebGL GLSL procedural terrain and cloud shaders in EarthGlobeCanvas.tsx are preserved', () => {
      const globeContent = fs.readFileSync(EARTH_GLOBE_CANVAS_PATH, 'utf8');
      assert.ok(
        globeContent.includes('noise2DSurf'),
        'EarthGlobeCanvas.tsx must preserve noise2DSurf terrain shader'
      );
      assert.ok(
        globeContent.includes('microTerrainNoise'),
        'EarthGlobeCanvas.tsx must preserve microTerrainNoise analytical relief shader'
      );
      assert.ok(
        globeContent.includes('fbmSurfCloud'),
        'EarthGlobeCanvas.tsx must preserve fbmSurfCloud procedural cloud shader'
      );
      assert.ok(
        globeContent.includes('computeSmallIslandField'),
        'EarthGlobeCanvas.tsx must preserve computeSmallIslandField procedural island generator'
      );
    });
  });

  // ---------------------------------------------------------------------------
  // SUITE 2: High-Liquidity Neutral Frosted Glass Stylesheet Rules
  // ---------------------------------------------------------------------------
  describe('Suite 2: High-Liquidity Neutral Frosted Glass Stylesheet Rules', () => {
    it('verifies .sata-glass-card has neutral translucent fill, high blur, saturation boost, and subtle border', () => {
      const glassCardBlock = indexCss.match(/\.sata-glass-card\s*\{([\s\S]*?)\}/);
      assert.ok(glassCardBlock, '.sata-glass-card CSS block must exist');
      const body = glassCardBlock[1];

      // Background must be translucent white (alpha <= 0.12)
      assert.ok(
        /background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[5-9]\)/.test(body) ||
        /background:\s*rgba\(255,\s*255,\s*255,\s*0\.1[0-2]\)/.test(body),
        `.sata-glass-card must use neutral translucent white background, found: ${body}`
      );
      // Backdrop filter blur >= 24px and saturate >= 160%
      assert.ok(
        /backdrop-filter:[^;]*blur\((2[4-9]|[3-9]\d)px\)/.test(body),
        '.sata-glass-card must have backdrop-filter with blur >= 24px'
      );
      assert.ok(
        /backdrop-filter:[^;]*saturate\((1[6-9]\d|2\d\d)%\)/.test(body),
        '.sata-glass-card must have backdrop-filter with saturate >= 160%'
      );
      // Webkit prefix
      assert.ok(
        body.includes('-webkit-backdrop-filter:'),
        '.sata-glass-card must provide -webkit-backdrop-filter for Safari/iOS support'
      );
      // Border: subtle 1px white border (alpha <= 0.25)
      assert.ok(
        /border:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255,\s*0\.(0\d|1\d|2[0-5])\)/.test(body),
        '.sata-glass-card must specify subtle 1px white border'
      );
      // Specular highlight: inset top 1px
      assert.ok(
        body.includes('inset 0 1px'),
        '.sata-glass-card must include top specular highlight inset 0 1px'
      );
    });

    it('verifies .sata-sidebar-glass has neutral translucent dark fill, 36px blur, 170% saturate, and subtle border', () => {
      const sidebarBlock = indexCss.match(/\.sata-sidebar-glass\s*\{([\s\S]*?)\}/);
      assert.ok(sidebarBlock, '.sata-sidebar-glass CSS block must exist');
      const body = sidebarBlock[1];

      assert.ok(
        /background:\s*rgba\(14,\s*18,\s*28,\s*0\.(3\d|4[0-5])\)/.test(body),
        `.sata-sidebar-glass must use translucent dark background (alpha ~0.42), found: ${body}`
      );
      assert.ok(
        /backdrop-filter:[^;]*blur\(36px\)/.test(body),
        '.sata-sidebar-glass must have blur(36px)'
      );
      assert.ok(
        /backdrop-filter:[^;]*saturate\(170%\)/.test(body),
        '.sata-sidebar-glass must have saturate(170%)'
      );
      assert.ok(
        body.includes('-webkit-backdrop-filter:'),
        '.sata-sidebar-glass must include -webkit-backdrop-filter'
      );
      assert.ok(
        /border:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255,\s*0\.1[0-9]\)/.test(body),
        '.sata-sidebar-glass must specify subtle 1px white border'
      );
    });

    it('verifies .sata-search-bar has neutral translucent dark fill, 36px blur, 170% saturate, and subtle border', () => {
      const searchBarBlock = indexCss.match(/\.sata-search-bar\s*\{([\s\S]*?)\}/);
      assert.ok(searchBarBlock, '.sata-search-bar CSS block must exist');
      const body = searchBarBlock[1];

      assert.ok(
        /background:\s*rgba\(14,\s*18,\s*28,\s*0\.(3\d|4[0-5])\)/.test(body),
        `.sata-search-bar must use translucent dark background (alpha ~0.42), found: ${body}`
      );
      assert.ok(
        /backdrop-filter:[^;]*blur\(36px\)/.test(body),
        '.sata-search-bar must have blur(36px)'
      );
      assert.ok(
        /backdrop-filter:[^;]*saturate\(170%\)/.test(body),
        '.sata-search-bar must have saturate(170%)'
      );
      assert.ok(
        body.includes('-webkit-backdrop-filter:'),
        '.sata-search-bar must include -webkit-backdrop-filter'
      );
      assert.ok(
        /border:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255,\s*0\.1[0-9]\)/.test(body),
        '.sata-search-bar must specify subtle 1px white border'
      );
    });

    it('verifies .sata-ai-card has neutral translucent fill, 20px blur, and 160% saturate', () => {
      const aiCardBlock = indexCss.match(/\.sata-ai-card\s*\{([\s\S]*?)\}/);
      assert.ok(aiCardBlock, '.sata-ai-card CSS block must exist');
      const body = aiCardBlock[1];

      assert.ok(
        /background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[4-8]\)/.test(body),
        '.sata-ai-card must use translucent white background (alpha ~0.05)'
      );
      assert.ok(
        /backdrop-filter:[^;]*blur\(20px\)/.test(body),
        '.sata-ai-card must have blur(20px)'
      );
      assert.ok(
        /backdrop-filter:[^;]*saturate\(160%\)/.test(body),
        '.sata-ai-card must have saturate(160%)'
      );
      assert.ok(
        body.includes('-webkit-backdrop-filter:'),
        '.sata-ai-card must include -webkit-backdrop-filter'
      );
    });

    it('verifies interactive pill elements (.sata-home-pill, .sata-icon-btn, .sata-date-pill) feature physical blur and subtle borders', () => {
      assert.ok(
        indexCss.includes('.sata-home-pill'),
        '.sata-home-pill rule must exist'
      );
      assert.ok(
        /(\.sata-home-pill[\s\S]*?backdrop-filter:[^;]*blur\()/.test(indexCss),
        '.sata-home-pill must have backdrop-filter blur'
      );

      assert.ok(
        indexCss.includes('.sata-icon-btn'),
        '.sata-icon-btn rule must exist'
      );
      assert.ok(
        /(\.sata-icon-btn[\s\S]*?backdrop-filter:[^;]*blur\()/.test(indexCss),
        '.sata-icon-btn must have backdrop-filter blur'
      );

      assert.ok(
        indexCss.includes('.sata-date-pill'),
        '.sata-date-pill rule must exist'
      );
      assert.ok(
        /(\.sata-date-pill[\s\S]*?backdrop-filter:[^;]*blur\()/.test(indexCss),
        '.sata-date-pill must have backdrop-filter blur'
      );
    });
  });

  // ---------------------------------------------------------------------------
  // SUITE 3: Search Bar Container Absolute Transparency Verification
  // ---------------------------------------------------------------------------
  describe('Suite 3: Search Bar Container Absolute Transparency Verification', () => {
    it('verifies search bar container has ZERO occurrences of bg-[#0e1017]/85 or opaque background utilities', () => {
      // Direct assertion across App.tsx
      assert.equal(
        appTsx.includes('bg-[#0e1017]'),
        false,
        'App.tsx must not contain bg-[#0e1017]'
      );
      assert.equal(
        appTsx.includes('bg-[#0e1017]/85'),
        false,
        'App.tsx must not contain bg-[#0e1017]/85'
      );

      // Verify the renderSearchBar function specifically
      const renderSearchBarBlock = appTsx.match(/const renderSearchBar = \([\s\S]*?return \([\s\S]*?\);/);
      const searchBlock = renderSearchBarBlock
        ? renderSearchBarBlock[0]
        : appTsx.match(/const renderSearchBar = \([^)]*\)\s*=>\s*\([\s\S]*?<\/form>/)?.[0];

      assert.ok(searchBlock, 'renderSearchBar implementation must exist in App.tsx');

      // The form container MUST include sata-search-bar
      assert.ok(
        searchBlock.includes('sata-search-bar'),
        'search bar form container must declare sata-search-bar class'
      );

      // Must not contain opaque bg- overrides
      assert.equal(
        /bg-\[#(?:[0-9a-fA-F]{6})\]\/(?:[7-9]\d|100)/.test(searchBlock),
        false,
        `search bar container must not contain opaque hex background overrides, found in: ${searchBlock}`
      );

      // Must not contain heavy border-white/40 override
      assert.equal(
        searchBlock.includes('border-white/40'),
        false,
        'search bar container must not contain heavy border-white/40 override'
      );
    });

    it('verifies search bar model dropdown menu uses translucent bg-black/60 and backdrop-blur-2xl', () => {
      const dropdownMenuMatch = appTsx.match(/\{isModelMenuOpen && \([\s\S]*?className="([^"]*)"/);
      assert.ok(dropdownMenuMatch, 'isModelMenuOpen dropdown container must exist in App.tsx');
      const menuClasses = dropdownMenuMatch[1];

      assert.equal(
        menuClasses.includes('bg-[#070e22]'),
        false,
        'Model dropdown menu must not contain opaque navy bg-[#070e22]'
      );
      assert.ok(
        menuClasses.includes('bg-black/60') || menuClasses.includes('bg-black/55') || menuClasses.includes('bg-black/50'),
        `Model dropdown menu must use translucent black background, found: ${menuClasses}`
      );
      assert.ok(
        menuClasses.includes('backdrop-blur-2xl'),
        `Model dropdown menu must have backdrop-blur-2xl, found: ${menuClasses}`
      );
      assert.ok(
        menuClasses.includes('border-white/15') || menuClasses.includes('border-white/14') || menuClasses.includes('border-white/16'),
        `Model dropdown menu must have subtle border-white/15, found: ${menuClasses}`
      );
    });
  });

  // ---------------------------------------------------------------------------
  // SUITE 4: Primary Floating Panels DOM & Static Markup Verification
  // ---------------------------------------------------------------------------
  describe('Suite 4: Primary Floating Panels DOM & Static Markup Verification', () => {
    it('verifies BottomCardsRow renders all 3 primary cards with .sata-glass-card and subtle white borders', () => {
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
        })
      );

      // Verify all 3 sections have sata-glass-card
      const glassCardCount = (html.match(/class="[^"]*sata-glass-card[^"]*"/g) || []).length;
      assert.equal(
        glassCardCount,
        3,
        `BottomCardsRow must render exactly 3 sections with sata-glass-card, found ${glassCardCount}`
      );

      // Verify subtle border-b border-white/10 inside cards
      assert.ok(
        html.includes('border-b border-white/10'),
        'BottomCardsRow cards must have subtle border-b border-white/10 header dividers'
      );

      // Verify date pills present
      assert.ok(
        html.includes('sata-date-pill'),
        'BottomCardsRow must render sata-date-pill elements'
      );
    });

    it('verifies ObservationSidebar renders root container with .sata-sidebar-glass and subcards with glass styling', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ObservationSidebar, {
          activeHeatSpots: 42,
          aiInsightLead: 'Observation Insight:',
          aiInsightBody: 'Satellite sensors confirm active thermal anomalies.',
          adjustOrbitEnabled: false,
          onToggleAdjustOrbit: () => {},
          selectedTimelineDay: 28,
          onSelectTimelineDay: () => {},
        })
      );

      // Root aside element
      const asideMatch = html.match(/<aside[^>]*class="([^"]*)"/);
      assert.ok(asideMatch, 'ObservationSidebar must render <aside> root element');
      const asideClasses = asideMatch[1];
      assert.ok(
        asideClasses.includes('sata-sidebar-glass'),
        'ObservationSidebar root <aside> must have .sata-sidebar-glass'
      );

      // AI Insights subcard must have .sata-ai-card
      assert.ok(
        html.includes('sata-ai-card'),
        'ObservationSidebar AI Insights card must have .sata-ai-card'
      );

      // Satellite Orbit status subcard must have subtle border and backdrop blur
      assert.ok(
        html.includes('backdrop-blur-2xl'),
        'Satellite Orbit subcard must specify backdrop-blur-2xl'
      );
      assert.ok(
        html.includes('border-white/15'),
        'Satellite Orbit subcard must specify border-white/15'
      );

      // Recommendations subcard must have subtle border and backdrop blur
      assert.ok(
        html.includes('backdrop-blur-md'),
        'Recommendations subcard must specify backdrop-blur-md'
      );
      assert.ok(
        html.includes('border-white/14'),
        'Recommendations subcard must specify border-white/14'
      );
    });

    it('verifies MetaDeepIntelligenceConsole renders container with high-liquidity glass and zero opaque gradients', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MetaDeepIntelligenceConsole, {
          targetName: 'Chennai Thermal Sector',
          lat: 13.08,
          lon: 80.27,
          activeHeatSpots: 18,
          layerType: 'VIIRS_THERMAL',
          briefingLead: 'Observation Insight:',
          briefingBody: 'Live thermal sensors observe low-intensity emissions.',
          onClose: () => {},
        })
      );

      // Root container class
      const asideMatch = html.match(/<aside[^>]*class="([^"]*)"/);
      assert.ok(asideMatch, 'MetaDeepIntelligenceConsole must render <aside> element');
      const asideClasses = asideMatch[1];

      // Must have translucent background and high blur
      assert.ok(
        asideClasses.includes('bg-black/45') || asideClasses.includes('bg-black/50') || asideClasses.includes('bg-black/40'),
        `Console must have translucent dark background, found: ${asideClasses}`
      );
      assert.ok(
        asideClasses.includes('backdrop-blur-[36px]') || asideClasses.includes('backdrop-blur-3xl'),
        `Console must have 36px backdrop blur, found: ${asideClasses}`
      );
      assert.ok(
        asideClasses.includes('saturate-[170%]'),
        `Console must have saturate-[170%], found: ${asideClasses}`
      );
      assert.ok(
        asideClasses.includes('border-white/14') || asideClasses.includes('border-white/15'),
        `Console must have subtle border-white/14, found: ${asideClasses}`
      );

      // Must NOT contain old opaque navy gradients
      assert.equal(
        asideClasses.includes('from-[#071630]'),
        false,
        'Console must not contain opaque navy gradient from-[#071630]'
      );
      assert.equal(
        asideClasses.includes('to-[#040d1a]'),
        false,
        'Console must not contain opaque navy gradient to-[#040d1a]'
      );
    });

    it('verifies KeyboardShortcutsModal renders dialog surface with neutral frosted glass and zero opaque navy', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(KeyboardShortcutsModal, {
          isOpen: true,
          onClose: () => {},
        })
      );

      // Modal container surface
      assert.ok(
        html.includes('backdrop-blur-2xl'),
        'KeyboardShortcutsModal surface must have backdrop-blur-2xl'
      );
      assert.ok(
        html.includes('bg-black/55') || html.includes('bg-black/60') || html.includes('bg-black/50'),
        'KeyboardShortcutsModal surface must have translucent black background'
      );
      assert.ok(
        html.includes('border-white/16') || html.includes('border-white/15'),
        'KeyboardShortcutsModal surface must have subtle border-white/16'
      );

      // Must NOT contain old opaque navy fill bg-[#070e22]/90
      assert.equal(
        html.includes('bg-[#070e22]'),
        false,
        'KeyboardShortcutsModal must not contain opaque navy fill bg-[#070e22]'
      );
    });

    it('verifies LiquidTimeline renders with .sata-date-pill, backdrop-blur-2xl, and subtle border', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(LiquidTimeline, {
          selectedDay: 28,
          onSelectDay: () => {},
          isPlaying: false,
          onTogglePlay: () => {},
        })
      );

      assert.ok(
        html.includes('sata-date-pill'),
        'LiquidTimeline must render with sata-date-pill class'
      );
      assert.ok(
        html.includes('backdrop-blur-2xl'),
        'LiquidTimeline must have backdrop-blur-2xl'
      );
      assert.ok(
        html.includes('border-white/20') || html.includes('border-white/15'),
        'LiquidTimeline must have subtle border-white/20'
      );
    });
  });

  // ---------------------------------------------------------------------------
  // SUITE 5: Typography Polish & AI De-Jargoning Invariants
  // ---------------------------------------------------------------------------
  describe('Suite 5: Typography Polish & AI De-Jargoning Invariants', () => {
    it('verifies ZERO occurrences of robotic AI buzzwords across application markup and source', () => {
      const sourceFiles = [
        APP_TSX_PATH,
        path.resolve(__dirname, 'ObservationSidebar.tsx'),
        path.resolve(__dirname, 'BottomCardsRow.tsx'),
        path.resolve(__dirname, 'MetaDeepIntelligenceConsole.tsx'),
        path.resolve(__dirname, 'KeyboardShortcutsModal.tsx'),
      ];

      const forbiddenJargon = [
        'Meta Muse is reasoning...',
        'Ask satellite anything...',
        'Meta Tri-Agent AI Matrix:',
        'Tri-Agent Swarm (All 3 Models Parallel)',
        'Execute Tri-Agent geospatial analysis',
        'Spark 1.3 Spatial',
        'Wonder 1.0 Physics',
        'Spark 1.2 Tactical',
        'SGP4 Locked',
      ];

      for (const filePath of sourceFiles) {
        const content = fs.readFileSync(filePath, 'utf8');
        for (const jargon of forbiddenJargon) {
          assert.equal(
            content.includes(jargon),
            false,
            `File ${path.basename(filePath)} must not contain robotic jargon "${jargon}"`
          );
        }
      }
    });

    it('verifies verified presence of human-readable copy across primary components', () => {
      const bottomHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(BottomCardsRow, {
          releases: [],
          sensors: [],
          liveIncidents: [],
        })
      );
      assert.ok(
        bottomHtml.includes('GLOBAL HAZARDS (NASA)'),
        'BottomCardsRow must display clean title "GLOBAL HAZARDS (NASA)"'
      );

      const sidebarHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ObservationSidebar, {
          activeHeatSpots: 5,
          aiInsightLead: '',
          aiInsightBody: 'All thermal parameters normal.',
          adjustOrbitEnabled: false,
          onToggleAdjustOrbit: () => {},
          selectedTimelineDay: 28,
          onSelectTimelineDay: () => {},
        })
      );
      assert.ok(
        sidebarHtml.includes('Spatial Mapping'),
        'ObservationSidebar must display task badge "Spatial Mapping"'
      );
      assert.ok(
        sidebarHtml.includes('Atmospheric Physics'),
        'ObservationSidebar must display task badge "Atmospheric Physics"'
      );
      assert.ok(
        sidebarHtml.includes('Surface Telemetry'),
        'ObservationSidebar must display task badge "Surface Telemetry"'
      );
      assert.ok(
        sidebarHtml.includes('Live Orbital Telemetry'),
        'ObservationSidebar must display "Live Orbital Telemetry"'
      );

      const consoleHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MetaDeepIntelligenceConsole, {
          targetName: 'Chennai Test',
          lat: 13.08,
          lon: 80.27,
          activeHeatSpots: 3,
          layerType: 'THERMAL',
          briefingLead: 'Observation Insight:',
          briefingBody: 'Normal telemetry.',
          onClose: () => {},
        })
      );
      assert.ok(
        consoleHtml.includes('Orbital Track Locked'),
        'MetaDeepIntelligenceConsole must display "Orbital Track Locked"'
      );
      assert.ok(
        consoleHtml.includes('NOAA Satellite Stream • Live'),
        'MetaDeepIntelligenceConsole must display "NOAA Satellite Stream • Live"'
      );
      assert.ok(
        consoleHtml.includes('Thermal Sensor Scan'),
        'MetaDeepIntelligenceConsole must display "Thermal Sensor Scan"'
      );
    });

    it('verifies preservation of internal model string IDs for functional compatibility', () => {
      // Model dropdown strings in App.tsx
      assert.ok(
        appTsx.includes("'tri-agent-swarm'"),
        "App.tsx must preserve internal ID 'tri-agent-swarm'"
      );
      assert.ok(
        appTsx.includes("'muse-spark-1.3'"),
        "App.tsx must preserve internal ID 'muse-spark-1.3'"
      );
      assert.ok(
        appTsx.includes("'muse-spark-1.2'"),
        "App.tsx must preserve internal ID 'muse-spark-1.2'"
      );
      assert.ok(
        appTsx.includes("'muse-wonder-1.0'"),
        "App.tsx must preserve internal ID 'muse-wonder-1.0'"
      );

      // Human-readable display mapping verified
      assert.ok(
        appTsx.includes('Multi-Sensor Consensus'),
        "App.tsx must map to human-readable label 'Multi-Sensor Consensus'"
      );
      assert.ok(
        appTsx.includes('Spatial Analytics'),
        "App.tsx must map to human-readable label 'Spatial Analytics'"
      );
      assert.ok(
        appTsx.includes('Rapid Geocoder'),
        "App.tsx must map to human-readable label 'Rapid Geocoder'"
      );
      assert.ok(
        appTsx.includes('Spectral Reasoner'),
        "App.tsx must map to human-readable label 'Spectral Reasoner'"
      );
    });
  });
});
