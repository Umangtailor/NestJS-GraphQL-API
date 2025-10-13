import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UsersService } from 'src/users/users.service';

@Resolver()
export class SignUpResolver {
  constructor(private usersService: UsersService) { }
  @Mutation('signUp')
  async signUp(@Args('data') input: CreateUserInput): Promise<any> {
    const user = await this.usersService.signUp(input);
    return { id: user.id, email: user.email, username: user.username };
  }
}