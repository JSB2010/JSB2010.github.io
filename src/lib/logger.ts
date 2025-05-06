/**
 * Centralized Logging System
 * 
 * This module provides a standardized way to log messages across the application.
 * It includes:
 * - Different log levels (error, warn, info, debug)
 * - Context-aware logging
 * - Environment-specific behavior
 * - Log storage and retrieval
 * - Integration with external logging services
 */

import { env } from '@/lib/env';

// Log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  source?: string;
}

// Logger configuration
export interface LoggerConfig {
  minLevel: LogLevel;
  enabled: boolean;
  persistLogs: boolean;
  maxLogEntries: number;
  context?: Record<string, any>;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
  enabled: true,
  persistLogs: env.NODE_ENV === 'development',
  maxLogEntries: 1000,
  context: {}
};

/**
 * Main Logger class
 */
export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private storageKey = 'app_logs';

  /**
   * Private constructor for singleton pattern
   */
  private constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.loadLogs();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config: Partial<LoggerConfig> = {}): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  /**
   * Log an error message
   */
  public error(message: string, context?: Record<string, any>, source?: string): void {
    this.log(LogLevel.ERROR, message, context, source);
  }

  /**
   * Log a warning message
   */
  public warn(message: string, context?: Record<string, any>, source?: string): void {
    this.log(LogLevel.WARN, message, context, source);
  }

  /**
   * Log an info message
   */
  public info(message: string, context?: Record<string, any>, source?: string): void {
    this.log(LogLevel.INFO, message, context, source);
  }

  /**
   * Log a debug message
   */
  public debug(message: string, context?: Record<string, any>, source?: string): void {
    this.log(LogLevel.DEBUG, message, context, source);
  }

  /**
   * Main log method
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, source?: string): void {
    // Skip if logging is disabled or level is below minimum
    if (!this.config.enabled || level > this.config.minLevel) {
      return;
    }

    // Create log entry
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.config.context, ...context },
      source
    };

    // Add to in-memory logs
    this.logs.push(entry);

    // Trim logs if they exceed max entries
    if (this.logs.length > this.config.maxLogEntries) {
      this.logs = this.logs.slice(-this.config.maxLogEntries);
    }

    // Save logs if persistence is enabled
    if (this.config.persistLogs) {
      this.saveLogs();
    }

    // Output to console
    this.consoleOutput(entry);

    // Here you could add integration with external logging services
    // this.sendToExternalService(entry);
  }

  /**
   * Output log entry to console
   */
  private consoleOutput(entry: LogEntry): void {
    const timestamp = entry.timestamp.split('T')[1].split('.')[0]; // HH:MM:SS
    const prefix = `[${timestamp}] [${LogLevel[entry.level]}]${entry.source ? ` [${entry.source}]` : ''}:`;
    
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.context || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context || '');
        break;
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context || '');
        break;
    }
  }

  /**
   * Save logs to localStorage (client-side only)
   */
  private saveLogs(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save logs to localStorage:', error);
    }
  }

  /**
   * Load logs from localStorage (client-side only)
   */
  private loadLogs(): void {
    if (typeof window === 'undefined') return;

    try {
      const savedLogs = localStorage.getItem(this.storageKey);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      console.error('Failed to load logs from localStorage:', error);
    }
  }

  /**
   * Get all logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs filtered by source
   */
  public getLogsBySource(source: string): LogEntry[] {
    return this.logs.filter(log => log.source === source);
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
    if (this.config.persistLogs && typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  /**
   * Create a child logger with additional context
   */
  public createChildLogger(context: Record<string, any>, source?: string): Logger {
    const childLogger = new Logger({
      ...this.config,
      context: { ...this.config.context, ...context }
    });
    
    // Override log method to include source
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = (level: LogLevel, message: string, ctx?: Record<string, any>) => {
      originalLog(level, message, ctx, source);
    };
    
    return childLogger;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export a function to create a logger for a specific component
export function createLogger(source: string, context: Record<string, any> = {}): Logger {
  return logger.createChildLogger(context, source);
}

// Helper function to format objects for logging
export function formatForLog(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return String(obj);
  }
}