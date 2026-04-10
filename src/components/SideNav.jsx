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

// Garden navigation icons
const HomeIcon = "https://www.figma.com/api/mcp/asset/a9622107-567f-4218-abe7-2bed2c10ca85";
const BarChartIcon = "https://www.figma.com/api/mcp/asset/cb2b77cd-c9af-4d30-ab23-d057df5077f3";
const LayoutGridIcon = "https://www.figma.com/api/mcp/asset/a4b88c4e-bbf9-410f-b0ac-edcbfd69f075";
const FlagIcon = "https://www.figma.com/api/mcp/asset/c436dbc1-64ad-4ba2-9ad8-ae64d21fecc4";
const GearIcon = "https://www.figma.com/api/mcp/asset/d16f24dc-192a-4bef-ad79-84292e74c0c2";

function SideNav() {
  return (
    <SideNavContainer>
      <NavItems>
        {/* Home */}
        <NavItem>
          <img src={HomeIcon} alt="Home" style={{ width: '15px', height: '15px' }} />
        </NavItem>

        {/* Bar chart square */}
        <NavItem>
          <img src={BarChartIcon} alt="Analytics" style={{ width: '15px', height: '15px' }} />
        </NavItem>

        {/* Layout grid - Active */}
        <NavItem $active>
          <img src={LayoutGridIcon} alt="Dashboard" style={{ width: '15px', height: '15px', filter: 'brightness(0) invert(1)' }} />
        </NavItem>

        {/* Flag */}
        <NavItem>
          <img src={FlagIcon} alt="Overview" style={{ width: '15px', height: '15px' }} />
        </NavItem>

        {/* Gear */}
        <NavItem>
          <img src={GearIcon} alt="Settings" style={{ width: '15px', height: '15px' }} />
        </NavItem>
      </NavItems>

      <BottomSection>
        {/* Bottom section can hold additional items if needed */}
      </BottomSection>
    </SideNavContainer>
  );
}

export default SideNav;
