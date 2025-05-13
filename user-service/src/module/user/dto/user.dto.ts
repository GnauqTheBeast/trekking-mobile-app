import { IsDate, IsEmail, IsOptional, IsString } from "class-validator";
import { CreateRequest, CheckLoginRequest } from "../interface/user.interface";

export class CreateRequestDto implements CreateRequest {
    @IsEmail()
    email: string;

    @IsString()
    fullname: string;

    @IsString()
    password: string;

    @IsString()
    roleName: string;
}

export class CheckLoginRequestDto implements CheckLoginRequest {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UpdateRequestDto {
    @IsEmail()
    email: string;

    @IsString()
    fullname: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string | null;

    @IsOptional()
    @IsDate()
    dob?: Date | null;

    @IsOptional()
    @IsString()
    address?: string | null;
}

export class ChangePasswordRequestDto {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string
}

export class ResponseDto {
    status: number;
    message: string;
}

export class ResponseDataDto<T> {
    status: number;
    message: string;
    data: T | null
}