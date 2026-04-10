import React from 'react';
import styled from 'styled-components';
import { BASELINE_STATE } from '../data/dashboardData';
import DashboardToolbar from './DashboardToolbar';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f8f9f9;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow: auto;
`;

const ComingSoon = styled.div`
  background: white;
  border-radius: 8px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

function Dashboard({ state }) {
  const data = BASELINE_STATE;

  return (
    <DashboardContainer>
      <DashboardToolbar />

      <ContentArea>
        <ComingSoon>
          <h2>🚀 Dashboard Widgets Coming Next</h2>
          <p style={{ marginTop: '16px', color: '#68737d' }}>
            Navigation structure complete. Now building dashboard widgets...
          </p>
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#87929d' }}>
            Alert Status: {data.alert.message}
          </p>
        </ComingSoon>
      </ContentArea>
    </DashboardContainer>
  );
}

export default Dashboard;
