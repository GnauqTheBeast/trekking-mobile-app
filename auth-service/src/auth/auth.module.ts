import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { ClientGrpcModule } from 'src/client-grpc/client.grpc';
import { JwtService } from './service/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        ClientGrpcModule,
        JwtModule.register({
            secret: 'dev',
            signOptions: {expiresIn: '1h'}
        })
    ],
    providers: [AuthService, JwtService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}

