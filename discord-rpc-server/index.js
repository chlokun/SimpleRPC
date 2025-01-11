// Import the required modules
const RPC = require('discord-rpc');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const clientId = process.env.CLIENT_ID;

// Create a new RPC client
const rpc = new RPC.Client({ transport: 'ipc' });

// Set the activity for the RPC client
function setActivity() {
  if (!rpc) return;
  rpc.setActivity({
    details: process.env.DETAILS,
    state: process.env.STATE,
    startTimestamp: new Date(),
    largeImageKey: process.env.LARGE_IMAGE_KEY,
    largeImageText: process.env.LARGE_IMAGE_TEXT,
    smallImageKey: process.env.SMALL_IMAGE_KEY,
    smallImageText: process.env.SMALL_IMAGE_TEXT,
    instance: false,
    type: parseInt(process.env.ACTIVITY_TYPE, 10),
    buttons: [
      {
        label: process.env.BUTTON_LABEL,
        url: process.env.BUTTON_URL,
      },
      {
        label: process.env.BUTTON2_LABEL,
        url: process.env.BUTTON2_URL,
      },
    ],
  });
}

// Log in to Discord with the client ID
rpc.on('ready', () => {
  console.log('RPC connected');
  setActivity();

  // Update the activity every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15 * 1000);
});

rpc.login({ clientId }).catch(console.error);