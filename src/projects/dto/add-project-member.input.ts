import { IsNotEmpty, IsEmail, IsUUID } from 'class-validator';

export class AddProjectMemberInput {
  @IsNotEmpty()
  @IsUUID(4, { message: 'Project ID must be a valid UUID' })
  projectId: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Must be a valid email address' })
  userEmail: string;
}