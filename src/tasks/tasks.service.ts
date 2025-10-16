import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { Task } from '../database/models/task.model';
import { Project } from '../database/models/project.model';
import { ProjectMember } from '../database/models/project-member.model';
import { User } from '../database/models/user.model';
import { CacheService } from '../cache/cache.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private taskModel: typeof Task,
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(ProjectMember) private projectMemberModel: typeof ProjectMember,
    @InjectModel(User) private userModel: typeof User,
    private sequelize: Sequelize,
    private cacheService: CacheService,
  ) {}

  async createTask(createTaskData: CreateTaskInput, userId: string) {
    const project = await this.projectModel.findByPk(createTaskData.projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if user is project owner or member
    const isMember = await this.isProjectMember(createTaskData.projectId, userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this project');
    }

    // If assignedTo is provided, check if they are project member
    if (createTaskData.assignedTo) {
      const assigneeIsMember = await this.isProjectMember(createTaskData.projectId, createTaskData.assignedTo);
      if (!assigneeIsMember) {
        throw new BadRequestException('Assigned user is not a member of this project');
      }
    }

    const task = await this.taskModel.create({
      title: createTaskData.title,
      description: createTaskData.description || null,
      projectId: createTaskData.projectId,
      createdBy: userId,
      assignedTo: createTaskData.assignedTo || null,
      status: 'pending',
    } as any);

    // Clear cache for the user and assignee
    await this.clearUserTasksCache(userId);
    if (createTaskData.assignedTo) {
      await this.clearUserTasksCache(createTaskData.assignedTo);
    }

    return {
      message: 'Task created successfully',
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status.toUpperCase().replace(/-/g, '_'),
        projectName: project?.name || 'Unknown Project',
        createdAt: task.createdAt,
      },
    };
  }

  async updateTask(updateTaskData: UpdateTaskInput, userId: string) {
    const task = await this.taskModel.findByPk(updateTaskData.taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.isDeleted) {
      throw new BadRequestException('Cannot update deleted task');
    }

    // Only creator or assignee can update
    if (task.createdBy !== userId && task.assignedTo !== userId) {
      throw new ForbiddenException('Only task creator or assignee can update the task');
    }

    const updateData: any = {};
    if (updateTaskData.description !== undefined) {
      updateData.description = updateTaskData.description;
    }
    if (updateTaskData.status !== undefined) {
      updateData.status = updateTaskData.status.toLowerCase().replace(/_/g, '-');
    }

    await task.update(updateData);

    const project = await this.projectModel.findByPk(task.projectId);

    // Clear cache for creator and assignee
    await this.clearUserTasksCache(task.createdBy);
    if (task.assignedTo) {
      await this.clearUserTasksCache(task.assignedTo);
    }

    return {
      message: 'Task updated successfully',
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status.toUpperCase().replace(/-/g, '_'),
        projectName: project?.name || 'Unknown Project',
        createdAt: task.createdAt,
      },
    };
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.taskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.isDeleted) {
      throw new BadRequestException('Task is already deleted');
    }

    // Only creator or assignee can delete
    if (task.createdBy !== userId && task.assignedTo !== userId) {
      throw new ForbiddenException('Only task creator or assignee can delete the task');
    }

    await task.update({
      isDeleted: true,
      deletedAt: new Date(),
    });

    const project = await this.projectModel.findByPk(task.projectId);

    // Clear cache for creator and assignee
    await this.clearUserTasksCache(task.createdBy);
    if (task.assignedTo) {
      await this.clearUserTasksCache(task.assignedTo);
    }

    return {
      message: 'Task deleted successfully',
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status.toUpperCase().replace(/-/g, '_'),
        projectName: project?.name || 'Unknown Project',
        createdAt: task.createdAt,
      },
    };
  }

  async getMyTasks(userId: string, page = 1, limit = 10, search?: string) {
    const cacheKey = this.cacheService.generateTaskCacheKey(userId, page, limit, search);

    // Try to get from cache first
    const cachedResult = await this.cacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Use stored procedure
    const result = await this.getUserTasksFromStoredProcedure(userId, page, limit, search);

    // Cache the result for 1 minute
    await this.cacheService.set(cacheKey, result, 60);

    return result;
  }

  private async getUserTasksFromStoredProcedure(userId: string, page: number, limit: number, search?: string) {
    const query = `SELECT * FROM sp_get_user_tasks($1::uuid, $2::int, $3::int, $4::text)`;

    const results = await this.sequelize.query(query, {
      bind: [userId, page, limit, search || null],
      type: QueryTypes.SELECT,
    }) as any[];

    if (!results.length) {
      return {
        tasks: [],
        totalCount: 0,
        hasNextPage: false,
      };
    }

    const totalCount = results[0].total_count || 0;
    const hasNextPage = results.length === limit && results.length < totalCount;

    return {
      tasks: results.map(row => ({
        id: row.task_id,
        title: row.title,
        description: row.description,
        status: row.status.toUpperCase().replace(/-/g, '_'),
        projectName: row.project_name,
        createdAt: row.created_date,
      })),
      totalCount: parseInt(totalCount),
      hasNextPage,
    };
  }

  private async isProjectMember(projectId: string, userId: string): Promise<boolean> {
    const project = await this.projectModel.findByPk(projectId);
    if (project?.ownerId === userId) {
      return true;
    }

    const membership = await this.projectMemberModel.findOne({
      where: { projectId, userId }
    });

    return !!membership;
  }

  private async clearUserTasksCache(userId: string): Promise<void> {
    // Clear all cache entries for this user (different page/limit/search combinations)
    // In a real implementation, you might want to use cache patterns or tags
    for (let page = 1; page <= 10; page++) {
      for (let limit of [10, 20, 50]) {
        const cacheKey = this.cacheService.generateTaskCacheKey(userId, page, limit);
        await this.cacheService.del(cacheKey);

        // Also clear entries with search terms (simplified approach)
        const searchCacheKey = this.cacheService.generateTaskCacheKey(userId, page, limit, 'search');
        await this.cacheService.del(searchCacheKey);
      }
    }
  }
}