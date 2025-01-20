// Import the required modules
const RPC = require('discord-rpc');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const clientId = process.env.CLIENT_ID;

// Create a new RPC client
const rpc = new RPC.Client({ transport: 'ipc' });

// Store the start timestamp
const startTimestamp = new Date();

// Helper function to create valid buttons array
function createButtons() {
  const buttons = [];
  
  if (process.env.BUTTON_LABEL && process.env.BUTTON_URL) {
    buttons.push({
      label: process.env.BUTTON_LABEL,
      url: process.env.BUTTON_URL,
    });
  }

  if (process.env.BUTTON2_LABEL && process.env.BUTTON2_URL) {
    buttons.push({
      label: process.env.BUTTON2_LABEL,
      url: process.env.BUTTON2_URL,
    });
  }

  return buttons;
}

// Set the activity for the RPC client
async function setActivity() {
  try {
    if (!rpc) {
      throw new Error('RPC client not initialized');
    }

    await rpc.setActivity({
      details: process.env.DETAILS || 'No details set',
      state: process.env.STATE || 'No state set',
      startTimestamp,
      largeImageKey: process.env.LARGE_IMAGE_KEY || 'default',
      largeImageText: process.env.LARGE_IMAGE_TEXT,
      smallImageKey: process.env.SMALL_IMAGE_KEY,
      smallImageText: process.env.SMALL_IMAGE_TEXT,
      buttons: createButtons()
    });
    console.log('󰄲 Activity updated successfully');
  } catch (error) {
    console.error('󰚌 Error setting activity:', error);
  }
}

// Handle RPC ready event
rpc.on('ready', () => {
  console.log('󰟡 RPC client ready');
  console.log('󱎫 Connected as:', rpc.user.username);
  setActivity();
});

// Handle connection
rpc.login({ clientId }).catch((error) => {
  console.error('󰌑 Connection failed:', error);
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('󰗼 Shutting down...');
  rpc.destroy().catch(console.error);
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('󰗼 Shutting down...');
  rpc.destroy().catch(console.error);
  process.exit();
});