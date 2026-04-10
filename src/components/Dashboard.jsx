import React from 'react';
import styled from 'styled-components';
import { BASELINE_STATE } from '../data/dashboardData';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9f9;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #2f3941;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #68737d;
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
      <Header>
        <Title>Contact Center Monitoring Dashboard</Title>
        <Subtitle>Hybrid AI + Human Agent Operations</Subtitle>
      </Header>

      <ComingSoon>
        <h2>🚀 Dashboard Under Construction</h2>
        <p style={{ marginTop: '16px', color: '#68737d' }}>
          Building the monitoring dashboard with Garden UI components...
        </p>
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#87929d' }}>
          Alert Status: {data.alert.message}
        </p>
      </ComingSoon>
    </DashboardContainer>
  );
}

export default Dashboard;
