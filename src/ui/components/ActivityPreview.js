import React from 'react';
import { Box, Text } from 'ink';

const ActivityPreview = ({ activity }) => {
  if (!activity || Object.keys(activity).length === 0) {
    return (
      <Box marginTop={2} flexDirection="column" borderStyle="single" padding={1}>
        <Text bold>Current Activity</Text>
        <Text dimColor>No activity set</Text>
      </Box>
    );
  }

  // Get activity type name based on the type number
  const getActivityTypeName = (type) => {
    const types = {
      0: 'Playing',
      1: 'Streaming',
      2: 'Listening to',
      3: 'Watching',
      5: 'Competing in'
    };
    return types[type] || 'Playing';
  };

  return (
    <Box marginTop={2} flexDirection="column" borderStyle="round" padding={1}>
      <Text bold>Current Activity</Text>
      
      <Box marginTop={1} flexDirection="column">
        <Text>
          <Text color="green">{getActivityTypeName(activity.type)} </Text>
          <Text bold>{activity.details || 'No details set'}</Text>
        </Text>
        
        <Text>{activity.state || 'No state set'}</Text>
        
        <Box marginTop={1}>
          <Text>Images: </Text>
          {activity.largeImageKey ? (
            <Text color="green">● Large</Text>
          ) : (
            <Text color="red">○ No Large</Text>
          )}
          <Text> / </Text>
          {activity.smallImageKey ? (
            <Text color="green">● Small</Text>
          ) : (
            <Text color="red">○ No Small</Text>
          )}
        </Box>
        
        <Box marginTop={1}>
          <Text>Buttons: </Text>
          <Text color={activity.buttons?.length > 0 ? 'green' : 'red'}>
            {activity.buttons?.length || 0} configured
          </Text>
        </Box>

        {activity.buttons?.length > 0 && (
          <Box marginTop={1} flexDirection="column">
            {activity.buttons.map((button, index) => (
              <Text key={index}>[{button.label}] → {button.url}</Text>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ActivityPreview;