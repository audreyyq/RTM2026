import React from 'react';
import styled from 'styled-components';
import { Button } from '@zendeskgarden/react-buttons';
import { Dropdown, Select, Field, Label, Menu, Item } from '@zendeskgarden/react-dropdowns';
import { DEFAULT_THEME } from '@zendeskgarden/react-theming';

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
  padding: 0 ${DEFAULT_THEME.space.lg};
  border-bottom: 1px solid ${DEFAULT_THEME.colors.grey[300]};
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: ${DEFAULT_THEME.space.xs};
  font-size: ${DEFAULT_THEME.fontSizes.md};
  color: ${DEFAULT_THEME.colors.foreground};
`;

const BreadcrumbLink = styled.span`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: ${DEFAULT_THEME.colors.grey[600]};
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${DEFAULT_THEME.space.sm};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: ${DEFAULT_THEME.borderRadii.md};
  cursor: pointer;
  color: ${DEFAULT_THEME.colors.grey[700]};

  &:hover {
    background-color: ${DEFAULT_THEME.colors.grey[100]};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${DEFAULT_THEME.space.sm};
  padding: 16px;
  border-bottom: 1px solid ${DEFAULT_THEME.colors.grey[200]};
`;

const FilterDropdown = styled.div`
  position: relative;
  height: 33px;

  select {
    width: ${props => props.$width || '140px'};
    height: 33px;
    padding: 8px 32px 8px 12px;
    border: 1px solid ${DEFAULT_THEME.colors.grey[400]};
    border-radius: ${DEFAULT_THEME.borderRadii.md};
    background-color: white;
    font-size: 12px;
    cursor: pointer;
    appearance: none;

    &:hover {
      border-color: ${DEFAULT_THEME.colors.grey[500]};
    }

    &:focus {
      outline: none;
      border-color: ${DEFAULT_THEME.colors.primaryHue};
      box-shadow: 0 0 0 3px ${DEFAULT_THEME.colors.primaryHue}33;
    }
  }

  &::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 6L6 10L10 6' stroke='%23293239' stroke-width='1.5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 2L8 6L4 10' stroke='%23293239' stroke-width='1.5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
    transform: translateY(-50%) rotate(90deg);
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
