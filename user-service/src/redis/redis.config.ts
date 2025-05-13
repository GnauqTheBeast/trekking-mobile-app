import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { RedisClientType, createClient } from "redis";

@Injectable()
export class RedisConfig implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(){
    this.client = createClient({
      socket: {
        host: 'redis',
        port: 6379
      },
    });
  }

  async onModuleInit(){
    await this.client.connect();
    console.log('Connect to Redis')
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log('Disconnect from redis')
  }


  getClient(): RedisClientType {
    return this.client;
  }

}