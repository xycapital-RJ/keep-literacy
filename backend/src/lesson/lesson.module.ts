import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LessonRepository } from './repositories/lesson.repository';
import { LESSON_REPOSITORY } from './repositories/lesson.repository.interface';

@Module({
  controllers: [LessonController],
  providers: [
    LessonService,
    {
      provide: LESSON_REPOSITORY,
      useClass: LessonRepository,
    },
  ],
  exports: [LESSON_REPOSITORY],
})
export class LessonModule {}
