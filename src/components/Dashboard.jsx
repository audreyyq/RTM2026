import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { getColor } from '@zendeskgarden/react-theming';
import { Skeleton } from '@zendeskgarden/react-loaders';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Button, IconButton } from '@zendeskgarden/react-buttons';
import { Alert, Title, Close } from '@zendeskgarden/react-notifications';
import { Modal, Header, Body, Footer } from '@zendeskgarden/react-modals';
import { Table, Head, HeaderRow, HeaderCell, Body as TableBody, Row as TableRow, Cell as TableCell } from '@zendeskgarden/react-tables';
import { Checkbox, Field, Label } from '@zendeskgarden/react-forms';
import { Menu, Item, Separator } from '@zendeskgarden/react-dropdowns';
import { Tag } from '@zendeskgarden/react-tags';
import { BASELINE_STATE } from '../data/dashboardData';
import DashboardToolbar from './DashboardToolbar';
import SparkleStrokeIcon from '@zendeskgarden/svg-icons/src/16/sparkle-stroke.svg?react';
import OverflowVerticalIcon from '@zendeskgarden/svg-icons/src/16/overflow-vertical-stroke.svg?react';
import DownloadIcon from '@zendeskgarden/svg-icons/src/16/download-stroke.svg?react';
import ChevronDownIcon from '@zendeskgarden/svg-icons/src/16/chevron-down-stroke.svg?react';

const DashboardWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  align-items: stretch;
  width: 100%;
  background-color: ${({ theme }) => getColor({ theme, variable: 'background.subtle' })};
`;

const DashboardMain = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  transition: margin-right 200ms cubic-bezier(0.23, 1, 0.32, 1);
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: transparent;
`;

const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  padding: 16px 24px 24px 24px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: transparent;
`;

const AlertWrapper = styled.div`
  [data-garden-id="notifications.alert"] {
    margin: 0;
    border-radius: 8px;
  }
`;

const AlertTimestamp = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #68737d;
  margin-top: 0;
`;

const AlertRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const DashboardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.h3`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #87929d;
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
`;

const MetricCardsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: ${props => props.$width || '280px'};
  flex-shrink: 0;

  ${props => props.$stretch && `
    & > * {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  `}
`;

const ChartCard = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const MetricCard = styled.div`
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => {
    if (props.$status === 'critical') return '0 2px 8px rgba(204, 51, 64, 0.15)';
    if (props.$status === 'warning') return '0 2px 8px rgba(247, 154, 62, 0.15)';
    return '0 1px 3px rgba(0, 0, 0, 0.08)';
  }};
  border: ${props => {
    if (props.$status === 'critical') return '2px solid #cc3340';
    if (props.$status === 'warning') return '2px solid #f79a3e';
    return '1px solid transparent';
  }};
  background-color: ${props => {
    if (props.$status === 'critical') return '#fef2f2';
    return 'white';
  }};
`;

const AlertIconBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 16px;
  height: 16px;
  color: #cc3340;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
  margin-bottom: 8px;
`;

const MetricValueWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricValue = styled.div`
  font-size: ${props => props.$status === 'critical' ? '36px' : '32px'};
  font-weight: 500;
  color: ${props => props.$status === 'critical' ? '#cc3340' : '#1f73b7'};
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 4px;
  margin: -2px -4px;
  transition: background-color 150ms ease-out;
  text-decoration: none;

  &:hover {
    background-color: ${props => props.$status === 'critical' ? 'rgba(204, 51, 64, 0.1)' : 'rgba(31, 115, 183, 0.08)'};
    text-decoration: underline;
    text-decoration-color: ${props => props.$status === 'critical' ? '#cc3340' : '#1f73b7'};
    text-underline-offset: 4px;
  }
`;

const MetricChange = styled.span`
  font-size: 14px;
  font-weight: 600;
  text-decoration: none !important;
  color: ${props => {
    if (props.$negative) return '#cc3340';
    if (props.$positive) return '#228f67';
    return '#68737d';
  }};

  &:hover {
    text-decoration: none !important;
  }
`;

const MetricSubtext = styled.div`
  font-size: 12px;
  color: #87929d;
  margin-top: 4px;
`;

const AgentAvailabilityRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 20px;
  margin-top: 4px;
`;

const AgentAvailabilityColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const AgentAvailabilityFigure = styled.div`
  font-size: 28px;
  font-weight: 500;
  color: #1f73b7;
  line-height: 1.15;
`;

const AgentAvailabilityCaption = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #68737d;
  margin-top: 4px;
  line-height: 1.3;
`;

const SlaStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  margin-top: 8px;
`;

const SlaStatusValuesRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: baseline;
`;

const SlaStatusLabelsRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 4px;
`;

const SlaStatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
`;

const SlaStatusValue = styled.div`
  font-size: 32px;
  font-weight: 500;
  color: ${props => {
    if (props.$status === 'breached') return '#cc3340';
    if (props.$status === 'nearing') return '#E9AD4D';
    if (props.$status === 'within') return '#699D2C';
    return '#1f73b7';
  }};
  line-height: 1;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 6px;
  margin: -2px -6px 2px -6px;
  transition: background-color 150ms ease-out;

  &:hover {
    background-color: ${props => {
      if (props.$status === 'breached') return 'rgba(204, 51, 64, 0.08)';
      if (props.$status === 'nearing') return 'rgba(233, 173, 77, 0.15)';
      if (props.$status === 'within') return 'rgba(105, 157, 44, 0.12)';
      return 'rgba(31, 115, 183, 0.08)';
    }};
    text-decoration: underline;
    text-decoration-color: ${props => {
      if (props.$status === 'breached') return '#cc3340';
      if (props.$status === 'nearing') return '#E9AD4D';
      if (props.$status === 'within') return '#699D2C';
      return '#1f73b7';
    }};
    text-underline-offset: 4px;
  }
`;

const SlaStatusLabel = styled.div`
  font-size: 12px;
  color: #68737d;
`;

const SlaMiniBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e9ebed;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`;

const SlaMiniBarFill = styled.div`
  height: 100%;
  width: ${props => props.$percent}%;
  background-color: ${props => {
    if (props.$status === 'breached') return '#cc3340';
    if (props.$status === 'nearing') return '#E9AD4D';
    if (props.$status === 'within') return '#699D2C';
    return '#1f73b7';
  }};
  border-radius: 2px;
`;

const ChartTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
  margin-bottom: 16px;
`;

const RankedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RankedListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const RankedListLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const RankedListDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$critical ? '#cc3340' : '#6865BF'};
  flex-shrink: 0;
`;

const RankedListLabel = styled.span`
  font-size: 13px;
  color: #2f3941;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 120px;
`;

const RankedListBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: #e9ebed;
  border-radius: 4px;
  overflow: hidden;
`;

const RankedListBarFill = styled.div`
  height: 100%;
  width: ${props => props.$percent}%;
  background-color: ${props => props.$critical ? '#cc3340' : '#6865BF'};
  border-radius: 4px;
`;

const InlineAlertIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: #cc3340;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const RankedListValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$critical ? '#cc3340' : '#6865BF'};
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background-color 150ms ease-out;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  &:hover {
    background-color: ${props => props.$critical ? 'rgba(204, 51, 64, 0.1)' : 'rgba(104, 101, 191, 0.1)'};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const Row3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

/** Transparent inset: 12px left / right / bottom; flush to top (no top padding). */
const RecommendationsPanelWrap = styled.div`
  flex: 0 0 ${400 + 12 + 12}px;
  min-height: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  padding: 0 12px 12px 12px;
  background: transparent;
  position: relative;
  z-index: 1;
  overflow: hidden;

  /* Panel slide-in animation from right */
  opacity: 1;
  transform: translateX(0);
  transition:
    opacity 400ms ease-out,
    transform 450ms cubic-bezier(0.16, 1, 0.3, 1);

  @starting-style {
    opacity: 0;
    transform: translateX(60px);
  }
`;

const RecommendationsPanel = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  background-color: white;
  border-left: 1px solid #d8dcde;
  border-radius: 8px;
  box-shadow: 0 0 4px 0 rgba(10, 13, 14, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  /* Inner panel scale animation */
  transform: scale(1);
  transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
  
  @starting-style {
    transform: scale(0.98);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px;
`;

const PanelTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
  margin: 0;
`;

const PanelCloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #68737d;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), background-color 150ms ease-out, color 150ms ease-out;
  
  &:hover {
    background-color: #f8f9f9;
    color: #2f3941;
  }
  
  &:active {
    transform: scale(0.92);
  }
`;

const PanelContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RecommendationCard = styled.div`
  background-color: white;
  border: 1px solid #e9ebed;
  border-radius: 8px;
  overflow: hidden;
`;

const RecommendationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 150ms ease-out;
  
  &:hover {
    background-color: #fafafa;
  }
`;

const RecommendationTitle = styled.div`
  flex: 1;
`;

const RecommendationTitleText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
  line-height: 1.4;
`;

const RecommendationPreview = styled.div`
  font-size: 13px;
  color: #68737d;
  margin-top: 6px;
  line-height: 1.5;
`;

const RecommendationChevron = styled.div`
  color: #c2c8cc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

const RecommendationBody = styled.div`
  padding: 0 16px 16px 16px;
`;

const RecommendationSectionLabel = styled.div`
  font-size: 13px;
  color: #2f3941;
  margin-bottom: 4px;
`;

const RecommendationList = styled.ul`
  margin: 0 0 16px 0;
  padding-left: 1.25em;
  font-size: 13px;
  color: #2f3941;
  line-height: 1.3;
  list-style: disc outside;
  list-style-type: disc;

  li {
    display: list-item;
    margin-bottom: 4px;
    padding-left: 2px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    font-weight: 600;
  }
`;

const RecommendationActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

const PrimaryActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: white;
  border: 1px solid #1f73b7;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #1f73b7;
  cursor: pointer;
  width: fit-content;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), background-color 150ms ease-out;
  
  &:hover {
    background-color: #f5faff;
  }
  
  &:active {
    transform: scale(0.97);
  }
`;

const InvestigateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 20px;
  font-size: 14px;
  color: #2f3941;
  cursor: pointer;
  width: fit-content;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), background-color 150ms ease-out, border-color 150ms ease-out;
  
  &:hover {
    background-color: #f8f9f9;
    border-color: #c2c8cc;
  }
  
  &:active {
    transform: scale(0.97);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

// Admin Copilot Panel Styles
const CopilotPanelWrap = styled.div`
  flex: 0 0 ${400 + 12 + 12}px;
  min-height: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  padding: 0 12px 12px 12px;
  background: transparent;
  position: relative;
  z-index: 2;

  /* Panel slide-in animation from right */
  opacity: 1;
  transform: translateX(0);
  transition:
    opacity 400ms ease-out,
    transform 450ms cubic-bezier(0.16, 1, 0.3, 1);

  @starting-style {
    opacity: 0;
    transform: translateX(60px);
  }
`;

const CopilotPanel = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 4px 0 rgba(10, 13, 14, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  /* Inner panel scale animation */
  transform: scale(1);
  transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1);

  @starting-style {
    transform: scale(0.98);
  }
`;

const CopilotHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
`;

const CopilotHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CopilotTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
  margin: 0;
`;

const CopilotCloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #68737d;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), background-color 150ms ease-out, color 150ms ease-out;
  
  &:hover {
    background-color: #f8f9f9;
    color: #2f3941;
  }
  
  &:active {
    transform: scale(0.92);
  }
`;

const CopilotContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => getColor({ theme, variable: 'background.default' })};
`;

const CopilotMessage = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  /* Message entrance animation */
  opacity: 1;
  transform: translateY(0);
  transition: 
    opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
  
  @starting-style {
    opacity: 0;
    transform: translateY(8px);
  }
`;

const CopilotAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #DAC9FF 0%, #A33FE1 50%, #6743E1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;

const CopilotMessageBubble = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 18px;
  color: #2f3941;
`;

const CopilotMessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const CopilotMessageSender = styled.span`
  font-weight: 600;
  font-size: 13px;
  color: #2f3941;
`;

const CopilotMessageTime = styled.span`
  font-size: 12px;
  color: #87929d;
`;

const CopilotMessageText = styled.div`
  color: #2f3941;
  
  p {
    margin: 0 0 8px 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  ul {
    margin: 8px 0 16px 0;
    padding-left: 20px;
    list-style-type: disc;
  }
  
  li {
    margin-bottom: 4px;
    display: list-item;
    
    &::marker {
      color: #68737d;
    }
  }
  
  strong {
    color: #2f3941;
    font-weight: 600;
  }
`;

const QuickReplyButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

const QuickReplyButton = styled.button`
  padding: 8px 12px;
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 20px;
  font-size: 14px;
  color: #2f3941;
  cursor: pointer;
  text-align: left;
  width: fit-content;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), background-color 150ms ease-out, border-color 150ms ease-out;

  &:hover {
    background-color: #f8f9f9;
    border-color: #c2c8cc;
  }
  
  &:active {
    transform: scale(0.97);
  }
`;

const CopilotRecCard = styled.div`
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 12px;
  margin-top: 12px;
  overflow: hidden;
  
  /* Card entrance animation */
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: 
    opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
  
  @starting-style {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
`;

const CopilotRecHeader = styled.div`
  background: linear-gradient(135deg, #f0e6fa 0%, #e8e0f5 100%);
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(41, 50, 57, 1);
`;

const CopilotRecContent = styled.div`
  padding: 16px;
  border-radius: 20px 20px 0px 0px;
`;

const CopilotRecTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
  line-height: 1.4;
`;

const CopilotRecSection = styled.div`
  margin-bottom: 12px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const CopilotRecSectionTitle = styled.p`
  margin: 0 0 4px 0;
  font-size: 13px;
  font-weight: 600;
  color: #2f3941;
`;

const CopilotRecList = styled.ul`
  margin: 0;
  padding-left: 18px;
  list-style-type: disc;
  
  li {
    font-size: 13px;
    color: #49545c;
    margin-bottom: 2px;
    line-height: 1.4;
    
    &::marker {
      color: #87929d;
    }
  }
`;

const CopilotRecActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

const CopilotRecButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: fit-content;
  min-width: 120px;
  padding: 10px 16px;
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #2f3941;
  cursor: pointer;
  text-align: center;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), background-color 150ms ease-out, border-color 150ms ease-out;

  &:hover:not(:disabled) {
    background-color: #f8f9f9;
    border-color: #c2c8cc;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    cursor: default;
    opacity: 0.8;
  }
`;

const CopilotViewAllButton = styled.button`
  padding: 10px 16px;
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #2f3941;
  cursor: pointer;
  text-align: center;
  margin-top: 12px;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), background-color 150ms ease-out, border-color 150ms ease-out;

  &:hover {
    background-color: #f8f9f9;
    border-color: #c2c8cc;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SuccessHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #038153;
`;

const SuccessCheckmark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #edf8f4;
  border-radius: 4px;
  color: #038153;
  font-size: 14px;
`;

const SuccessDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #2f3941;
  line-height: 1.5;
  
  strong {
    font-weight: 600;
  }
`;

const SuccessExpectations = styled.div`
  margin-top: 4px;
`;

const SuccessExpectationsTitle = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #68737d;
`;

const SuccessExpectationsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #2f3941;
  line-height: 1.6;
  
  li {
    margin-bottom: 2px;
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #d8dcde;
  border-top-color: #2f3941;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CopilotStartScreen = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const CopilotStartGradient = styled.div`
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(218, 201, 255, 1) 0%, rgba(163, 63, 225, 0.8) 42%, rgba(103, 67, 225, 0.5) 100%);
  filter: blur(100px);
  pointer-events: none;
  opacity: 0.4;
  z-index: 0;
`;

const CopilotStartContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 352px;
`;

const CopilotStartIcon = styled.div`
  svg {
    width: 16px;
    height: 16px;
    
    path {
      fill: url(#startSparkleGradient);
    }
  }
`;

const CopilotStartTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2f3941;
`;

const CopilotStartSuggestions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 8px;
`;

const CopilotSuggestionButton = styled.button`
  display: block;
  width: fit-content;
  padding: 10px 16px;
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 20px;
  font-size: 14px;
  color: #2f3941;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  
  &:hover {
    background-color: #f8f9f9;
    border-color: #c2c8cc;
  }
`;

const CopilotStartFooter = styled.div`
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  z-index: 1;
`;

const CopilotPoweredBy = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #68737d;
`;

const CopilotDisclaimer = styled.div`
  font-size: 12px;
  color: #87929d;
  line-height: 1.4;
`;

const CopilotInputArea = styled.div`
  padding: 16px 20px;
  background: ${({ theme }) => getColor({ theme, variable: 'background.default' })};
  position: relative;
  z-index: 2;
`;

const CopilotInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 8px 20px;
  border: 1px solid #d8dcde;
  border-radius: 28px;
  background: white;
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
  
  &:focus-within {
    border-color: #1f73b7;
    box-shadow: 0 0 0 3px rgba(31, 115, 183, 0.15);
  }
`;

const CopilotInput = styled.input`
  flex: 1;
  border: none;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.4;
  background: transparent;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #87929d;
  }
`;

const CopilotSendButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2f3941;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), background 150ms ease-out;

  &:hover {
    background: #1f292f;
  }

  &:active {
    transform: scale(0.92);
    background: #0f1417;
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: white;
  }
