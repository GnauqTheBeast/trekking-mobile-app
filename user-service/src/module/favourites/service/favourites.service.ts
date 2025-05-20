import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourite } from '../entities/favourites.entity';
import { Repository } from 'typeorm';
import { ResponseDTO } from '../dto/ResponseDTO';
import { TOUR_SERVICE_NAME, TourServiceClient } from 'src/interface-proto/tour.interface';
import { ClientGrpc } from '@nestjs/microservices';
import { User } from 'src/module/user/entities/user.entity';

@Injectable()
export class FavouritesService {
    private tourService: TourServiceClient;
    constructor (
        @InjectRepository(Favourite)
        private readonly favouriteRepository: Repository<Favourite>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @Inject(TOUR_SERVICE_NAME)
        private tourClient: ClientGrpc
    ) {
        this.tourService = this.tourClient.getService<TourServiceClient>(TOUR_SERVICE_NAME);
    }


    async getAllByUserId(userId: string): Promise<ResponseDTO<Favourite[]>> {

        const allFavourites = await this.favouriteRepository.find({
            where: {
                user: {
                    id: userId
                }
            }
        })

        if(allFavourites.length === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No favourites',
                data: null
            }
        }

        return {
            status: HttpStatus.OK,
            message: "Favourites",
            data: allFavourites
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
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
                data: null,
            };
        }

        const result = await this.favouriteRepository.delete({
            user: user,
            tour_id: tourId,
        });

        if (result.affected === 0) {
            return {
                status: HttpStatus.NOT_ACCEPTABLE,
                message: 'Favourite not found or already deleted',
                data: null,
            };
        }

        return {
            status: HttpStatus.OK,
            message: 'Favourite removed successfully',
            data: null,
        };
    }

}
