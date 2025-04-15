import { Controller, Inject } from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { GetRoleIdReponse, GetRoleIdRequest, GetRoleNameRequest, ROLE_SERVICE_NAME, RoleServiceController, RoleServiceControllerMethods, getRoleNameReponse } from '../interface/role.interface';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
@RoleServiceControllerMethods()
export class RoleController implements RoleServiceController {

    @Inject(RoleService)
    private readonly roleService: RoleService;


    @GrpcMethod(ROLE_SERVICE_NAME, 'getRoleId')
    async getRoleId(request: GetRoleIdRequest): Promise<GetRoleIdReponse> {
        return await this.roleService.getRoleIdByName(request);
    }

    @GrpcMethod(ROLE_SERVICE_NAME, 'getRoleName')
    async getRoleName(request: GetRoleNameRequest): Promise<getRoleNameReponse> {
        return await this.roleService.getRoleNameById(request);
    }


}