`;

const UserMessage = styled.div`
  display: flex;
  justify-content: flex-end;
  
  /* Message entrance animation */
  opacity: 1;
  transform: translateY(0);
  transition: 
    opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
  
  @starting-style {
    opacity: 0;
    transform: translateY(8px);
  }
`;

const UserMessageBubble = styled.div`
  background-color: ${({ theme }) => getColor({ theme, variable: 'background.success' })};
  border-radius: 8px 0px 8px 8px;
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  max-width: 80%;
`;

const CopilotLoadingMessage = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  /* Loading message entrance */
  opacity: 1;
  transform: translateY(0);
  transition: 
    opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
  
  @starting-style {
    opacity: 0;
    transform: translateY(8px);
  }
`;

const CopilotLoadingBubble = styled.div`
  flex: 1;
`;

const CopilotWorkingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const CopilotWorkingText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #2f3941;
`;

const CopilotSkeletonRow = styled.div`
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledSkeleton = styled(Skeleton)`
  background-color: #E9D8F1 !important;
  
  &::after {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent) !important;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 0;
  
  span {
    width: 6px;
    height: 6px;
    background-color: #87929d;
    border-radius: 50%;
    animation: typing 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1);
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.15s; }
    &:nth-child(3) { animation-delay: 0.3s; }
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-5px);
      opacity: 1;
    }
  }
`;

const CopilotLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
  padding: 40px;
`;

const CopilotLoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #DAC9FF 0%, #A33FE1 50%, #6743E1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.08);
      opacity: 0.85;
    }
  }
`;

const CopilotLoadingText = styled.div`
  font-size: 13px;
  color: #68737d;
  text-align: center;
`;

// Modal Styles
const ModalHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ModalHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ModalTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
`;

const ModalSubtitle = styled.span`
  font-size: 12px;
  color: #68737d;
`;

const FilterTag = styled.span`
  font-size: 12px;
  color: #1f73b7;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 14px;
  color: #1f73b7;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5faff;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const BulkActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background-color: #edf7ff;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  border-top: 1px solid #d8dcde;
`;

const BulkActionText = styled.span`
  font-size: 14px;
  color: #2f3941;
`;

const TableWrapper = styled.div`
  max-height: 500px;
  overflow: auto;
  padding-bottom: ${({ $hasSelection }) => $hasSelection ? '60px' : '0'};
  
  table {
    width: 100%;
    min-width: 1200px;
    table-layout: fixed;
  }
  
  th, td {
    font-size: 12px !important;
    vertical-align: middle;
  }
  
  /* Center-align checkbox cells */
  th:first-child,
  td:first-child {
    text-align: center;
    
    [data-garden-id="forms.field"] {
      display: flex;
      justify-content: center;
    }
  }
  
  /* Apply text truncation only to cells that don't contain interactive elements */
  th:not(:first-child):not(:last-child),
  td:not(:first-child):not(:last-child) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Ensure checkbox cells have enough space and aren't clipped */
  th:first-child,
  td:first-child,
  th:last-child,
  td:last-child {
    overflow: visible;
    position: relative;
    z-index: 1;
  }
  
  /* Ensure checkboxes are fully clickable */
  [data-garden-id="forms.checkbox"],
  [data-garden-id="forms.checkbox_label"],
  [data-garden-id="forms.field"] {
    cursor: pointer;
    position: relative;
    z-index: 2;
    pointer-events: auto;
  }
  
  /* Ensure checkbox input is clickable */
  input[type="checkbox"] {
    cursor: pointer;
    pointer-events: auto;
  }
`;

const TicketLink = styled.a`
  color: #1f73b7;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const OutcomeTag = styled(Tag)`
  background-color: #cc3340 !important;
  color: white !important;
`;

const ActionMenu = styled.div`
  position: relative;
  
  /* Ensure dropdown menu isn't constrained by table cell width */
  [data-garden-id="dropdowns.menu"] {
    min-width: 120px;
    white-space: nowrap;
  }
