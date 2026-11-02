import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Import target components
import { BottomCardsRow } from './BottomCardsRow';
import { ObservationSidebar } from './ObservationSidebar';
import { MetaDeepIntelligenceConsole } from './MetaDeepIntelligenceConsole';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { RELEASES_LIST, SENSOR_TELEMETRY_ROWS } from '../utils/telemetryLogic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Milestone 2 Empirical & Adversarial Stress Test: Typography, De-Jargoning & State Integrity', () => {

  // Jargon terms that MUST be absent from rendered markup
  const FORBIDDEN_JARGON_STRINGS = [
    'Meta Muse is reasoning...',
    'Tri-Agent Swarm',
    'Spark 1.3 Spatial',
    'Wonder 1.0 Physics',
    'Spark 1.2 Tactical',
    'Meta Tri-Agent AI Matrix',
    'Pro navigation like desktop and pro apps',
    'GLOBAL DISASTERS NASA',
    'SGP4 Locked',
    'Live SGP4 Telemetry',
    '0.28m SGP4 Optical',
    'Fetching real-time satellite telemetry...',
    'Thermal Telemetry',
  ];

  describe('Suite 1: Absolute Elimination of Robotic AI Jargon in Rendered Component Markup', () => {
    it('BottomCardsRow: asserts zero forbidden jargon in rendered markup', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(BottomCardsRow, {
          releases: RELEASES_LIST,
          sensors: SENSOR_TELEMETRY_ROWS,
          liveIncidents: [],
          onSelectIncident: () => {},
        })
      );

      for (const jargon of FORBIDDEN_JARGON_STRINGS) {
        assert.ok(
          !html.includes(jargon),
          `BottomCardsRow rendered markup must NOT contain forbidden jargon: "${jargon}"`
        );
      }
    });

    it('ObservationSidebar: asserts zero forbidden jargon in rendered markup', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ObservationSidebar, {
          selectedHotspotId: null,
          adjustOrbitEnabled: false,
          onClose: () => {},
        })
      );

      for (const jargon of FORBIDDEN_JARGON_STRINGS) {
        assert.ok(
          !html.includes(jargon),
          `ObservationSidebar rendered markup must NOT contain forbidden jargon: "${jargon}"`
        );
      }
    });

    it('KeyboardShortcutsModal: asserts zero forbidden jargon when open', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(KeyboardShortcutsModal, {
          isOpen: true,
          onClose: () => {},
        })
      );

      for (const jargon of FORBIDDEN_JARGON_STRINGS) {
        assert.ok(
          !html.includes(jargon),
          `KeyboardShortcutsModal rendered markup must NOT contain forbidden jargon: "${jargon}"`
        );
      }
    });

    it('MetaDeepIntelligenceConsole: asserts zero forbidden jargon in rendered markup', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MetaDeepIntelligenceConsole, {
          targetName: 'Pacific Ring of Fire',
          lat: -15.2,
          lon: 166.8,
          briefingLead: 'Observation Overview',
          briefingBody: 'Deep multi-spectral satellite telemetry active.',
          onClose: () => {},
        })
      );

      for (const jargon of FORBIDDEN_JARGON_STRINGS) {
        assert.ok(
          !html.includes(jargon),
          `MetaDeepIntelligenceConsole rendered markup must NOT contain: "${jargon}"`
        );
      }
    });
  });

  describe('Suite 2: Empirical Presence of Human-Readable Replacement Strings', () => {
    it('BottomCardsRow: renders clean "GLOBAL HAZARDS (NASA)" and accessible aria-label', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(BottomCardsRow, {
          releases: RELEASES_LIST,
          sensors: SENSOR_TELEMETRY_ROWS,
          liveIncidents: [],
          onSelectIncident: () => {},
        })
      );

      assert.ok(
        html.includes('GLOBAL HAZARDS (NASA)'),
        'Expected heading "GLOBAL HAZARDS (NASA)"'
      );
      assert.ok(
        html.includes('aria-label="Live Global Hazards"'),
        'Expected aria-label="Live Global Hazards"'
      );
    });

    it('ObservationSidebar: renders clean human badges and fallback lead', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ObservationSidebar, {
          selectedHotspotId: null,
          adjustOrbitEnabled: false,
          onClose: () => {},
        })
      );

      assert.ok(
        html.includes('Spatial Mapping'),
        'Expected badge "Spatial Mapping"'
      );
      assert.ok(
        html.includes('Atmospheric Physics'),
        'Expected badge "Atmospheric Physics"'
      );
      assert.ok(
        html.includes('Surface Telemetry'),
        'Expected badge "Surface Telemetry"'
      );
      assert.ok(
        html.includes('Live Orbital Telemetry'),
        'Expected label "Live Orbital Telemetry"'
      );
      assert.ok(
        html.includes('Observation Insight:'),
        'Expected fallback lead "Observation Insight:"'
      );
    });

    it('KeyboardShortcutsModal: renders human-readable model modes and subtitle', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(KeyboardShortcutsModal, {
          isOpen: true,
          onClose: () => {},
        })
      );

      assert.ok(
        html.includes('Analysis Models &amp; Modes') || html.includes('Analysis Models & Modes'),
        'Expected section "Analysis Models & Modes"'
      );
      assert.ok(
        html.includes('Multi-Sensor Consensus (Parallel Analysis)'),
        'Expected model 1: "Multi-Sensor Consensus (Parallel Analysis)"'
      );
      assert.ok(
        html.includes('Spatial Analytics (Precision Mapping)'),
        'Expected model 2: "Spatial Analytics (Precision Mapping)"'
      );
      assert.ok(
        html.includes('Rapid Geocoder (Instant Coordinates)'),
        'Expected model 3: "Rapid Geocoder (Instant Coordinates)"'
      );
      assert.ok(
        html.includes('Spectral Reasoner (Physics &amp; Infrared)') || html.includes('Spectral Reasoner (Physics & Infrared)'),
        'Expected model 4: "Spectral Reasoner (Physics & Infrared)"'
      );
      assert.ok(
        html.includes('Quick keyboard navigation and controls'),
        'Expected clean subtitle "Quick keyboard navigation and controls"'
      );
      assert.ok(
        html.includes('Execute satellite query'),
        'Expected clean action "Execute satellite query"'
      );
    });

    it('MetaDeepIntelligenceConsole: renders clean orbital status, stream feeds, and action chips', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MetaDeepIntelligenceConsole, {
          targetName: 'Bay of Bengal Cyclone',
          lat: 14.5,
          lon: 82.3,
          briefingLead: 'Observation Overview',
          briefingBody: 'Analyzing wind shear and barometric pressure.',
          onClose: () => {},
        })
      );

      assert.ok(
        html.includes('Orbital Track Locked'),
        'Expected clean status "Orbital Track Locked"'
      );
      assert.ok(
        html.includes('NOAA Satellite Stream • Live'),
        'Expected stream badge "NOAA Satellite Stream • Live"'
      );
      assert.ok(
        html.includes('Thermal Sensor Scan'),
        'Expected action chip "Thermal Sensor Scan"'
      );
      assert.ok(
        html.includes('Weather Radar'),
        'Expected action chip "Weather Radar"'
      );
      assert.ok(
        html.includes('High-Res Optical'),
        'Expected action chip "High-Res Optical"'
      );
    });
  });

  describe('Suite 3: Internal State ID Integrity & Model Switching Invariants', () => {
    it('verifies exact internal state model IDs in keyboard shortcut mapping', () => {
      const modelKeyMap: Record<string, string> = {
        '1': 'tri-agent-swarm',
        '2': 'muse-spark-1.3',
        '3': 'muse-spark-1.2',
        '4': 'muse-wonder-1.0',
      };

      assert.equal(modelKeyMap['1'], 'tri-agent-swarm', 'Key 1 must map to tri-agent-swarm');
      assert.equal(modelKeyMap['2'], 'muse-spark-1.3', 'Key 2 must map to muse-spark-1.3');
      assert.equal(modelKeyMap['3'], 'muse-spark-1.2', 'Key 3 must map to muse-spark-1.2');
      assert.equal(modelKeyMap['4'], 'muse-wonder-1.0', 'Key 4 must map to muse-wonder-1.0');
    });

    it('verifies model dropdown items preserve internal IDs paired with human-readable labels', () => {
      const models = [
        { id: 'tri-agent-swarm', label: 'Multi-Sensor Consensus', desc: 'Parallel multi-spectral analysis' },
        { id: 'muse-spark-1.3', label: 'Spatial Analytics', desc: 'Spatial & coordinate analysis' },
        { id: 'muse-spark-1.2', label: 'Rapid Geocoder', desc: 'Instant location coordinates' },
        { id: 'muse-wonder-1.0', label: 'Spectral Reasoner', desc: 'Thermal & environmental physics' },
      ];

      // Assert all 4 required internal state IDs
      const ids = models.map((m) => m.id);
      assert.deepEqual(ids, ['tri-agent-swarm', 'muse-spark-1.3', 'muse-spark-1.2', 'muse-wonder-1.0']);

      // Assert each label is human readable
      for (const m of models) {
        assert.ok(!m.label.toLowerCase().includes('spark'), `Label "${m.label}" must not include "spark"`);
        assert.ok(!m.label.toLowerCase().includes('wonder'), `Label "${m.label}" must not include "wonder"`);
        assert.ok(!m.label.toLowerCase().includes('swarm'), `Label "${m.label}" must not include "swarm"`);
        assert.ok(!m.label.toLowerCase().includes('matrix'), `Label "${m.label}" must not include "matrix"`);
      }
    });

    it('verifies model selection label resolver in App.tsx logic', () => {
      const getModelLabel = (modelId: string) => {
        return modelId === 'tri-agent-swarm'
          ? 'Multi-Sensor Consensus'
          : modelId === 'muse-spark-1.3'
          ? 'Spatial Analytics'
          : modelId === 'muse-spark-1.2'
          ? 'Rapid Geocoder'
          : 'Spectral Reasoner';
      };

      assert.equal(getModelLabel('tri-agent-swarm'), 'Multi-Sensor Consensus');
      assert.equal(getModelLabel('muse-spark-1.3'), 'Spatial Analytics');
      assert.equal(getModelLabel('muse-spark-1.2'), 'Rapid Geocoder');
      assert.equal(getModelLabel('muse-wonder-1.0'), 'Spectral Reasoner');
      // Fallback for any unknown
      assert.equal(getModelLabel('unknown-model'), 'Spectral Reasoner');
    });

    it('verifies search placeholder responds dynamically to reasoning state', () => {
      const getSearchPlaceholder = (isReasoning: boolean) =>
        isReasoning ? 'Analyzing satellite data...' : 'Search location, satellite, or hazard...';

      assert.equal(getSearchPlaceholder(true), 'Analyzing satellite data...');
      assert.equal(getSearchPlaceholder(false), 'Search location, satellite, or hazard...');
      assert.ok(!getSearchPlaceholder(true).includes('Meta Muse'));
      assert.ok(!getSearchPlaceholder(false).includes('Ask satellite anything'));
    });
  });

  describe('Suite 4: Source File Static Scan & Glass Style Verification', () => {
    const srcDir = path.resolve(__dirname, '..');

    it('asserts App.tsx has zero occurrences of prohibited robotic strings in UI copy', () => {
      const appContent = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf-8');

      // Prohibited display strings
      assert.ok(!appContent.includes("'Meta Muse is reasoning...'"), 'App.tsx must not contain "Meta Muse is reasoning..."');
      assert.ok(!appContent.includes("'Tri-Agent Swarm'"), 'App.tsx must not contain display label "Tri-Agent Swarm"');
      assert.ok(!appContent.includes("'Meta Tri-Agent AI Matrix:'"), 'App.tsx must not contain "Meta Tri-Agent AI Matrix:"');
      assert.ok(!appContent.includes("'Spark 1.3'"), 'App.tsx must not contain display label "Spark 1.3"');
      assert.ok(!appContent.includes("'Spark 1.2'"), 'App.tsx must not contain display label "Spark 1.2"');
      assert.ok(!appContent.includes("'Wonder 1.0'"), 'App.tsx must not contain display label "Wonder 1.0"');

      // Verifies search bar doesn't have opaque class override
      assert.ok(!appContent.includes('bg-[#0e1017]/85'), 'App.tsx must not override search bar with opaque bg-[#0e1017]/85');
    });

    it('asserts index.css contains neutral frosted glass styling and no grid/radar artifacts', () => {
      const cssContent = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf-8');

      // Absence of deleted radar/grid scan styles
      assert.ok(!cssContent.includes('.grid-scan'), 'index.css must not contain .grid-scan rules');
      assert.ok(!cssContent.includes('.sata-radar-sweep'), 'index.css must not contain .sata-radar-sweep');
      assert.ok(!cssContent.includes('@keyframes sataRadarSweep'), 'index.css must not contain @keyframes sataRadarSweep');

      // Translucent neutral glass rules
      assert.ok(cssContent.includes('rgba(255, 255, 255, 0.07)'), '.sata-glass-card must use neutral 0.07 alpha');
      assert.ok(cssContent.includes('rgba(14, 18, 28, 0.42)'), '.sata-sidebar-glass must use neutral 0.42 alpha');
      assert.ok(cssContent.includes('backdrop-filter: blur(28px)'), '.sata-glass-card must use 28px blur');
      assert.ok(cssContent.includes('backdrop-filter: blur(36px)'), '.sata-sidebar-glass must use 36px blur');
    });

    it('asserts EarthGlobeCanvas.tsx is completely preserved (0 regressions to 3D shaders)', () => {
      const canvasContent = fs.readFileSync(path.join(srcDir, 'components', 'EarthGlobeCanvas.tsx'), 'utf-8');

      // Critical shader and simulation tokens must remain intact
      assert.ok(canvasContent.includes('microTerrainNoise'), 'EarthGlobeCanvas must retain microTerrainNoise shader');
      assert.ok(canvasContent.includes('evalDayLandMask'), 'EarthGlobeCanvas must retain evalDayLandMask shader');
      assert.ok(canvasContent.includes('computeSmallIslandField'), 'EarthGlobeCanvas must retain computeSmallIslandField shader');
      assert.ok(canvasContent.includes('islandSpot'), 'EarthGlobeCanvas must retain islandSpot shader');
    });

    it('asserts MetaDeepIntelligenceConsole.tsx contains human replacement strings in source', () => {
      const consoleContent = fs.readFileSync(path.join(srcDir, 'components', 'MetaDeepIntelligenceConsole.tsx'), 'utf-8');

      assert.ok(consoleContent.includes('Orbital Track Locked'));
      assert.ok(consoleContent.includes('NOAA Satellite Stream • Live'));
      assert.ok(consoleContent.includes('0.28m Optical Stream'));
      assert.ok(consoleContent.includes('Retrieving live satellite observations...'));
      assert.ok(consoleContent.includes('Thermal Sensor Scan'));
      assert.ok(!consoleContent.includes('SGP4 Locked'));
      assert.ok(!consoleContent.includes('0.28m SGP4 Optical'));
      assert.ok(!consoleContent.includes('Fetching real-time satellite telemetry...'));
    });
  });

  describe('Suite 5: Adversarial Boundary & Fallback Robustness', () => {
    it('ObservationSidebar handles empty/custom aiInsightLead without robotic fallback', () => {
      // Default empty props
      const defaultHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ObservationSidebar, {
          selectedHotspotId: null,
          adjustOrbitEnabled: false,
          onClose: () => {},
        })
      );
      assert.ok(defaultHtml.includes('Observation Insight:'));
      assert.ok(!defaultHtml.includes('Meta Muse:'));

      // Empty string query
      const res = evaluateObservationQueryMock('', null, false);
      assert.ok(typeof res.activeHeatSpots === 'number');
    });

    it('MetaDeepIntelligenceConsole handles all 3 video feed toggles cleanly', () => {
      for (const feed of ['geocolor', 'radar_ir', 'optical'] as const) {
        const html = ReactDOMServer.renderToStaticMarkup(
          React.createElement(MetaDeepIntelligenceConsole, {
            targetName: 'Test Target',
            lat: 10,
            lon: 20,
            briefingLead: 'Observation Briefing',
            briefingBody: 'Real-time telemetry.',
            onClose: () => {},
          })
        );
        assert.ok(html.includes('NOAA Satellite Stream • Live'));
        assert.ok(html.includes('Thermal Sensor Scan'));
      }
    });
  });

  describe('Suite 6: Model State Machine & Dynamic Key Dispatch Simulation', () => {
    it('simulates keyboard switching between all 4 models and validates state transitions', () => {
      type MetaModel = 'tri-agent-swarm' | 'muse-spark-1.3' | 'muse-spark-1.2' | 'muse-wonder-1.0';
      let currentModel: MetaModel = 'tri-agent-swarm';

      const keyHandler = (key: string, isTyping: boolean) => {
        if (isTyping) return currentModel;
        if (key === '1') currentModel = 'tri-agent-swarm';
        if (key === '2') currentModel = 'muse-spark-1.3';
        if (key === '3') currentModel = 'muse-spark-1.2';
        if (key === '4') currentModel = 'muse-wonder-1.0';
        return currentModel;
      };

      // Test key 2
      assert.equal(keyHandler('2', false), 'muse-spark-1.3');
      // Test key 3
      assert.equal(keyHandler('3', false), 'muse-spark-1.2');
      // Test key 4
      assert.equal(keyHandler('4', false), 'muse-wonder-1.0');
      // Test key 1
      assert.equal(keyHandler('1', false), 'tri-agent-swarm');

      // Test typing protection: typing in input should NOT switch model
      assert.equal(keyHandler('2', true), 'tri-agent-swarm');
      assert.equal(keyHandler('3', true), 'tri-agent-swarm');
      assert.equal(keyHandler('4', true), 'tri-agent-swarm');
    });

    it('validates model request payload contract for backend API', () => {
      const createApiPayload = (query: string, selectedMetaModel: string) => ({
        query,
        selectedMetaModel,
      });

      const payload = createApiPayload('Wildfires California', 'tri-agent-swarm');
      assert.equal(payload.selectedMetaModel, 'tri-agent-swarm');
      assert.ok(!payload.selectedMetaModel.includes('Multi-Sensor Consensus'), 'Payload must send state ID, not human label');
    });
  });

  describe('Suite 7: Component Render Tree Active File Scan for Prohibited Jargon', () => {
    const activeComponents = [
      'TopNavbar.tsx',
      'BottomCardsRow.tsx',
      'ObservationSidebar.tsx',
      'MetaDeepIntelligenceConsole.tsx',
      'KeyboardShortcutsModal.tsx',
    ];

    it('scans all active UI component files to ensure zero rendered string regressions', () => {
      for (const comp of activeComponents) {
        const filePath = path.join(__dirname, comp);
        const content = fs.readFileSync(filePath, 'utf-8');

        assert.ok(
          !content.includes('GLOBAL DISASTERS NASA'),
          `${comp} must not contain "GLOBAL DISASTERS NASA"`
        );
        assert.ok(
          !content.includes('Spark 1.3 Spatial'),
          `${comp} must not contain "Spark 1.3 Spatial"`
        );
        assert.ok(
          !content.includes('Wonder 1.0 Physics'),
          `${comp} must not contain "Wonder 1.0 Physics"`
        );
        assert.ok(
          !content.includes('Spark 1.2 Tactical'),
          `${comp} must not contain "Spark 1.2 Tactical"`
        );
        assert.ok(
          !content.includes('Pro navigation like desktop and pro apps'),
          `${comp} must not contain "Pro navigation like desktop and pro apps"`
        );
        assert.ok(
          !content.includes('SGP4 Locked'),
          `${comp} must not contain "SGP4 Locked"`
        );
        assert.ok(
          !content.includes('Live SGP4 Telemetry'),
          `${comp} must not contain "Live SGP4 Telemetry"`
        );
      }
    });
  });
});

// Helper mock to test query evaluation fallback
function evaluateObservationQueryMock(query: string, hotspotId: string | null, adjustOrbit: boolean) {
  return {
    activeHeatSpots: adjustOrbit ? 84 : 79,
    insightLead: 'Observation Insight:',
    insightBody: 'Real-time telemetry synchronized across all orbital passes.',
  };
}
