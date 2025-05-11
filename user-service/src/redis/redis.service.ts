import { Injectable } from '@nestjs/common';
import { RedisConfig } from './redis.config';

@Injectable()
export class RedisService {
    constructor(
        private readonly redisConfig: RedisConfig
    ) {}

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redisConfig.getClient().get(key);
        return value ? JSON.parse(value) : null;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const client = this.redisConfig.getClient();
        const jsonValue = JSON.stringify(value);
        if(ttl) await client.setEx(key, ttl, jsonValue);
        else await client.set(key, jsonValue);
    }

    async del<T>(key: string): Promise<void> {
        await this.redisConfig.getClient().del(key);
    }
}
