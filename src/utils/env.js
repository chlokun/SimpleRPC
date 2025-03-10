/**
 * Environment configuration template for SimpleRPC
 */

export const envExample = `
# Discord Rich Presence Configuration
# https://discord.com/developers/applications

# Required - Your Discord application client ID
CLIENT_ID=

# Activity details (first line)
DETAILS=Playing a game

# Activity state (second line)
STATE=In a match

# Activity type: 0=Playing, 1=Streaming, 2=Listening, 3=Watching, 5=Competing
ACTIVITY_TYPE=0

# Image keys (must be uploaded to your Discord application)
LARGE_IMAGE_KEY=
LARGE_IMAGE_TEXT=
SMALL_IMAGE_KEY=
SMALL_IMAGE_TEXT=

# Buttons (up to 2 buttons can be added)
BUTTON_LABEL=
BUTTON_URL=
BUTTON2_LABEL=
BUTTON2_URL=
`;

/**
 * Get field descriptions for the setup wizard
 */
export const getFieldDescriptions = () => ({
  CLIENT_ID: 'Your Discord application client ID from the Developer Portal',
  DETAILS: 'Text that appears as the first line of your activity',
  STATE: 'Text that appears as the second line of your activity',
  LARGE_IMAGE_KEY: 'Key for the large image (must be uploaded to your Discord application)',
  LARGE_IMAGE_TEXT: 'Text that appears when hovering over the large image',
  SMALL_IMAGE_KEY: 'Key for the small image (must be uploaded to your Discord application)',
  SMALL_IMAGE_TEXT: 'Text that appears when hovering over the small image',
  ACTIVITY_TYPE: 'Number representing the type of activity (0=Playing, 1=Streaming, 2=Listening, 3=Watching, 5=Competing)',
  BUTTON_LABEL: 'Text displayed on the first button',
  BUTTON_URL: 'URL to open when the first button is clicked',
  BUTTON2_LABEL: 'Text displayed on the second button',
  BUTTON2_URL: 'URL to open when the second button is clicked'
});