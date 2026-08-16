import { SlideAttempt } from '@prisma/client';

/**
 * ISP: responsible only for recording per-slide quiz attempts.
 */
export interface ISlideAttemptRepository {
  recordSlideAttempt(
    userId: string,
    slideId: string,
    selectedOption: number,
    isCorrect: boolean,
  ): Promise<SlideAttempt>;

  /** Returns the most recent attempt per slideId for a given user */
  getLatestAttemptsForSlides(
    userId: string,
    slideIds: string[],
  ): Promise<SlideAttempt[]>;
}

export const SLIDE_ATTEMPT_REPOSITORY = Symbol('SLIDE_ATTEMPT_REPOSITORY');
