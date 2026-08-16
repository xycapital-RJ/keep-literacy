import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /** List all published courses */
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  /** Get one course with its modules and lessons */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.courseService.findOne(id);
  }
}
