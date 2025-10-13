import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  username: string;
  @Field()
  @IsEmail({}, { message: 'Is not a email' })
  email: string;
  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}