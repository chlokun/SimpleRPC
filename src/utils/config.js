/**
 * Configuration utilities for SimpleRPC
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import logger from './logger.js';

// Get the directory name properly in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..');

/**
 * Load configuration from .env file
 */
export const loadConfig = async () => {
  try {
    // First load via dotenv
    dotenv.config();
    
    // Then also parse manually to get all values
    const envPath = path.join(rootDir, '.env');
    const content = await fs.readFile(envPath, 'utf8');
    const config = {};
    
    content.split('\n').forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key) {
          config[key] = valueParts.join('=');
        }
      }
    });
    
    logger.debug('Configuration loaded');
    return config;
  } catch (err) {
    logger.error(`Failed to load config: ${err.message}`);
    return null;
  }
};

/**
 * Save configuration to .env file
 */
export const saveConfig = async (config) => {
  try {
    // Generate .env file content
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Write to .env file
    await fs.writeFile(path.join(rootDir, '.env'), envContent);
    logger.success('Configuration saved');
    return true;
  } catch (err) {
    logger.error(`Failed to save config: ${err.message}`);
    return false;
  }
};

/**
 * Check if configuration exists
 */
export const configExists = async () => {
  try {
    const envPath = path.join(rootDir, '.env');
    await fs.access(envPath);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Validate configuration
 */
export const validateConfig = (config) => {
  const errors = [];
  
  // Required fields
  if (!config.CLIENT_ID) {
    errors.push('CLIENT_ID is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default {
  loadConfig,
  saveConfig,
  configExists,
  validateConfig
};