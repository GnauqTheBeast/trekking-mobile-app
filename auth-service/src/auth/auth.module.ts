import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { ClientGrpcModule } from 'src/client-grpc/client.grpc';
import { JwtService } from './service/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { RedisService } from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisConfig } from 'src/redis/redis.config';

@Module({
    imports: [
        ClientGrpcModule,
        JwtModule.register({
            secret: 'dev',
            signOptions: {expiresIn: '30d'}
        }),
        RedisModule
    ],
    providers: [AuthService, JwtService, OtpService, RedisService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}

