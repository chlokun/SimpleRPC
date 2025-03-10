/**
 * SimpleRPC daemon for detached mode operation
 * 
 * This file runs as a detached process without a TUI,
 * maintaining a Discord RPC presence in the background.
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import RPCClient from './rpc/client.js';

// Load environment variables
dotenv.config();

// Get the directory name properly in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const LOG_FILE = path.join(rootDir, '.simplerpc.log');

/**
 * Simple logger for daemon mode
 */
class DaemonLogger {
  constructor(logFile) {
    this.logFile = logFile;
    // Create or truncate log file
    fs.writeFileSync(this.logFile, `--- SimpleRPC Daemon Started at ${new Date().toISOString()} ---\n`);
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    // Append to log file
    fs.appendFileSync(this.logFile, logEntry);
  }

  info(message) {
    this.log('info', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  error(message) {
    this.log('error', message);
  }

  success(message) {
    this.log('success', message);
  }
}

/**
 * Main daemon function
 */
async function runDaemon() {
  // Initialize logger
  const logger = new DaemonLogger(LOG_FILE);
  logger.info('SimpleRPC daemon starting...');

  // Initialize RPC client
  const client = new RPCClient();

  // Set up event handlers
  client.on('ready', (user) => {
    logger.success(`Connected to Discord as ${user.username}`);
  });

  client.on('error', (error) => {
    logger.error(`Discord RPC Error: ${error.message}`);
    
    // Try to reconnect after a delay
    setTimeout(() => {
      logger.info('Attempting to reconnect...');
      client.connect().catch(err => {
        logger.error(`Reconnect failed: ${err.message}`);
      });
    }, 30000); // 30 second delay
  });

  client.on('disconnected', () => {
    logger.warn('Disconnected from Discord');
    
    // Try to reconnect after a delay
    setTimeout(() => {
      logger.info('Attempting to reconnect...');
      client.connect().catch(err => {
        logger.error(`Reconnect failed: ${err.message}`);
      });
    }, 10000); // 10 second delay
  });

  // Connect to Discord
  logger.info('Connecting to Discord...');
  try {
    await client.connect();
  } catch (error) {
    logger.error(`Failed to connect: ${error.message}`);
    
    // Schedule reconnect attempts
    const reconnectInterval = setInterval(() => {
      logger.info('Attempting to reconnect...');
      client.connect()
        .then(() => {
          logger.success('Reconnected successfully');
          clearInterval(reconnectInterval);
        })
        .catch(err => {
          logger.error(`Reconnect failed: ${err.message}`);
        });
    }, 60000); // 1 minute interval
  }
  
  // Keep process alive and handle signals
  process.on('SIGINT', () => {
    logger.info('Received SIGINT signal, shutting down...');
    client.disconnect();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM signal, shutting down...');
    client.disconnect();
    process.exit(0);
  });
  
  // Log periodic health checks
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    logger.info(`Health check - Memory: RSS ${Math.round(memoryUsage.rss / 1024 / 1024)} MB, Heap: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}/${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`);
  }, 3600000); // Every hour
}

// Run the daemon
runDaemon();