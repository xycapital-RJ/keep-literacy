import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { SaveProgressDto } from './dto/save-progress.dto';
import { RecordAttemptDto } from './dto/record-attempt.dto';

@Controller()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /** Save lesson completion + award XP & streak */
  @Post('lessons/:lessonId/progress')
  saveProgress(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() dto: SaveProgressDto,
  ) {
    return this.progressService.saveLessonProgress(lessonId, dto);
  }

  /** Record a quiz slide answer — returns isCorrect + explanation */
  @Post('slides/:slideId/attempt')
  recordAttempt(
    @Param('slideId', ParseUUIDPipe) slideId: string,
    @Body() dto: RecordAttemptDto,
  ) {
    return this.progressService.recordSlideAttempt(slideId, dto);
  }
}
