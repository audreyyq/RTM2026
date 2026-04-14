import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import GlobalNav from './components/GlobalNav';
import Dashboard from './components/Dashboard';
import SlackScreen from './components/SlackScreen';

const AppShell = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

function App() {
  const [currentScreen, setCurrentScreen] = useState('slack');
  const [dashboardState, setDashboardState] = useState('baseline');
  const [showAlertStates, setShowAlertStates] = useState(true);

  if (currentScreen === 'slack') {
    return (
      <SlackScreen onViewDashboard={() => setCurrentScreen('dashboard')} />
    );
  }

  return (
    <ThemeProvider>
      <AppShell>
        <GlobalNav
          showAlertStates={showAlertStates}
          onShowAlertStatesChange={setShowAlertStates}
        >
          <Dashboard
            state={dashboardState}
            onStateChange={setDashboardState}
            showAlertStates={showAlertStates}
            onResetPrototype={() => setCurrentScreen('slack')}
          />
        </GlobalNav>
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
