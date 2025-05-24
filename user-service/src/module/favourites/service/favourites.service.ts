import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from '../entities/favourites.entity';
import { Repository } from 'typeorm';
import { FavoriteProps, ResponseDTO } from '../dto/ResponseDTO';
import { TOUR_SERVICE_NAME, TourResp, TourServiceClient } from 'src/interface-proto/tour.interface';
import { ClientGrpc } from '@nestjs/microservices';
import { User } from 'src/module/user/entities/user.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FavouritesService {
    private tourService: TourServiceClient;
    constructor (
        @InjectRepository(Favorite)
        private readonly favouriteRepository: Repository<Favorite>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @Inject(TOUR_SERVICE_NAME)
        private tourClient: ClientGrpc
    ) {
        this.tourService = this.tourClient.getService<TourServiceClient>(TOUR_SERVICE_NAME);
    }


    async getAllByUserId(userId: string): Promise<ResponseDTO<FavoriteProps[]>> {

        const allFavourites = await this.favouriteRepository.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ['user']
        })

        if(allFavourites.length === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No favourites',
                data: null
            }
        }

        const favourites: FavoriteProps[] = [];
        for(const fav of allFavourites) {
            try {
                const tour: TourResp = await firstValueFrom(
                    this.tourService.checkTourExist({ tourId: fav.tour_id })
                );
                const {tourId, hostId, ...tmp} = tour;
                const favTmp: FavoriteProps = {
                    ...tmp,
                    id: tourId,
                    images: JSON.parse(tour.images),
                    total_slot: tour.slot,
                    available_slot: tour.availableSlot,
                    host: {
                        id: fav.user.id,
                        name: fav.user.fullname,
                        image: fav.user.image
                }}
                if(tour.status === 'PUBLISHED') favourites.push(favTmp);
                else await this.favouriteRepository.delete({tour_id: fav.tour_id})
            } catch (error) {
                await this.favouriteRepository.delete({ id: fav.id });
            }
        }

        return {
            status: HttpStatus.OK,
            message: "Favourites",
            data: favourites
        }
    }

    async add(userId: string, tourId: string): Promise<ResponseDTO<void>> {
        const user = await this.userRepository.findOne({
            where: {id: userId}
        })

        if(!user) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Not found user",
                data: null
            }
        }

        const favourite = this.favouriteRepository.create({
            user: user,
            tour_id: tourId
        })

        await this.favouriteRepository.save(favourite);

        return {
            status: HttpStatus.OK,
            message: 'Add successfully!',
            data: null
        }
    }

    async remove(userId: string, tourId: string): Promise<ResponseDTO<void>> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        const result = await this.favouriteRepository.delete({
            user: user,
            tour_id: tourId,
        });

        if (result.affected === 0) {
            throw new HttpException('Favourite not found or already deleted', HttpStatus.NOT_ACCEPTABLE)
        }

        return {
            status: HttpStatus.OK,
            message: 'Favourite removed successfully',
            data: null,
        };
    }

    async check(userId: string, tourId: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        const fav = await this.favouriteRepository.findOne({
            where: {
                user: {id: user.id},
                tour_id: tourId
            }
        });
        if(!fav) return false;
        return true;
    }

}
