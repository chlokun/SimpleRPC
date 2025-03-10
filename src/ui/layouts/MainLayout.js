import React from 'react';
import { Box, Text } from 'ink';

/**
 * Main layout component that wraps the entire application
 * Provides consistent borders and spacing
 */
const MainLayout = ({ children }) => {
  return (
    <Box flexDirection="column" width="100%" height="100%">
      <Box 
        borderStyle="round" 
        borderColor="blue" 
        padding={1} 
        marginBottom={1}
      >
        <Text bold color="blue">SimpleRPC</Text>
        <Text color="gray"> - Discord Rich Presence Client</Text>
      </Box>
      
      <Box flexGrow={1} flexDirection="column">
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;