import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { envExample, getFieldDescriptions } from '../../utils/env.js';

// Get the directory name properly in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..', '..');

// Fields for the setup wizard
const fields = [
  { id: 'CLIENT_ID', label: 'Discord Client ID', required: true },
  { id: 'DETAILS', label: 'Activity Details', default: 'Playing a game' },
  { id: 'STATE', label: 'Activity State', default: 'In a match' },
  { id: 'ACTIVITY_TYPE', label: 'Activity Type', default: '0' },
  { id: 'LARGE_IMAGE_KEY', label: 'Large Image Key' },
  { id: 'LARGE_IMAGE_TEXT', label: 'Large Image Text' },
  { id: 'SMALL_IMAGE_KEY', label: 'Small Image Key' },
  { id: 'SMALL_IMAGE_TEXT', label: 'Small Image Text' },
  { id: 'BUTTON_LABEL', label: 'Button 1 Label' },
  { id: 'BUTTON_URL', label: 'Button 1 URL' },
  { id: 'BUTTON2_LABEL', label: 'Button 2 Label' },
  { id: 'BUTTON2_URL', label: 'Button 2 URL' }
];

// Field descriptions
const descriptions = getFieldDescriptions();

const SetupWizard = ({ reset = false }) => {
  const { exit } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState({});
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentField = fields[currentStep];

  // Load existing values if present
  useEffect(() => {
    const loadExistingConfig = async () => {
      try {
        setIsLoading(true);
        
        if (!reset) {
          const envPath = path.join(rootDir, '.env');
          const fileExists = await fs.access(envPath).then(() => true).catch(() => false);
          
          if (fileExists) {
            const content = await fs.readFile(envPath, 'utf8');
            const existingValues = {};
            
            content.split('\n').forEach(line => {
              if (line && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                if (key && key.trim()) {
                  existingValues[key.trim()] = valueParts.join('=').trim();
                }
              }
            });
            
            setValues(existingValues);
          }
        }
        
        // Set the initial value for the first step
        setValue(values[currentField.id] || currentField.default || '');
        
      } catch (err) {
        setError(`Failed to load config: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExistingConfig();
  }, [reset]);

  // Update value when step changes
  useEffect(() => {
    if (!isLoading) {
      setValue(values[currentField.id] || currentField.default || '');
    }
  }, [currentStep, isLoading]);

  const handleSubmit = async () => {
    // If this is the last step, save the config
    if (currentStep === fields.length - 1) {
      const updatedValues = { ...values, [currentField.id]: value };
      setSaving(true);
      
      try {
        // Parse the example env content
        let envContent = envExample;
        
        // Replace values in the template
        Object.entries(updatedValues).forEach(([key, val]) => {
          if (val) {
            const regex = new RegExp(`${key}=.*`, 'g');
            envContent = envContent.replace(regex, `${key}=${val}`);
          }
        });
        
        // Write to .env file
        await fs.writeFile(path.join(rootDir, '.env'), envContent);
        setSuccess(true);
        
        // Exit after showing success message
        setTimeout(() => exit(), 3000);
      } catch (err) {
        setError(`Failed to save configuration: ${err.message}`);
        setSaving(false);
      }
    } else {
      // Move to next step
      setValues({ ...values, [currentField.id]: value });
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle keyboard navigation
  const handleKeyPress = (key) => {
    if (key.escape) {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      } else {
        exit();
      }
    }
  };

  if (isLoading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text>
          <Spinner type="dots" /> Loading configuration...
        </Text>
      </Box>
    );
  }

  if (success) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="green">✓ Configuration saved successfully!</Text>
        <Text>You can now run the SimpleRPC client with 'rpc' command.</Text>
        <Text>Exiting in 3 seconds...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>SimpleRPC Setup Wizard</Text>
      <Text>Step {currentStep + 1} of {fields.length}</Text>
      
      <Box marginTop={1}>
        <Text bold color={currentField.required ? 'yellow' : 'blue'}>
          {currentField.label}:
        </Text>
      </Box>
      
      <Box marginTop={1}>
        <Text dimColor>{descriptions[currentField.id] || ''}</Text>
      </Box>
      
      {error && (
        <Box marginTop={1}>
          <Text color="red">{error}</Text>
        </Box>
      )}
      
      {saving ? (
        <Box marginTop={1}>
          <Text color="green">
            <Spinner type="dots" /> Saving configuration...
          </Text>
        </Box>
      ) : (
        <Box marginTop={1}>
          <TextInput
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            placeholder={currentField.default || ''}
          />
        </Box>
      )}
      
      <Box marginTop={2} flexDirection="column">
        <Text dimColor>Press Enter to {currentStep === fields.length - 1 ? 'save' : 'continue'}</Text>
        {currentStep > 0 && (
          <Text dimColor>Press Escape to go back</Text>
        )}
      </Box>
    </Box>
  );
};

export default SetupWizard;