import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis: Redis;

  async onModuleInit() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
    console.log('Connected to Redis');
  }

  async setData(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async getData(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async saveCommand(key: string, item: string): Promise<void> {
    await this.redis.rpush(key, item);
  }

  async getCommand(
    key: string,
    start: number = 0,
    end: number = -1,
  ): Promise<string[]> {
    return await this.redis.lrange(key, start, end);
  }

  async removeFromCommand(key: string, item: string): Promise<void> {
    await this.redis.lrem(key, 0, item);
  }
}
