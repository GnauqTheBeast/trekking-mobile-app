import { IsEmail, IsString } from "class-validator";
import { CreateUserRequest, CheckLoginRequest } from "../interface/user.interface";

export class CreateUserRequestDto implements CreateUserRequest {
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