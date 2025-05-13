import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleModule } from '../role/role.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
    RolePermissionModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
