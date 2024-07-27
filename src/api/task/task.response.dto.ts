import { Task } from '../../domain/task/task.entity';

export class TaskResponse {
  id: number;
  description: string;
  completed: boolean;
  created_at: Date;
  deadline?: Date;
  overdue?: boolean;

  public static from_domain(task: Task): TaskResponse {
    return {
      id: task.data.id,
      description: task.data.description,
      completed: task.data.completed,
      created_at: task.data.created_at,
      deadline: task.data.deadline,
      overdue: task.is_overdue(),
    };
  }
}

