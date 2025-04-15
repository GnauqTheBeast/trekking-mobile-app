import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { ROLE_PACKAGE_NAME, ROLE_SERVICE_NAME } from "../user/interface/role.interface";


export const ClientGrpcModule = ClientsModule.register([{
    name: ROLE_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
        package: ROLE_PACKAGE_NAME,
        protoPath: join(__dirname, '../../src/proto/role.proto'),
        url: '0.0.0.0:50053'
    }
}])