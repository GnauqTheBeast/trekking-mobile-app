import { Body, Controller, Headers, Post } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import {GrpcMethod} from '@nestjs/microservices'
import {AUTH_SERVICE_NAME, AuthServiceController, AuthServiceControllerMethods, LoginResponse, RegisterResponse, ValidateResponse } from "../interface/auth.interface";
import { LoginRequestDto, RegisterRequestDto, ResponseDto, ValidateRequestDto } from "../dto/auth.dto";

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

    @Post('otp')
    async verifyOTP(
        @Body() { email, otp }: { email: string, otp: string }
    ): Promise<RegisterResponse> {
        return await this.authService.verifyOtp(email, otp)
    }

    @Post('resend-otp')
    async resendOtp(
        @Body() { email }: { email: string }
    ): Promise<void> {
        return await this.authService.resendOtp(email);
    }

    @Post('forgot-password')
    async forgotPassword(
        @Body('email') email: string
    ): Promise<ResponseDto> {
        return this.authService.forgotPassword(email);
    }

    @Post('forgot/otp')
    async verifyForgotOtp(
        @Body() {email, otp}: {email: string, otp: string}
    ): Promise<ResponseDto> {
        return this.authService.verifyForgotOtp(email, otp);
    }

    @Post('change-email')
    async changeEmail(
        @Body('email') email : string,
        @Headers('authorization') authHeader: string
    ): Promise<ResponseDto> {
        return await this.authService.changeEmail(email, authHeader);
    }

    @Post('change-email/otp')
    async verifyChangeEmailOtp(
        @Body() {email, otp}: {email: string, otp: string}
    ): Promise<ResponseDto> {
        return this.authService.verifyChangeEmailOtp(email, otp);
    }


    @GrpcMethod(AUTH_SERVICE_NAME, 'validate')
    async validate(
        request: ValidateRequestDto
    ): Promise<ValidateResponse> {
        return await this.authService.validate(request);
    }

}