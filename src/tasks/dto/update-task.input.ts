import { IsNotEmpty, IsOptional, IsUUID, Length, IsIn } from 'class-validator';

export class UpdateTaskInput {
  @IsNotEmpty()
  @IsUUID(4, { message: 'Task ID must be a valid UUID' })
  taskId: string;

  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsOptional()
  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'], { message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED' })
  status?: string;
}