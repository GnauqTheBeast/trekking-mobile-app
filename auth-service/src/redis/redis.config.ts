import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisConfig implements OnModuleInit, OnModuleDestroy {
    private client: Redis
    constructor(){
        this.client = new Redis({
            host: 'redis',
            port: 6379
        })
    }

    async onModuleInit() {
        console.log("Connect to Redis")
    }

    async onModuleDestroy() {
        await this.client.quit()
        console.log("Disconnect from Redis")
    }

    getClient(): Redis {
        return this.client;
    }
}