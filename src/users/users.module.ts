import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../database/models/user.model';
// import { TokenBlacklist } from '../database/models/token-blacklist.model';
import { AuthModule } from '../auth/auth.module';
import { PubsubModule } from '../pubsub/pubsub.module';
import { UsersService } from './users.service';

// Resolvers
import * as UserResolvers from './resolvers';
// Services
import * as UserServices from './services';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    AuthModule,
    PubsubModule,
  ],
  providers: [
    UsersService,
    ...Object.values(UserServices),
    ...Object.values(UserResolvers),
  ],
  exports: [UsersService],
})
export class UsersModule { }
