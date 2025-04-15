import { Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService as Jwt} from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../interface/user.interface';

@Injectable()
export class JwtService {

    constructor(
        private readonly jwt: Jwt
    ){}

    public checkPassword(password: string, userPassword: string): boolean {
        return bcrypt.compareSync(password, userPassword);
    }

    public generateToken(user: User): string {
        return this.jwt.sign(
            {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                roleId: user.roleId,
                roleName: user.roleName
            }
        )
    }

    public encodePassword(password: string): string {
        const salt: string = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    public async verifyToken(token: string): Promise<object> {
        try {
            const decoded = await this.jwt.verifyAsync(token);
            return decoded;
        } catch (error) {
            throw new Error(error)
        }
      }

}
