import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { JwtService } from './jwt.service';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../interface/auth.interface';
import { LoginRequestDto, RegisterRequestDto, ValidateRequestDto } from '../dto/auth.dto';
import { USER_SERVICE_NAME, UserServiceClient } from '../interface/user.interface';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ROLE_PERMISSION_SERVICE_NAME, RolePermissionServiceClient } from '../interface/role-permission.interface';



@Injectable()
export class AuthService {
    private userService: UserServiceClient;
    private rolePermissionService: RolePermissionServiceClient;
    constructor (
        private readonly jwtService: JwtService,

        @Inject(USER_SERVICE_NAME)
        private readonly userClient: ClientGrpc,

        @Inject(ROLE_PERMISSION_SERVICE_NAME)
        private readonly rolePermissionClient: ClientGrpc,

    ) {
        this.userService = this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
        this.rolePermissionService = this.rolePermissionClient.getService<RolePermissionServiceClient>(ROLE_PERMISSION_SERVICE_NAME);
    }

    public async register (
        {email, fullname, password, roleName}: RegisterRequestDto
    ) : Promise<RegisterResponse> {
        try {
            await firstValueFrom(
                this.userService.createUser({
                    email, fullname, password, roleName
                })
            )
            return {
                status: HttpStatus.OK,
                message: 'Register succesfully!'
            }
        }
        catch(err) {
            const {status, message} = err.response;
            return {
                status,
                message,
            }
        }
    }

    public async login(
        { email, password }: LoginRequestDto
    ): Promise<LoginResponse>{

        const data = await firstValueFrom(
            this.userService.checkLogin({ email, password })
        )

        if(!data.user) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'Invalid email or password!',
                token: ''
            }
        }

        const token = await this.jwtService.generateToken(data.user);

        return {
            status: HttpStatus.OK,
            message: 'Login successfully!',
            token: token,
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
        console.log(decoded.id)

        const dataUser = await firstValueFrom(
            this.userService.getUserById({id: decoded.id})
        )

        if(!dataUser.user) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
                id: null,
                role: null,
                permissions: null,
            }
        }

        console.log("data:", dataUser)

        const data = await firstValueFrom(
            this.rolePermissionService.getAllPermissionByRoleId({roleId: decoded.roleId})
        )

        const permissions = data.permission;

        return {
            status: HttpStatus.OK,
            message: 'Verified!',
            id: decoded.id,
            role: decoded.roleName,
            permissions: permissions
        }
    }
}
