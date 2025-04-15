import { Controller, Get, Inject, Param } from '@nestjs/common';
import { CheckLoginResponse, GetUserByIdRequest, GetUserByIdResponse, USER_SERVICE_NAME, UserServiceControllerMethods } from '../interface/user.interface';
import { UserService } from '../service/user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CheckLoginRequestDto, CreateUserRequestDto } from '../dto/user.dto';

@Controller('user')
@UserServiceControllerMethods()
export class UserController {

    @Inject(UserService)
    private readonly userService: UserService;

    @GrpcMethod(USER_SERVICE_NAME, 'createUser')
    async createUser(request: CreateUserRequestDto): Promise<void> {
        return await this.userService.createUser(request);
    }

    @GrpcMethod(USER_SERVICE_NAME, 'checkLogin')
    async checkLogin(request: CheckLoginRequestDto): Promise<CheckLoginResponse> {
        return await this.userService.checkLogin(request)
    }

    @GrpcMethod(USER_SERVICE_NAME, 'getUserById')
    async getUserById(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
        return await this.userService.getUserById(request)
    }

    @Get(':id')
    async getUserInfomation(
        @Param() id: string
    ): Promise<GetUserByIdResponse> {
        return await this.userService.getUserById({id});
    }

}
