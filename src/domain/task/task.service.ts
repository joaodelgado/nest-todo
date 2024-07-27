import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NewTask, Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @Inject(TaskRepository) private readonly taskRepository: TaskRepository,
  ) { }

  async create(task: NewTask): Promise<Task> {
    if (task.is_overdue()) {
      this.logger.warn(`Received an overdue task creation request ${task.data.deadline}`);
      throw new UnprocessableEntityException("Deadlines can't be in the past");
    }
    return this.taskRepository.create(task);
  }
}

