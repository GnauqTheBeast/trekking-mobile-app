import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { GetRoleIdReponse, GetRoleIdRequest, GetRoleNameRequest, ROLE_SERVICE_NAME, RoleServiceController, RoleServiceControllerMethods, getRoleNameReponse } from '../../../interface-proto/role.interface';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateRequest, ResponseDataDto, ResponseDto, UpdateRequest } from '../dto/role.dto';

@Controller('role')
// @RoleServiceControllerMethods()
export class RoleController {

    @Inject(RoleService)
    private readonly roleService: RoleService;


    // @GrpcMethod(ROLE_SERVICE_NAME, 'getRoleId')
    // async getRoleId(request: GetRoleIdRequest): Promise<GetRoleIdReponse> {
    //     return await this.roleService.getRoleIdByName(request);
    // }

    // @GrpcMethod(ROLE_SERVICE_NAME, 'getRoleName')
    // async getRoleName(request: GetRoleNameRequest): Promise<getRoleNameReponse> {
    //     return await this.roleService.getRoleNameById(request);
    // }

    @Post('create')
    async create(
        @Body()request: CreateRequest
    ): Promise<ResponseDto> {
        return await this.roleService.create(request);
    }

    @Get('getAll')
    async getAll(): Promise<ResponseDataDto> {
        return await this.roleService.getAll();
    }

    @Put('update/:id')
    async update(
        @Param('id') id: string,
        @Body() request: UpdateRequest
    ): Promise<ResponseDto> {
        return await this.roleService.update(id, request);
    }

    @Delete('delete/:id')
    async delete(
        @Param('id') id: string
    ): Promise<ResponseDto> {
        return await this.roleService.delete(id);
    }

}
