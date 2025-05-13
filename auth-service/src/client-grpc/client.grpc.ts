import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from "src/auth/interface/user.interface";


export const ClientGrpcModule = ClientsModule.register([
    {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
            package: USER_PACKAGE_NAME,
            protoPath: join(__dirname, '../../src/proto/user.proto'),
            url: 'user-service:50052'
        }
    },
])