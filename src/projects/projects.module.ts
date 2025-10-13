import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from '../database/models/project.model';
import { ProjectMember } from '../database/models/project-member.model';
import { User } from '../database/models/user.model';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Project, ProjectMember, User]),
    AuthModule,
  ],
  providers: [ProjectsService, ProjectsResolver],
  exports: [ProjectsService],
})
export class ProjectsModule {}