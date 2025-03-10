import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import RPCClient from '../../rpc/client.js';
import logger from '../../utils/logger.js';
import ActivityPreview from './ActivityPreview.js';

const Dashboard = ({ connectionStatus, setConnectionStatus }) => {
  const [rpc, setRpc] = useState(null);
  const [activity, setActivity] = useState({});
  const [username, setUsername] = useState('');
  const [uptime, setUptime] = useState('00:00:00');
  const [startTime, setStartTime] = useState(null);
  const [ping, setPing] = useState({ current: 0, avg: 0 });

  // Initialize RPC client and connect
  useEffect(() => {
    const client = new RPCClient();
    setRpc(client);

    client.on('ready', (user) => {
      setConnectionStatus('connected');
      setUsername(user.username);
      setStartTime(new Date());
      logger.success(`Connected to Discord as ${user.username}`);
      
      // Get current activity
      client.getActivity().then(activity => {
        setActivity(activity);
      });
    });

    client.on('error', (error) => {
      setConnectionStatus('error');
      logger.error(`Discord RPC Error: ${error.message}`);
    });

    client.on('disconnected', () => {
      setConnectionStatus('disconnected');
      logger.warn('Disconnected from Discord');
    });

    client.on('activityUpdated', (newActivity) => {
      setActivity(newActivity);
      logger.info('Activity updated');
    });

    // Connect to Discord
    setConnectionStatus('connecting');
    logger.info('Connecting to Discord...');
    client.connect().catch(error => {
      logger.error(`Failed to connect: ${error.message}`);
    });

    // Cleanup on unmount
    return () => {
      client.disconnect();
    };
  }, []);

  // Update uptime
  useEffect(() => {
    if (!startTime) return;
    
    const interval = setInterval(() => {
      const diff = new Date() - startTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setUptime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);

  // Simulate ping calculation
  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    
    const pingInterval = setInterval(() => {
      const newPing = Math.floor(Math.random() * 50) + 10; // Simulate ping between 10-60ms
      setPing(prev => ({
        current: newPing,
        avg: prev.avg ? (prev.avg + newPing) / 2 : newPing
      }));
    }, 5000);
    
    return () => clearInterval(pingInterval);
  }, [connectionStatus]);

  // Render connection status
  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Text color="green">● Connected</Text>;
      case 'connecting':
        return (
          <Text color="yellow">
            <Spinner type="dots" /> Connecting...
          </Text>
        );
      case 'error':
        return <Text color="red">● Error</Text>;
      default:
        return <Text color="red">● Disconnected</Text>;
    }
  };

  // Render ping indicator
  const renderPingIndicator = () => {
    const pingValue = ping.current;
    let color = 'green';
    
    if (pingValue > 100) color = 'red';
    else if (pingValue > 50) color = 'yellow';
    
    const bars = Math.min(10, Math.max(1, Math.ceil(pingValue / 10)));
    
    return (
      <Box>
        <Text color={color}>{'█'.repeat(bars)}{' '.repeat(10 - bars)} {pingValue}ms</Text>
      </Box>
    );
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Dashboard</Text>
      
      <Box marginTop={1} flexDirection="column">
        <Box>
          <Text>Status: </Text>
          {renderConnectionStatus()}
        </Box>
        
        {username && (
          <Box marginTop={1}>
            <Text>Connected as: </Text>
            <Text color="blue">{username}</Text>
          </Box>
        )}
        
        {startTime && (
          <Box marginTop={1}>
            <Text>Uptime: </Text>
            <Text>{uptime}</Text>
          </Box>
        )}
        
        {connectionStatus === 'connected' && (
          <Box marginTop={1} flexDirection="column">
            <Box>
              <Text>Ping: </Text>
              <Text>{ping.current}ms (Avg: {Math.round(ping.avg)}ms)</Text>
            </Box>
            <Box marginTop={1}>
              {renderPingIndicator()}
            </Box>
          </Box>
        )}
      </Box>
      
      {connectionStatus === 'connected' && (
        <ActivityPreview activity={activity} />
      )}
    </Box>
  );
};

export default Dashboard;