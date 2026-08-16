import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';

import type { ILessonProgressRepository } from './repositories/lesson-progress.repository.interface';
import { LESSON_PROGRESS_REPOSITORY } from './repositories/lesson-progress.repository.interface';
import type { IGamificationRepository } from './repositories/gamification.repository.interface';
import { GAMIFICATION_REPOSITORY } from './repositories/gamification.repository.interface';
import type { ISlideAttemptRepository } from './repositories/slide-attempt.repository.interface';
import { SLIDE_ATTEMPT_REPOSITORY } from './repositories/slide-attempt.repository.interface';
import type { ILessonRepository } from '../lesson/repositories/lesson.repository.interface';
import { LESSON_REPOSITORY } from '../lesson/repositories/lesson.repository.interface';

import { SaveProgressDto } from './dto/save-progress.dto';
import { RecordAttemptDto } from './dto/record-attempt.dto';

@Injectable()
export class ProgressService {
  constructor(
    @Inject(LESSON_PROGRESS_REPOSITORY)
    private readonly lessonProgressRepo: ILessonProgressRepository,

    @Inject(GAMIFICATION_REPOSITORY)
    private readonly gamificationRepo: IGamificationRepository,

    @Inject(SLIDE_ATTEMPT_REPOSITORY)
    private readonly slideAttemptRepo: ISlideAttemptRepository,

    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepo: ILessonRepository,
  ) {}

  // ── POST /lessons/:lessonId/progress ────────────────────────────────────────

  async saveLessonProgress(lessonId: string, dto: SaveProgressDto) {
    const lesson = await this.lessonRepo.findByIdWithSlides(lessonId);

    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${lessonId}" not found`);
    }

    const status = dto.status ?? ProgressStatus.COMPLETED;

    // ── Calculate score from quiz attempts ──────────────────────────────────
    // Count quiz slides in this lesson, then count how many the user got right
    let score: number | undefined;

    if (status === ProgressStatus.COMPLETED) {
      const quizSlides = lesson.slides.filter((s) => s.type === 'QUIZ');

      if (quizSlides.length > 0) {
        const attempts = await this.slideAttemptRepo.getLatestAttemptsForSlides(
          dto.userId,
          quizSlides.map((s) => s.id),
        );

        const correctCount = attempts.filter((a) => a.isCorrect).length;
        // Score = percentage of quiz slides answered correctly (0–100)
        score = Math.round((correctCount / quizSlides.length) * 100);
      }
    }

    // ── Upsert progress record ───────────────────────────────────────────────
    const { progress, isFirstCompletion } =
      await this.lessonProgressRepo.upsertProgress(
        dto.userId,
        lessonId,
        status,
        score !== undefined ? score : dto.score,
      );

    // ── Award XP only on FIRST completion — prevents XP farming ─────────────
    if (status !== ProgressStatus.COMPLETED || !isFirstCompletion) {
      return { progress };
    }

    const gamification = await this.gamificationRepo.awardXpAndUpdateStreak(
      dto.userId,
      lesson.xpReward,
    );

    return {
      progress,
      gamification: {
        xpEarned: lesson.xpReward,
        score: score ?? null,
        ...gamification,
      },
    };
  }

  // ── POST /slides/:slideId/attempt ────────────────────────────────────────────

  async recordSlideAttempt(slideId: string, dto: RecordAttemptDto) {
    const slide = await this.lessonRepo.findSlideById(slideId);

    if (!slide) {
      throw new NotFoundException(`Slide with id "${slideId}" not found`);
    }

    if (slide.type !== 'QUIZ') {
      throw new BadRequestException(
        `Slide "${slideId}" is not a QUIZ slide — only QUIZ slides accept attempts`,
      );
    }

    if (slide.correctOption === null || slide.correctOption === undefined) {
      throw new BadRequestException(
        `Slide "${slideId}" has no correct answer configured`,
      );
    }

    const isCorrect = dto.selectedOption === slide.correctOption;

    await this.slideAttemptRepo.recordSlideAttempt(
      dto.userId,
      slideId,
      dto.selectedOption,
      isCorrect,
    );

    return {
      isCorrect,
      selectedOption: dto.selectedOption,
      correctOption: slide.correctOption,
      explanation: slide.explanation ?? null,
    };
  }
}
