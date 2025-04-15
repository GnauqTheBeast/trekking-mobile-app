import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './config/database.config';

@Module({
  imports: [DatabaseModule , UserModule],
})
export class AppModule {}
