import { Injectable } from '@nestjs/common';
import { Lesson, Slide } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ILessonRepository,
  LessonWithSlides,
} from './lesson.repository.interface';

@Injectable()
export class LessonRepository implements ILessonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(moduleId?: string): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      where: moduleId ? { moduleId } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({ where: { id } });
  }

  async findByIdWithSlides(id: string): Promise<LessonWithSlides | null> {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        slides: { orderBy: { order: 'asc' } },
      },
    });
  }

  async findSlideById(slideId: string): Promise<Slide | null> {
    return this.prisma.slide.findUnique({ where: { id: slideId } });
  }
}
