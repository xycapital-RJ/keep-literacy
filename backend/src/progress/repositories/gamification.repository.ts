import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { computeLevel, isDifferentDay } from '../gamification.utils';
import {
  GamificationSnapshot,
  IGamificationRepository,
} from './gamification.repository.interface';

@Injectable()
export class GamificationRepository implements IGamificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async awardXpAndUpdateStreak(
    userId: string,
    xpToAdd: number,
  ): Promise<GamificationSnapshot> {
    const now = new Date();

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        xp: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveAt: true,
      },
    });

    const newXp = user.xp + xpToAdd;
    const newLevel = computeLevel(newXp);

    // Increment streak only when crossing into a new calendar day
    let newStreak = user.currentStreak;
    if (!user.lastActiveAt || isDifferentDay(user.lastActiveAt, now)) {
      newStreak += 1;
    }
    const newLongest = Math.max(user.longestStreak, newStreak);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveAt: now,
      },
      select: {
        xp: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
      },
    });
  }
}
