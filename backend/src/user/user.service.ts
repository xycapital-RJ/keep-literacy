import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../auth/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../auth/repositories/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async getStats(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }

    return {
      xp: user.xp,
      level: user.level,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    };
  }
}
