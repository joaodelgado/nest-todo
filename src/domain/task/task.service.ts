import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NewTask, Task, TaskFilter, UpdateTask } from './task.entity';
import { TaskRepository } from './task.repository';
import { PaginatedFilter, PaginatedResult } from '../utils/pagination.util';

@Injectable()
export class TaskService {

  constructor(
    @Inject(TaskRepository) private readonly taskRepository: TaskRepository,
  ) { }

  async get_one(filter: TaskFilter): Promise<Task | undefined> {
    return this.taskRepository.get_one(filter);
  }

  async list(filter: PaginatedFilter<TaskFilter>): Promise<PaginatedResult<Task>> {
    return this.taskRepository.list(filter);
  }

  async create(task: NewTask): Promise<Task> {
    if (task.is_overdue()) {
      throw new UnprocessableEntityException("Deadlines can't be in the past");
    }
    return this.taskRepository.create(task);
  }

  async update(task: UpdateTask): Promise<Task> {
    if (task.is_overdue()) {
      throw new UnprocessableEntityException("Deadlines can't be in the past");
    }
    return this.taskRepository.update(task);
  }
}

