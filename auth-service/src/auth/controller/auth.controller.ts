import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import {GrpcMethod} from '@nestjs/microservices'
import {AUTH_SERVICE_NAME, AuthServiceController, AuthServiceControllerMethods, LoginResponse, RegisterResponse, ValidateResponse } from "../interface/auth.interface";
import { LoginRequestDto, RegisterRequestDto, ValidateRequestDto } from "../dto/auth.dto";

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('register')
    async register(
        @Body() request: RegisterRequestDto
    ): Promise<RegisterResponse> {
        return await this.authService.register(request)
    }

    @Post('login')
    async login(
        @Body() request: LoginRequestDto
    ): Promise<LoginResponse> {
        return await this.authService.login(request);
    }

    @Post('test')
    async test(
        @Body() request: ValidateRequestDto
    ): Promise<ValidateResponse> {
        return await this.authService.validate(request);
    }

    @GrpcMethod(AUTH_SERVICE_NAME, 'validate')
    async validate(
        request: ValidateRequestDto
    ): Promise<ValidateResponse> {
        return await this.authService.validate(request);
    }

}