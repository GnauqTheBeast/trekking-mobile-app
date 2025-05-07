import { BadRequestException, Injectable } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class OtpService {

    constructor(
        private readonly redisService: RedisService
    ){}

    generateOtp(): string {
        let result = '';
        for(let i=0;i<6;i++){
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    async saveOtp(email: string, otp: string): Promise<void> {
        const key = `otp:${email}`
        await this.redisService.set(key, otp, 300)
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const key = `otp:${email}`;
        const attemptsKey = `otp:attempts:${email}`;

        const storedOtp = await this.redisService.get<string>(key);
        if(!storedOtp){
            throw new BadRequestException("Expired OTP. Please try requesting a new OTP.")
        }

        const attempts = await this.redisService.get<number>(attemptsKey) || 0;

        if(storedOtp !== otp) {
            if(attempts + 1 === 5){
                await this.redisService.del(key);
                await this.redisService.del(attemptsKey);
                throw new BadRequestException("Too many failed OTP attempts. Please try again later.")
            }
            await this.redisService.set(attemptsKey, attempts + 1, 300);
            throw new BadRequestException("Invalid OTP. Please try again later.")
        }

        await this.redisService.del(key);
        await this.redisService.del(attemptsKey);

        return true;

    }

}