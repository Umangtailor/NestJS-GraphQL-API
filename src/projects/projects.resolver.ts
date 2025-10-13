import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dto/create-project.input';
import { AddProjectMemberInput } from './dto/add-project-member.input';

@Resolver('Project')
@UseGuards(GqlAuthGuard)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query('myProjects')
  async getMyProjects(@CurrentUser() user: any) {
    return this.projectsService.getMyProjects(user.userId);
  }

  @Mutation('createProject')
  async createProject(
    @Args('data') createProjectData: CreateProjectInput,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.createProject(createProjectData, user.userId);
  }

  @Mutation('addProjectMember')
  async addProjectMember(
    @Args('data') addMemberData: AddProjectMemberInput,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.addProjectMember(addMemberData, user.userId);
  }
}