import { Injectable } from '@nestjs/common';
import { Course } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CourseWithModules,
  ICourseRepository,
} from './course.repository.interface';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublished(): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByIdWithModulesAndLessons(
    id: string,
  ): Promise<CourseWithModules | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: { orderBy: { order: 'asc' } },
          },
        },
      },
    });
  }
}
