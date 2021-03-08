import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

import { User } from "./user.entity";
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authCredentials: AuthCredentialsDTO): Promise<void> {
        const { username, password } = authCredentials;

        const salt = await bcrypt.genSalt();

        const user = new User();
        user.username = username;
        user.password = await this.hashPassword(password, salt);
        user.salt = salt;

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') { //duplicate username
                throw new ConflictException('Username already exists.')
            } else {
                throw new InternalServerErrorException()
            };
        }
    }

    async validateUserPassword(authCredentials: AuthCredentialsDTO): Promise<string>{
        const { username, password } = authCredentials;
        const user = await this.findOne({username});
        
        if(user && await user.validatePassword(password)){
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string>{
        return await bcrypt.hash(password, salt)
    }
}