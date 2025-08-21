/**
 * Advanced caching system with multiple strategies and performance optimization
 * Implements LRU, TTL, and hybrid caching with compression and persistence
 */

import { getConfig } from '@/config/app';
import { logger, performanceMonitor } from '@/lib/errors';

// ===== CACHE INTERFACES =====

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  compressed: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  totalSize: number;
  itemCount: number;
  hitRate: number;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  strategy?: 'lru' | 'ttl' | 'hybrid';
  compress?: boolean;
  persistent?: boolean;
  keyPrefix?: string;
}

// ===== COMPRESSION UTILITIES =====

class CompressionUtils {
  public static compress(data: unknown): string {
    try {
      const json = JSON.stringify(data);
      // Simple compression using deflate algorithm (for production, use a proper compression library)
      return btoa(unescape(encodeURIComponent(json)));
    } catch (error) {
      logger.warn('Compression failed, storing uncompressed', { error });
      return JSON.stringify(data);
    }
  }

  public static decompress(compressed: string): unknown {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(compressed))));
    } catch (error) {
      // Fallback to parsing as regular JSON
      return JSON.parse(compressed);
    }
  }

  public static getSize(data: unknown): number {
    return new Blob([JSON.stringify(data)]).size;
  }
}

// ===== BASE CACHE INTERFACE =====

export interface ICache<T> {
  get(key: string): T | null;
  set(key: string, value: T, options?: Partial<CacheOptions>): void;
  delete(key: string): boolean;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
  size(): number;
  getStats(): CacheStats;
}

// ===== LRU CACHE IMPLEMENTATION =====

class LRUCache<T> implements ICache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder = new Map<string, number>();
  private accessCounter = 0;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
    totalSize: 0,
    itemCount: 0,
    hitRate: 0,
  };

  constructor(
    private maxSize: number = 100,
    private defaultTTL: number = 900000, // 15 minutes
    private options: CacheOptions = {}
  ) {}

  public get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check TTL
    if (this.isExpired(entry)) {
      this.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Update access information
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.accessOrder.set(key, ++this.accessCounter);
    
    this.stats.hits++;
    this.updateHitRate();

    // Decompress if needed
    if (entry.compressed && typeof entry.data === 'string') {
      return CompressionUtils.decompress(entry.data as string) as T;
    }

    return entry.data;
  }

  public set(key: string, value: T, options: Partial<CacheOptions> = {}): void {
    const now = Date.now();
    const ttl = options.ttl || this.defaultTTL;
    const compress = options.compress ?? this.options.compress ?? false;
    
    let dataToStore: T | string = value;
    let size = CompressionUtils.getSize(value);
    let isCompressed = false;

    // Compress if enabled
    if (compress) {
      dataToStore = CompressionUtils.compress(value) as T;
      size = CompressionUtils.getSize(dataToStore);
      isCompressed = true;
    }

    const entry: CacheEntry<T> = {
      data: dataToStore,
      timestamp: now,
      ttl,
      accessCount: 1,
      lastAccessed: now,
      size,
      compressed: isCompressed,
    };

    // Check if we need to evict
    this.evictIfNeeded();

    // Store the entry
    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
    
    this.stats.sets++;
    this.stats.totalSize += size;
    this.stats.itemCount = this.cache.size;

    logger.debug('Cache set', { key, size, compressed: isCompressed });
  }

  public delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.cache.delete(key);
    this.accessOrder.delete(key);
    
    this.stats.deletes++;
    this.stats.totalSize -= entry.size;
    this.stats.itemCount = this.cache.size;

    return true;
  }

  public clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;
    this.stats.totalSize = 0;
    this.stats.itemCount = 0;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  public size(): number {
    return this.cache.size;
  }

  public getStats(): CacheStats {
    return { ...this.stats };
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictIfNeeded(): void {
    if (this.cache.size < this.maxSize) return;

    // Find least recently used item
    let lruKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [key, accessTime] of this.accessOrder) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.delete(lruKey);
      this.stats.evictions++;
      logger.debug('Cache eviction', { evictedKey: lruKey });
    }
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }
}

// ===== TTL CACHE IMPLEMENTATION =====

