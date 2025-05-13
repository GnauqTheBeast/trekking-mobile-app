import { Body, Controller, Delete, Get, Inject, Param, Put } from '@nestjs/common';
import { CheckExistByEmailRequest, CheckExistByEmailResponse, CheckLoginResponse, GetByIdRequest, GetByIdResponse, USER_SERVICE_NAME, UserServiceControllerMethods } from '../interface/user.interface';
import { UserService } from '../service/user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CheckLoginRequestDto, CreateRequestDto, ResponseDataDto, ResponseDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';

@Controller('user')
@UserServiceControllerMethods()
export class UserController {

    @Inject(UserService)
    private readonly userService: UserService;

    @GrpcMethod(USER_SERVICE_NAME, 'create')
    async create(request: CreateRequestDto): Promise<void> {
        return await this.userService.create(request);
    }

    @GrpcMethod(USER_SERVICE_NAME, 'getById')
    async getById(request: GetByIdRequest): Promise<GetByIdResponse> {
        return await this.userService.getById(request);
    }

    @GrpcMethod(USER_SERVICE_NAME, 'CheckExistByEmail')
    async checkExistByEmail(request: CheckExistByEmailRequest): Promise<CheckExistByEmailResponse> {
        return await this.userService.checkExistByEmail(request);
    }

    @GrpcMethod(USER_SERVICE_NAME, 'checkLogin')
    async checkLogin(request: CheckLoginRequestDto): Promise<CheckLoginResponse> {
        return await this.userService.checkLogin(request)
    }


    @Get('getInfo/:id')
    async getUserInfomation(
        @Param() id: string
    ): Promise<GetByIdResponse> {
        return await this.userService.getById({id});
    }

    @Get('getAll')
    async getAll(): Promise<ResponseDataDto<User[]>> {
        return await this.userService.getAll();
    }

    @Put('update/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() request: Partial<User>
    ): Promise<ResponseDto> {
        return await this.userService.update(id, request)
    }

    @Delete('delete/:id')
    async deleteUser(
        @Param('id') id: string
    ): Promise<ResponseDto> {
        return await this.userService.delete(id);
    }

}
