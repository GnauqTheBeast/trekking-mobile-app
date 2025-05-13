import { Module } from '@nestjs/common';
import { RolePermissionController } from './controller/role-permission.controller';
import { RolePermissionService } from './service/role-permission.service';

import { RolePermission } from './entities/role-permisson.entity';
import { RedisModule } from 'src/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission]), RedisModule],
  providers: [RolePermissionService],
  controllers: [RolePermissionController],
  exports: [RolePermissionService]
})
export class RolePermissionModule {}
