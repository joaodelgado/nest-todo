import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { TaskResponse } from './task.response.dto';
import { NewTaskRequest } from './task.request.dto';
import { TaskService } from '../../domain/task/task.service';

@Controller('/tasks')
export class TaskController {
  constructor(private taskService: TaskService) { }

  @Put()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() request: NewTaskRequest): Promise<TaskResponse> {
    const task = await this.taskService.create(request.to_domain());
    return TaskResponse.fromDomain(task);
  }
}

