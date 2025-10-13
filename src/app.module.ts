import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { PubsubModule } from './pubsub/pubsub.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { RedisCacheModule } from './cache/cache.module';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    RedisCacheModule,
    UsersModule,
    PubsubModule,
    ProjectsModule,
    TasksModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [join(process.cwd(), 'src/**/*.gql')],
      sortSchema: true,

      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': false,
      },
      context: ({ req, connection }) => {
        if (connection) {
          return { req: connection.context };
        }
        return { req };
      },
      playground: false,
      plugins: process.env.NODE_ENV !== 'production' ? [ApolloServerPluginLandingPageLocalDefault()] : [],
    }),
  ],
})
export class AppModule { }
