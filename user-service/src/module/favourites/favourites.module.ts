import { Module } from '@nestjs/common';
import { FavouritesService } from './service/favourites.service';
import { FavouritesController } from './controller/favourites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favourites.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { ClientGrpcModule } from 'src/client-grpc/client.grpc';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    TypeOrmModule.forFeature([User]),
    ClientGrpcModule,
    UserModule
  ],
  providers: [FavouritesService],
  controllers: [FavouritesController],
  exports: [FavouritesService]
})
export class FavouritesModule {}
