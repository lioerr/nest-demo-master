import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';

import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  /**
   * 设置数据
   * @param key 
   * @param value 
   * @param seconds { ttl : 300 }
   */
  async set(key: string, value: any, seconds?: any) {
    if (seconds) {
      await this.cacheManager.set(key, value, seconds)
    } else {
      await this.cacheManager.set(key, value)
    }
  }

  /**
   * 获取数据
   * @param key 
   * @returns 
   */
  async get(key: string) {
    let data = await this.cacheManager.get(key)

    if (!data) {
      return null;
    }
    return data;
  }
}
