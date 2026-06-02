import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../database/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto): Promise<{ access_token: string }> {
    const [usernameExists, emailExists] = await Promise.all([
      this.usersService.findByUsername(payload.username),
      this.usersService.findByEmail(payload.email),
    ]);

    if (usernameExists) {
      throw new ConflictException('Username already in use');
    }

    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await this.usersService.create({
      username: payload.username,
      email: payload.email,
      passwordHash,
      createdBy: payload.username,
    });

    return this.buildToken(user);
  }

  async login(payload: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(payload.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildToken(user);
  }

  private buildToken(user: User): { access_token: string } {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      email: user.email,
    });

    return { access_token: accessToken };
  }
}
