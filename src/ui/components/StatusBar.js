import React from 'react';
import { Box, Text } from 'ink';
import { VIEWS } from '../app.js';

const StatusBar = ({ connectionStatus, currentView }) => {
  // Get status indicator color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'green';
      case 'connecting':
        return 'yellow';
      case 'error':
        return 'red';
      default:
        return 'red';
    }
  };

  // Get view status indicator
  const getViewStatus = (view) => {
    if (currentView === view) {
      return <Text color="green">●</Text>;
    }
    return <Text color="gray">○</Text>;
  };

  return (
    <Box 
      borderStyle="single" 
      borderColor="gray" 
      marginTop={1}
      padding={1}
      justifyContent="space-between"
    >
      <Box>
        <Text>Status: </Text>
        <Text color={getStatusColor()}>●</Text>
      </Box>
      
      <Box>
        <Box marginRight={2}>
          {getViewStatus(VIEWS.DASHBOARD)} <Text>Dashboard</Text>
        </Box>
        <Box marginRight={2}>
          {getViewStatus(VIEWS.CONFIG)} <Text>Config</Text>
        </Box>
        <Box>
          {getViewStatus(VIEWS.LOGS)} <Text>Logs</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default StatusBar;