/**
 * Constants for Discord RPC
 */

// Activity types
export const ACTIVITY_TYPES = {
  PLAYING: 0,
  STREAMING: 1,
  LISTENING: 2,
  WATCHING: 3,
  CUSTOM: 4,
  COMPETING: 5
};

// Activity type labels
export const ACTIVITY_TYPE_LABELS = {
  0: 'Playing',
  1: 'Streaming',
  2: 'Listening to',
  3: 'Watching',
  4: 'Custom', // Not typically used for RPC
  5: 'Competing in'
};

// Connection status
export const CONNECTION_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
};

// Default RPC configuration
export const DEFAULT_CONFIG = {
  clientId: '',
  details: 'Playing a game',
  state: 'In a match',
  startTimestamp: null,
  largeImageKey: '',
  largeImageText: '',
  smallImageKey: '',
  smallImageText: '',
  activityType: 0
};