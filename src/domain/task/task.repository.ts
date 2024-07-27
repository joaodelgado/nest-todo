import { PaginatedResult } from '../utils/pagination.util';
import { NewTask, Task, TaskFilter } from './task.entity';

export interface TaskRepository {
  list(filter: TaskFilter): Promise<PaginatedResult<Task>>;
  create(task: NewTask): Promise<Task>;
}

export const TaskRepository = Symbol('TaskRepository');
