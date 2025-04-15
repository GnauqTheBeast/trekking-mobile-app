import { Module } from '@nestjs/common';
import { RoleService } from './role/service/role.service';
import { RoleModule } from './role/role.module';
import { DatabaseModule } from './config/database.config';

@Module({
  imports: [DatabaseModule, RoleModule],
})
export class AppModule {}
