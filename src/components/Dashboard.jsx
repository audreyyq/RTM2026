import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getColor } from '@zendeskgarden/react-theming';
import { Skeleton } from '@zendeskgarden/react-loaders';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Button } from '@zendeskgarden/react-buttons';
import { Alert, Title, Close } from '@zendeskgarden/react-notifications';
import { BASELINE_STATE } from '../data/dashboardData';
import DashboardToolbar from './DashboardToolbar';

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
  transition: margin-right 0.3s ease;
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

const MetricValue = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.$status === 'critical' ? '#cc3340' : '#1f73b7'};
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 4px;
  margin: -2px -4px;
  transition: background-color 0.15s ease;
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
  font-size: 32px;
  font-weight: 600;
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
  font-weight: 600;
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
  transition: background-color 0.15s ease;

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
  transition: background-color 0.15s ease;
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
  
  &:hover {
    background-color: #f8f9f9;
    color: #2f3941;
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
  line-height: 1.6;
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
  
  &:hover {
    background-color: #f5faff;
  }
`;

const InvestigateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 4px;
  font-size: 14px;
  color: #2f3941;
  cursor: pointer;
  width: fit-content;
  
  &:hover {
    background-color: #f8f9f9;
    border-color: #c2c8cc;
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
  
  &:hover {
    background-color: #f8f9f9;
    color: #2f3941;
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
    margin: 8px 0;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 4px;
  }
  
  strong {
    color: #2f3941;
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
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: #f8f9f9;
    border-color: #c2c8cc;
  }
`;

const CopilotInputArea = styled.div`
  padding: 16px 20px;
  background: ${({ theme }) => getColor({ theme, variable: 'background.default' })};
`;

const CopilotInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 8px 20px;
  border: 1px solid #d8dcde;
  border-radius: 28px;
  background: white;
  
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
  transition: background 0.15s ease;

  &:hover {
    background: #1f292f;
  }

  &:active {
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
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-4px);
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
  animation: pulse 1.5s ease-in-out infinite;
  
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
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`;

const CopilotLoadingText = styled.div`
  font-size: 13px;
  color: #68737d;
  text-align: center;
`;

// Baseline data
const baselineMetrics = {
  totalConversations: 65,
  automatedResolution: 58,
  queueWaitTime: '8min',
  agentsAvailable: 5,
  agentsScheduledTotal: 15,
  agentSpareCapacityPercent: 33,
  avgFirstAssignment: '2.4min',
  avgResolutionTime: '8.2min',
  slaCompliance: 76,
  slaBreached: 5,
  slaNearing: 12,
  slaWithin: 28,
};

const baselineEscalation = [
  { intent: 'Payment Declined', rate: 73, critical: true },
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
    metrics: { ...baselineMetrics, totalConversations: 68, automatedResolution: 56, slaBreached: 6, slaNearing: 11 },
    escalation: [
      { intent: 'Payment Declined', rate: 75, critical: true },
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
    metrics: { ...baselineMetrics, totalConversations: 72, automatedResolution: 55, queueWaitTime: '9min', slaBreached: 7, slaNearing: 13 },
    escalation: [
      { intent: 'Payment Declined', rate: 78, critical: true },
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
    metrics: { ...baselineMetrics, totalConversations: 70, automatedResolution: 54, queueWaitTime: '10min', slaBreached: 8, slaNearing: 14, slaWithin: 26 },
    escalation: [
      { intent: 'Payment Declined', rate: 80, critical: true },
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

function Dashboard({ state, onStateChange, showAlertStates = true }) {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  // Handle copilot loading state
  useEffect(() => {
    if (showCopilot) {
      setCopilotLoading(true);
      const timer = setTimeout(() => {
        setCopilotLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopilot]);
  const data = BASELINE_STATE;

  // Get current data based on update count
  const currentVariation = updateCount === 0 ? null : dataVariations[(updateCount - 1) % 3];
  const metrics = currentVariation ? currentVariation.metrics : baselineMetrics;
  const escalationData = currentVariation ? currentVariation.escalation : baselineEscalation;
  const queueDepthData = currentVariation ? currentVariation.queue : baselineQueue;

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
          <DashboardToolbar />

          <ContentArea>
            {!alertDismissed && (
            <AlertWrapper>
              <Alert type="warning">
                <AlertRow>
                  <div>
                    <Title>Anomaly detected: Automated resolution dropped to 58% · Payment Declined +340%</Title>
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
                <MetricValue>
                  {metrics.totalConversations}
                  <MetricChange $negative>(+{Math.round((metrics.totalConversations - 40) / 40 * 100)}%)</MetricChange>
                </MetricValue>
                <MetricSubtext>Baseline: 40</MetricSubtext>
              </MetricCard>
              <MetricCard $status={showAlertStates ? 'critical' : undefined} style={{ flex: 1 }}>
                {showAlertStates && (
                <AlertIconBadge>
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a1 1 0 01.867.5l6.928 12A1 1 0 0114.928 15H1.072a1 1 0 01-.867-1.5l6.928-12A1 1 0 018 1zm0 4a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 5zm0 7a1 1 0 100-2 1 1 0 000 2z"/>
                  </svg>
                </AlertIconBadge>
                )}
                <MetricLabel>Automated resolution</MetricLabel>
                <MetricValue $status={showAlertStates ? 'critical' : undefined}>
                  {metrics.automatedResolution}%
                  <MetricChange $negative={showAlertStates}>↓</MetricChange>
                </MetricValue>
                <MetricSubtext>Baseline: 78%</MetricSubtext>
              </MetricCard>
              <ChartCard style={{ flex: 1 }}>
                <ChartTitle>Escalation rate by intent</ChartTitle>
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
                  <MetricValue $status={showAlertStates ? 'critical' : undefined}>
                    {metrics.queueWaitTime}
                    <MetricChange $negative={showAlertStates}>↑</MetricChange>
                  </MetricValue>
                  <MetricSubtext>Baseline: 2 min</MetricSubtext>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>Agent availability</MetricLabel>
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
                    <RecommendationTitleText>Reassign payment declined tickets to Tier 2 specialists</RecommendationTitleText>
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
                    <li>40 Payment Declined tickets in Billing queue (89 total cases)</li>
                    <li>High wait times (9 min)</li>
                    <li>AI struggling with <strong>Payment Declined</strong> (73% escalation rate)</li>
                  </RecommendationList>
                  
                  <RecommendationSectionLabel>Expected impact:</RecommendationSectionLabel>
                  <RecommendationList>
                    <li>Queue clears in: 15min</li>
                    <li>Wait time: 9:00 → 3:00 (↓67%)</li>
                    <li>Resolution rate improves</li>
                  </RecommendationList>

                  <RecommendationActions>
                    <PrimaryActionButton>Reassign tickets</PrimaryActionButton>
                    <InvestigateButton onClick={() => { setShowRecommendations(false); setShowCopilot(true); }}>
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
                    <RecommendationTitleText>Request backup coverage</RecommendationTitleText>
                    <RecommendationPreview>Estimated clear time: 30min · Wait time reduces to: ~2.5min</RecommendationPreview>
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
                    <RecommendationTitleText>Send customer update</RecommendationTitleText>
                    <RecommendationPreview>Customers informed · Reduces duplicate contacts by ~30%</RecommendationPreview>
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
              <CopilotCloseButton type="button" aria-label="Close panel" onClick={() => setShowCopilot(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                  <path stroke="currentColor" strokeLinecap="round" d="M3 13L13 3m0 10L3 3" />
                </svg>
              </CopilotCloseButton>
            </CopilotHeader>
            
            {copilotLoading ? (
              <CopilotContent>
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
                <CopilotContent>
                  <UserMessage>
                    <UserMessageBubble>Investigate with assistant</UserMessageBubble>
                  </UserMessage>
                  <CopilotMessage>
                    <CopilotMessageBubble>
                      <CopilotMessageText>
                        <p>Here's what's happening with the <strong>Payment Declined</strong> anomaly:</p>
                        <p><strong>What's happening:</strong></p>
                        <ul>
                          <li>AI resolution dropped from <strong>78% → 58%</strong></li>
                          <li>Payment Declined intent volume spiked <strong>+340%</strong> in the last 30 minutes</li>
                          <li>AI agents are escalating <strong>73%</strong> of Payment Declined cases (vs. 22% baseline)</li>
                        </ul>
                        <p><strong>Why AI resolution is falling:</strong></p>
                        <p>Payment Declined inquiries are related to a merchant processing issue outside the AI agent's training. The AI handles standard scenarios (insufficient funds, expired cards) but can't resolve system-level payment gateway problems.</p>
                        <p>What would you like to explore?</p>
                        <QuickReplyButtons>
                          <QuickReplyButton>Has this happened recently?</QuickReplyButton>
                          <QuickReplyButton>What happens if I don't act?</QuickReplyButton>
                          <QuickReplyButton>What should I do?</QuickReplyButton>
                        </QuickReplyButtons>
                      </CopilotMessageText>
                    </CopilotMessageBubble>
                  </CopilotMessage>
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
    </DashboardWrapper>
  );
}

export default Dashboard;
