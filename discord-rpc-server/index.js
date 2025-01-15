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

// Set the activity for the RPC client
function setActivity() {
  if (!rpc) {
    console.log('RPC client not initialized');
    return;
  }

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

  rpc.setActivity({
    details: process.env.DETAILS,
    state: process.env.STATE,
    startTimestamp: startTimestamp, // Use a fixed start timestamp
    largeImageKey: process.env.LARGE_IMAGE_KEY,
    largeImageText: process.env.LARGE_IMAGE_TEXT,
    smallImageKey: process.env.SMALL_IMAGE_KEY,
    smallImageText: process.env.SMALL_IMAGE_TEXT,
    instance: false,
    type: parseInt(process.env.ACTIVITY_TYPE, 10),
    buttons: buttons,
  }).then(() => {
    console.log('Activity set successfully:', {
      details: process.env.DETAILS,
      state: process.env.STATE,
      startTimestamp: startTimestamp,
      largeImageKey: process.env.LARGE_IMAGE_KEY,
      largeImageText: process.env.LARGE_IMAGE_TEXT,
      smallImageKey: process.env.SMALL_IMAGE_KEY,
      smallImageText: process.env.SMALL_IMAGE_TEXT,
      buttons: buttons,
    });
  }).catch((error) => {
    console.error('Error setting activity:', error);
  });
}

// Log in to the RPC client
rpc.on('ready', () => {
  console.log('RPC client ready');
  setActivity();

  // Update the activity every 15 seconds without resetting the timer
  setInterval(() => {
    console.log('Updating activity');
    setActivity();
  }, 15000);
});

rpc.on('disconnected', () => {
  console.log('RPC client disconnected');
});

rpc.on('error', (error) => {
  console.error('RPC client error:', error);
});

rpc.login({ clientId }).then(() => {
  console.log('Logged in successfully');
}).catch((error) => {
  console.error('Error logging in:', error);
});