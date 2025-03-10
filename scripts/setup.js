/**
 * Setup script for SimpleRPC
 * 
 * This script runs after npm install and ensures the CLI executable
 * is properly created and made executable.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import util from 'util';

// Convert exec to promise
const execAsync = util.promisify(exec);

// Get directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const binDir = path.join(rootDir, 'bin');
const rpcPath = path.join(binDir, 'rpc');

async function setup() {
  try {
    console.log('Setting up SimpleRPC...');
    
    // Create bin directory if it doesn't exist
    try {
      await fs.mkdir(binDir);
      console.log('Created bin directory');
    } catch (err) {
      // Ignore if directory already exists
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
    
    // Create the CLI executable file
    const fileContent = `#!/usr/bin/env node

import '../src/index.js';
`;
    
    await fs.writeFile(rpcPath, fileContent);
    console.log('Created CLI executable file');
    
    // Make the file executable on Unix-like systems
    if (process.platform !== 'win32') {
      try {
        await execAsync(`chmod +x "${rpcPath}"`);
        console.log('Made CLI executable');
      } catch (err) {
        console.error('Failed to make CLI executable:', err.message);
      }
    }
    
    console.log('Setup completed successfully!');
    console.log('');
    console.log('You can now use the CLI by running:');
    console.log('- npm link (to install globally)');
    console.log('- rpc (to run the application)');
    
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

// Run setup
setup();