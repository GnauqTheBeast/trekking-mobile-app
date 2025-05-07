import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from '../entities/role-permisson.entity';
import { RedisService } from 'src/redis/redis.service';

import { GetAllPermissionByRoleIdRequest, GetAllPermissionByRoleIdResponse } from '../interface/role-permission.interface';

@Injectable()
export class RolePermissionService {
    constructor(

        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,

        private readonly redisService: RedisService
    ){}

    async getAllPermissionByRoleId(request: GetAllPermissionByRoleIdRequest): Promise<GetAllPermissionByRoleIdResponse> {
        const {roleId} = request;

        const cacheKey = `user/permission/${roleId}`
        const cacheData = await this.redisService.get<string[]>(cacheKey);

        if(cacheData) {
            return {
                status: HttpStatus.OK,
                message: 'All permission (from cache)',
                permission: cacheData
            }
        }

        const permission = await this.rolePermissionRepository.find({
            where: {role_id: roleId},
            relations: ['permission']
        })

        if(permission.length === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Role don't have any permission!",
                permission: []
            }
        }

        const allPermission = permission.map(p => p.permission.name);

        await this.redisService.set(cacheKey, allPermission, 3600)

        return {
            status: HttpStatus.OK,
            message: 'All permission',
            permission: allPermission
        }
    }

}
