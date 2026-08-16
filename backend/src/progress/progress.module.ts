import { Module } from '@nestjs/common';
import { LessonModule } from '../lesson/lesson.module';

import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

import { LessonProgressRepository } from './repositories/lesson-progress.repository';
import { LESSON_PROGRESS_REPOSITORY } from './repositories/lesson-progress.repository.interface';

import { GamificationRepository } from './repositories/gamification.repository';
import { GAMIFICATION_REPOSITORY } from './repositories/gamification.repository.interface';

import { SlideAttemptRepository } from './repositories/slide-attempt.repository';
import { SLIDE_ATTEMPT_REPOSITORY } from './repositories/slide-attempt.repository.interface';

@Module({
  imports: [LessonModule],
  controllers: [ProgressController],
  providers: [
    ProgressService,
    {
      provide: LESSON_PROGRESS_REPOSITORY,
      useClass: LessonProgressRepository,
    },
    {
      provide: GAMIFICATION_REPOSITORY,
      useClass: GamificationRepository,
    },
    {
      provide: SLIDE_ATTEMPT_REPOSITORY,
      useClass: SlideAttemptRepository,
    },
  ],
})
export class ProgressModule {}
