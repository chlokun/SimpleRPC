/**
 * Discord RPC Client
 * 
 * Handles communication with Discord via the Rich Presence protocol
 */

import RPC from 'discord-rpc';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import path from 'path';

// Load environment variables
dotenv.config();

export class RPCClient extends EventEmitter {
  constructor() {
    super();
    this.clientId = process.env.CLIENT_ID;
    this.client = null;
    this.startTimestamp = new Date();
    this.connected = false;
  }

  async connect() {
    if (!this.clientId) {
      throw new Error('CLIENT_ID is not set in environment variables');
    }

    this.client = new RPC.Client({ transport: 'ipc' });

    // Set up event handlers
    this.client.on('ready', () => {
      this.connected = true;
      this.emit('ready', this.client.user);
      this.updateActivity();
    });

    try {
      await this.client.login({ clientId: this.clientId });
      return true;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  disconnect() {
    if (this.client) {
      this.connected = false;
      this.client.destroy();
      this.emit('disconnected');
    }
  }

  async updateActivity(overrides = {}) {
    if (!this.client || !this.connected) {
      throw new Error('Client not connected');
    }

    const buttons = this.createButtons();
    
    const activity = {
      details: process.env.DETAILS || 'No details set',
      state: process.env.STATE || 'No state set',
      startTimestamp: this.startTimestamp,
      largeImageKey: process.env.LARGE_IMAGE_KEY,
      largeImageText: process.env.LARGE_IMAGE_TEXT,
      smallImageKey: process.env.SMALL_IMAGE_KEY,
      smallImageText: process.env.SMALL_IMAGE_TEXT,
      type: parseInt(process.env.ACTIVITY_TYPE || '0'),
      ...overrides
    };

    if (buttons.length > 0) {
      activity.buttons = buttons;
    }

    try {
      await this.client.setActivity(activity);
      this.emit('activityUpdated', activity);
      return activity;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async getActivity() {
    if (!this.client || !this.connected) {
      return null;
    }
    
    return {
      details: process.env.DETAILS,
      state: process.env.STATE,
      largeImageKey: process.env.LARGE_IMAGE_KEY,
      smallImageKey: process.env.SMALL_IMAGE_KEY,
      buttons: this.createButtons(),
      type: parseInt(process.env.ACTIVITY_TYPE || '0')
    };
  }

  createButtons() {
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
}

export default RPCClient;