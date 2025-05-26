import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ChangeEmailRequest, ChangeEmailResponse, CheckExistByEmailRequest, CheckExistByEmailResponse, CheckLoginResponse, GetByIdRequest, GetByIdResponse } from '../../../interface-proto/user.interface';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordRequestDto, CheckLoginRequestDto, CreateRequestDto, ResetPasswordRequestDto, ResponseDataDto, ResponseDto } from '../dto/user.dto';
import { RoleService } from 'src/module/role/service/role.service';
import { RpcException } from '@nestjs/microservices';
import { RolePermissionService } from 'src/module/role-permission/service/role-permission.service';
import { Host } from 'src/module/favourites/dto/ResponseDTO';

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
                fullname: user!.fullname,
                phoneNumber: user!.phoneNumber ?? null,
                dob: user!.dob ? String(user!.dob) : null,
                address: user!.address,
                gender: user!.gender ?? null,
                image: user!.image ?? null,
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

    async resetPassword(request: ResetPasswordRequestDto): Promise<ResponseDto> {
        const {email, newPassword} = request;

        const user = await this.userRepository.findOne({where: {email}});
        if(!user) throw new HttpException("Invalid email, please try again.", HttpStatus.NOT_FOUND);

        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

        const updated = await this.userRepository.update({email}, {password: hashedNewPassword})
        if(updated.affected === 0 || !updated.affected) {
            throw new HttpException("Change password unsuccessfully!", HttpStatus.FORBIDDEN)
        }

        return {
            status: HttpStatus.OK,
            message: "Reset password successfully!"
        }
    }

    async changeEmail(request: ChangeEmailRequest): Promise<ChangeEmailResponse> {
        const {id, newEmail} = request;
        const result = await this.userRepository.update({id}, {email: newEmail})
        if(result.affected === 0 || !result.affected) {
            throw new RpcException('Update not successfully!')
        }
        return {
            result: true
        };
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
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber ?? null,
                dob: user.dob ? String(user.dob) : null,
                address: user.address ?? null,
                gender: user.gender ?? null,
                image: user.gender ?? null,
                role: user.role,
                permissions: []
            }
        }
    }


    async getHostById(id: string): Promise<Host> {

        const user = await this.userRepository.findOne({
            where: {id},
            relations: ['role']
        })

        if(!user) throw new RpcException({
            status: HttpStatus.NOT_FOUND,
            message: "User not found"
        })

        return {
            id: user.id,
            name: user.fullname,
            image: user.image ?? null,

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
            fullname: fullname,
            password: hashedPassword,
            role: role
        });

        await this.userRepository.save(user);
    }

    async update(id: string, request: Partial<User>): Promise<ResponseDto> {
        console.log(id)
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
