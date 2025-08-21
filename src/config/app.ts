/**
 * Application configuration management
 * Centralized configuration with type safety and validation
 */

import { z } from 'zod';

// ===== CONFIGURATION SCHEMAS =====

const EnvironmentSchema = z.enum(['development', 'staging', 'production', 'test']);

const DatabaseConfigSchema = z.object({
  url: z.string().url().optional(),
  maxConnections: z.number().int().positive().default(10),
  timeout: z.number().positive().default(30000),
});

const CacheConfigSchema = z.object({
  ttl: z.number().positive().default(900000), // 15 minutes
  maxSize: z.number().int().positive().default(100),
  strategy: z.enum(['lru', 'ttl', 'hybrid']).default('hybrid'),
});

const SecurityConfigSchema = z.object({
  enableCSP: z.boolean().default(true),
  enableSecurityHeaders: z.boolean().default(true),
  allowedOrigins: z.array(z.string()).default([]),
  rateLimiting: z.object({
    enabled: z.boolean().default(true),
    maxRequests: z.number().int().positive().default(100),
    windowMs: z.number().positive().default(900000), // 15 minutes
  }),
});

const ApiConfigSchema = z.object({
  baseUrl: z.string().url(),
  version: z.string().default('v1'),
  timeout: z.number().positive().default(30000),
  retries: z.number().int().min(0).max(5).default(3),
  backoffFactor: z.number().positive().default(2),
});

const MonitoringConfigSchema = z.object({
  enabled: z.boolean().default(false),
  endpoint: z.string().url().optional(),
  sampleRate: z.number().min(0).max(1).default(0.1),
  enablePerformanceTracking: z.boolean().default(true),
  enableErrorTracking: z.boolean().default(true),
});

const FeatureFlagsSchema = z.object({
  analytics: z.boolean().default(false),
  debugging: z.boolean().default(false),
  experimentalFeatures: z.boolean().default(false),
  performanceMonitoring: z.boolean().default(false),
  maintenanceMode: z.boolean().default(false),
});

const AppConfigSchema = z.object({
  name: z.string().default('Ny Baiboly'),
  version: z.string().default('2.0.0'),
  description: z.string().default('Professional Malagasy Bible Application'),
  environment: EnvironmentSchema,
  database: DatabaseConfigSchema,
  cache: CacheConfigSchema,
  security: SecurityConfigSchema,
  api: ApiConfigSchema,
  monitoring: MonitoringConfigSchema,
  features: FeatureFlagsSchema,
  search: z.object({
    maxResults: z.number().int().positive().default(100),
    debounceDelay: z.number().positive().default(300),
    highlightEnabled: z.boolean().default(true),
  }),
});

// ===== TYPE EXPORTS =====

export type Environment = z.infer<typeof EnvironmentSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
export type CacheConfig = z.infer<typeof CacheConfigSchema>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
export type ApiConfig = z.infer<typeof ApiConfigSchema>;
export type MonitoringConfig = z.infer<typeof MonitoringConfigSchema>;
export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;

// ===== CONFIGURATION BUILDER =====

class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  private loadConfiguration(): AppConfig {
    const environment = (process.env.NODE_ENV as Environment) || 'development';
    
    const rawConfig = {
      name: process.env.NEXT_PUBLIC_APP_NAME || 'Ny Baiboly',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Professional Malagasy Bible Application',
      environment,
      
      database: {
        url: process.env.DATABASE_URL,
        maxConnections: Number(process.env.DB_MAX_CONNECTIONS) || 10,
        timeout: Number(process.env.DB_TIMEOUT) || 30000,
      },
      
      cache: {
        ttl: Number(process.env.NEXT_PUBLIC_CACHE_TTL) || 900000,
        maxSize: Number(process.env.CACHE_MAX_SIZE) || 100,
        strategy: (process.env.CACHE_STRATEGY as 'lru' | 'ttl' | 'hybrid') || 'hybrid',
      },
      
      security: {
        enableCSP: process.env.NEXT_PUBLIC_CSP_NONCE_ENABLED === 'true',
        enableSecurityHeaders: process.env.NEXT_PUBLIC_SECURITY_HEADERS_ENABLED === 'true',
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
        rateLimiting: {
          enabled: process.env.RATE_LIMITING_ENABLED !== 'false',
          maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
          windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
        },
      },
      
      api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
        version: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
        timeout: Number(process.env.API_TIMEOUT) || 30000,
        retries: Number(process.env.API_RETRIES) || 3,
        backoffFactor: Number(process.env.API_BACKOFF_FACTOR) || 2,
      },
      
      monitoring: {
        enabled: process.env.MONITORING_ENABLED === 'true',
        endpoint: process.env.MONITORING_ENDPOINT,
        sampleRate: Number(process.env.MONITORING_SAMPLE_RATE) || 0.1,
        enablePerformanceTracking: process.env.PERFORMANCE_TRACKING_ENABLED !== 'false',
        enableErrorTracking: process.env.ERROR_TRACKING_ENABLED !== 'false',
      },
      
      features: {
        analytics: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
        debugging: environment === 'development',
        experimentalFeatures: process.env.EXPERIMENTAL_FEATURES === 'true',
        performanceMonitoring: process.env.PERFORMANCE_MONITORING === 'true',
        maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
      },
      
      search: {
        maxResults: Number(process.env.NEXT_PUBLIC_MAX_SEARCH_RESULTS) || 100,
        debounceDelay: Number(process.env.NEXT_PUBLIC_DEBOUNCE_DELAY) || 300,
        highlightEnabled: process.env.SEARCH_HIGHLIGHT_ENABLED !== 'false',
      },
    };

    // Validate configuration
    try {
      return AppConfigSchema.parse(rawConfig);
    } catch (error) {
      console.error('Configuration validation failed:', error);
      throw new Error('Invalid application configuration');
    }
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public isProduction(): boolean {
    return this.config.environment === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  public isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.config.features[feature];
  }

  public updateFeatureFlag(feature: keyof FeatureFlags, enabled: boolean): void {
    this.config.features[feature] = enabled;
  }
}

// ===== SINGLETON EXPORT =====

export const config = ConfigurationManager.getInstance();

// ===== HELPER FUNCTIONS =====

/**
 * Get configuration value with type safety
 */
export const getConfig = () => config.getConfig();

/**
 * Check if running in production
 */
export const isProduction = () => config.isProduction();

/**
 * Check if running in development
 */
export const isDevelopment = () => config.isDevelopment();

/**
 * Check if feature is enabled
 */
export const isFeatureEnabled = (feature: keyof FeatureFlags) => 
  config.isFeatureEnabled(feature);

/**
 * Get environment-specific values
 */
export const getEnvironmentValue = <T>(
  values: Record<Environment, T>,
  fallback: T
): T => {
  const environment = getConfig().environment;
  return values[environment] ?? fallback;
};

/**
 * Validate configuration on startup
 */
export const validateConfiguration = (): void => {
  try {
    const currentConfig = getConfig();
    console.info('✅ Configuration validated successfully', {
      environment: currentConfig.environment,
      version: currentConfig.version,
      features: Object.entries(currentConfig.features)
        .filter(([, enabled]) => enabled)
        .map(([feature]) => feature),
    });
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    throw error;
  }
};
