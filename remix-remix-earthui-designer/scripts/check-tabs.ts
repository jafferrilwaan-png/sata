import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { TopNavbar } from '../src/components/TopNavbar';

const htmlWithoutChildren = ReactDOMServer.renderToStaticMarkup(
  React.createElement(TopNavbar, {
    activeTab: 'HOME',
    onSelectTab: () => {},
    onFocusSearch: () => {},
    onOpenNotifications: () => {},
    onOpenProfile: () => {},
    unreadAlertsCount: 0,
  })
);

console.log('Without children:');
console.log('Includes HOME:', htmlWithoutChildren.includes('>HOME</button>'));
console.log('Includes SATELLITES:', htmlWithoutChildren.includes('>SATELLITES</button>'));
console.log('Includes ORBITS:', htmlWithoutChildren.includes('>ORBITS</button>'));
console.log('Includes RELEASES:', htmlWithoutChildren.includes('>RELEASES</button>'));

const htmlWithChildren = ReactDOMServer.renderToStaticMarkup(
  React.createElement(TopNavbar, {
    activeTab: 'HOME',
    onSelectTab: () => {},
    onFocusSearch: () => {},
    onOpenNotifications: () => {},
    onOpenProfile: () => {},
    unreadAlertsCount: 0,
    children: React.createElement('div', { id: 'search' }, 'Search'),
  })
);

console.log('With children:');
console.log('Includes HOME:', htmlWithChildren.includes('>HOME</button>'));
console.log('Includes Search:', htmlWithChildren.includes('id="search"'));
