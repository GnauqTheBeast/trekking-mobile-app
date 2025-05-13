import { IsEmail, IsString } from "class-validator";
import { LoginRequest, RegisterRequest, ValidateRequest } from "../interface/auth.interface";

export class LoginRequestDto implements LoginRequest {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}

export class RegisterRequestDto implements RegisterRequest {
    @IsEmail()
    email: string;
    @IsString()
    fullname: string;
    @IsString()
    password: string;
    @IsString()
    roleName: string;
}

export class ValidateRequestDto implements ValidateRequest {
    @IsString()
    token: string;
}

