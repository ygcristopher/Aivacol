import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(payload: RegisterDto): Promise<{
        access_token: string;
    }>;
    login(payload: LoginDto): Promise<{
        access_token: string;
    }>;
    private buildToken;
}
