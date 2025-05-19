import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { GetRoleIdReponse, GetRoleIdRequest, GetRoleNameRequest, getRoleNameReponse } from '../../../interface-proto/role.interface';
import { RpcException } from '@nestjs/microservices';
import { CreateRequest, ResponseDataDto, ResponseDto, UpdateRequest } from '../dto/role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ){}

    async getByName(name: string): Promise<Role | null> {
        const role = await this.roleRepository.findOne({where: {name}});
        if (!role) return null;
        return role;
    }

    async getById(id: string): Promise<Role | null> {
        const role = await this.roleRepository.findOne({where: {id}});
        if(!role) return null
        return role;
    }

    async create(request: CreateRequest): Promise<ResponseDto> {
        const {name, description} = request;
        const role = this.roleRepository.create({
            name: name,
            description: description
        })
        if(!role) throw new HttpException("Create role unsuccessfully!", HttpStatus.FORBIDDEN)

        await this.roleRepository.save(role);
        return {
            status: HttpStatus.OK,
            message: 'Create role successfully!'
        }
    }

    async getAll(): Promise<ResponseDataDto> {
        const allRoles = await this.roleRepository.find();
        if(allRoles.length === 0) throw new HttpException("Can't get all role!", HttpStatus.BAD_REQUEST)

        return {
            status: HttpStatus.OK,
            message: "All roles",
            data: allRoles
        }
    }

    async update(id: string, request: UpdateRequest): Promise<ResponseDto> {
        const updated = await this.roleRepository.update(id, request);
        if(updated.affected === 0 || !updated.affected){
            throw new HttpException("Update role unsuccessfully!", HttpStatus.FORBIDDEN)
        }

        return {
            status: HttpStatus.OK,
            message: "Update role successfuly"
        }
    }

    async delete(id: string): Promise<ResponseDto> {
        const deleted = await this.roleRepository.delete(id);
        if(deleted.affected === 0 || !deleted.affected){
            throw new HttpException("Delete role unsuccessfully!", HttpStatus.FORBIDDEN)
        }

        return {
            status: HttpStatus.OK,
            message: "Delete role successfuly"
        }
    }
}
