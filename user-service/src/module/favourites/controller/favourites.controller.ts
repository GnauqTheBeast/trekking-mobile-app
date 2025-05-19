import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { FavouritesService } from '../service/favourites.service';
import { ResponseDTO } from '../dto/ResponseDTO';
import { Favourite } from '../entities/favourites.entity';

@Controller('favourites')
export class FavouritesController {

    constructor(
        @Inject()
        private readonly favourService: FavouritesService
    ){}

    @Get(':userId')
    async getAllByUserId(
        @Param('userId') userId: string
    ): Promise<ResponseDTO<Favourite[]>> {
        return await this.favourService.getAllByUserId(userId);
    }

    @Post(':userId:tourId')
    async add(
        @Param('userId') userId: string,
        @Param('tourId') tourId: string
    ): Promise<ResponseDTO<void>> {
        return await this.favourService.add(userId, tourId);
    }

    @Delete(':userId:tourId')
    async remove(
        @Param('userId') userId: string,
        @Param('tourId') tourId: string
    ): Promise<ResponseDTO<void>> {
        return await this.favourService.remove(userId, tourId);
    }

}
