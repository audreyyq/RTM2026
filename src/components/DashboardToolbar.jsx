import React from 'react';
import styled from 'styled-components';
import { Button } from '@zendeskgarden/react-buttons';

const ReloadIcon = "https://www.figma.com/api/mcp/asset/6b423ed7-0b44-4102-b6a0-5060f6f53387";

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 32px;
  border-bottom: 1px solid #e0e0e0;
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #293239;
`;

const BreadcrumbLink = styled.span`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #68737d;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
  color: #68737d;

  &:hover {
    background-color: #f8f9f9;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SparkleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${props => props.$isActive ? '#293239' : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${props => props.$isActive ? '#293239' : '#f8f9f9'};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
`;

const FilterDropdown = styled.div`
  position: relative;
  height: 33px;

  select {
    width: ${props => props.$width || '140px'};
    height: 33px;
    padding: 8px 28px 8px 28px;
    border: 1px solid #d8dcde;
    border-radius: 4px;
    background-color: white;
    font-size: 12px;
    cursor: pointer;
    appearance: none;
    color: transparent;

    &:hover {
      border-color: #87929d;
    }

    &:focus {
      outline: none;
      border-color: #1f73b7;
      box-shadow: 0 0 0 3px rgba(31, 115, 183, 0.2);
    }
  }

  &::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 3h8M3 6h6M4 9h4' stroke='%23687782' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%23293239' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
  }
`;

const FilterLabel = styled.span`
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #2f3941;
  pointer-events: none;
  white-space: nowrap;
`;

const FilterValue = styled.span`
  font-weight: 600;
`;

function DashboardToolbar({ isCopilotOpen, onToggleCopilot, onRefresh }) {
  return (
    <ToolbarContainer>
      <ActionBar>
        <Breadcrumbs>
          <BreadcrumbLink>Project name</BreadcrumbLink>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbLink>Messaging operations dashboard</BreadcrumbLink>
        </Breadcrumbs>

        <ActionButtons>
          <IconButton title="Refresh" onClick={onRefresh}>
            <img src={ReloadIcon} alt="Refresh" style={{ width: '14px', height: '16px', objectFit: 'contain' }} />
          </IconButton>
          <Button size="small">Edit</Button>
          <Button isPrimary size="small">Share</Button>
          <SparkleButton 
            title="Monitoring assistant" 
            $isActive={isCopilotOpen} 
            onClick={onToggleCopilot}
          >
            <svg viewBox="0 0 16 16" width="16" height="16">
              <defs>
                <linearGradient id="sparkleGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#DAC9FF" />
                  <stop offset="42%" stopColor="#A33FE1" />
                  <stop offset="100%" stopColor="#6743E1" />
                </linearGradient>
              </defs>
              <path fill={isCopilotOpen ? "#ffffff" : "url(#sparkleGradient)"} d="M2.499 11a.5.5 0 0 1 .477.348l.256.797a1.01 1.01 0 0 0 .63.633l.789.248a.5.5 0 0 1 .001.954l-.79.252a1.007 1.007 0 0 0-.63.633l-.252.787a.5.5 0 0 1-.95.008l-.266-.79a1.034 1.034 0 0 0-.636-.639l-.781-.252a.5.5 0 0 1-.002-.95l.794-.26a1.023 1.023 0 0 0 .636-.634l.248-.786A.5.5 0 0 1 2.5 11ZM1 7.513a1 1 0 0 1 .69-.953l2.583-.844a3.95 3.95 0 0 0 2.465-2.457l.808-2.56A1 1 0 0 1 9.452.695l.832 2.598a3.906 3.906 0 0 0 2.448 2.453l2.569.811a1 1 0 0 1 .004 1.906l-2.572.823a3.896 3.896 0 0 0-2.449 2.454l-.82 2.565a1 1 0 0 1-1.9.014l-.866-2.567v-.002A3.971 3.971 0 0 0 4.24 9.284l-2.547-.821A1 1 0 0 1 1 7.513Z"/>
            </svg>
          </SparkleButton>
        </ActionButtons>
      </ActionBar>

      <FilterBar>
        <FilterDropdown>
          <select>
            <option>Brand ALL</option>
          </select>
          <FilterLabel>Brand <FilterValue>ALL</FilterValue></FilterLabel>
        </FilterDropdown>
        <FilterDropdown>
          <select>
            <option>Group ALL</option>
          </select>
          <FilterLabel>Group <FilterValue>ALL</FilterValue></FilterLabel>
        </FilterDropdown>
        <FilterDropdown $width="160px">
          <select>
            <option>Channel type ALL</option>
          </select>
          <FilterLabel>Channel type <FilterValue>ALL</FilterValue></FilterLabel>
        </FilterDropdown>
        <FilterDropdown>
          <select>
            <option>Channel ALL</option>
          </select>
          <FilterLabel>Channel <FilterValue>ALL</FilterValue></FilterLabel>
        </FilterDropdown>
        <FilterDropdown>
          <select>
            <option>Tags ALL</option>
          </select>
          <FilterLabel>Tags <FilterValue>ALL</FilterValue></FilterLabel>
        </FilterDropdown>
      </FilterBar>
    </ToolbarContainer>
  );
}

export default DashboardToolbar;
