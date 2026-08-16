import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ProgressStatus } from '@prisma/client';

export class SaveProgressDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsEnum(ProgressStatus)
  status?: ProgressStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;
}
