import { Module } from '@nestjs/common';
import { FavouritesService } from './service/favourites.service';
import { FavouritesController } from './controller/favourites.controller';

@Module({
  providers: [FavouritesService],
  controllers: [FavouritesController]
})
export class FavouritesModule {}
