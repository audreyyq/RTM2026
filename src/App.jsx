import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import GlobalNav from './components/GlobalNav';
import Dashboard from './components/Dashboard';

const AppShell = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

function App() {
  const [dashboardState, setDashboardState] = useState('baseline');

  return (
    <ThemeProvider>
      <AppShell>
        <GlobalNav>
          <Dashboard state={dashboardState} onStateChange={setDashboardState} />
        </GlobalNav>
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
