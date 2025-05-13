import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CheckExistByEmailRequest, CheckExistByEmailResponse, CheckLoginResponse, GetByIdRequest, GetByIdResponse } from '../interface/user.interface';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordRequestDto, CheckLoginRequestDto, CreateRequestDto, ResponseDataDto, ResponseDto } from '../dto/user.dto';
import { RoleService } from 'src/module/role/service/role.service';
import { RpcException } from '@nestjs/microservices';
import { RolePermissionService } from 'src/module/role-permission/service/role-permission.service';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService,
        private readonly rolePermissionService: RolePermissionService
    ) {}

    async checkExistByEmail(request: CheckExistByEmailRequest): Promise<CheckExistByEmailResponse> {
        const {email} = request;

        const user = await this.userRepository.findOne({ where: { email } });

        return {result: !!user}

    }

    async checkLogin(request: CheckLoginRequestDto): Promise<CheckLoginResponse> {

        const {email, password} = request;
        const user = await this.userRepository.findOne({
            where: {email},
            relations: ['role']
        })

        const isValidPassword = bcrypt.compareSync(password, user!.password);
        if(!isValidPassword) {
            return {
                user: null
            }
        }

        const roleId = user!.role.id;
        const data = await this.rolePermissionService.getAllPermissionByRoleId({roleId});
        const permissions = data.permission;

        return {
            user: {
                id: user!.id,
                email: user!.email,
                fullname: user!.name,
                phoneNumber: user!.phone_number,
                dob: user!.dob ? String(user!.dob) : null,
                address: user!.address,
                role: user!.role,
                permissions: permissions
            }
        }
    }


    async changePassword(id: string, request: ChangePasswordRequestDto): Promise<ResponseDto> {

        const {oldPassword, newPassword} = request;

        const user = await this.userRepository.findOne({where: {id}});
        if(!user) throw new HttpException("User not found!", HttpStatus.NOT_FOUND);

        const isPasswordMatch = bcrypt.compareSync(oldPassword, user.password)
        if(!isPasswordMatch) {
            throw new HttpException("Old password is incorrect", HttpStatus.UNAUTHORIZED)
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

        const updated = await this.userRepository.update(id, {password: hashedNewPassword})
        if(updated.affected === 0 || !updated.affected) {
            throw new HttpException("Change password unsuccessfully!", HttpStatus.FORBIDDEN)
        }

        return {
            status: HttpStatus.OK,
            message: "Change password successfully!"
        }
    }

    async getById(request: GetByIdRequest): Promise<GetByIdResponse> {

        const {id} = request;

        const user = await this.userRepository.findOne({
            where: {id},
            relations: ['role']
        })

        if(!user) throw new RpcException({
            status: HttpStatus.NOT_FOUND,
            message: "User not found"
        })

        return {
            user: {
                id: user.id,
                fullname: user.name,
                email: user.email,
                phoneNumber: user.phone_number ?? null,
                dob: user.dob ? String(user.dob) : null,
                address: user.address ?? null,
                role: user.role,
                permissions: []
            }
        }
    }

    async getAll(): Promise<ResponseDataDto<User[]>> {
        const allUser = await this.userRepository.find();
        if(allUser.length === 0) {
            throw new HttpException("Don't have any user", HttpStatus.NOT_FOUND)
        }
        return {
            status: HttpStatus.OK,
            message: "All users",
            data: allUser
        }
    }

    async create(request: CreateRequestDto): Promise<void> {
        const {email, fullname, password, roleName} = request;

        const role = await this.roleService.getByName(roleName)

        if (!role) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: `Role "${roleName}" not found`
            });
        }

        const salt: string = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = this.userRepository.create({
            email: email,
            name: fullname,
            password: hashedPassword,
            role: role
        });

        await this.userRepository.save(user);
    }

    async update(id: string, request: Partial<User>): Promise<ResponseDto> {
        const result = await this.userRepository.update(id, request)
        if(result.affected === 0 || !result.affected) {
            throw new HttpException('Update unsuccesfully!', HttpStatus.FORBIDDEN)
        }
        return {
            status: HttpStatus.OK,
            message: "Update profile successfully!"
        }
    }

    async delete(id: string): Promise<ResponseDto> {
        const removed = await this.userRepository.delete(id);
        if(removed.affected === 0 || !removed.affected) {
            throw new HttpException('Delete unsuccesfully!', HttpStatus.FORBIDDEN)
        }
        return {
            status: HttpStatus.OK,
            message: "Delete user successfully!"
        }
    }


}