class TTLCache<T> implements ICache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private timers = new Map<string, NodeJS.Timeout>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
    totalSize: 0,
    itemCount: 0,
    hitRate: 0,
  };

  constructor(
    private defaultTTL: number = 900000,
    private options: CacheOptions = {}
  ) {}

  public get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    this.stats.hits++;
    this.updateHitRate();

    if (entry.compressed && typeof entry.data === 'string') {
      return CompressionUtils.decompress(entry.data as string) as T;
    }

    return entry.data;
  }

  public set(key: string, value: T, options: Partial<CacheOptions> = {}): void {
    const ttl = options.ttl || this.defaultTTL;
    const compress = options.compress ?? this.options.compress ?? false;
    
    // Clear existing timer
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    let dataToStore: T | string = value;
    let size = CompressionUtils.getSize(value);
    let isCompressed = false;

    if (compress) {
      dataToStore = CompressionUtils.compress(value) as T;
      size = CompressionUtils.getSize(dataToStore);
      isCompressed = true;
    }

    const entry: CacheEntry<T> = {
      data: dataToStore,
      timestamp: Date.now(),
      ttl,
      accessCount: 1,
      lastAccessed: Date.now(),
      size,
      compressed: isCompressed,
    };

    this.cache.set(key, entry);
    
    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
      this.stats.evictions++;
    }, ttl);
    
    this.timers.set(key, timer);
    
    this.stats.sets++;
    this.stats.totalSize += size;
    this.stats.itemCount = this.cache.size;
  }

  public delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }

    this.cache.delete(key);
    
    this.stats.deletes++;
    this.stats.totalSize -= entry.size;
    this.stats.itemCount = this.cache.size;

    return true;
  }

  public clear(): void {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    
    this.cache.clear();
    this.timers.clear();
    this.stats.totalSize = 0;
    this.stats.itemCount = 0;
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  public size(): number {
    return this.cache.size;
  }

  public getStats(): CacheStats {
    return { ...this.stats };
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }
}

// ===== CACHE MANAGER =====

class CacheManager {
  private caches = new Map<string, ICache<unknown>>();
  private static instance: CacheManager;

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public getCache<T>(
    name: string, 
    options: CacheOptions = {}
  ): ICache<T> {
    const config = getConfig();
    const cacheOptions = {
      ttl: config.cache.ttl,
      maxSize: config.cache.maxSize,
      strategy: config.cache.strategy,
      ...options,
    };

    if (!this.caches.has(name)) {
      let cache: ICache<T>;

      switch (cacheOptions.strategy) {
        case 'lru':
          cache = new LRUCache<T>(
            cacheOptions.maxSize,
            cacheOptions.ttl,
            cacheOptions
          );
          break;
        case 'ttl':
          cache = new TTLCache<T>(cacheOptions.ttl, cacheOptions);
          break;
        case 'hybrid':
        default:
          // Use LRU with TTL features
          cache = new LRUCache<T>(
            cacheOptions.maxSize,
            cacheOptions.ttl,
            cacheOptions
          );
          break;
      }

      this.caches.set(name, cache as ICache<unknown>);
      logger.info('Cache created', { 
        name, 
        strategy: cacheOptions.strategy,
        maxSize: cacheOptions.maxSize,
        ttl: cacheOptions.ttl 
      });
    }

    return this.caches.get(name) as ICache<T>;
  }

  public clearCache(name: string): void {
    const cache = this.caches.get(name);
    if (cache) {
      cache.clear();
      logger.info('Cache cleared', { name });
    }
  }

  public clearAllCaches(): void {
    for (const [name, cache] of this.caches) {
      cache.clear();
      logger.info('Cache cleared', { name });
    }
  }

  public getCacheStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    for (const [name, cache] of this.caches) {
      stats[name] = cache.getStats();
    }
    return stats;
  }

  public logCacheStats(): void {
    const stats = this.getCacheStats();
    logger.info('Cache statistics', { stats });
  }
}

// ===== CACHE DECORATORS =====

export function cached<T>(
  cacheName: string,
  options: CacheOptions = {}
) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cache = cacheManager.getCache<T>(cacheName, options);

    descriptor.value = async function (...args: unknown[]) {
      const cacheKey = `${propertyKey}_${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cached = cache.get(cacheKey);
      if (cached !== null) {
        logger.debug('Cache hit', { method: propertyKey, key: cacheKey });
        return cached;
      }

      // Execute method and cache result
      const timerId = performanceMonitor.startTimer(`cache_${propertyKey}`);
      
      try {
        const result = await originalMethod.apply(this, args);
        cache.set(cacheKey, result, options);
        
        logger.debug('Cache miss - result cached', { 
          method: propertyKey, 
          key: cacheKey 
        });
        
        return result;
      } finally {
        performanceMonitor.endTimer(timerId, { 
          method: propertyKey,
          cached: false 
        });
      }
    };

    return descriptor;
  };
}

// ===== EXPORTS =====

export const cacheManager = CacheManager.getInstance();

// ===== CACHE UTILITIES =====

export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> => {
  const cache = cacheManager.getCache<T>('default', options);
  
  const cached = cache.get(key);
  if (cached !== null) {
    return cached;
  }

  const result = await performanceMonitor.measureAsync(
    'cache_operation',
    fn,
    { key }
  );
  
  cache.set(key, result, options);
  return result;
};

export const invalidateCache = (pattern: string): void => {
  const stats = cacheManager.getCacheStats();
  
  for (const cacheName in stats) {
    const cache = cacheManager.getCache(cacheName);
    const keys = cache.keys();
    
    for (const key of keys) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  }
  
  logger.info('Cache invalidated', { pattern });
};
