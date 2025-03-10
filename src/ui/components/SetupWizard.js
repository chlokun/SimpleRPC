import React, { useState } from 'react';
import { Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import fs from 'fs/promises';
import path from 'path';
import { envExample } from '../../utils/env.js';

const steps = [
  {
    id: 'clientId',
    label: 'Discord Client ID',
    description: 'Enter your Discord application client ID from the Developer Portal',
    default: '',
    required: true
  },
  {
    id: 'details',
    label: 'Activity Details',
    description: 'Text that appears as the first line of your activity',
    default: 'Playing a game',
    required: false
  },
  {
    id: 'state',
    label: 'Activity State',
    description: 'Text that appears as the second line of your activity',
    default: 'In a match',
    required: false
  },
  {
    id: 'largeImageKey',
    label: 'Large Image Key',
    description: 'Key for the large image (must be uploaded to your Discord application)',
    default: '',
    required: false
  },
  {
    id: 'largeImageText',
    label: 'Large Image Text',
    description: 'Text that appears when hovering over the large image',
    default: '',
    required: false
  },
  {
    id: 'activityType',
    label: 'Activity Type (0=Playing, 1=Streaming, 2=Listening, 3=Watching, 5=Competing)',
    description: 'Number representing the type of activity',
    default: '0',
    required: false
  },
];

export const SetupWizard = ({ reset = false }) => {
  const { exit } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState({});
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const step = steps[currentStep];

  const handleSubmit = async () => {
    // If this is the last step, save the config
    if (currentStep === steps.length - 1) {
      const updatedValues = { ...values, [step.id]: value };
      setSaving(true);
      
      try {
        // Generate .env file content
        const envContent = envExample
          .split('\n')
          .map(line => {
            const [key] = line.split('=');
            if (key && updatedValues[key.toLowerCase()]) {
              return `${key}=${updatedValues[key.toLowerCase()]}`;
            }
            return line;
          })
          .join('\n');
          
        // Write to .env file
        await fs.writeFile(path.join(process.cwd(), '.env'), envContent);
        setSuccess(true);
        
        // Exit after showing success message
        setTimeout(() => exit(), 3000);
      } catch (err) {
        setError(`Failed to save configuration: ${err.message}`);
        setSaving(false);
      }
    } else {
      // Move to next step
      setValues({ ...values, [step.id]: value });
      setValue(steps[currentStep + 1].default);
      setCurrentStep(currentStep + 1);
    }
  };

  // Load existing values if present
  React.useEffect(() => {
    const loadExistingConfig = async () => {
      try {
        if (!reset) {
          const envPath = path.join(process.cwd(), '.env');
          const fileExists = await fs.access(envPath).then(() => true).catch(() => false);
          
          if (fileExists) {
            const content = await fs.readFile(envPath, 'utf8');
            const existingValues = {};
            
            content.split('\n').forEach(line => {
              if (line && !line.startsWith('#')) {
                const [key, val] = line.split('=');
                if (key && val) {
                  existingValues[key.toLowerCase()] = val;
                }
              }
            });
            
            setValues(existingValues);
          }
        }
        
        // Set the initial value for the first step
        setValue(steps[0].default);
      } catch (err) {
        console.error('Failed to load config:', err);
      }
    };
    
    loadExistingConfig();
  }, [reset]);

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
      <Text>{currentStep + 1} of {steps.length}: {step.label}</Text>
      <Text dimColor>{step.description}</Text>
      
      {error && <Text color="red">{error}</Text>}
      
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
            placeholder={step.default}
          />
        </Box>
      )}
      
      <Box marginTop={2}>
        <Text dimColor>Press Enter to {currentStep === steps.length - 1 ? 'save' : 'continue'}</Text>
      </Box>
    </Box>
  );
};

export default SetupWizard;