import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private JwtService: JwtService
    ){}

    async signup(authCredentials: AuthCredentialsDTO): Promise<void>{
        return await this.userRepository.signUp(authCredentials);
    }

    async signin(authCredentials: AuthCredentialsDTO): Promise<{accessToken:string}>{
        const username = await this.userRepository.validateUserPassword(authCredentials);
        
        if(!username){
            throw new UnauthorizedException('Invalid credentials.');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.JwtService.sign(payload);

        this.logger.debug(`Generated JWT Token with payload: ${JSON.stringify(payload)}`);

        return { accessToken };
    }
}
