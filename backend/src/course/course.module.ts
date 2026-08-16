import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseRepository } from './repositories/course.repository';
import { COURSE_REPOSITORY } from './repositories/course.repository.interface';

@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    { provide: COURSE_REPOSITORY, useClass: CourseRepository },
  ],
})
export class CourseModule {}
