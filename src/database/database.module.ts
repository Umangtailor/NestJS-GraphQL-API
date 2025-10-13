import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';

import { User } from './models/user.model';
import { Project } from './models/project.model';
import { ProjectMember } from './models/project-member.model';
import { Task } from './models/task.model';

@Module({
  imports: [
    AppConfigModule,

    SequelizeModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        dialect: 'postgres',
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUsername,
        password: configService.databasePassword,
        database: configService.databaseName,
        models: [User, Project, ProjectMember, Task],
        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
    }),

    SequelizeModule.forFeature([User, Project, ProjectMember, Task]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule { }
