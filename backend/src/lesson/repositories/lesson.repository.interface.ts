import { Lesson, Slide } from '@prisma/client';

export type LessonWithSlides = Lesson & { slides: Slide[] };

export interface ILessonRepository {
  findAll(moduleId?: string): Promise<Lesson[]>;
  findById(id: string): Promise<Lesson | null>;
  findByIdWithSlides(id: string): Promise<LessonWithSlides | null>;
  findSlideById(slideId: string): Promise<Slide | null>;
}

export const LESSON_REPOSITORY = Symbol('LESSON_REPOSITORY');
