import React from 'react';
import styled from 'styled-components';

const SideNavContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 56px;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 67.5%, rgba(92, 105, 112, 0.08) 100%), #f8f9f9;
  padding: 12px 0;
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${props => props.$active ? '#2f3941' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.$active ? 'white' : '#68737d'};

  &:hover {
    background-color: ${props => props.$active ? '#2f3941' : '#e9ebed'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function SideNav() {
  return (
    <SideNavContainer>
      <NavItems>
        {/* Home */}
        <NavItem>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </NavItem>

        {/* Real-time monitoring */}
        <NavItem>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </NavItem>

        {/* Dashboard - Active */}
        <NavItem $active>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <rect x="3" y="3" width="6" height="6" rx="1"/>
            <rect x="11" y="3" width="6" height="6" rx="1"/>
            <rect x="3" y="11" width="6" height="6" rx="1"/>
            <rect x="11" y="11" width="6" height="6" rx="1"/>
          </svg>
        </NavItem>

        {/* Reports/Flag */}
        <NavItem>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
          </svg>
        </NavItem>

        {/* Settings */}
        <NavItem>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </NavItem>
      </NavItems>

      <BottomSection>
        {/* Bottom section can hold additional items if needed */}
      </BottomSection>
    </SideNavContainer>
  );
}

export default SideNav;
