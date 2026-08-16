import { IsOptional, IsUUID } from 'class-validator';

export class LessonQueryDto {
  @IsOptional()
  @IsUUID()
  moduleId?: string;
}
