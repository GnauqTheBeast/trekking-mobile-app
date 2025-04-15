import { Module } from '@nestjs/common';

import { RedisModule } from './redis/redis.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { RedisConfig } from './redis/redis.config';
import { DatabaseModule } from './config/database.config';

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    RolePermissionModule],
  providers: [RedisConfig],
})
export class AppModule {}
