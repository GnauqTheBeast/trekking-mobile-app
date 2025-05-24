import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { FavouritesService } from '../service/favourites.service';
import { FavoriteProps, ResponseDTO } from '../dto/ResponseDTO';
import { Favorite } from '../entities/favourites.entity';
import { TourResp } from 'src/interface-proto/tour.interface';

@Controller('favourites')
export class FavouritesController {

    constructor(
        @Inject()
        private readonly favourService: FavouritesService
    ){}

    @Get(':userId')
    async getAllByUserId(
        @Param('userId') userId: string
    ): Promise<ResponseDTO<FavoriteProps[]>> {
        return await this.favourService.getAllByUserId(userId);
    }

    @Post(':userId/:tourId')
    async add(
        @Param('userId') userId: string,
        @Param('tourId') tourId: string
    ): Promise<ResponseDTO<void>> {
        return await this.favourService.add(userId, tourId);
    }

    @Delete(':userId/:tourId')
    async remove(
        @Param('userId') userId: string,
        @Param('tourId') tourId: string
    ): Promise<ResponseDTO<void>> {
        return await this.favourService.remove(userId, tourId);
    }

    @Get('check/:userId/:tourId')
    async check(
        @Param('userId') userId: string,
        @Param('tourId') tourId: string
    ): Promise<boolean> {
        return await this.favourService.check(userId, tourId);
    }

}
