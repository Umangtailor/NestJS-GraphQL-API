import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateProjectInput {
  @IsNotEmpty({ message: 'Project name must not be empty' })
  @Length(1, 255)
  name: string;

  @IsOptional()
  @Length(0, 1000)
  description?: string;
}