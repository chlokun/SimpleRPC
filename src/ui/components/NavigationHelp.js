import React from 'react';
import { Box, Text } from 'ink';

const NavigationHelp = () => {
  return (
    <Box 
      borderStyle="single" 
      borderColor="gray" 
      marginTop={1}
      padding={1}
      justifyContent="space-between"
    >
      <Box>
        <Box marginRight={2}>
          <Text bold>[1/D]</Text>
          <Text> Dashboard</Text>
        </Box>
        
        <Box marginRight={2}>
          <Text bold>[2/C]</Text>
          <Text> Config</Text>
        </Box>
        
        <Box marginRight={2}>
          <Text bold>[3/L]</Text>
          <Text> Logs</Text>
        </Box>
      </Box>
      
      <Box>
        <Text bold>[Ctrl+Q]</Text>
        <Text> Quit</Text>
      </Box>
    </Box>
  );
};

export default NavigationHelp;