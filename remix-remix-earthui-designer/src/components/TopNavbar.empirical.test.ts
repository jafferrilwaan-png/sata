import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import ReactDOMServer from 'react-dom/server';
import { TopNavbar } from './TopNavbar';
import { NavTab } from '../utils/telemetryLogic';

describe('TopNavbar Empirical Challenge & Adversarial Stress Test Suite', () => {
  // Base props helper
  const createProps = (overrides?: Partial<React.ComponentProps<typeof TopNavbar>>) => ({
    activeTab: 'HOME' as NavTab,
    onSelectTab: () => {},
    onFocusSearch: () => {},
    onOpenNotifications: () => {},
    onOpenProfile: () => {},
    unreadAlertsCount: 0,
    ...overrides,
  });

  describe('Suite 1: Responsive Layout Classes Across Mobile and Desktop Breakpoints', () => {
    it('enforces exact mobile/desktop ordering: order-1 (Zone 1), order-3 sm:order-2 (Zone 2), order-2 sm:order-3 (Zone 3)', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps())
      );

      // Zone 1: Brand Wordmark & Meta Lockup must be order-1
      const zone1Match = html.match(/<button[^>]*class="([^"]*order-1[^"]*)"/);
      assert.ok(zone1Match, 'Zone 1 button must contain order-1 class');
      assert.ok(zone1Match[1].includes('order-1'), 'Zone 1 must have order-1');

      // Zone 2: Navigation / Search container must be order-3 on mobile and sm:order-2 on desktop
      const zone2Match = html.match(/<div[^>]*class="([^"]*order-3[^"]*sm:order-2[^"]*)"/);
      assert.ok(
        zone2Match,
        'Zone 2 div container must contain "order-3 sm:order-2" classes for mobile wrapping'
      );
      assert.ok(
        zone2Match[1].includes('order-3') && zone2Match[1].includes('sm:order-2'),
        'Zone 2 must have order-3 and sm:order-2'
      );
      assert.ok(
        zone2Match[1].includes('w-full sm:w-auto flex-1'),
        'Zone 2 must expand full-width on mobile (w-full) and flex-1 auto on desktop'
      );

      // Zone 3: Action Icons & User Avatar must be order-2 on mobile and sm:order-3 on desktop
      const zone3Match = html.match(/<div[^>]*class="([^"]*order-2[^"]*sm:order-3[^"]*)"/);
      assert.ok(
        zone3Match,
        'Zone 3 div container must contain "order-2 sm:order-3" classes for top-right alignment on mobile'
      );
      assert.ok(
        zone3Match[1].includes('order-2') && zone3Match[1].includes('sm:order-3'),
        'Zone 3 must have order-2 and sm:order-3'
      );
    });

    it('maintains Zone 2 order-3 sm:order-2 when docked search bar is passed as children', () => {
      const searchChild = React.createElement('div', { id: 'sata-command-search-docked' }, 'Search Bar');
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({ children: searchChild }))
      );

      assert.ok(html.includes('id="sata-command-search-docked"'), 'Docked search bar must be rendered in Zone 2');
      const zone2Match = html.match(/<div[^>]*class="([^"]*order-3[^"]*sm:order-2[^"]*)"/);
      assert.ok(zone2Match, 'Zone 2 must preserve order-3 sm:order-2 when rendering children');
    });

    it('verifies parent header container has flex-wrap sm:flex-nowrap and full width', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps())
      );

      const headerMatch = html.match(/<header[^>]*class="([^"]*)"/);
      assert.ok(headerMatch, 'Header element must exist');
      const headerClasses = headerMatch[1];
      assert.ok(headerClasses.includes('flex'), 'Header must be a flex container');
      assert.ok(headerClasses.includes('flex-wrap'), 'Header must wrap on mobile viewports');
      assert.ok(headerClasses.includes('sm:flex-nowrap'), 'Header must not wrap on desktop viewports');
      assert.ok(headerClasses.includes('w-full'), 'Header must span full width');
      assert.ok(headerClasses.includes('justify-between'), 'Header must justify space between items');
    });
  });

  describe('Suite 2: Pointer Events Isolation Architecture', () => {
    it('verifies pointer-events-none on parent header container for 3D Earth canvas click-through', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps())
      );

      const headerMatch = html.match(/<header[^>]*class="([^"]*)"/);
      assert.ok(headerMatch, 'Header element must exist');
      assert.ok(
        headerMatch[1].includes('pointer-events-none'),
        'Parent header MUST have pointer-events-none so transparent areas pass mouse events to the 3D globe'
      );
    });

    it('verifies pointer-events-auto on Zone 1, Zone 2, and Zone 3 interactive zones', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps())
      );

      // Zone 1
      const zone1Match = html.match(/<button[^>]*class="([^"]*order-1[^"]*)"/);
      assert.ok(zone1Match, 'Zone 1 button must exist');
      assert.ok(
        zone1Match[1].includes('pointer-events-auto'),
        'Zone 1 must have pointer-events-auto to intercept clicks'
      );

      // Zone 2
      const zone2Match = html.match(/<div[^>]*class="([^"]*order-3[^"]*sm:order-2[^"]*)"/);
      assert.ok(zone2Match, 'Zone 2 container must exist');
      assert.ok(
        zone2Match[1].includes('pointer-events-auto'),
        'Zone 2 must have pointer-events-auto to intercept navigation or search interaction'
      );

      // Zone 3
      const zone3Match = html.match(/<div[^>]*class="([^"]*order-2[^"]*sm:order-3[^"]*)"/);
      assert.ok(zone3Match, 'Zone 3 container must exist');
      assert.ok(
        zone3Match[1].includes('pointer-events-auto'),
        'Zone 3 must have pointer-events-auto to intercept action clicks'
      );
    });
  });

  describe('Suite 3: iOS Frosted Glass GitHub Button Geometry and Link Semantics', () => {
    it('strictly matches clamp geometry w-[clamp(30px,2.8vw,42px)] h-[clamp(30px,2.8vw,42px)]', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps())
      );

      // Anchor element matching github link
      const anchorMatch = html.match(/<a[^>]*href="https:\/\/github\.com"[^>]*class="([^"]*)"/);
      assert.ok(anchorMatch, 'GitHub anchor must be rendered with default https://github.com href');
      const classes = anchorMatch[1];

      assert.ok(
        classes.includes('w-[clamp(30px,2.8vw,42px)]'),
        'GitHub button MUST have exact width clamp "w-[clamp(30px,2.8vw,42px)]"'
      );
      assert.ok(
        classes.includes('h-[clamp(30px,2.8vw,42px)]'),
        'GitHub button MUST have exact height clamp "h-[clamp(30px,2.8vw,42px)]"'
      );
      assert.ok(
        classes.includes('sata-icon-btn'),
        'GitHub button MUST have ".sata-icon-btn" frosted glass styling class'
      );
      assert.ok(
        classes.includes('rounded-full'),
        'GitHub button MUST have "rounded-full" geometry'
      );
      assert.ok(
        classes.includes('shrink-0'),
        'GitHub button MUST have "shrink-0" to prevent flex compression'
      );
    });

    it('verifies HTML anchor security, accessibility, and icon styling', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps())
      );

      // Check anchor tag attributes
      const anchorMatch = html.match(/<a[^>]*href="https:\/\/github\.com"[^>]*>/);
      assert.ok(anchorMatch, 'GitHub anchor tag must exist');
      const anchorTag = anchorMatch[0];

      assert.ok(anchorTag.includes('target="_blank"'), 'Must have target="_blank"');
      assert.ok(anchorTag.includes('rel="noopener noreferrer"'), 'Must have rel="noopener noreferrer"');
      assert.ok(anchorTag.includes('aria-label="GitHub Repository"'), 'Must have aria-label="GitHub Repository"');
      assert.ok(anchorTag.includes('title="GitHub Repository"'), 'Must have title="GitHub Repository"');

      // Check Lucide Github icon inside
      assert.ok(html.includes('lucide-github'), 'Must render Lucide Github icon');
      const iconMatch = html.match(/<svg[^>]*class="([^"]*lucide-github[^"]*)"/);
      assert.ok(iconMatch, 'Github SVG must have proper icon classes');
      const iconClasses = iconMatch[1];
      assert.ok(
        iconClasses.includes('w-[clamp(14px,1.25vw,18px)]'),
        'Github icon must have clamped width w-[clamp(14px,1.25vw,18px)]'
      );
      assert.ok(
        iconClasses.includes('h-[clamp(14px,1.25vw,18px)]'),
        'Github icon must have clamped height h-[clamp(14px,1.25vw,18px)]'
      );
      assert.ok(
        iconClasses.includes('stroke-[1.8]'),
        'Github icon must have stroke-[1.8] to match iOS iconography stroke density'
      );
    });

    it('ensures GitHub button is an <a> tag and NEVER a <button> tag', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps())
      );

      // Verify no button wraps GitHub
      const buttonWithGithub = /<button[^>]*>[^<]*<a[^>]*github\.com/.test(html);
      assert.equal(buttonWithGithub, false, 'GitHub link must not be nested inside a <button>');

      const buttonWithGithubAria = /<button[^>]*aria-label="GitHub[^"]*"/.test(html);
      assert.equal(buttonWithGithubAria, false, 'GitHub control must be an anchor, not a button element');
    });

    it('correctly handles custom githubUrl prop override and URL formatting', () => {
      const customUrl = 'https://github.com/meta-llama/sata-sentinel?ref=earthui#readme';
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({ githubUrl: customUrl }))
      );

      assert.ok(
        html.includes(`href="${customUrl.replace('&', '&amp;')}"`) || html.includes(`href="${customUrl}"`),
        'GitHub anchor must accept and render custom githubUrl'
      );
    });
  });

  describe('Suite 4: Zero Settings References Across Rendered DOM and Listeners', () => {
    it('confirms 0 settings references in rendered HTML under default state', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps())
      );

      assert.equal(
        /settings/i.test(html),
        false,
        `Rendered HTML must have ZERO matches for /settings/i, found in: ${html}`
      );
    });

    it('confirms 0 settings references in rendered HTML even when legacy onOpenSettings is passed', () => {
      let callbackInvoked = false;
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({
          onOpenSettings: () => { callbackInvoked = true; },
        }))
      );

      assert.equal(
        /settings/i.test(html),
        false,
        'Rendered HTML must have ZERO matches for /settings/i even if onOpenSettings is passed'
      );
      assert.equal(callbackInvoked, false, 'onOpenSettings must not be invoked');
    });

    it('confirms 0 settings references across all 4 navigation tabs', () => {
      const tabs: NavTab[] = ['HOME', 'SATELLITES', 'ORBITS', 'RELEASES'];
      for (const tab of tabs) {
        const html = ReactDOMServer.renderToStaticMarkup(
          React.createElement(TopNavbar, createProps({ activeTab: tab }))
        );
        assert.equal(
          /settings/i.test(html),
          false,
          `Rendered HTML for tab ${tab} must have 0 settings references`
        );
      }
    });

    it('confirms 0 settings references with docked search bar and keyboard shortcuts open', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({
          children: React.createElement('div', null, 'Search Mode'),
          onOpenShortcuts: () => {},
          unreadAlertsCount: 5,
        }))
      );

      assert.equal(/settings/i.test(html), false, 'Rendered HTML must have 0 settings references in all states');
      assert.ok(!html.includes('lucide-settings'), 'lucide-settings icon must not be in DOM');
      assert.ok(!html.includes('Telemetry Settings'), 'Telemetry Settings text/label must not be in DOM');
    });
  });

  describe('Suite 5: App.tsx Integration & Type Safety Verification', () => {
    it('verifies App.tsx mounts TopNavbar with required props and zero onOpenSettings reference', () => {
      const appTsxPath = path.resolve(__dirname, '../App.tsx');
      assert.ok(fs.existsSync(appTsxPath), 'App.tsx must exist');

      const appContent = fs.readFileSync(appTsxPath, 'utf8');

      // 1. Verify TopNavbar is imported
      assert.ok(
        appContent.includes("import { TopNavbar } from './components/TopNavbar'") ||
        appContent.includes('import { TopNavbar } from "./components/TopNavbar"'),
        'App.tsx must import TopNavbar'
      );

      // 2. Extract TopNavbar JSX block
      const topNavbarBlockMatch = appContent.match(/<TopNavbar[\s\S]*?<\/TopNavbar>/);
      assert.ok(topNavbarBlockMatch, '<TopNavbar> JSX block must exist in App.tsx');
      const topNavbarJsx = topNavbarBlockMatch[0];

      // 3. Verify githubUrl is passed
      assert.ok(
        topNavbarJsx.includes('githubUrl="https://github.com"') ||
        topNavbarJsx.includes("githubUrl='https://github.com'") ||
        topNavbarJsx.includes('githubUrl='),
        'App.tsx must supply githubUrl prop to TopNavbar'
      );

      // 4. Verify onOpenSettings is completely absent from TopNavbar in App.tsx
      assert.ok(
        !topNavbarJsx.includes('onOpenSettings'),
        'App.tsx TopNavbar invocation must NOT pass onOpenSettings'
      );

      // 5. Verify unreadAlertsCount and other core props are passed
      assert.ok(topNavbarJsx.includes('activeTab={activeTab}'), 'Must pass activeTab');
      assert.ok(topNavbarJsx.includes('onSelectTab='), 'Must pass onSelectTab');
      assert.ok(topNavbarJsx.includes('onFocusSearch='), 'Must pass onFocusSearch');
      assert.ok(topNavbarJsx.includes('onOpenNotifications='), 'Must pass onOpenNotifications');
      assert.ok(topNavbarJsx.includes('onOpenProfile='), 'Must pass onOpenProfile');
      assert.ok(topNavbarJsx.includes('unreadAlertsCount='), 'Must pass unreadAlertsCount');
    });

    it('verifies TopNavbar TypeScript interface contract allows optional githubUrl and children', () => {
      const element = React.createElement(TopNavbar, {
        activeTab: 'HOME',
        onSelectTab: () => {},
        onFocusSearch: () => {},
        onOpenNotifications: () => {},
        onOpenProfile: () => {},
        unreadAlertsCount: 0,
        // githubUrl and onOpenSettings omitted to verify optionality
      });
      assert.ok(element, 'TopNavbar element must instantiate without githubUrl (uses default)');
    });
  });

  describe('Suite 6: Adversarial Stress Scenarios & Edge Cases', () => {
    it('stress tests unreadAlertsCount values: 0, 1, 9999, negative, and large integers', () => {
      // unreadAlertsCount = 0 -> no sr-only badge
      const html0 = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({ unreadAlertsCount: 0 }))
      );
      assert.ok(!html0.includes('active alerts'), 'Count 0 must not display active alerts screen reader text');

      // unreadAlertsCount = 1 -> "1 active alerts"
      const html1 = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({ unreadAlertsCount: 1 }))
      );
      assert.ok(html1.includes('1 active alerts'), 'Count 1 must display "1 active alerts"');

      // unreadAlertsCount = 9999
      const html9999 = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({ unreadAlertsCount: 9999 }))
      );
      assert.ok(html9999.includes('9999 active alerts'), 'Count 9999 must display "9999 active alerts"');

      // unreadAlertsCount = -5 (negative edge case)
      const htmlNeg = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({ unreadAlertsCount: -5 }))
      );
      assert.ok(!htmlNeg.includes('active alerts'), 'Negative count must not render active alerts text');
    });

    it('stress tests onOpenShortcuts conditional rendering', () => {
      // With onOpenShortcuts: button rendered
      const htmlWith = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({ onOpenShortcuts: () => {} }))
      );
      assert.ok(htmlWith.includes('aria-label="Keyboard Shortcuts (?)"'), 'Shortcuts button rendered when handler provided');

      // Without onOpenShortcuts: button NOT rendered
      const htmlWithout = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({ onOpenShortcuts: undefined }))
      );
      assert.ok(!htmlWithout.includes('aria-label="Keyboard Shortcuts (?)"'), 'Shortcuts button omitted when handler undefined');
    });

    it('preserves all 4 orbital navigation tabs in Zone 2 with proper active indicator', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps({ activeTab: 'ORBITS' }))
      );

      // Verify all 4 tab labels exist
      assert.ok(html.includes('>HOME<'), 'Must render HOME tab');
      assert.ok(html.includes('>SATELLITES<'), 'Must render SATELLITES tab');
      assert.ok(html.includes('>ORBITS<'), 'Must render ORBITS tab');
      assert.ok(html.includes('>RELEASES<'), 'Must render RELEASES tab');

      // Verify active pill styling is on ORBITS
      const orbitsMatch = html.match(/<button[^>]*class="([^"]*)"[^>]*>ORBITS<\/button>/);
      assert.ok(orbitsMatch, 'ORBITS button must exist');
      assert.ok(orbitsMatch[1].includes('sata-home-pill'), 'Active tab must have sata-home-pill class');

      // Verify inactive pill styling is on HOME
      const homeMatch = html.match(/<button[^>]*class="([^"]*)"[^>]*>HOME<\/button>/);
      assert.ok(homeMatch, 'HOME button must exist');
      assert.ok(!homeMatch[1].includes('sata-home-pill'), 'Inactive tab must not have sata-home-pill class');
      assert.ok(homeMatch[1].includes('text-[#a1a1aa]'), 'Inactive tab must have text-[#a1a1aa]');
    });

    it('verifies Zone 1 brand wordmark, logo image, and Powered by Meta lockup', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TopNavbar, createProps())
      );

      assert.ok(html.includes('alt="SATA Sentinel"'), 'Zone 1 brand logo must have alt="SATA Sentinel"');
      assert.ok(html.includes('src="/assets/ui/sata_brand_logo.png"'), 'Zone 1 brand logo must have correct image src');
      assert.ok(html.includes('data-testid="powered-by-meta-badge"'), 'Zone 1 must contain powered-by-meta-badge');
      assert.ok(html.includes('Powered by Meta'), 'Zone 1 must contain "Powered by Meta" text');
    });
  });
});
