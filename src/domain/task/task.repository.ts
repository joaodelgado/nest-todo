import { PaginatedFilter, PaginatedResult } from '../utils/pagination.util';
import { NewTask, Task, TaskFilter } from './task.entity';

export interface TaskRepository {
  get_one(filter: TaskFilter): Promise<Task | undefined>;
  list(filter: PaginatedFilter<TaskFilter>): Promise<PaginatedResult<Task>>;
  create(task: NewTask): Promise<Task>;
}

export const TaskRepository = Symbol('TaskRepository');
