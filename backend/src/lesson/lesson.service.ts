import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ILessonRepository } from './repositories/lesson.repository.interface';
import {
  LESSON_REPOSITORY,
  LessonWithSlides,
} from './repositories/lesson.repository.interface';
import { Lesson } from '@prisma/client';

@Injectable()
export class LessonService {
  constructor(
    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async findAll(moduleId?: string): Promise<Lesson[]> {
    return this.lessonRepository.findAll(moduleId);
  }

  async findByIdWithSlides(id: string): Promise<LessonWithSlides> {
    const lesson = await this.lessonRepository.findByIdWithSlides(id);

    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }

    return lesson;
  }
}
