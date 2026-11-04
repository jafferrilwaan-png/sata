import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { TopNavbar } from './TopNavbar';
import { NavTab } from '../utils/telemetryLogic';

describe('Adversarial Stress Test: TopNavbar & GitHub Button Refactor', () => {
  const defaultBaseProps = {
    activeTab: 'HOME' as NavTab,
    onSelectTab: () => {},
    onFocusSearch: () => {},
    onOpenNotifications: () => {},
    onOpenProfile: () => {},
    unreadAlertsCount: 0,
  };

  describe('Suite 1: GitHub Button Fallbacks, Custom URLs, and Security Semantics', () => {
    it('falls back to https://github.com when githubUrl is undefined', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          githubUrl: undefined,
        })
      );

      assert.match(
        html,
        /<a[^>]*href="https:\/\/github\.com"[^>]*>/,
        'Expected default fallback href="https://github.com"'
      );
      assert.ok(html.includes('target="_blank"'), 'Expected target="_blank" on GitHub anchor');
      assert.ok(
        html.includes('rel="noopener noreferrer"'),
        'Expected rel="noopener noreferrer" on external anchor'
      );
      assert.ok(
        html.includes('aria-label="GitHub Repository"'),
        'Expected aria-label="GitHub Repository"'
      );
      assert.ok(
        html.includes('title="GitHub Repository"'),
        'Expected title="GitHub Repository"'
      );
      assert.ok(html.includes('lucide-github'), 'Expected lucide-github icon inside GitHub link');
    });

    it('renders custom repository URL when githubUrl is provided', () => {
      const customUrl = 'https://github.com/nasa/sata-sentinel';
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          githubUrl: customUrl,
        })
      );

      assert.match(
        html,
        new RegExp(`<a[^>]*href="${customUrl}"[^>]*>`),
        'Expected custom githubUrl to be passed verbatim to href'
      );
    });

    it('handles query parameters and anchors in githubUrl cleanly', () => {
      const complexUrl = 'https://github.com/meta-llama/sata?tab=readme&view=full#architecture';
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          githubUrl: complexUrl,
        })
      );

      // React escapes '&' to '&amp;' in attribute values
      assert.ok(
        html.includes('href="https://github.com/meta-llama/sata?tab=readme&amp;view=full#architecture"'),
        'Expected properly formatted & escaped href attribute for complex URL'
      );
    });

    it('verifies iOS frosted glass styling classes on the GitHub link', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, defaultBaseProps)
      );

      assert.ok(html.includes('sata-icon-btn'), 'Expected .sata-icon-btn class');
      assert.ok(html.includes('rounded-full'), 'Expected rounded-full class');
      assert.ok(html.includes('w-[clamp(30px,2.8vw,42px)]'), 'Expected responsive width clamping');
      assert.ok(html.includes('h-[clamp(30px,2.8vw,42px)]'), 'Expected responsive height clamping');
      assert.ok(html.includes('cursor-pointer'), 'Expected cursor-pointer class');
    });
  });

  describe('Suite 2: Absolute Settings UI Elimination & Callback Neutralization', () => {
    it('guarantees zero Settings button or icon when onOpenSettings is undefined', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, defaultBaseProps)
      );

      assert.equal(html.includes('Telemetry Settings'), false, 'No "Telemetry Settings" aria-label');
      assert.equal(html.includes('lucide-settings'), false, 'No lucide-settings icon');
      assert.equal(html.includes('Settings'), false, 'No settings text anywhere in output');
    });

    it('guarantees onOpenSettings prop is completely inert and does not cause Settings to render', () => {
      let callbackInvoked = false;
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          onOpenSettings: () => {
            callbackInvoked = true;
          },
        })
      );

      assert.equal(callbackInvoked, false, 'Callback should not be invoked during render');
      assert.equal(html.includes('Telemetry Settings'), false, 'No "Telemetry Settings" aria-label even when prop is passed');
      assert.equal(html.includes('lucide-settings'), false, 'No lucide-settings even when prop is passed');
      assert.equal(html.includes('Settings'), false, 'No settings keyword in DOM output');
    });
  });

  describe('Suite 3: unreadAlertsCount Boundary Conditions', () => {
    it('omits screen-reader alert badge when unreadAlertsCount is 0', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          unreadAlertsCount: 0,
        })
      );

      assert.ok(html.includes('aria-label="Observation Alerts"'), 'Observation alerts button exists');
      assert.equal(html.includes('active alerts'), false, 'No sr-only active alerts badge for 0');
    });

    it('renders screen-reader alert badge when unreadAlertsCount is 9999', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          unreadAlertsCount: 9999,
        })
      );

      assert.ok(
        html.includes('<span class="sr-only">9999 active alerts</span>'),
        'Expected sr-only badge with 9999 count'
      );
    });

    it('omits screen-reader alert badge when unreadAlertsCount is negative (-1, -9999)', () => {
      for (const neg of [-1, -42, -9999]) {
        const html = ReactDOMServer.renderToStaticMarkup(
          React.createElement(TopNavbar, {
            ...defaultBaseProps,
            unreadAlertsCount: neg,
          })
        );

        assert.equal(
          html.includes('active alerts'),
          false,
          `Expected no sr-only badge when unreadAlertsCount is ${neg}`
        );
      }
    });

    it('renders single alert count correctly for count = 1', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          unreadAlertsCount: 1,
        })
      );

      assert.ok(
        html.includes('<span class="sr-only">1 active alerts</span>'),
        'Expected sr-only badge with 1 count'
      );
    });
  });

  describe('Suite 4: activeTab Enum Permutations & Tab Highlighting', () => {
    const tabs: NavTab[] = ['HOME', 'SATELLITES', 'ORBITS'];

    tabs.forEach((activeTab) => {
      it(`highlights tab "${activeTab}" with .sata-home-pill while other tabs remain unhighlighted`, () => {
        const html = ReactDOMServer.renderToStaticMarkup(
          React.createElement(TopNavbar, {
            ...defaultBaseProps,
            activeTab,
          })
        );

        // Find button for activeTab
        const activeTabRegex = new RegExp(
          `<button[^>]*class="[^"]*sata-home-pill[^"]*"[^>]*>${activeTab}</button>`
        );
        assert.match(
          html,
          activeTabRegex,
          `Expected tab "${activeTab}" to have class "sata-home-pill"`
        );

        // Check other tabs do NOT have sata-home-pill
        tabs
          .filter((t) => t !== activeTab)
          .forEach((inactiveTab) => {
            const inactiveTabRegex = new RegExp(
              `<button[^>]*class="[^"]*text-\\[#a1a1aa\\][^"]*"[^>]*>${inactiveTab}</button>`
            );
            assert.match(
              html,
              inactiveTabRegex,
              `Expected inactive tab "${inactiveTab}" to have class "text-[#a1a1aa]"`
            );
            const badHighlightRegex = new RegExp(
              `<button[^>]*class="[^"]*sata-home-pill[^"]*"[^>]*>${inactiveTab}</button>`
            );
            assert.equal(
              badHighlightRegex.test(html),
              false,
              `Inactive tab "${inactiveTab}" must not have sata-home-pill`
            );
          });
      });
    });

    it('handles unexpected tab without crashing and renders all tabs inactive', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          activeTab: 'UNKNOWN_TAB' as any,
        })
      );

      assert.ok(html.includes('Primary Orbital Navigation'), 'Navigation bar renders cleanly');
      assert.equal(html.includes('sata-home-pill'), false, 'No tab should have sata-home-pill');
    });
  });

  describe('Suite 5: Zone 2 Docked Search Bar (Children Slot) vs Navigation Tabs', () => {
    it('renders navigation tabs when children is undefined', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          children: undefined,
        })
      );

      assert.ok(
        html.includes('aria-label="Primary Orbital Navigation"'),
        'Primary Orbital Navigation must be rendered'
      );
      assert.ok(html.includes('>HOME</button>'), 'HOME tab button rendered');
      assert.ok(html.includes('>SATELLITES</button>'), 'SATELLITES tab button rendered');
      assert.ok(html.includes('>ORBITS</button>'), 'ORBITS tab button rendered');
      assert.ok(!html.includes('>RELEASES</button>'), 'RELEASES tab button must not be rendered');
    });

    it('renders docked search bar and omits navigation tabs when children is passed', () => {
      const customSearchChild = React.createElement(
        'form',
        { id: 'sata-command-search-top', 'data-testid': 'docked-search-bar' },
        React.createElement('input', { type: 'text', placeholder: 'Search...' })
      );

      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          children: customSearchChild,
        })
      );

      assert.ok(
        html.includes('data-testid="docked-search-bar"'),
        'Docked search bar child must be rendered'
      );
      assert.equal(
        html.includes('aria-label="Primary Orbital Navigation"'),
        false,
        'Navigation tabs must be omitted when children is present'
      );
    });
  });

  describe('Suite 6: Keyboard Shortcuts Conditional Rendering', () => {
    it('renders Keyboard Shortcuts button when onOpenShortcuts is provided', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          onOpenShortcuts: () => {},
        })
      );

      assert.ok(
        html.includes('aria-label="Keyboard Shortcuts (?)"'),
        'Keyboard shortcuts button should be present'
      );
      assert.ok(html.includes('lucide-keyboard'), 'Lucide keyboard icon should be present');
    });

    it('omits Keyboard Shortcuts button when onOpenShortcuts is undefined', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, {
          ...defaultBaseProps,
          onOpenShortcuts: undefined,
        })
      );

      assert.equal(
        html.includes('aria-label="Keyboard Shortcuts (?)"'),
        false,
        'Keyboard shortcuts button must not be rendered when handler is undefined'
      );
      assert.equal(
        html.includes('lucide-keyboard'),
        false,
        'Lucide keyboard icon must not be rendered when handler is undefined'
      );
    });
  });

  describe('Suite 7: Zone 1, 2, 3 Layout Preservation across 144 Permutations', () => {
    const tabs: NavTab[] = ['HOME', 'SATELLITES', 'ORBITS'];
    const alertCounts = [0, 9999, -1];
    const urls = [undefined, 'https://github.com/nasa/sata-sentinel', 'https://github.com/meta/sata'];
    const childrenOptions = [
      undefined,
      React.createElement('div', { id: 'docked-search' }, 'Search Slot'),
    ];
    const shortcutsOptions = [undefined, () => {}];
    const settingsOptions = [undefined, () => {}];

    let testCount = 0;

    for (const activeTab of tabs) {
      for (const unreadAlertsCount of alertCounts) {
        for (const githubUrl of urls) {
          for (const children of childrenOptions) {
            for (const onOpenShortcuts of shortcutsOptions) {
              for (const onOpenSettings of settingsOptions) {
                testCount++;
                const html = ReactDOMServer.renderToStaticMarkup(
                  React.createElement(TopNavbar, {
                    activeTab,
                    onSelectTab: () => {},
                    onFocusSearch: () => {},
                    onOpenNotifications: () => {},
                    onOpenSettings,
                    githubUrl,
                    onOpenProfile: () => {},
                    onOpenShortcuts,
                    unreadAlertsCount,
                    children,
                  })
                );

                // Invariant 1: No settings UI anywhere
                assert.equal(
                  html.includes('Telemetry Settings'),
                  false,
                  `Combination #${testCount}: Settings aria-label must never render`
                );
                assert.equal(
                  html.includes('lucide-settings'),
                  false,
                  `Combination #${testCount}: Settings icon must never render`
                );

                // Invariant 2: GitHub link is always present with valid attrs
                const expectedHref = githubUrl ?? 'https://github.com';
                assert.ok(
                  html.includes(`href="${expectedHref}"`),
                  `Combination #${testCount}: Expected href="${expectedHref}"`
                );
                assert.ok(
                  html.includes('target="_blank"'),
                  `Combination #${testCount}: Expected target="_blank"`
                );
                assert.ok(
                  html.includes('rel="noopener noreferrer"'),
                  `Combination #${testCount}: Expected rel="noopener noreferrer"`
                );
                assert.ok(
                  html.includes('aria-label="GitHub Repository"'),
                  `Combination #${testCount}: Expected aria-label="GitHub Repository"`
                );

                // Invariant 3: Zone 1 Brand & Meta Lockup intact
                assert.ok(
                  html.includes('alt="SATA Sentinel"'),
                  `Combination #${testCount}: SATA Sentinel brand logo missing`
                );
                assert.ok(
                  html.includes('data-testid="powered-by-meta-badge"'),
                  `Combination #${testCount}: Meta badge missing`
                );
                assert.ok(
                  html.includes('Powered by Meta'),
                  `Combination #${testCount}: Powered by Meta text missing`
                );

                // Invariant 4: Zone 3 standard controls intact
                assert.ok(
                  html.includes('aria-label="Focus Search Bar"'),
                  `Combination #${testCount}: Search focus button missing`
                );
                assert.ok(
                  html.includes('aria-label="Observation Alerts"'),
                  `Combination #${testCount}: Observation alerts button missing`
                );
                assert.ok(
                  html.includes('aria-label="Commander Profile"'),
                  `Combination #${testCount}: Commander profile avatar missing`
                );
              }
            }
          }
        }
      }
    }

    it(`successfully verified all ${testCount} prop permutation invariants`, () => {
      assert.equal(testCount, 216, 'Expected exactly 216 combinations tested');
    });
  });
});
