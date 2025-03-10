/**
 * Logger utility for SimpleRPC
 * 
 * Provides consistent logging with timestamps and log levels
 */

// Log levels
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  SUCCESS: 'success'
};

// Define a class for the logger
class Logger {
  constructor() {
    this.logs = [];
    this.listeners = [];
  }

  // Add a log entry
  log(message, level = LOG_LEVELS.INFO) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = { message, level, timestamp };
    
    this.logs.push(entry);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(entry));
    
    // Console output with appropriate formatting
    this._consoleOutput(entry);
    
    return entry;
  }
  
  // Output to console with color/formatting
  _consoleOutput({ message, level, timestamp }) {
    const prefix = `[${timestamp}]`;
    
    switch (level) {
      case LOG_LEVELS.DEBUG:
        console.debug(`${prefix} 🔍 ${message}`);
        break;
      case LOG_LEVELS.INFO:
        console.info(`${prefix} ℹ️ ${message}`);
        break;
      case LOG_LEVELS.WARN:
        console.warn(`${prefix} ⚠️ ${message}`);
        break;
      case LOG_LEVELS.ERROR:
        console.error(`${prefix} ❌ ${message}`);
        break;
      case LOG_LEVELS.SUCCESS:
        console.log(`${prefix} ✅ ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  // Convenience methods for different log levels
  debug(message) {
    return this.log(message, LOG_LEVELS.DEBUG);
  }

  info(message) {
    return this.log(message, LOG_LEVELS.INFO);
  }

  warn(message) {
    return this.log(message, LOG_LEVELS.WARN);
  }

  error(message) {
    return this.log(message, LOG_LEVELS.ERROR);
  }

  success(message) {
    return this.log(message, LOG_LEVELS.SUCCESS);
  }

  // Get all logs
  getLogs() {
    return [...this.logs];
  }

  // Subscribe to new log entries
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Clear all logs
  clear() {
    this.logs = [];
  }
}

// Create and export a singleton instance
export const logger = new Logger();

// Export default
export default logger;