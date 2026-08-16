import { Injectable } from '@nestjs/common';
import { SlideAttempt } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ISlideAttemptRepository } from './slide-attempt.repository.interface';

@Injectable()
export class SlideAttemptRepository implements ISlideAttemptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async recordSlideAttempt(
    userId: string,
    slideId: string,
    selectedOption: number,
    isCorrect: boolean,
  ): Promise<SlideAttempt> {
    return this.prisma.slideAttempt.create({
      data: { userId, slideId, selectedOption, isCorrect },
    });
  }

  /**
   * Returns the most recent attempt per slideId for a given user.
   * Used to calculate the lesson score at completion time.
   */
  async getLatestAttemptsForSlides(
    userId: string,
    slideIds: string[],
  ): Promise<SlideAttempt[]> {
    if (slideIds.length === 0) return [];

    // Fetch all attempts for these slides by this user, most recent first
    const attempts = await this.prisma.slideAttempt.findMany({
      where: { userId, slideId: { in: slideIds } },
      orderBy: { attemptedAt: 'desc' },
    });

    // Keep only the latest attempt per slide
    const seen = new Set<string>();
    const latest: SlideAttempt[] = [];

    for (const attempt of attempts) {
      if (!seen.has(attempt.slideId)) {
        seen.add(attempt.slideId);
        latest.push(attempt);
      }
    }

    return latest;
  }
}
