import { Injectable } from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ILessonProgressRepository,
  UpsertProgressResult,
} from './lesson-progress.repository.interface';

@Injectable()
export class LessonProgressRepository implements ILessonProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertProgress(
    userId: string,
    lessonId: string,
    status: ProgressStatus,
    score?: number,
  ): Promise<UpsertProgressResult> {
    const now = new Date();
    const isCompleted = status === ProgressStatus.COMPLETED;

    // Use a transaction: try INSERT first, if conflict UPDATE and return
    // the previous status so we can detect first completion atomically.
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Read existing (inside transaction for consistency)
      const existing = await tx.userProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
        select: { id: true, status: true },
      });

      const wasAlreadyCompleted =
        existing?.status === ProgressStatus.COMPLETED;

      let progress;

      if (!existing) {
        // First time — create
        progress = await tx.userProgress.create({
          data: {
            userId,
            lessonId,
            status,
            score,
            startedAt: now,
            completedAt: isCompleted ? now : null,
          },
        });
      } else {
        // Already exists — update
        progress = await tx.userProgress.update({
          where: { userId_lessonId: { userId, lessonId } },
          data: {
            status,
            ...(score !== undefined && { score }),
            // Only stamp completedAt the first time it completes
            ...(!wasAlreadyCompleted && isCompleted && { completedAt: now }),
          },
        });
      }

      return { progress, isFirstCompletion: isCompleted && !wasAlreadyCompleted };
    });

    return result;
  }
}