`;

// Escalation table data - 68 tickets
const escalationTableData = [
  { id: '11239', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '1min 32sec', language: 'POL' },
  { id: '12345', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues +1 more', duration: '1min 32sec', language: 'ENG' },
  { id: '19876', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Payment issues', duration: '1min 32sec', language: 'ENG' },
  { id: '20567', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Payment issues', duration: '0min 45sec', language: 'ENG' },
  { id: '22345', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Account access', duration: '2min 50sec', language: 'POL' },
  { id: '30001', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'Payment issues +1 more', duration: '1min 3sec', language: 'ITA' },
  { id: '30003', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Payment issues', duration: '1min 16sec', language: 'ENG' },
  { id: '30005', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '3min 50sec', language: 'POL' },
  { id: '30007', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Refund request', duration: '2min 38sec', language: 'ITA' },
  { id: '30009', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'Payment issues', duration: '4min 25sec', language: 'ENG' },
  { id: '30011', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'General billing', duration: '3min 6sec', language: 'POL' },
  { id: '30013', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues +1 more', duration: '4min 46sec', language: 'ITA' },
  { id: '30015', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Payment issues', duration: '3min 32sec', language: 'ENG' },
  { id: '30017', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'Refund request', duration: '2min 35sec', language: 'POL' },
  { id: '30019', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Payment issues', duration: '4min 54sec', language: 'ITA' },
  { id: '30021', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Account access', duration: '4min 5sec', language: 'ENG' },
  { id: '30023', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'General billing', duration: '3min 20sec', language: 'POL' },
  { id: '30025', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Payment issues', duration: '2min 15sec', language: 'ENG' },
  { id: '30027', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues +1 more', duration: '1min 48sec', language: 'ITA' },
  { id: '30029', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Refund request', duration: '3min 12sec', language: 'POL' },
  { id: '30031', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '2min 45sec', language: 'ENG' },
  { id: '30033', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Account access', duration: '4min 20sec', language: 'ITA' },
  { id: '30035', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'General billing', duration: '1min 55sec', language: 'POL' },
  { id: '30037', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Payment issues +1 more', duration: '3min 38sec', language: 'ENG' },
  { id: '30039', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues', duration: '2min 22sec', language: 'ITA' },
  { id: '30041', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Refund request', duration: '4min 10sec', language: 'POL' },
  { id: '30043', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '1min 35sec', language: 'ENG' },
  { id: '30045', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Account access', duration: '3min 50sec', language: 'ITA' },
  { id: '30047', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'General billing', duration: '2min 28sec', language: 'POL' },
  { id: '30049', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Payment issues +1 more', duration: '4min 5sec', language: 'ENG' },
  { id: '30051', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues', duration: '1min 42sec', language: 'ITA' },
  { id: '30053', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Refund request', duration: '3min 18sec', language: 'POL' },
  { id: '30055', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '2min 55sec', language: 'ENG' },
  { id: '30057', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Account access', duration: '4min 32sec', language: 'ITA' },
  { id: '30059', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'General billing', duration: '1min 20sec', language: 'POL' },
  { id: '30061', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Payment issues +1 more', duration: '3min 45sec', language: 'ENG' },
  { id: '30063', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues', duration: '2min 10sec', language: 'ITA' },
  { id: '30065', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Refund request', duration: '4min 48sec', language: 'POL' },
  { id: '30067', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '1min 58sec', language: 'ENG' },
  { id: '30069', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Account access', duration: '3min 25sec', language: 'ITA' },
  { id: '30071', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'General billing', duration: '2min 40sec', language: 'POL' },
  { id: '30073', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Payment issues +1 more', duration: '4min 15sec', language: 'ENG' },
  { id: '30075', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues', duration: '1min 30sec', language: 'ITA' },
  { id: '30077', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Refund request', duration: '3min 55sec', language: 'POL' },
  { id: '30079', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '2min 18sec', language: 'ENG' },
  { id: '30081', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Account access', duration: '4min 42sec', language: 'ITA' },
  { id: '30083', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'General billing', duration: '1min 45sec', language: 'POL' },
  { id: '30085', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Payment issues +1 more', duration: '3min 30sec', language: 'ENG' },
  { id: '30087', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues', duration: '2min 5sec', language: 'ITA' },
  { id: '30089', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Refund request', duration: '4min 28sec', language: 'POL' },
  { id: '30091', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '1min 52sec', language: 'ENG' },
  { id: '30093', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Account access', duration: '3min 15sec', language: 'ITA' },
  { id: '30095', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'General billing', duration: '2min 48sec', language: 'POL' },
  { id: '30097', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Payment issues +1 more', duration: '4min 8sec', language: 'ENG' },
  { id: '30099', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues', duration: '1min 38sec', language: 'ITA' },
  { id: '30101', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Refund request', duration: '3min 58sec', language: 'POL' },
  { id: '30103', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '2min 25sec', language: 'ENG' },
  { id: '30105', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Account access', duration: '4min 35sec', language: 'ITA' },
  { id: '30107', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'General billing', duration: '1min 28sec', language: 'POL' },
  { id: '30109', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Payment issues +1 more', duration: '3min 42sec', language: 'ENG' },
  { id: '30111', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues', duration: '2min 12sec', language: 'ITA' },
  { id: '30113', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Refund request', duration: '4min 52sec', language: 'POL' },
  { id: '30115', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Brasilian Customer', useCase: 'Payment issues', duration: '1min 15sec', language: 'ENG' },
  { id: '30117', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Spanish Customer', useCase: 'Account access', duration: '3min 28sec', language: 'ITA' },
  { id: '30119', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Chilean Customer +1 more', useCase: 'General billing', duration: '2min 55sec', language: 'POL' },
  { id: '30121', aiAgent: 'Zendesk - WhatsApp', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'Portuguese Customer', useCase: 'Payment issues +1 more', duration: '4min 18sec', language: 'ENG' },
  { id: '30123', aiAgent: 'Zendesk - chat - m', channel: 'Messaging', state: 'Completed - reviewed', outcome: 'Assisted escalation', segment: 'Colombian Customer +1 more', useCase: 'Payment issues', duration: '1min 48sec', language: 'ITA' },
  { id: '30125', aiAgent: 'Zendesk - facebook', channel: 'Messaging', state: 'Completed - pending review', outcome: 'Assisted escalation', segment: 'English Customer', useCase: 'Refund request', duration: '2min 32sec', language: 'ENG' },
];

// Baseline data
const baselineMetrics = {
  totalConversations: 65,
  automatedResolution: 44,
  queueWaitTime: '8min',
  agentsAvailable: 21,
  agentsScheduledTotal: 42,
  agentSpareCapacityPercent: 36,
  avgFirstAssignment: '2.4min',
  avgResolutionTime: '8.2min',
  slaCompliance: 76,
  slaBreached: 5,
  slaNearing: 12,
  slaWithin: 28,
};

const baselineEscalation = [
  { intent: 'Payment issues', rate: 73, critical: true },
  { intent: 'Account Access', rate: 45, critical: false },
  { intent: 'Refund Request', rate: 28, critical: false },
  { intent: 'General Billing', rate: 18, critical: false },
];

const baselineQueue = [
  { workstream: 'Billing', count: 45, critical: true },
  { workstream: 'Technical Support', count: 12, critical: false },
  { workstream: 'Account Management', count: 8, critical: false },
  { workstream: 'General Inquiry', count: 6, critical: false },
  { workstream: 'Returns', count: 4, critical: false },
];

// Data variations (slight shifts)
const dataVariations = [
  {
    metrics: { ...baselineMetrics, totalConversations: 68, automatedResolution: 42, slaBreached: 6, slaNearing: 11 },
    escalation: [
      { intent: 'Payment issues', rate: 75, critical: true },
      { intent: 'Account Access', rate: 43, critical: false },
      { intent: 'Refund Request', rate: 30, critical: false },
      { intent: 'General Billing', rate: 17, critical: false },
    ],
    queue: [
      { workstream: 'Billing', count: 48, critical: true },
      { workstream: 'Technical Support', count: 14, critical: false },
      { workstream: 'Account Management', count: 7, critical: false },
      { workstream: 'General Inquiry', count: 5, critical: false },
      { workstream: 'Returns', count: 3, critical: false },
    ],
  },
  {
    metrics: { ...baselineMetrics, totalConversations: 72, automatedResolution: 41, queueWaitTime: '9min', slaBreached: 7, slaNearing: 13 },
    escalation: [
      { intent: 'Payment issues', rate: 78, critical: true },
      { intent: 'Account Access', rate: 47, critical: false },
      { intent: 'Refund Request', rate: 26, critical: false },
      { intent: 'General Billing', rate: 20, critical: false },
    ],
    queue: [
      { workstream: 'Billing', count: 52, critical: true },
      { workstream: 'Technical Support', count: 15, critical: false },
      { workstream: 'Account Management', count: 9, critical: false },
      { workstream: 'General Inquiry', count: 7, critical: false },
      { workstream: 'Returns', count: 5, critical: false },
    ],
  },
  {
    metrics: { ...baselineMetrics, totalConversations: 70, automatedResolution: 40, queueWaitTime: '10min', slaBreached: 8, slaNearing: 14, slaWithin: 26 },
    escalation: [
      { intent: 'Payment issues', rate: 80, critical: true },
      { intent: 'Account Access', rate: 48, critical: false },
      { intent: 'Refund Request', rate: 25, critical: false },
      { intent: 'General Billing', rate: 22, critical: false },
    ],
    queue: [
      { workstream: 'Billing', count: 55, critical: true },
      { workstream: 'Technical Support', count: 16, critical: false },
      { workstream: 'Account Management', count: 10, critical: false },
      { workstream: 'General Inquiry', count: 8, critical: false },
      { workstream: 'Returns', count: 6, critical: false },
    ],
  },
];

function Dashboard({ state, onStateChange, showAlertStates = true, onResetPrototype }) {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotMode, setCopilotMode] = useState('start'); // 'start' or 'investigate'
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotStep, setCopilotStep] = useState('initial');
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [reassignState, setReassignState] = useState('idle');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  const copilotContentRef = useRef(null);

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (copilotContentRef.current) {
      copilotContentRef.current.scrollTo({
        top: copilotContentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [copilotStep, reassignState, copilotLoading]);

  // Handle copilot loading state - only run once when first opened
  useEffect(() => {
    if (showCopilot && copilotStep === 'initial') {
      setCopilotLoading(true);
      const timer = setTimeout(() => {
        setCopilotLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopilot, copilotStep]);
  
  // Reset copilot state when closing
  const handleCloseCopilot = () => {
    setShowCopilot(false);
    setCopilotStep('initial');
    setCopilotLoading(false);
  };
  
  // Handle "What should I do?" click
  const handleWhatShouldIDo = () => {
    // Immediately show user message and loading state
    setCopilotStep('loading');
    // After delay, show the recommendation
    setTimeout(() => {
      setCopilotStep('recommendation');
    }, 1500);
  };
  const data = BASELINE_STATE;

  // Get current data based on update count
  const currentVariation = updateCount === 0 ? null : dataVariations[(updateCount - 1) % 3];
  const baseMetrics = currentVariation ? currentVariation.metrics : baselineMetrics;
  const escalationData = currentVariation ? currentVariation.escalation : baselineEscalation;
  const baseQueueData = currentVariation ? currentVariation.queue : baselineQueue;
  
  // Override agent metrics when Tier 2 specialist is selected
  const metrics = selectedGroup === 'Tier 2 specialist'
    ? { 
        ...baseMetrics, 
        agentsAvailable: reassignState === 'success' ? 0 : 4, 
        agentsScheduledTotal: 12, 
        agentSpareCapacityPercent: reassignState === 'success' ? 0 : 42 
      }
    : baseMetrics;
  
  // Get billing queue data for dynamic recommendation card
  const billingQueueItem = baseQueueData.find(q => q.workstream === 'Billing');
  const currentBillingCount = billingQueueItem?.count || 0;
  const ticketsToReassign = Math.round(currentBillingCount * 0.5); // Reassign ~50% of tickets
  const specialistsNeeded = Math.max(3, Math.round(ticketsToReassign / 6)); // ~6 tickets per specialist
  const currentWaitTime = metrics.queueWaitTime || '8min';
  const projectedWaitTime = '3min';
  
  // Apply action effect to queue data
  const queueDepthData = reassignState === 'success' 
    ? baseQueueData.map(q => 
        q.workstream === 'Billing' 
          ? { ...q, count: Math.round(q.count * 0.5), critical: false }
          : q
      )
    : baseQueueData;

  const queueBarLabelContent = useCallback(
    (props) => {
      const { x, y, width, height, value } = props;
      return (
        <g>
          <text x={x + width + 8} y={y + height / 2} dy={4} fill="#68737d" fontSize={12} fontWeight={600}>
            {value}
          </text>
        </g>
      );
    },
    []
  );

  const queueYAxisTick = useCallback(
    (props) => {
      const { x, y, payload, index } = props;
      const isCritical = showAlertStates && queueDepthData[index]?.critical;
      return (
        <g transform={`translate(${x},${y})`}>
          {isCritical && (
            <svg x={-140} y={-7} width={14} height={14} viewBox="0 0 16 16" fill="#cc3340">
              <path d="M8 1a1 1 0 01.867.5l6.928 12A1 1 0 0114.928 15H1.072a1 1 0 01-.867-1.5l6.928-12A1 1 0 018 1zm0 4a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 5zm0 7a1 1 0 100-2 1 1 0 000 2z"/>
            </svg>
          )}
          <text x={isCritical ? -122 : -140} y={0} dy={4} textAnchor="start" fill="#2f3941" fontSize={12}>
            {payload.value}
          </text>
        </g>
      );
    },
    [showAlertStates, queueDepthData]
  );

  // Auto-update every 10 seconds, reset after 3 updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCount(prev => {
        if (prev >= 3) return 0; // Reset to baseline after 3 updates
        return prev + 1;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardWrapper>
      <DashboardMain>
        <DashboardContainer>
          <DashboardToolbar 
            isCopilotOpen={showCopilot}
            onToggleCopilot={() => {
              if (showCopilot) {
                setShowCopilot(false);
              } else {
                setCopilotMode('start');
                setShowCopilot(true);
                setShowRecommendations(false);
              }
            }}
            onRefresh={() => {
              if (onResetPrototype) {
                onResetPrototype();
              } else {
                setReassignState('idle');
                setCopilotStep('initial');
                setCopilotMode('start');
                setCopilotLoading(false);
                setShowCopilot(false);
                setShowRecommendations(false);
                setAlertDismissed(false);
              }
            }}
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
          />

          <ContentArea>
            {!alertDismissed && (
            <AlertWrapper>
              <Alert type="warning">
                <AlertRow>
                  <div>
                    <Title>Escalation rate increased to 44% · "Payment issues" use case +340% (73% escalating)</Title>
                    <AlertTimestamp>Detected 2 min ago</AlertTimestamp>
                  </div>
                  <Button size="small" onClick={() => { setShowCopilot(false); setShowRecommendations(true); }}>View recommendations</Button>
                </AlertRow>
                <Close aria-label="Close alert" onClick={() => setAlertDismissed(true)} />
              </Alert>
            </AlertWrapper>
            )}

        <DashboardGrid>
          <Section>
            <SectionHeader>AI Agent Performance</SectionHeader>
            <Row>
              <MetricCard style={{ flex: 1 }}>
                <MetricLabel>Total conversations</MetricLabel>
                <MetricValueWrapper>
                  <MetricValue>
                    {metrics.totalConversations}
                    <MetricChange $negative>(+{Math.round((metrics.totalConversations - 40) / 40 * 100)}%)</MetricChange>
                  </MetricValue>
                </MetricValueWrapper>
              </MetricCard>
              <MetricCard $status={showAlertStates ? 'critical' : undefined} style={{ flex: 1 }}>
                {showAlertStates && (
                <AlertIconBadge>
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a1 1 0 01.867.5l6.928 12A1 1 0 0114.928 15H1.072a1 1 0 01-.867-1.5l6.928-12A1 1 0 018 1zm0 4a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 5zm0 7a1 1 0 100-2 1 1 0 000 2z"/>
                  </svg>
                </AlertIconBadge>
                )}
                <MetricLabel>Escalation rate</MetricLabel>
                <MetricValueWrapper>
                  <MetricValue $status={showAlertStates ? 'critical' : undefined} onClick={() => setShowEscalationModal(true)}>
                    {metrics.automatedResolution}%
                    <MetricChange $negative={showAlertStates}>↑</MetricChange>
                  </MetricValue>
                </MetricValueWrapper>
              </MetricCard>
              <ChartCard style={{ flex: 1 }}>
                <ChartTitle>Escalation rate by use case</ChartTitle>
                <RankedList>
                  {escalationData.map((entry, index) => {
                    const rowCritical = showAlertStates && entry.critical;
                    return (
                    <RankedListItem key={index}>
                      <RankedListLeft>
                        <RankedListDot $critical={rowCritical} />
                        <RankedListLabel>
                          {entry.intent}
                        </RankedListLabel>
                        <RankedListBar>
                          <RankedListBarFill $critical={rowCritical} $percent={entry.rate} />
                        </RankedListBar>
                      </RankedListLeft>
                      <RankedListValue $critical={rowCritical}>
                        {entry.rate}%
                        {rowCritical && (
                          <InlineAlertIcon>
                            <svg viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8 1a1 1 0 01.867.5l6.928 12A1 1 0 0114.928 15H1.072a1 1 0 01-.867-1.5l6.928-12A1 1 0 018 1zm0 4a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 5zm0 7a1 1 0 100-2 1 1 0 000 2z"/>
                            </svg>
                          </InlineAlertIcon>
                        )}
                      </RankedListValue>
                    </RankedListItem>
                  );
                  })}
                </RankedList>
              </ChartCard>
            </Row>
          </Section>

          <Section>
            <SectionHeader>Human Agent Operations</SectionHeader>
            <Row>
              <ChartCard style={{ flex: '0 0 45%' }}>
                <ChartTitle>Queues and tickets</ChartTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={queueDepthData} layout="vertical" margin={{ left: 0, right: 60 }} barCategoryGap="25%">
                    <XAxis type="number" domain={[0, 50]} hide />
                    <YAxis type="category" dataKey="workstream" width={140} axisLine={false} tickLine={false} tick={queueYAxisTick} />
                    <Bar dataKey="count" radius={[4, 4, 4, 4]} background={{ fill: '#e9ebed', radius: 4 }}>
                      {queueDepthData.map((entry, index) => (
                        <Cell key={index} fill={showAlertStates && entry.critical ? '#cc3340' : '#3694E2'} />
                      ))}
                      <LabelList dataKey="count" content={queueBarLabelContent} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <MetricCardsColumn $stretch style={{ flex: 1 }}>
                <MetricCard $status={showAlertStates ? 'critical' : undefined}>
                  {showAlertStates && (
                  <AlertIconBadge>
                    <svg viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1a1 1 0 01.867.5l6.928 12A1 1 0 0114.928 15H1.072a1 1 0 01-.867-1.5l6.928-12A1 1 0 018 1zm0 4a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 5zm0 7a1 1 0 100-2 1 1 0 000 2z"/>
                    </svg>
                  </AlertIconBadge>
                  )}
                  <MetricLabel>Queue avg wait time</MetricLabel>
                  <MetricValueWrapper>
                    <MetricValue $status={showAlertStates ? 'critical' : undefined}>
                      {metrics.queueWaitTime}
                      <MetricChange $negative={showAlertStates}>↑</MetricChange>
                    </MetricValue>
                  </MetricValueWrapper>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>Agent availability</MetricLabel>
                  <MetricValueWrapper>
                    <AgentAvailabilityRow>
                      <AgentAvailabilityColumn>
                        <AgentAvailabilityFigure>
                          {metrics.agentsAvailable}/{metrics.agentsScheduledTotal}
                        </AgentAvailabilityFigure>
                        <AgentAvailabilityCaption>Available</AgentAvailabilityCaption>
                      </AgentAvailabilityColumn>
                      <AgentAvailabilityColumn>
                        <AgentAvailabilityFigure>
                          {metrics.agentSpareCapacityPercent}%
                        </AgentAvailabilityFigure>
                        <AgentAvailabilityCaption>Spare Capacity</AgentAvailabilityCaption>
                      </AgentAvailabilityColumn>
                    </AgentAvailabilityRow>
                  </MetricValueWrapper>
                </MetricCard>
              </MetricCardsColumn>

              <MetricCard style={{ flex: 1.2, display: 'flex', flexDirection: 'column' }}>
              <MetricLabel>SLA status (queue)</MetricLabel>
              <SlaStatusContainer>
                <SlaStatusValuesRow>
                  <SlaStatusItem>
                    <SlaStatusValue $status="breached">{metrics.slaBreached}</SlaStatusValue>
                    <SlaStatusLabel>Breached</SlaStatusLabel>
                  </SlaStatusItem>
                  <SlaStatusItem>
                    <SlaStatusValue $status="nearing">{metrics.slaNearing}</SlaStatusValue>
                    <SlaStatusLabel>Nearing breach</SlaStatusLabel>
                  </SlaStatusItem>
                  <SlaStatusItem>
                    <SlaStatusValue $status="within">{metrics.slaWithin}</SlaStatusValue>
                    <SlaStatusLabel>Within SLA</SlaStatusLabel>
                  </SlaStatusItem>
                </SlaStatusValuesRow>
              </SlaStatusContainer>
            </MetricCard>
            </Row>
          </Section>

          <Section>
            <SectionHeader>Operational Performance</SectionHeader>
            <Row3>
              <MetricCard>
                <MetricLabel>Avg time to first assignment</MetricLabel>
              <MetricValue>{metrics.avgFirstAssignment}</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Avg resolution time</MetricLabel>
              <MetricValue>{metrics.avgResolutionTime}</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>SLA compliance</MetricLabel>
              <MetricValue>
                {metrics.slaCompliance}%
                <MetricChange $negative>↓</MetricChange>
              </MetricValue>
            </MetricCard>
            </Row3>
          </Section>
            </DashboardGrid>
          </ContentArea>
        </DashboardContainer>
      </DashboardMain>

      {showRecommendations && (
        <RecommendationsPanelWrap>
        <RecommendationsPanel>
            <PanelHeader>
              <PanelTitle>Recommended actions</PanelTitle>
              <PanelCloseButton type="button" aria-label="Close panel" onClick={() => setShowRecommendations(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                  <path stroke="currentColor" strokeLinecap="round" d="M3 13L13 3m0 10L3 3" />
                </svg>
              </PanelCloseButton>
            </PanelHeader>
            <PanelContent>
              {/* Action 1 - Expanded */}
              <RecommendationCard>
                <RecommendationHeader>
                  <RecommendationTitle>
                    <RecommendationTitleText>Reassign "Payment declined" topic tickets to Tier 2 specialists</RecommendationTitleText>
                  </RecommendationTitle>
                  <RecommendationChevron>
                    <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                      <path fill="currentColor" d="M3.312 10.39a.5.5 0 01-.69-.718l.066-.062 5-4a.5.5 0 01.542-.054l.082.054 5 4a.5.5 0 01-.55.83l-.074-.05L8 6.641l-4.688 3.75z"/>
                    </svg>
                  </RecommendationChevron>
                </RecommendationHeader>
                <RecommendationBody>
                  <RecommendationSectionLabel>This addresses:</RecommendationSectionLabel>
                  <RecommendationList>
                    <li>26 "Payment declined" topic tickets in Billing queue</li>
                    <li>High queue wait times</li>
                  </RecommendationList>
                  
                  <RecommendationSectionLabel>Expected impact:</RecommendationSectionLabel>
                  <RecommendationList>
                    <li>Billing queue clears in: 15min</li>
                    <li>Queue wait time: 9:00 → 3:00 (↓67%)</li>
                  </RecommendationList>

                  <RecommendationActions>
                    <PrimaryActionButton>Reassign tickets</PrimaryActionButton>
                    <InvestigateButton onClick={() => { setShowRecommendations(false); setCopilotMode('investigate'); setShowCopilot(true); }}>
                      <svg viewBox="0 0 16 16">
                        <defs>
                          <linearGradient id="btnSparkle" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#DAC9FF" />
                            <stop offset="42%" stopColor="#A33FE1" />
                            <stop offset="100%" stopColor="#6743E1" />
                          </linearGradient>
                        </defs>
                        <path fill="url(#btnSparkle)" d="M2.499 11a.5.5 0 0 1 .477.348l.256.797a1.01 1.01 0 0 0 .63.633l.789.248a.5.5 0 0 1 .001.954l-.79.252a1.007 1.007 0 0 0-.63.633l-.252.787a.5.5 0 0 1-.95.008l-.266-.79a1.034 1.034 0 0 0-.636-.639l-.781-.252a.5.5 0 0 1-.002-.95l.794-.26a1.023 1.023 0 0 0 .636-.634l.248-.786A.5.5 0 0 1 2.5 11ZM1 7.513a1 1 0 0 1 .69-.953l2.583-.844a3.95 3.95 0 0 0 2.465-2.457l.808-2.56A1 1 0 0 1 9.452.695l.832 2.598a3.906 3.906 0 0 0 2.448 2.453l2.569.811a1 1 0 0 1 .004 1.906l-2.572.823a3.896 3.896 0 0 0-2.449 2.454l-.82 2.565a1 1 0 0 1-1.9.014l-.866-2.567v-.002A3.971 3.971 0 0 0 4.24 9.284l-2.547-.821A1 1 0 0 1 1 7.513Z"/>
                      </svg>
                      Investigate with assistant
                    </InvestigateButton>
                  </RecommendationActions>
                </RecommendationBody>
              </RecommendationCard>

              {/* Action 2 - Collapsed */}
              <RecommendationCard>
                <RecommendationHeader>
                  <RecommendationTitle>
                    <RecommendationTitleText>Assign Billing skill to available agents</RecommendationTitleText>
                    <RecommendationPreview>Increases capacity by ~25%</RecommendationPreview>
                  </RecommendationTitle>
                  <RecommendationChevron>
                    <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                      <path fill="currentColor" d="M12.688 5.61a.5.5 0 01.69.718l-.066.062-5 4a.5.5 0 01-.542.054l-.082-.054-5-4a.5.5 0 01.55-.83l.074.05L8 9.359l4.688-3.75z"/>
                    </svg>
                  </RecommendationChevron>
                </RecommendationHeader>
              </RecommendationCard>

              {/* Action 3 - Collapsed */}
              <RecommendationCard>
                <RecommendationHeader>
                  <RecommendationTitle>
                    <RecommendationTitleText>Increase agent capacity (3 → 4 chats)</RecommendationTitleText>
                    <RecommendationPreview>Temporary boost: +33% throughput</RecommendationPreview>
                  </RecommendationTitle>
                  <RecommendationChevron>
                    <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                      <path fill="currentColor" d="M12.688 5.61a.5.5 0 01.69.718l-.066.062-5 4a.5.5 0 01-.542.054l-.082-.054-5-4a.5.5 0 01.55-.83l.074.05L8 9.359l4.688-3.75z"/>
                    </svg>
                  </RecommendationChevron>
                </RecommendationHeader>
              </RecommendationCard>
            </PanelContent>
          </RecommendationsPanel>
        </RecommendationsPanelWrap>
      )}

      {showCopilot && (
        <CopilotPanelWrap>
          <CopilotPanel>
            <CopilotHeader>
              <CopilotHeaderLeft>
                <CopilotTitle>Monitoring assistant</CopilotTitle>
              </CopilotHeaderLeft>
              <CopilotCloseButton type="button" aria-label="Close panel" onClick={handleCloseCopilot}>
                <svg width="16" height="16" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                  <path stroke="currentColor" strokeLinecap="round" d="M3 13L13 3m0 10L3 3" />
                </svg>
              </CopilotCloseButton>
            </CopilotHeader>
            
            {copilotMode === 'start' ? (
              <>
                <CopilotStartScreen>
                  <CopilotStartContent>
                    <CopilotStartIcon>
                      <svg width="0" height="0" style={{ position: 'absolute' }}>
                        <defs>
                          <linearGradient id="startSparkleGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#DAC9FF" />
                            <stop offset="42%" stopColor="#A33FE1" />
                            <stop offset="100%" stopColor="#6743E1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <SparkleStrokeIcon />
                    </CopilotStartIcon>
                    <CopilotStartTitle>How can I help?</CopilotStartTitle>
                    <CopilotStartSuggestions>
                      <CopilotSuggestionButton onClick={() => { setCopilotMode('investigate'); }}>
                        What's causing the automated resolution drop?
                      </CopilotSuggestionButton>
                      <CopilotSuggestionButton onClick={() => { setCopilotMode('investigate'); }}>
                        What should I do about this?
                      </CopilotSuggestionButton>
                      <CopilotSuggestionButton onClick={() => { setCopilotMode('investigate'); }}>
                        What happens if I don't act?
                      </CopilotSuggestionButton>
                    </CopilotStartSuggestions>
                  </CopilotStartContent>
                  <CopilotStartFooter>
                    <CopilotPoweredBy>Powered by AI</CopilotPoweredBy>
                    <CopilotDisclaimer>AI content can be inaccurate or misleading.<br/>Review it carefully.</CopilotDisclaimer>
                  </CopilotStartFooter>
                </CopilotStartScreen>
                <CopilotInputArea>
                  <CopilotInputWrapper>
                    <CopilotInput placeholder="Ask monitoring assistant" />
                    <CopilotSendButton type="button" aria-label="Send message">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3L8 13M8 3L4 7M8 3L12 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </CopilotSendButton>
                  </CopilotInputWrapper>
                </CopilotInputArea>
              </>
            ) : copilotLoading ? (
              <CopilotContent ref={copilotContentRef}>
                <UserMessage>
                  <UserMessageBubble>Investigate with assistant</UserMessageBubble>
                </UserMessage>
                <CopilotLoadingMessage>
                  <CopilotLoadingBubble>
                    <CopilotWorkingHeader>
                      <svg viewBox="0 0 16 16">
                        <defs>
                          <linearGradient id="workingSparkle" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#DAC9FF" />
                            <stop offset="42%" stopColor="#A33FE1" />
                            <stop offset="100%" stopColor="#6743E1" />
                          </linearGradient>
                        </defs>
                        <path fill="url(#workingSparkle)" d="M2.499 11a.5.5 0 0 1 .477.348l.256.797a1.01 1.01 0 0 0 .63.633l.789.248a.5.5 0 0 1 .001.954l-.79.252a1.007 1.007 0 0 0-.63.633l-.252.787a.5.5 0 0 1-.95.008l-.266-.79a1.034 1.034 0 0 0-.636-.639l-.781-.252a.5.5 0 0 1-.002-.95l.794-.26a1.023 1.023 0 0 0 .636-.634l.248-.786A.5.5 0 0 1 2.5 11ZM1 7.513a1 1 0 0 1 .69-.953l2.583-.844a3.95 3.95 0 0 0 2.465-2.457l.808-2.56A1 1 0 0 1 9.452.695l.832 2.598a3.906 3.906 0 0 0 2.448 2.453l2.569.811a1 1 0 0 1 .004 1.906l-2.572.823a3.896 3.896 0 0 0-2.449 2.454l-.82 2.565a1 1 0 0 1-1.9.014l-.866-2.567v-.002A3.971 3.971 0 0 0 4.24 9.284l-2.547-.821A1 1 0 0 1 1 7.513Z"/>
                      </svg>
                      <CopilotWorkingText>Working</CopilotWorkingText>
                    </CopilotWorkingHeader>
                    <CopilotSkeletonRow>
                      <StyledSkeleton height="12px" width="100%" />
                    </CopilotSkeletonRow>
                    <CopilotSkeletonRow>
                      <StyledSkeleton height="12px" width="90%" />
                    </CopilotSkeletonRow>
                    <CopilotSkeletonRow>
                      <StyledSkeleton height="12px" width="75%" />
                    </CopilotSkeletonRow>
                  </CopilotLoadingBubble>
                </CopilotLoadingMessage>
              </CopilotContent>
            ) : (
              <>
                <CopilotContent ref={copilotContentRef}>
                  <UserMessage>
                    <UserMessageBubble>Investigate with assistant</UserMessageBubble>
                  </UserMessage>
                  <CopilotMessage>
                    <CopilotMessageBubble>
                      <CopilotMessageText>
                        <p><strong>What's happening:</strong></p>
                        <ul>
                          <li>Escalation rate increased to <strong>42%</strong> (baseline: 22%)</li>
                          <li>Billing queue: <strong>52 cases</strong> (baseline: 8)</li>
                        </ul>
                        <p><strong>Root cause:</strong></p>
                        <p>Payment Declined topic is driving the spike:</p>
                        <ul>
                          <li>AI agents are escalating <strong>73%</strong> of "Payment issues" use case tickets (vs. 22% baseline)</li>
                          <li>"Payment declined" topic accounts for <strong>~50%</strong> of current escalations</li>
                        </ul>
                        <p><strong>Why escalation rates are spiking:</strong></p>
                        <p>Payment Declined cases involve merchant processing issues outside AI training. AI handles standard scenarios (insufficient funds, expired cards) but can't resolve system-level payment gateway problems.</p>
                        <p>What would you like to explore?</p>
                        {copilotStep === 'initial' && (
                          <QuickReplyButtons>
                            <QuickReplyButton>Show similar past incidents</QuickReplyButton>
                            <QuickReplyButton>What happens if I don't act?</QuickReplyButton>
                            <QuickReplyButton onClick={handleWhatShouldIDo}>What should I do?</QuickReplyButton>
                          </QuickReplyButtons>
                        )}
                      </CopilotMessageText>
                    </CopilotMessageBubble>
                  </CopilotMessage>
                  
                  {(copilotStep === 'loading' || copilotStep === 'recommendation') && (
                    <UserMessage>
                      <UserMessageBubble>What should I do?</UserMessageBubble>
                    </UserMessage>
                  )}
                  
                  {copilotStep === 'loading' && (
                    <CopilotLoadingMessage>
                      <CopilotLoadingBubble>
                        <CopilotWorkingHeader>
                          <svg viewBox="0 0 16 16">
                            <defs>
                              <linearGradient id="workingSparkle2" x1="50%" y1="0%" x2="50%" y2="100%">
                                <stop offset="0%" stopColor="#DAC9FF" />
                                <stop offset="42%" stopColor="#A33FE1" />
                                <stop offset="100%" stopColor="#6743E1" />
                              </linearGradient>
                            </defs>
                            <path fill="url(#workingSparkle2)" d="M2.499 11a.5.5 0 0 1 .477.348l.256.797a1.01 1.01 0 0 0 .63.633l.789.248a.5.5 0 0 1 .001.954l-.79.252a1.007 1.007 0 0 0-.63.633l-.252.787a.5.5 0 0 1-.95.008l-.266-.79a1.034 1.034 0 0 0-.636-.639l-.781-.252a.5.5 0 0 1-.002-.95l.794-.26a1.023 1.023 0 0 0 .636-.634l.248-.786A.5.5 0 0 1 2.5 11ZM1 7.513a1 1 0 0 1 .69-.953l2.583-.844a3.95 3.95 0 0 0 2.465-2.457l.808-2.56A1 1 0 0 1 9.452.695l.832 2.598a3.906 3.906 0 0 0 2.448 2.453l2.569.811a1 1 0 0 1 .004 1.906l-2.572.823a3.896 3.896 0 0 0-2.449 2.454l-.82 2.565a1 1 0 0 1-1.9.014l-.866-2.567v-.002A3.971 3.971 0 0 0 4.24 9.284l-2.547-.821A1 1 0 0 1 1 7.513Z"/>
                          </svg>
                          <CopilotWorkingText>Working</CopilotWorkingText>
                        </CopilotWorkingHeader>
                        <CopilotSkeletonRow>
                          <StyledSkeleton height="12px" width="100%" />
                        </CopilotSkeletonRow>
                        <CopilotSkeletonRow>
                          <StyledSkeleton height="12px" width="90%" />
                        </CopilotSkeletonRow>
                        <CopilotSkeletonRow>
                          <StyledSkeleton height="12px" width="75%" />
                        </CopilotSkeletonRow>
                      </CopilotLoadingBubble>
                    </CopilotLoadingMessage>
                  )}
                  
                  {copilotStep === 'recommendation' && (
                    <CopilotMessage>
                      <CopilotMessageBubble>
                        <CopilotMessageText>
                          <p>Based on the analysis, here's what I recommend:</p>
                          <CopilotRecCard>
                            <CopilotRecHeader>Recommended action</CopilotRecHeader>
                            <CopilotRecContent>
                              <CopilotRecTitle>Reassign 26 "Payment declined" topic tickets to Tier 2 specialists</CopilotRecTitle>
                              <CopilotRecSection>
                                <CopilotRecSectionTitle>This addresses</CopilotRecSectionTitle>
                                <CopilotRecList>
                                  <li>Billing queue overflow (45 total tickets)</li>
                                  <li>High queue wait times (9min avg)</li>
                                </CopilotRecList>
                              </CopilotRecSection>
                              <CopilotRecSection>
                                <CopilotRecSectionTitle>Expected impact</CopilotRecSectionTitle>
                                <CopilotRecList>
                                  <li>4 Tier 2 specialists will handle reassignment (~6 tickets per agent)</li>
                                  <li>Queue clears in: ~15min</li>
                                  <li>Queue wait time: 9min → 3min (↓67%)</li>
                                </CopilotRecList>
                              </CopilotRecSection>
                              {reassignState === 'idle' && (
                                <CopilotRecActions>
                                  <CopilotRecButton 
                                    onClick={() => {
                                      setReassignState('loading');
                                      setTimeout(() => setReassignState('success'), 1000);
                                    }}
                                  >
                                    Reassign tickets
                                  </CopilotRecButton>
                                </CopilotRecActions>
                              )}
                              {reassignState === 'loading' && (
                                <CopilotRecActions>
                                  <CopilotRecButton disabled>
                                    <LoadingSpinner />
                                  </CopilotRecButton>
                                </CopilotRecActions>
                              )}
                            </CopilotRecContent>
                          </CopilotRecCard>
                          {reassignState !== 'success' && (
                            <CopilotViewAllButton>View all recommendations</CopilotViewAllButton>
                          )}
                        </CopilotMessageText>
                      </CopilotMessageBubble>
                    </CopilotMessage>
                  )}
                  
                  {reassignState === 'success' && (
                    <CopilotMessage>
                      <CopilotMessageBubble>
                        <CopilotMessageText>
                          <SuccessMessage>
                            <SuccessHeader>
                              <SuccessCheckmark>✓</SuccessCheckmark>
                              Action applied
                            </SuccessHeader>
                            <SuccessDescription>
                              26 <strong>Payment Declined</strong> tickets reassigned to 4 Tier 2 specialists
                            </SuccessDescription>
                            <SuccessExpectations>
                              <SuccessExpectationsTitle>You should see:</SuccessExpectationsTitle>
                              <SuccessExpectationsList>
                                <li>Queue volume dropping in ~5 min</li>
                                <li>Queue wait times improving in ~10min</li>
                                <li>SLA compliance improving</li>
                              </SuccessExpectationsList>
                            </SuccessExpectations>
                          </SuccessMessage>
                        </CopilotMessageText>
                      </CopilotMessageBubble>
                    </CopilotMessage>
                  )}
                </CopilotContent>

                <CopilotInputArea>
<CopilotInputWrapper>
                    <CopilotInput
                      placeholder="Ask monitoring assistant"
                    />
                    <CopilotSendButton type="button" aria-label="Send message">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3L8 13M8 3L4 7M8 3L12 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </CopilotSendButton>
                  </CopilotInputWrapper>
                </CopilotInputArea>
              </>
            )}
          </CopilotPanel>
        </CopilotPanelWrap>
      )}

      {showEscalationModal && (
        <Modal isLarge onClose={() => { setShowEscalationModal(false); setSelectedTickets([]); }} style={{ width: '95vw', maxWidth: '1800px' }}>
          <Header style={{ padding: '20px 24px' }}>
            <ModalHeaderRow>
              <ModalHeaderLeft>
                <ModalTitle>Escalation rate</ModalTitle>
              </ModalHeaderLeft>
              <DownloadButton>
                <DownloadIcon />
                Download
              </DownloadButton>
            </ModalHeaderRow>
          </Header>
          <Body style={{ padding: '12px 24px 24px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ModalSubtitle>68 tickets</ModalSubtitle>
            </div>
            
            <TableWrapper $hasSelection={selectedTickets.length > 0}>
              <Table size="small">
                <Head>
                  <HeaderRow>
                    <HeaderCell style={{ width: '40px' }}>
                      <Field>
                        <Checkbox
                          checked={selectedTickets.length === escalationTableData.length}
                          indeterminate={selectedTickets.length > 0 && selectedTickets.length < escalationTableData.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTickets(escalationTableData.map(t => t.id));
                            } else {
                              setSelectedTickets([]);
                            }
                          }}
                        >
                          <Label hidden>Select all</Label>
                        </Checkbox>
                      </Field>
                    </HeaderCell>
                    <HeaderCell style={{ width: '75px' }}>Ticket ID</HeaderCell>
                    <HeaderCell style={{ width: '100px' }}>AI agent</HeaderCell>
                    <HeaderCell style={{ width: '70px' }}>Channel</HeaderCell>
                    <HeaderCell style={{ width: '120px' }}>Conversation state</HeaderCell>
                    <HeaderCell style={{ width: '130px' }}>Automation outcome</HeaderCell>
                    <HeaderCell style={{ width: '90px' }}>Segment</HeaderCell>
                    <HeaderCell style={{ width: '90px' }}>Use case</HeaderCell>
                    <HeaderCell style={{ width: '70px' }}>Duration</HeaderCell>
                    <HeaderCell style={{ width: '70px' }}>Language</HeaderCell>
                    <HeaderCell style={{ width: '50px' }}>Actions</HeaderCell>
                  </HeaderRow>
                </Head>
                <TableBody>
                  {escalationTableData.map((ticket) => (
                    <TableRow key={ticket.id} isSelected={selectedTickets.includes(ticket.id)}>
                      <TableCell isMinimum>
                        <Field>
                          <Checkbox
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTickets([...selectedTickets, ticket.id]);
                              } else {
                                setSelectedTickets(selectedTickets.filter(id => id !== ticket.id));
                              }
                            }}
                          >
                            <Label hidden>Select ticket {ticket.id}</Label>
                          </Checkbox>
                        </Field>
                      </TableCell>
                      <TableCell>
                        <TicketLink href="#">{ticket.id}</TicketLink>
                      </TableCell>
                      <TableCell>{ticket.aiAgent}</TableCell>
                      <TableCell>{ticket.channel}</TableCell>
                      <TableCell>{ticket.state}</TableCell>
                      <TableCell>
                        <OutcomeTag size="small">{ticket.outcome}</OutcomeTag>
                      </TableCell>
                      <TableCell>{ticket.segment}</TableCell>
                      <TableCell>{ticket.useCase}</TableCell>
                      <TableCell>{ticket.duration}</TableCell>
                      <TableCell>{ticket.language}</TableCell>
                      <TableCell isMinimum>
                        <ActionMenu>
                          <Menu
                            button={(props) => (
                              <IconButton {...props} size="small" focusInset>
                                <OverflowVerticalIcon />
                              </IconButton>
                            )}
                          >
                            <Item value="assign">Assign</Item>
                            <Item value="observe">Observe</Item>
                          </Menu>
                        </ActionMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
            
            {selectedTickets.length > 0 && (
              <BulkActionBar>
                <BulkActionText>{selectedTickets.length} selected</BulkActionText>
                <Menu
                  button={(props) => (
                    <Button {...props} size="small" isBasic>
                      Assign
                      <Button.EndIcon>
                        <ChevronDownIcon />
                      </Button.EndIcon>
                    </Button>
                  )}
                >
                  <Item value="agent1">Assign to Agent 1</Item>
                  <Item value="agent2">Assign to Agent 2</Item>
                  <Item value="agent3">Assign to Agent 3</Item>
                  <Separator />
                  <Item value="unassigned">Unassign</Item>
                </Menu>
              </BulkActionBar>
            )}
          </Body>
        </Modal>
      )}
    </DashboardWrapper>
  );
}

export default Dashboard;
