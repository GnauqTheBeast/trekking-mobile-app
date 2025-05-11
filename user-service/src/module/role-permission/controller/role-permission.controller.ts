import { Body, Controller, Post } from '@nestjs/common';
import { GetAllPermissionByRoleIdRequest, GetAllPermissionByRoleIdResponse, ROLE_PERMISSION_SERVICE_NAME, RolePermissionServiceControllerMethods } from '../interface/role-permission.interface';
import { RolePermissionService } from '../service/role-permission.service';
import { GrpcMethod } from '@nestjs/microservices';


@Controller('role-permission')
@RolePermissionServiceControllerMethods()
export class RolePermissionController {
    constructor(
        private readonly rolePermissionService: RolePermissionService
    ){}

    @GrpcMethod(ROLE_PERMISSION_SERVICE_NAME, 'getAllPermissionByRoleId')
    async getAllPermissionByRoleId(request: GetAllPermissionByRoleIdRequest): Promise<GetAllPermissionByRoleIdResponse> {
        return this.rolePermissionService.getAllPermissionByRoleId(request);
    }

    @Post('get-all')
    async getAllPermissionByRoleIdApi(@Body() request: GetAllPermissionByRoleIdRequest): Promise<GetAllPermissionByRoleIdResponse> {
    return this.rolePermissionService.getAllPermissionByRoleId(request);
  }

}
