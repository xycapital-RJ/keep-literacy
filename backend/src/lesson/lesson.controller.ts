import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonQueryDto } from './dto/lesson-query.dto';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  findAll(@Query() query: LessonQueryDto) {
    return this.lessonService.findAll(query.moduleId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonService.findByIdWithSlides(id);
  }
}
