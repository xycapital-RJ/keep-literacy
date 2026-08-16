import { ProgressStatus, UserProgress } from '@prisma/client';

export interface UpsertProgressResult {
  progress: UserProgress;
  /** True only when status just changed TO completed for the first time */
  isFirstCompletion: boolean;
}

/**
 * ISP: responsible only for persisting lesson-level progress records.
 */
export interface ILessonProgressRepository {
  upsertProgress(
    userId: string,
    lessonId: string,
    status: ProgressStatus,
    score?: number,
  ): Promise<UpsertProgressResult>;
}

export const LESSON_PROGRESS_REPOSITORY = Symbol('LESSON_PROGRESS_REPOSITORY');
