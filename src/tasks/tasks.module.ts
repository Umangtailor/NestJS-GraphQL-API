import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from '../database/models/task.model';
import { Project } from '../database/models/project.model';
import { ProjectMember } from '../database/models/project-member.model';
import { User } from '../database/models/user.model';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { AuthModule } from '../auth/auth.module';
import { RedisCacheModule } from '../cache/cache.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Task, Project, ProjectMember, User]),
    AuthModule,
    RedisCacheModule,
  ],
  providers: [TasksService, TasksResolver],
  exports: [TasksService],
})
export class TasksModule {}