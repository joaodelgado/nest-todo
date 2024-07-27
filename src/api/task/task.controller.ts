import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Put, Query, Req } from '@nestjs/common';
import { TaskResponse } from './task.response.dto';
import { ListTaskRequest, NewTaskRequest } from './task.request.dto';
import { TaskService } from '../../domain/task/task.service';
import { REQUEST_USER_KEY } from '../auth/auth.guard';
import { PaginatedResponse } from '../utils/pagination.util';

@Controller('/tasks')
export class TaskController {
  constructor(private taskService: TaskService) { }

  @Get(':id')
  async get_by_id(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<TaskResponse> {
    const task = await this.taskService.get_one({
      user: req['user'],
      id: id
    });

    if (task == undefined) {
      throw new NotFoundException();
    }

    return TaskResponse.from_domain(task);
  }

  @Get()
  async list(
    @Req() req: Request,
    @Query() request: ListTaskRequest,
  ): Promise<PaginatedResponse<TaskResponse>> {
    const tasks = await this.taskService.list(request.to_domain(req['user']));
    return PaginatedResponse.from_domain(tasks, TaskResponse.from_domain);
  }

  @Put()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() request: NewTaskRequest): Promise<TaskResponse> {
    const task = await this.taskService.create(request.to_domain(req[REQUEST_USER_KEY]));
    return TaskResponse.from_domain(task);
  }
}

