import { Injectable } from "@nestjs/common";
import { RedisConfig } from "./redis.config";

@Injectable()
export class RedisService {
    constructor(
        private readonly redisConfig: RedisConfig
    ){}

    async get<T>(key: string): Promise<T | null>{
        const value = await this.redisConfig.getClient().get(key);
        return value ? JSON.parse(value) : null
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const jsonValue = JSON.stringify(value);
        const client = this.redisConfig.getClient();
        if(ttl) await client.set(key, jsonValue, 'EX', ttl)
    }

    async del(key: string): Promise<void> {
        await this.redisConfig.getClient().del(key);
    }

    async incr(key: string): Promise<void> {
        await this.redisConfig.getClient().incr(key);
    }

    async expire(key: string, ttl: number): Promise<void> {
        await this.redisConfig.getClient().expire(key, ttl);
    }
}