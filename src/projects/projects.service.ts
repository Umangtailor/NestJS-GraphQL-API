import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from '../database/models/project.model';
import { ProjectMember } from '../database/models/project-member.model';
import { User } from '../database/models/user.model';
import { CreateProjectInput } from './dto/create-project.input';
import { AddProjectMemberInput } from './dto/add-project-member.input';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(ProjectMember) private projectMemberModel: typeof ProjectMember,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async createProject(createProjectData: CreateProjectInput, userId: string) {
    const project = await this.projectModel.create({
      name: createProjectData.name,
      description: createProjectData.description || null,
      ownerId: userId,
    } as any);

    const projectWithOwner = await this.projectModel.findByPk(project.id, {
      include: [{ model: User, as: 'owner' }],
    });

    return {
      message: 'Project created successfully',
      data: projectWithOwner,
    };
  }

  async addProjectMember(addMemberData: AddProjectMemberInput, userId: string) {
    const project = await this.projectModel.findByPk(addMemberData.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Only project owner can add members');
    }

    const user = await this.userModel.findOne({ where: { email: addMemberData.userEmail } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await this.projectMemberModel.findOne({
      where: { projectId: addMemberData.projectId, userId: user.id }
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this project');
    }

    await this.projectMemberModel.create({
      projectId: addMemberData.projectId,
      userId: user.id,
      role: 'member',
    } as any);

    const updatedProject = await this.projectModel.findByPk(addMemberData.projectId, {
      include: [{ model: User, as: 'owner' }],
    });

    return {
      message: 'Member added successfully',
      data: updatedProject,
    };
  }

  async getMyProjects(userId: string) {
    return await this.projectModel.findAll({
      where: { ownerId: userId },
      include: [{ model: User, as: 'owner' }],
      order: [['createdAt', 'DESC']],
    });
  }
}