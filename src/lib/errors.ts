/**
 * Advanced error handling system with structured logging
 * Implements error categorization, retry logic, and performance monitoring
 */

import { getConfig, isDevelopment } from '@/config/app';

// ===== ERROR TYPES =====

export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  DATA = 'DATA',
  PERMISSION = 'PERMISSION',
  SYSTEM = 'SYSTEM',
  BUSINESS = 'BUSINESS',
  EXTERNAL = 'EXTERNAL',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  environment: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface StructuredError {
  id: string;
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context: ErrorContext;
  stack?: string;
  cause?: StructuredError;
  recoverable: boolean;
  retryable: boolean;
  userMessage: string;
}

// ===== CUSTOM ERROR CLASSES =====

export class AppError extends Error {
  public readonly id: string;
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly recoverable: boolean;
  public readonly retryable: boolean;
  public readonly userMessage: string;
  public readonly cause?: AppError;

  constructor(
    message: string,
    options: {
      code: string;
      category: ErrorCategory;
      severity?: ErrorSeverity;
      context?: Partial<ErrorContext>;
      recoverable?: boolean;
      retryable?: boolean;
      userMessage?: string;
      cause?: AppError | Error;
    }
  ) {
    super(message);
    this.name = 'AppError';
    
    this.id = generateErrorId();
    this.code = options.code;
    this.category = options.category;
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.recoverable = options.recoverable ?? true;
    this.retryable = options.retryable ?? false;
    this.userMessage = options.userMessage || this.getDefaultUserMessage();
    
    this.context = {
      timestamp: new Date().toISOString(),
      environment: getConfig().environment,
      ...options.context,
    };
    
    if (options.cause instanceof AppError) {
      this.cause = options.cause;
    } else if (options.cause instanceof Error) {
      this.cause = AppError.fromError(options.cause);
    }

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  private getDefaultUserMessage(): string {
    switch (this.category) {
      case ErrorCategory.VALIDATION:
        return 'Misy olana amin\'ny angon-drakitra nampidirinao. Azafady avereno.';
      case ErrorCategory.NETWORK:
        return 'Misy olana amin\'ny fifandraisana. Azafady andramo indray.';
      case ErrorCategory.DATA:
        return 'Tsy hita ny angon-drakitra notadiavina.';
      case ErrorCategory.PERMISSION:
        return 'Tsy manana alalana ianao hanao izany.';
      default:
        return 'Nisy tsy faharetana. Azafady andramo indray.';
    }
  }

  public toStructured(): StructuredError {
    return {
      id: this.id,
      code: this.code,
      message: this.message,
      category: this.category,
      severity: this.severity,
      context: this.context,
      stack: this.stack,
      cause: this.cause?.toStructured(),
      recoverable: this.recoverable,
      retryable: this.retryable,
      userMessage: this.userMessage,
    };
  }

  public static fromError(error: Error, context?: ErrorContext): AppError {
    if (error instanceof AppError) {
      return error;
    }

    return new AppError(error.message, {
      code: 'UNKNOWN_ERROR',
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.MEDIUM,
      context: {
        ...context,
        metadata: {
          originalName: error.name,
          stack: error.stack,
        },
      },
    });
  }
}

// ===== SPECIFIC ERROR CLASSES =====

export class ValidationError extends AppError {
  constructor(
    message: string,
    context?: Partial<ErrorContext>
  ) {
    super(message, {
      code: 'VALIDATION_ERROR',
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      context,
      recoverable: true,
      retryable: false,
    });
  }
}

export class NetworkError extends AppError {
  constructor(
    message: string,
    context?: Partial<ErrorContext>
  ) {
    super(message, {
      code: 'NETWORK_ERROR',
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.HIGH,
      context,
      recoverable: true,
      retryable: true,
    });
  }
}

export class DataNotFoundError extends AppError {
  constructor(
    resource: string,
    identifier?: string,
    context?: Partial<ErrorContext>
  ) {
    const message = identifier 
      ? `${resource} with identifier "${identifier}" not found`
      : `${resource} not found`;
      
    super(message, {
      code: 'DATA_NOT_FOUND',
      category: ErrorCategory.DATA,
      severity: ErrorSeverity.LOW,
      context: {
        ...context,
        metadata: {
          resource,
          identifier,
        },
      },
      recoverable: true,
      retryable: false,
    });
  }
}

export class BusinessLogicError extends AppError {
  constructor(
    message: string,
    userMessage: string,
    context?: Partial<ErrorContext>
  ) {
    super(message, {
      code: 'BUSINESS_LOGIC_ERROR',
      category: ErrorCategory.BUSINESS,
      severity: ErrorSeverity.MEDIUM,
      context,
      recoverable: true,
      retryable: false,
      userMessage,
    });
  }
}

// ===== LOGGER INTERFACE =====

export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info', 
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

export type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

export interface LogEntry {
  timestamp: string;
  level: LogLevelType;
  message: string;
  context?: Record<string, unknown>;
  error?: StructuredError;
  performance?: {
    duration: number;
    memory?: number;
  };
}

// ===== STRUCTURED LOGGER =====

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(
    level: LogLevelType,
    message: string,
    context?: Record<string, unknown>,
    error?: AppError
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error?.toStructured(),
    };
  }

  private log(entry: LogEntry): void {
    // Add to memory store
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (isDevelopment()) {
      const { timestamp, level, message, context, error } = entry;
      
      switch (level) {
        case 'debug':
          console.info(`[${timestamp}] DEBUG: ${message}`, context);
          break;
        case 'info':
          console.info(`[${timestamp}] INFO: ${message}`, context);
          break;
        case 'warn':
          console.warn(`[${timestamp}] WARN: ${message}`, context);
          break;
        case 'error':
        case 'fatal':
          console.error(`[${timestamp}] ${level.toUpperCase()}: ${message}`, {
            context,
            error,
          });
          break;
      }
    }

    // Send to monitoring service (if configured)
    this.sendToMonitoring(entry);
  }

  private async sendToMonitoring(entry: LogEntry): Promise<void> {
    const config = getConfig();
    
    if (!config.monitoring.enabled || !config.monitoring.endpoint) {
      return;
    }

    try {
      // Only send errors and warnings to monitoring
      if (entry.level === 'error' || entry.level === 'fatal' || entry.level === 'warn') {
        await fetch(config.monitoring.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry),
        });
      }
    } catch (error) {
      // Avoid infinite loop by not using logger here
      console.error('Failed to send log to monitoring service:', error);
    }
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.log(this.createLogEntry('debug', message, context));
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log(this.createLogEntry('info', message, context));
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log(this.createLogEntry('warn', message, context));
  }

  public error(message: string, error?: AppError, context?: Record<string, unknown>): void {
    this.log(this.createLogEntry('error', message, context, error));
  }

  public fatal(message: string, error?: AppError, context?: Record<string, unknown>): void {
    this.log(this.createLogEntry('fatal', message, context, error));
  }

  public getLogs(level?: LogLevelType): LogEntry[] {
    if (!level) {return this.logs;}
    return this.logs.filter(log => log.level === level);
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

// ===== PERFORMANCE MONITORING =====

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private static instance: PerformanceMonitor;

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public startTimer(operation: string): string {
    const id = `${operation}_${Date.now()}_${Math.random()}`;
    this.metrics.set(id, performance.now());
    return id;
  }

  public endTimer(id: string, context?: Record<string, unknown>): number {
    const startTime = this.metrics.get(id);
    if (!startTime) {
      logger.warn('Timer not found', { timerId: id });
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(id);

    logger.info('Performance metric', {
      ...context,
      duration: Math.round(duration),
      operation: id.split('_')[0],
    });

    return duration;
  }

  public measureAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> {
    const timerId = this.startTimer(operation);
    
    return fn()
      .then(result => {
        this.endTimer(timerId, { ...context, success: true });
        return result;
      })
      .catch(error => {
        this.endTimer(timerId, { ...context, success: false, error: error.message });
        throw error;
      });
  }

  public measure<T>(
    operation: string,
    fn: () => T,
    context?: Record<string, unknown>
  ): T {
    const timerId = this.startTimer(operation);
    
    try {
      const result = fn();
      this.endTimer(timerId, { ...context, success: true });
      return result;
    } catch (error) {
      this.endTimer(timerId, { ...context, success: false, error: (error as Error).message });
      throw error;
    }
  }
}

// ===== UTILITY FUNCTIONS =====

function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ===== EXPORTS =====

export const logger = Logger.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();

// ===== ASYNC ERROR HANDLING HELPER =====

export const handleAsyncError = async <T>(
  promise: Promise<T>,
  context?: Partial<ErrorContext>
): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    const appError = AppError.fromError(error as Error);
    // Create new error with additional context instead of mutating readonly property
    const newError = new AppError(appError.message, {
      code: appError.code,
      category: appError.category,
      severity: appError.severity,
      context: { ...appError.context, ...context },
      recoverable: appError.recoverable,
      retryable: appError.retryable,
      userMessage: appError.userMessage,
      cause: appError.cause,
    });
    logger.error('Async operation failed', newError);
    throw newError;
  }
};
