import { IsNotEmpty, IsOptional, IsUUID, Length } from 'class-validator';

export class CreateTaskInput {
  @IsNotEmpty({ message: 'Title must not be empty' })
  @Length(1, 255)
  title: string;

  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsNotEmpty()
  @IsUUID(4, { message: 'Project ID must be a valid UUID' })
  projectId: string;

  @IsOptional()
  @IsUUID(4, { message: 'Assigned user ID must be a valid UUID' })
  assignedTo?: string;
}