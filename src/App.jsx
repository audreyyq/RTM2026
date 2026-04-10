import React, { useState } from 'react';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import styled from 'styled-components';
import TopNav from './components/TopNav';
import SideNav from './components/SideNav';
import Dashboard from './components/Dashboard';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

function App() {
  const [dashboardState, setDashboardState] = useState('baseline');

  return (
    <ThemeProvider>
      <AppContainer>
        <TopNav />
        <MainContainer>
          <SideNav />
          <ContentArea>
            <Dashboard state={dashboardState} onStateChange={setDashboardState} />
          </ContentArea>
        </MainContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
