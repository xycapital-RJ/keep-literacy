import { User } from '@prisma/client';

export type GamificationSnapshot = Pick<
  User,
  'xp' | 'level' | 'currentStreak' | 'longestStreak'
>;

/**
 * ISP: responsible only for XP and streak updates on a user.
 */
export interface IGamificationRepository {
  awardXpAndUpdateStreak(
    userId: string,
    xpToAdd: number,
  ): Promise<GamificationSnapshot>;
}

export const GAMIFICATION_REPOSITORY = Symbol('GAMIFICATION_REPOSITORY');
