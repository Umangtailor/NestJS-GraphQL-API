// src/users/resolvers/mutations/login-user.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LoginUserInput } from 'src/users/dto/login-user.input';
import { UsersService } from 'src/users/users.service';


@Resolver()
export class LoginUserResolver {
  constructor(private usersService: UsersService) { }

  @Mutation('loginUser')
  async loginUser(@Args('data') input: LoginUserInput): Promise<any> {
    return this.usersService.loginUser(input);
  }
}
