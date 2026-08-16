import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICourseRepository } from './repositories/course.repository.interface';
import { COURSE_REPOSITORY } from './repositories/course.repository.interface';

@Injectable()
export class CourseService {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  findAll() {
    return this.courseRepo.findAllPublished();
  }

  async findOne(id: string) {
    const course = await this.courseRepo.findByIdWithModulesAndLessons(id);
    if (!course) {
      throw new NotFoundException(`Course with id "${id}" not found`);
    }
    return course;
  }
}
