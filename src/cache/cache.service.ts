import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const result = await this.cacheManager.get<T>(key);
    return result || null;
  }

  async set<T>(key: string, value: T, ttl = 60): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  generateTaskCacheKey(userId: string, page: number, limit: number, search?: string): string {
    const searchParam = search ? `_search_${search}` : '';
    return `user_tasks_${userId}_${page}_${limit}${searchParam}`;
  }
}