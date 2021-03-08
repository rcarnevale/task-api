import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('/signup')
    signup(@Body(ValidationPipe) authCredentials: AuthCredentialsDTO): Promise<void>{
        return this.authService.signup(authCredentials)
    }

    @Post('/signin')
    signin(@Body(ValidationPipe) authCredentials: AuthCredentialsDTO): Promise<{accessToken:string}>{
        return this.authService.signin(authCredentials);
    }
}
