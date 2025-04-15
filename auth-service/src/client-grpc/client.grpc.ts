import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { ROLE_PERMISSION_PACKAGE_NAME, ROLE_PERMISSION_SERVICE_NAME } from "src/auth/interface/role-permission.interface";
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from "src/auth/interface/user.interface";


export const ClientGrpcModule = ClientsModule.register([
    {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
            package: USER_PACKAGE_NAME,
            protoPath: join(__dirname, '../../src/proto/user.proto'),
            url: '0.0.0.0:50052'
        }
    },
    {
        name: ROLE_PERMISSION_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
            package: ROLE_PERMISSION_PACKAGE_NAME,
            protoPath: join(__dirname, '../../src/proto/role-permission.proto'),
            url: '0.0.0.0:50054'
        }
    }
])