import React from 'react';
import styled from 'styled-components';
import { Button } from '@zendeskgarden/react-buttons';

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

function DashboardToolbar() {
  return (
    <ToolbarContainer>
      <ActionBar>
        <Breadcrumbs>
          <BreadcrumbLink>Project name</BreadcrumbLink>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbLink>Dashboard A</BreadcrumbLink>
        </Breadcrumbs>

        <ActionButtons>
          <IconButton title="Refresh">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 3a5 5 0 104.546 2.914.5.5 0 00-.908-.417A4 4 0 118 4v1.076l.812-.812a.5.5 0 01.707.707l-2 2a.5.5 0 01-.707 0l-2-2a.5.5 0 11.707-.707L8 4.076V3z" />
            </svg>
          </IconButton>
          <Button size="small">Edit</Button>
          <Button isPrimary size="small">Share</Button>
        </ActionButtons>
      </ActionBar>

      <FilterBar>
        <FilterDropdown>
          <select>
            <option>Brand ALL</option>
          </select>
        </FilterDropdown>
        <FilterDropdown>
          <select>
            <option>Group ALL</option>
          </select>
        </FilterDropdown>
        <FilterDropdown $width="160px">
          <select>
            <option>Channel type ALL</option>
          </select>
        </FilterDropdown>
        <FilterDropdown>
          <select>
            <option>Channel ALL</option>
          </select>
        </FilterDropdown>
        <FilterDropdown>
          <select>
            <option>Tags ALL</option>
          </select>
        </FilterDropdown>
      </FilterBar>
    </ToolbarContainer>
  );
}

export default DashboardToolbar;
