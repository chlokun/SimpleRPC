import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../../utils/logger.js';

// Get the directory name properly in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..', '..');

const configFields = [
  {
    key: 'CLIENT_ID',
    label: 'Client ID',
    description: 'Your Discord application client ID',
    required: true
  },
  {
    key: 'DETAILS',
    label: 'Activity Details',
    description: 'First line of your presence',
    required: false
  },
  {
    key: 'STATE',
    label: 'Activity State',
    description: 'Second line of your presence',
    required: false
  },
  {
    key: 'LARGE_IMAGE_KEY',
    label: 'Large Image Key',
    description: 'Key for the large image',
    required: false
  },
  {
    key: 'LARGE_IMAGE_TEXT',
    label: 'Large Image Text',
    description: 'Text shown when hovering over large image',
    required: false
  },
  {
    key: 'SMALL_IMAGE_KEY',
    label: 'Small Image Key',
    description: 'Key for the small image',
    required: false
  },
  {
    key: 'SMALL_IMAGE_TEXT',
    label: 'Small Image Text',
    description: 'Text shown when hovering over small image',
    required: false
  },
  {
    key: 'ACTIVITY_TYPE',
    label: 'Activity Type',
    description: '0=Playing, 1=Streaming, 2=Listening, 3=Watching, 5=Competing',
    required: false
  },
  {
    key: 'BUTTON_LABEL',
    label: 'Button 1 Label',
    description: 'Label for the first button',
    required: false
  },
  {
    key: 'BUTTON_URL',
    label: 'Button 1 URL',
    description: 'URL for the first button',
    required: false
  },
  {
    key: 'BUTTON2_LABEL',
    label: 'Button 2 Label',
    description: 'Label for the second button',
    required: false
  },
  {
    key: 'BUTTON2_URL',
    label: 'Button 2 URL',
    description: 'URL for the second button',
    required: false
  }
];

const ConfigEditor = () => {
  const [config, setConfig] = useState({});
  const [activeField, setActiveField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [status, setStatus] = useState('');

  // Load config from .env file
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const envPath = path.join(rootDir, '.env');
        const content = await fs.readFile(envPath, 'utf8');
        const loadedConfig = {};
        
        content.split('\n').forEach(line => {
          if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            if (key) {
              // Handle values that might contain = characters
              loadedConfig[key] = valueParts.join('=');
            }
          }
        });
        
        setConfig(loadedConfig);
        logger.info('Configuration loaded');
      } catch (err) {
        logger.error(`Failed to load config: ${err.message}`);
        setStatus(`Error: ${err.message}`);
      }
    };
    
    loadConfig();
  }, []);

  // Handle field selection
  const handleFieldSelect = (key) => {
    setActiveField(key);
    setEditValue(config[key] || '');
  };

  // Handle value submission
  const handleSubmit = async () => {
    if (!activeField) return;
    
    const updatedConfig = { ...config, [activeField]: editValue };
    setConfig(updatedConfig);
    setStatus(`Updated ${activeField}`);
    
    try {
      // Generate updated .env content
      const envContent = Object.entries(updatedConfig)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      
      // Write to .env file
      await fs.writeFile(path.join(rootDir, '.env'), envContent);
      logger.success(`Updated ${activeField} in configuration`);
      setStatus('Changes saved');
      
      // Clear active field
      setActiveField(null);
      setEditValue('');
    } catch (err) {
      logger.error(`Failed to save config: ${err.message}`);
      setStatus(`Error saving: ${err.message}`);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setActiveField(null);
    setEditValue('');
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Configuration Editor</Text>
      
      {status && (
        <Box marginTop={1}>
          <Text color={status.startsWith('Error') ? 'red' : 'green'}>
            {status}
          </Text>
        </Box>
      )}
      
      <Box marginTop={1} flexDirection="column">
        {configFields.map((field) => (
          <Box key={field.key} marginBottom={1}>
            <Text bold color={field.required ? 'yellow' : 'blue'}>
              {field.key}:
            </Text>
            <Box marginLeft={2}>
              {activeField === field.key ? (
                <TextInput
                  value={editValue}
                  onChange={setEditValue}
                  onSubmit={handleSubmit}
                />
              ) : (
                <Text>{config[field.key] || ''}</Text>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      
      <Box marginTop={2}>
        <Text dimColor>
          {activeField 
            ? 'Press Enter to save, Escape to cancel' 
            : 'Use arrow keys to navigate, Enter to edit a field'}
        </Text>
      </Box>
    </Box>
  );
};

export default ConfigEditor;