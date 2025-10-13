import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver('Task')
@UseGuards(GqlAuthGuard)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Query('myTasks')
  async getMyTasks(
    @Args('page') page: number = 1,
    @Args('limit') limit: number = 10,
    @Args('search') search: string,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.getMyTasks(user.userId, page, limit, search);
  }

  @Mutation('createTask')
  async createTask(
    @Args('data') createTaskData: CreateTaskInput,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.createTask(createTaskData, user.userId);
  }

  @Mutation('updateTask')
  async updateTask(
    @Args('data') updateTaskData: UpdateTaskInput,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.updateTask(updateTaskData, user.userId);
  }

  @Mutation('deleteTask')
  async deleteTask(
    @Args('taskId') taskId: string,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.deleteTask(taskId, user.userId);
  }
}