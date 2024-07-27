import { Body, Controller, HttpCode, HttpStatus, Put, Req } from '@nestjs/common';
import { TaskResponse } from './task.response.dto';
import { NewTaskRequest } from './task.request.dto';
import { TaskService } from '../../domain/task/task.service';
import { REQUEST_USER_KEY } from '../auth/auth.guard';

@Controller('/tasks')
export class TaskController {
  constructor(private taskService: TaskService) { }

  @Put()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Req() req: Request, @Body() request: NewTaskRequest): Promise<TaskResponse> {
    const task = await this.taskService.create(request.to_domain(req[REQUEST_USER_KEY]));
    return TaskResponse.fromDomain(task);
  }
}

