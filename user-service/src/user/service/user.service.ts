import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { ROLE_SERVICE_NAME, RoleServiceClient } from '../interface/role.interface';
import { CheckLoginResponse, GetUserByIdRequest, GetUserByIdResponse } from '../interface/user.interface';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { CheckLoginRequestDto, CreateUserRequestDto } from '../dto/user.dto';

@Injectable()
export class UserService {
    private roleService: RoleServiceClient;
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(ROLE_SERVICE_NAME)
        private readonly client: ClientGrpc,
    ){
        this.roleService = this.client.getService<RoleServiceClient>(ROLE_SERVICE_NAME)
    }

    async createUser(request: CreateUserRequestDto): Promise<void> {
        const {email, fullname, password, roleName} = request;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new RpcException({
                status: HttpStatus.CONFLICT,
                message: "Email already exist!"
            });
        }

        const role = await firstValueFrom(
            this.roleService.getRoleId({ roleName: roleName }),
          ).catch((error) => {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: error
            })
          });

        const salt: string = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);

        const user = this.userRepository.create({
            email: email,
            name: fullname,
            password: hashedPassword,
            role_id: role.roleId,
        });

        await this.userRepository.save(user);
    }

    async checkLogin(request: CheckLoginRequestDto): Promise<CheckLoginResponse> {

        const {email, password} = request;
        const user = await this.userRepository.findOne({
            where: {email},
        })

        if(!user) {
            console.log('Not found user')
            return {
                user: undefined
            }
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if(!isValidPassword) {
            console.log("Not valid password")
            return { user: undefined }
        }

        const data = await firstValueFrom(
            this.roleService.getRoleName({roleId: user.role_id})
        ).catch(err => {throw new Error(`Failed to get role: ${err.message}`)})

        return {
            user: {
                id: user.id,
                email: user.email,
                fullname: user.name,
                roleId: user.role_id,
                roleName: data.roleName
            }
        }
    }

    async getUserById(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {

        console.log("request: ", request)
        const {id} = request;

        console.log("id: ", id)
        const user = await this.userRepository.findOne({
            where: {id}
        })

        if(!user) {
            return {user: undefined}
        }

        return {
            user: {
                id: user.id,
                fullname: user.name,
                email: user.email,
                phoneNumber: user.phone_number ?? null,
                dob: user.dob ? String(user.dob) : null,
                address: user.address ?? null
            }
        }
    }

}
