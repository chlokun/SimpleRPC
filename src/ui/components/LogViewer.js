import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { LOG_LEVELS } from '../../utils/logger.js';

const LogViewer = ({ logs = [] }) => {
  const [filter, setFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  // Get color for log level
  const getLogColor = (level) => {
    switch (level) {
      case LOG_LEVELS.DEBUG:
        return 'blue';
      case LOG_LEVELS.INFO:
        return 'white';
      case LOG_LEVELS.WARN:
        return 'yellow';
      case LOG_LEVELS.ERROR:
        return 'red';
      case LOG_LEVELS.SUCCESS:
        return 'green';
      default:
        return 'gray';
    }
  };

  // Get icon for log level
  const getLogIcon = (level) => {
    switch (level) {
      case LOG_LEVELS.DEBUG:
        return '🔍';
      case LOG_LEVELS.INFO:
        return 'ℹ️';
      case LOG_LEVELS.WARN:
        return '⚠️';
      case LOG_LEVELS.ERROR:
        return '❌';
      case LOG_LEVELS.SUCCESS:
        return '✅';
      default:
        return '•';
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Logs</Text>
      
      <Box marginTop={1}>
        <Text>Filter: </Text>
        {Object.values(LOG_LEVELS).map(level => (
          <Box key={level} marginRight={1}>
            <Text 
              color={filter === level ? 'green' : 'gray'}
              underline={filter === level}
            >
              {level.toUpperCase()}
            </Text>
          </Box>
        ))}
        <Box marginRight={1}>
          <Text 
            color={filter === 'all' ? 'green' : 'gray'}
            underline={filter === 'all'}
          >
            ALL
          </Text>
        </Box>
      </Box>
      
      <Box 
        flexDirection="column" 
        borderStyle="single" 
        borderColor="gray" 
        marginTop={1} 
        padding={1}
        height={15}
        overflowY="auto"
      >
        {filteredLogs.length === 0 ? (
          <Text dimColor>No logs to display</Text>
        ) : (
          filteredLogs.map((log, index) => (
            <Text 
              key={index} 
              color={getLogColor(log.level)}
            >
              [{log.timestamp}] {getLogIcon(log.level)} {log.message}
            </Text>
          ))
        )}
      </Box>
      
      <Box marginTop={1}>
        <Text dimColor>Press 1-5 to filter logs, A to show all</Text>
      </Box>
    </Box>
  );
};

export default LogViewer;