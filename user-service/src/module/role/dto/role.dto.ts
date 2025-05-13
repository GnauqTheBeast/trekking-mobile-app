import { IsOptional, IsString } from "class-validator";
import { Role } from "../entities/role.entity";

export class CreateRequest {
    @IsString()
    name: string

    @IsString()
    @IsOptional()
    description: string
}

export class UpdateRequest {
    @IsString()
    name: string

    @IsString()
    @IsOptional()
    description: string
}

export class ResponseDto {
    status: number;
    message: string
}

export class ResponseDataDto {
    status: number;
    message: string;
    data: Role[]
}
