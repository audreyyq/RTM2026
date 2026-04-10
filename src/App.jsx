import React, { useState } from 'react';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import Dashboard from './components/Dashboard';

function App() {
  const [dashboardState, setDashboardState] = useState('baseline');

  return (
    <ThemeProvider>
      <Dashboard state={dashboardState} onStateChange={setDashboardState} />
    </ThemeProvider>
  );
}

export default App;
