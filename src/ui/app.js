import React, { useState, useEffect } from 'react';
import { Box, useInput, useApp } from 'ink';
import MainLayout from './layouts/MainLayout.js';
import Dashboard from './components/Dashboard.js';
import ConfigEditor from './components/ConfigEditor.js';
import LogViewer from './components/LogViewer.js';
import StatusBar from './components/StatusBar.js';
import NavigationHelp from './components/NavigationHelp.js';
import logger from '../utils/logger.js';

// Define view types
export const VIEWS = {
  DASHBOARD: 'dashboard',
  CONFIG: 'config',
  LOGS: 'logs',
};

const App = () => {
  const { exit } = useApp();
  const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [logs, setLogs] = useState([]);

  // Listen to logger events
  useEffect(() => {
    const unsubscribe = logger.subscribe(log => {
      setLogs(prev => [...prev, log]);
    });
    
    // Log application start
    logger.info('SimpleRPC started');
    
    return () => {
      unsubscribe();
      logger.info('SimpleRPC exited');
    };
  }, []);

  // Handle keyboard input
  useInput((input, key) => {
    // Navigation between views
    if (key.ctrl && input === 'q') {
      exit();
    } else if (input === '1' || input === 'd') {
      setCurrentView(VIEWS.DASHBOARD);
    } else if (input === '2' || input === 'c') {
      setCurrentView(VIEWS.CONFIG);
    } else if (input === '3' || input === 'l') {
      setCurrentView(VIEWS.LOGS);
    }
  });

  // Render the active view
  const renderActiveView = () => {
    switch (currentView) {
      case VIEWS.CONFIG:
        return <ConfigEditor />;
      case VIEWS.LOGS:
        return <LogViewer logs={logs} />;
      case VIEWS.DASHBOARD:
      default:
        return (
          <Dashboard 
            connectionStatus={connectionStatus}
            setConnectionStatus={setConnectionStatus}
          />
        );
    }
  };

  return (
    <MainLayout>
      {renderActiveView()}
      <StatusBar 
        connectionStatus={connectionStatus}
        currentView={currentView}
      />
      <NavigationHelp />
    </MainLayout>
  );
};

export default App;