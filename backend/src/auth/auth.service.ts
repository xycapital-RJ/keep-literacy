import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from './repositories/user.repository.interface';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  // ── register ────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with that email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.userRepo.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
      displayName: dto.displayName,
    });

    // Auto-enroll in all published courses so new users see content immediately
    await this.userRepo.enrollInAllPublishedCourses(user.id);

    return this.buildAuthResponse(user.id, user.email, user.displayName);
  }

  // ── login ────────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user.id, user.email, user.displayName);
  }

  // ── helpers ──────────────────────────────────────────────────────────────────

  private buildAuthResponse(
    userId: string,
    email: string,
    displayName: string | null | undefined,
  ) {
    const payload: JwtPayload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: { id: userId, email, displayName: displayName ?? null },
    };
  }
}
