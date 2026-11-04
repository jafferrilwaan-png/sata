import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, Github, Keyboard, User } from 'lucide-react';
import { NavTab } from '../utils/telemetryLogic';

interface TopNavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onFocusSearch: () => void;
  onOpenNotifications: () => void;
  onOpenSettings?: () => void;
  githubUrl?: string;
  onOpenProfile: () => void;
  onOpenShortcuts?: () => void;
  unreadAlertsCount: number;
  children?: React.ReactNode;
}

const NAV_TABS: NavTab[] = ['HOME', 'SATELLITES', 'ORBITS'];

export const TopNavbar = React.memo<TopNavbarProps>(({
  activeTab,
  onSelectTab,
  onFocusSearch,
  onOpenNotifications,
  onOpenSettings,
  githubUrl = 'https://github.com',
  onOpenProfile,
  onOpenShortcuts,
  unreadAlertsCount,
  children,
}) => {
  return (
    <header className="sticky top-0 z-40 flex flex-wrap sm:flex-nowrap items-center justify-between px-3 sm:px-5 lg:px-8 pt-2.5 sm:pt-3 pb-1 w-full gap-y-2 gap-x-2 sm:gap-4 shrink-0 pointer-events-none">
      {/* Zone 1: Exact SATA Stencil Wordmark + Minimal White "Powered by Meta" Sub-Lockup */}
      <button
        type="button"
        onClick={() => onSelectTab('HOME')}
        aria-label="SATA Home"
        className="order-1 flex flex-col items-start shrink-0 focus:outline-none group cursor-pointer gap-0.5 sm:gap-1 pointer-events-auto"
      >
        <img
          src="/assets/ui/sata_brand_logo.png"
          alt="SATA Sentinel"
          referrerPolicy="no-referrer"
          className="h-[clamp(28px,3.2vw,44px)] w-auto object-contain select-none drop-shadow-[0_4px_16px_rgba(56,189,248,0.4)]"
        />
        <span
          data-testid="powered-by-meta-badge"
          className="flex items-center gap-1 sm:gap-1.5 pl-0.5 text-[clamp(8px,0.72vw,10.5px)] font-normal tracking-[0.08em] text-white/85 whitespace-nowrap select-none"
        >
          <svg
            viewBox="0 0 24 16"
            fill="none"
            aria-hidden="true"
            className="w-[clamp(10px,0.9vw,13px)] h-[clamp(7px,0.65vw,9px)] text-white/90 shrink-0"
          >
            <path
              d="M6.4 2.5C3.7 2.5 1.8 4.8 1.8 8c0 3.1 1.8 5.5 4.4 5.5 2 0 3.6-1.4 5.8-4.7 2.2 3.3 3.8 4.7 5.8 4.7 2.6 0 4.4-2.4 4.4-5.5 0-3.2-1.9-5.5-4.6-5.5-2.1 0-3.8 1.5-5.6 4.4C10.2 4 8.5 2.5 6.4 2.5Z"
              stroke="currentColor"
              strokeWidth="1.85"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Powered by Meta</span>
        </span>
      </button>

      {/* Zone 2: Center Liquid Glass Search Bar (or Navigation Tabs) */}
      <div className="order-3 sm:order-2 w-full sm:w-auto flex-1 flex justify-center items-center px-1 sm:px-4 pointer-events-auto max-w-[680px]">
        <AnimatePresence mode="wait" initial={false}>
          {children ? (
            <motion.div
              key="docked-search-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center items-center"
            >
              {children}
            </motion.div>
          ) : (
            <motion.nav
              key="primary-nav-tabs"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Primary Orbital Navigation"
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1 sm:gap-3 md:gap-5 xl:gap-9 sm:ml-4 lg:ml-8 overflow-x-auto no-scrollbar py-1 px-1.5 sm:p-0 rounded-full bg-white/[0.04] sm:bg-transparent border border-white/10 sm:border-0"
            >
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => onSelectTab(tab)}
                    className={`relative flex-1 sm:flex-initial text-center text-[10.5px] sm:text-[clamp(10px,0.92vw,13.5px)] tracking-[0.06em] sm:tracking-[0.08em] font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'sata-home-pill px-2.5 sm:px-[clamp(12px,1.6vw,28px)] py-1.5 sm:py-[clamp(5px,0.55vw,10px)] rounded-full text-white font-semibold'
                        : 'px-2 sm:px-[clamp(6px,0.8vw,12px)] py-1 sm:py-[clamp(4px,0.45vw,8px)] text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Zone 3: Top-Right Action Icons & User Avatar */}
      <div className="order-2 sm:order-3 flex items-center gap-1.5 sm:gap-[clamp(4px,0.65vw,12px)] shrink-0 ml-auto sm:ml-0 pointer-events-auto">
        <button
          type="button"
          onClick={onFocusSearch}
          aria-label="Focus Search Bar"
          className="sata-icon-btn w-[clamp(30px,2.8vw,40px)] h-[clamp(30px,2.8vw,40px)] rounded-full flex items-center justify-center text-[#e4e4e7] hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <img
            src="/assets/aistudio/image_565e711c.png"
            alt="Search"
            className="w-[clamp(14px,1.3vw,18px)] h-[clamp(14px,1.3vw,18px)] object-contain"
          />
        </button>

        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Observation Alerts"
          className="sata-icon-btn relative w-[clamp(30px,2.8vw,42px)] h-[clamp(30px,2.8vw,42px)] rounded-full flex items-center justify-center text-[#e4e4e7] hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <Bell className="w-[clamp(14px,1.25vw,18px)] h-[clamp(14px,1.25vw,18px)] stroke-[1.8]" />
          {unreadAlertsCount > 0 && (
            <span className="sr-only">{unreadAlertsCount} active alerts</span>
          )}
        </button>

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
          title="GitHub Repository"
          className="sata-icon-btn w-[clamp(30px,2.8vw,42px)] h-[clamp(30px,2.8vw,42px)] rounded-full flex items-center justify-center text-[#e4e4e7] hover:text-white transition-all cursor-pointer shrink-0"
        >
          <Github className="w-[clamp(14px,1.25vw,18px)] h-[clamp(14px,1.25vw,18px)] stroke-[1.8]" />
        </a>

        {onOpenShortcuts && (
          <button
            type="button"
            onClick={onOpenShortcuts}
            aria-label="Keyboard Shortcuts (?)"
            title="Keyboard Shortcuts (?)"
            className="sata-icon-btn hidden sm:flex w-[clamp(30px,2.8vw,42px)] h-[clamp(30px,2.8vw,42px)] rounded-full items-center justify-center text-[#e4e4e7] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <Keyboard className="w-[clamp(14px,1.25vw,18px)] h-[clamp(14px,1.25vw,18px)] stroke-[1.8]" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenProfile}
          aria-label="Commander Profile"
          title="Flight Controller Profile"
          className="sata-icon-btn w-[clamp(30px,2.8vw,42px)] h-[clamp(30px,2.8vw,42px)] rounded-full flex items-center justify-center text-[#e4e4e7] hover:text-white transition-all cursor-pointer shrink-0"
        >
          <User className="w-[clamp(14px,1.25vw,18px)] h-[clamp(14px,1.25vw,18px)] stroke-[1.8]" />
        </button>
      </div>
    </header>
  );
});
