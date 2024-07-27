import { NewTask, Task } from './task.entity';

export interface TaskRepository {
  create(task: NewTask): Promise<Task>;
}

export const TaskRepository = Symbol('TaskRepository');
