import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forRoot()],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                entities: ['dist/**/*.entity.{ts,js}'],
                synchronize: false
            }),
            inject: [ConfigService]
        })
    ]
})

export class DatabaseModule {};
