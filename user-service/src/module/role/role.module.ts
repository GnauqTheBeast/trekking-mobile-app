import { Module } from '@nestjs/common';
import { RoleService } from './service/role.service';
import { RoleController } from './controller/role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role])
    ],
    providers: [RoleService],
    controllers: [RoleController],
    exports: [RoleService]
})
export class RoleModule {}
