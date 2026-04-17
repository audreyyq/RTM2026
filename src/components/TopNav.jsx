import React from 'react';
import styled from 'styled-components';

const TopNavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  background-color: #f8f9f9;
  padding: 0 8px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 32px;

  img {
    width: 40px;
    height: 32px;
    object-fit: contain;
  }
`;

const ZendeskLogo = "/rtm2026/Logo.png";

const ProductTray = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #293239;

  &:hover {
    background-color: #e9ebed;
  }
`;

const TabsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  max-width: 224px;
  padding: 0 8px 0 12px;
  background-color: ${props => props.$active ? '#293239' : 'transparent'};
  border-radius: 8px;
  color: ${props => props.$active ? 'white' : '#293239'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.$active ? '#293239' : '#e9ebed'};
  }
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 4px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e9ebed;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

function TopNav() {
  return (
    <TopNavContainer>
      <LeftSection>
        <Logo>
          <img src={ZendeskLogo} alt="Zendesk" />
        </Logo>
        <ProductTray>
          <span>Analytics</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </ProductTray>
      </LeftSection>

      <TabsSection>
        <Tab $active>
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
        <IconButton>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </IconButton>
      </TabsSection>

      <RightSection>
        <Avatar>
          <img src="/rtm2026/Avatar.png" alt="User avatar" />
        </Avatar>
      </RightSection>
    </TopNavContainer>
  );
}

export default TopNav;
