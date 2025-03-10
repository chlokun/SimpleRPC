/**
 * CLI handler for SimpleRPC
 * 
 * Processes command-line arguments and launches the appropriate interface
 * based on user input flags.
 */

import meow from 'meow';
import { render } from 'ink';
import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';
import pidusage from 'pidusage';

// Get the directory name properly in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const PID_FILE = path.join(rootDir, '.simplerpc.pid');

/**
 * Define CLI options and help text
 */
const cli = meow(`
  SimpleRPC - Discord Rich Presence with a Terminal UI

  Usage
    $ rpc [options]

  Options
    --help, -h     Show this help
    --setup, -s    Run the setup wizard
    --reset, -r    Reset configuration and run the setup wizard
    --version, -v  Show version
    --detach, -d   Run in background (detached mode)
    --status       Check if a background process is running
    --stop         Stop the background process

  Examples
    $ rpc               Launch the main application
    $ rpc --setup       Run the setup wizard
    $ rpc -d            Run in background
    $ rpc --status      Check background process status
    $ rpc --stop        Stop background process
`, {
  importMeta: import.meta,
  flags: {
    help: {
      type: 'boolean',
      shortFlag: 'h'  // Changed from 'alias' to 'shortFlag'
    },
    setup: {
      type: 'boolean',
      shortFlag: 's'  // Changed from 'alias' to 'shortFlag'
    },
    reset: {
      type: 'boolean',
      shortFlag: 'r'  // Changed from 'alias' to 'shortFlag'
    },
    version: {
      type: 'boolean',
      shortFlag: 'v'  // Changed from 'alias' to 'shortFlag'
    },
    detach: {
      type: 'boolean',
      shortFlag: 'd'  // Changed from 'alias' to 'shortFlag'
    },
    status: {
      type: 'boolean'
    },
    stop: {
      type: 'boolean'
    }
  }
});

// Rest of your CLI code remains unchanged...

/**
 * Write PID to file
 */
async function writePidFile(pid) {
  try {
    await fs.writeFile(PID_FILE, pid.toString());
    return true;
  } catch (error) {
    console.error('Failed to write PID file:', error);
    return false;
  }
}

/**
 * Read PID from file
 */
async function readPidFile() {
  try {
    const content = await fs.readFile(PID_FILE, 'utf8');
    return parseInt(content.trim(), 10);
  } catch (error) {
    return null;
  }
}

/**
 * Check if a process with the given PID is running
 */
async function isProcessRunning(pid) {
  try {
    await pidusage(pid);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get status of the background process
 */
async function getStatus() {
  const pid = await readPidFile();
  
  if (!pid) {
    console.log('❌ No SimpleRPC background process is running');
    return null;
  }
  
  const running = await isProcessRunning(pid);
  
  if (running) {
    try {
      const stats = await pidusage(pid);
      console.log(`✅ SimpleRPC is running in the background (PID: ${pid})`);
      console.log(`   CPU: ${stats.cpu.toFixed(1)}%, Memory: ${(stats.memory / 1024 / 1024).toFixed(1)} MB`);
      console.log(`   Uptime: ${formatUptime(stats.elapsed)}`);
      return pid;
    } catch (error) {
      console.log(`✅ SimpleRPC is running in the background (PID: ${pid})`);
      return pid;
    }
  } else {
    console.log('❌ SimpleRPC background process is not running (stale PID file found)');
    await fs.unlink(PID_FILE).catch(() => {});
    return null;
  }
}

/**
 * Format milliseconds as uptime string
 */
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Stop the background process
 */
async function stopProcess() {
  const pid = await readPidFile();
  
  if (!pid) {
    console.log('❌ No SimpleRPC background process is running');
    return false;
  }
  
  const running = await isProcessRunning(pid);
  
  if (running) {
    try {
      process.kill(pid);
      await fs.unlink(PID_FILE);
      console.log(`✅ SimpleRPC background process (PID: ${pid}) has been stopped`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to stop process: ${error.message}`);
      return false;
    }
  } else {
    console.log('❌ SimpleRPC background process is not running (stale PID file found)');
    await fs.unlink(PID_FILE).catch(() => {});
    return false;
  }
}

/**
 * Run the application in detached mode
 */
async function runDetached() {
  // First check if a process is already running
  const existingPid = await readPidFile();
  if (existingPid) {
    const running = await isProcessRunning(existingPid);
    if (running) {
      console.log(`❌ SimpleRPC is already running in the background (PID: ${existingPid})`);
      console.log('   Use --stop to stop it before starting a new instance.');
      return;
    } else {
      // Clean up stale PID file
      await fs.unlink(PID_FILE).catch(() => {});
    }
  }

  // Path to the daemon file
  const daemonPath = path.join(__dirname, 'daemon.js');
  
  // Spawn the process and detach it
  const child = fork(daemonPath, [], {
    detached: true,
    stdio: 'ignore'
  });
  
  // Unref the child to allow this process to exit
  child.unref();
  
  // Store the PID for future reference
  await writePidFile(child.pid);
  
  console.log(`✅ SimpleRPC is now running in the background (PID: ${child.pid})`);
  console.log('   Use the following commands to manage it:');
  console.log('   - rpc --status : Check if the process is running');
  console.log('   - rpc --stop   : Stop the background process');
}

/**
 * Initialize the application
 * This is the main entry point that decides which UI to render
 */
async function init() {
  try {
    // Handle status check
    if (cli.flags.status) {
      await getStatus();
      return;
    }
    
    // Handle stop command
    if (cli.flags.stop) {
      await stopProcess();
      return;
    }
    
    // Handle detached mode
    if (cli.flags.detach) {
      await runDetached();
      return;
    }
    
    // Check if .env exists
    const envPath = path.join(rootDir, '.env');
    const envExists = await fs.access(envPath).then(() => true).catch(() => false);

    // Dynamic imports for components to avoid loading everything at once
    let App, SetupWizard;

    if (cli.flags.setup || cli.flags.reset || !envExists) {
      // Import the setup wizard component
      const setupModule = await import('./ui/components/SetupWizard.js');
      SetupWizard = setupModule.default;
      
      // Render the setup wizard
      render(
        React.createElement(SetupWizard, { 
          reset: cli.flags.reset 
        })
      );
    } else {
      // Import the main app component
      const appModule = await import('./ui/app.js');
      App = appModule.default;
      
      // Render the main application
      render(
        React.createElement(App)
      );
    }
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
}

// Start the application
init();