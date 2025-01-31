import { PaginatedFilter, PaginatedResult } from '../utils/pagination.util';
import { NewTask, Task, TaskFilter, UpdateTask } from './task.entity';

export interface TaskRepository {
  get_one(filter: TaskFilter): Promise<Task>;
  list(filter: PaginatedFilter<TaskFilter>): Promise<PaginatedResult<Task>>;
  create(task: NewTask): Promise<Task>;
  update(task: UpdateTask): Promise<Task>;
  delete(task: TaskFilter): Promise<void>;
}

export const TaskRepository = Symbol('TaskRepository');
