import React from 'react';
import styled from 'styled-components';
import {
  Product,
  Header,
  Nav,
  Main,
} from '@zendesk-ui/navigation';

/* Fills App shell; must NOT override Product's internal display:grid (Nav + Main layout). */
const NavRoot = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

// Product icons
import ProductSupportIcon from '@zendesk-ui/assets/icons/20px/product-support.svg?react';
import ProductKnowledgeIcon from '@zendesk-ui/assets/icons/20px/product-knowledge.svg?react';
import ProductAnalyticsIcon from '@zendesk-ui/assets/icons/20px/product-analytics.svg?react';
import ProductQaIcon from '@zendesk-ui/assets/icons/20px/product-quality-assurance.svg?react';
import ProductAiAgentsIcon from '@zendesk-ui/assets/icons/20px/product-ai-agents.svg?react';
import ProductAdminCenterIcon from '@zendesk-ui/assets/icons/20px/product-admin-center.svg?react';

// Nav icons
import HomeIcon from '@zendesk-ui/assets/icons/20px/home-fill.svg?react';
import LayoutGridIcon from '@zendesk-ui/assets/icons/20px/layout-grid-fill.svg?react';
import BarChartIcon from '@zendesk-ui/assets/icons/20px/bar-chart-square-fill.svg?react';
import FlagIcon from '@zendesk-ui/assets/icons/20px/flag-fill.svg?react';
import GearIcon from '@zendesk-ui/assets/icons/20px/gear-fill.svg?react';

// Header icons
import MagnifyingGlassIcon from '@zendesk-ui/assets/icons/20px/magnifying-glass-fill.svg?react';

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  max-width: 280px;
  padding: 0 8px 0 12px;
  background-color: #293239;
  border-radius: 8px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const TabIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
`;

const TabText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TabDismiss = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: inherit;
  padding: 0;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const AddTabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #68737d;

  &:hover {
    background-color: #e9ebed;
  }
`;

const products = [
  { value: 'support', label: 'Support', href: '#', icon: <ProductSupportIcon /> },
  { value: 'knowledge', label: 'Knowledge', href: '#', icon: <ProductKnowledgeIcon /> },
  { value: 'analytics', label: 'Analytics', href: '#', icon: <ProductAnalyticsIcon />, isSelected: true },
  { value: 'qa', label: 'Quality assurance', href: '#', icon: <ProductQaIcon /> },
  { value: 'ai-agents', label: 'AI agents', href: '#', icon: <ProductAiAgentsIcon /> },
  { value: 'admin-center', label: 'Admin center', href: '#', icon: <ProductAdminCenterIcon /> },
];

function GlobalNav({ children }) {
  const [currentNav, setCurrentNav] = React.useState('dashboards');

  const headerTabs = (
    <TabsContainer>
      <Tab>
        <TabIcon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="3" width="4" height="4" rx="1"/>
            <rect x="9" y="3" width="4" height="4" rx="1"/>
            <rect x="3" y="9" width="4" height="4" rx="1"/>
            <rect x="9" y="9" width="4" height="4" rx="1"/>
          </svg>
        </TabIcon>
        <TabText>Messaging operations dashboard</TabText>
        <TabDismiss>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </TabDismiss>
      </Tab>
      <AddTabButton>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </AddTabButton>
    </TabsContainer>
  );

  return (
    <NavRoot>
    <Product locale="en-US" products={products}>
      <Header startChildren={headerTabs}>
        <Header.IconButton tooltip="Search (Cmd+/)">
          <MagnifyingGlassIcon />
        </Header.IconButton>
        <Header.Separator />
        <Header.Help>
          <div style={{ padding: '16px' }}>
            <h3>Help & Resources</h3>
            <p>Access documentation and support.</p>
          </div>
        </Header.Help>
      </Header>

      <Nav>
        <Nav.Item
          icon={<HomeIcon />}
          isCurrent={currentNav === 'home'}
          onAction={() => setCurrentNav('home')}
        >
          Home
        </Nav.Item>
        <Nav.Item
          icon={<LayoutGridIcon />}
          isCurrent={currentNav === 'dashboards'}
          onAction={() => setCurrentNav('dashboards')}
        >
          Dashboards
        </Nav.Item>
        <Nav.Item
          icon={<BarChartIcon />}
          isCurrent={currentNav === 'reports'}
          onAction={() => setCurrentNav('reports')}
        >
          Reports
        </Nav.Item>
        <Nav.Item
          icon={<FlagIcon />}
          isCurrent={currentNav === 'explore'}
          onAction={() => setCurrentNav('explore')}
        >
          Explore
        </Nav.Item>
        <Nav.Separator />
        <Nav.Item
          icon={<GearIcon />}
          isCurrent={currentNav === 'settings'}
          onAction={() => setCurrentNav('settings')}
        >
          Settings
        </Nav.Item>
      </Nav>

      <Main>
        <MainContent>{children}</MainContent>
      </Main>
    </Product>
    </NavRoot>
  );
}

export default GlobalNav;
