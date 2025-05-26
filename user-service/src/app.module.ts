import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.config';
import { RoleModule } from './module/role/role.module';
import { RolePermissionModule } from './module/role-permission/role-permission.module';
import { UserModule } from './module/user/user.module';
import { FavouritesModule } from './module/favourites/favourites.module';

@Module({
  imports: [DatabaseModule, UserModule, FavouritesModule],
})
export class AppModule {}
