import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { JwtService } from './jwt.service';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../interface/auth.interface';
import { LoginRequestDto, RegisterRequestDto, ValidateRequestDto } from '../dto/auth.dto';
import { USER_SERVICE_NAME, UserServiceClient } from '../interface/user.interface';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OtpService } from 'src/otp/otp.service';
import { sendOtp } from 'src/util/mail.util';
import { RedisService } from 'src/redis/redis.service';



@Injectable()
export class AuthService {
    private userService: UserServiceClient;
    constructor (
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
        private readonly redisService: RedisService,

        @Inject(USER_SERVICE_NAME)
        private readonly userClient: ClientGrpc,


    ) {
        this.userService = this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    public async register (
        {email, fullname, password, roleName}: RegisterRequestDto
    ) : Promise<RegisterResponse> {

        const data = await firstValueFrom(
            this.userService.checkExistByEmail({email})
        )
        console.log(data)
        if(data.result) {
            throw new HttpException("Email already exist!", HttpStatus.CONFLICT)
        }

        const otp = this.otpService.generateOtp();
        await this.otpService.saveOtp(email, otp);
        await sendOtp(email, otp)

        const key = `user:info:${email}`;
        await this.redisService.set(key, {fullname, password, roleName}, 300)

        return {
            status: HttpStatus.OK,
            message: 'Fill Otp!'
        }
    }

    async verifyOtp(email: string, otp: string): Promise<RegisterResponse> {
        await this.otpService.verifyOtp(email, otp);

        const key = `user:info:${email}`;
        const user = await this.redisService.get<{
            fullname: string,
            password: string,
            roleName: string
        }>(key);

        if (!user) {
            throw new BadRequestException('User data not found. Please register again.');
        }

        const { fullname, password, roleName } = user;

        await firstValueFrom(
            this.userService.create({
                email,
                fullname,
                password,
                roleName
            })
        );

        await this.redisService.del(key);

        return {
            status: HttpStatus.CREATED,
            message: 'User registered successfully!',
        };
    }

    async resendOtp(email: string): Promise<void> {
        const otp = this.otpService.generateOtp();
        await this.otpService.saveOtp(email, otp);
        await sendOtp(email, otp)
    }

    public async login(
        { email, password }: LoginRequestDto
    ): Promise<LoginResponse>{

        const checkEmailExist = await firstValueFrom(
            this.userService.checkExistByEmail({ email })
        )
        if(!checkEmailExist.result) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'Invalid email or password!',
                token: null,
                user: null
            }
        }

        const data = await firstValueFrom(
            this.userService.checkLogin({email, password})
        )

        const user = data.user;
        if(!user) {
            return {
                status: HttpStatus.NOT_ACCEPTABLE,
                message: 'Invalid email or password!',
                token: null,
                user: null
            }
        }

        const token = this.jwtService.generateToken(user);

        return {
            status: HttpStatus.OK,
            message: 'Login successfully!',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                phoneNumber: user.phoneNumber,
                dob: String(user.dob),
                address: user.address,
                role: user.role,
                permissions: user.permissions
            }
        }
    }

    public async validate (
        request: ValidateRequestDto
    ) : Promise<ValidateResponse> {

        const {token} = request

        const decoded: {[key: string]: any} | string = await this.jwtService.verifyToken(token);

        if(!decoded || typeof decoded === 'string'){
            return {
                status: HttpStatus.FORBIDDEN,
                message: 'Token is invalid!',
                id: null,
                role: null,
                permissions: null,
            }
        }

        console.log(decoded)

        return {
            status: HttpStatus.OK,
            message: 'Verified!',
            id: decoded.id,
            role: decoded.roleName,
            permissions: decoded.permissions
        }
    }
}
