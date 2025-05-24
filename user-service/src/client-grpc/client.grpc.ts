import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { PB_PACKAGE_NAME, TOUR_SERVICE_NAME } from "src/interface-proto/tour.interface";


export const ClientGrpcModule = ClientsModule.register([
    {
        name: TOUR_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
            package: PB_PACKAGE_NAME,
            protoPath: join(__dirname, '../../src/proto/tour.proto'),
            url: '0.0.0.0:50051'
        }
    },
])