import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { GetRoleIdReponse, GetRoleIdRequest, GetRoleNameRequest, getRoleNameReponse } from '../interface/role.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ){}

    async getRoleIdByName(request: GetRoleIdRequest): Promise<GetRoleIdReponse> {
        const { roleName } = request;
        const role = await this.roleRepository.findOne({where: {name: roleName}});
        if (!role) {
            throw new RpcException({
                code: 404,
                message: `Role not found`,
              });
        }
        return {
            roleId: role.id
        }
    }

    async getRoleNameById(request: GetRoleNameRequest): Promise<getRoleNameReponse> {
        const {roleId} = request;
        const role = await this.roleRepository.findOne({where: {id: roleId}});
        if(!role) throw new RpcException('Role not found');
        return {
            roleName: role.name
        }
    }
}
