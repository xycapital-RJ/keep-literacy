import { IsInt, IsUUID, Min } from 'class-validator';

export class RecordAttemptDto {
  @IsUUID()
  userId!: string;

  @IsInt()
  @Min(0)
  selectedOption!: number;
}
