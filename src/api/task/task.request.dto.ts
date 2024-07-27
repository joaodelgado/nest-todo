import { IsNotEmpty, IsOptional } from 'class-validator';
import { NewTask } from '../../domain/task/task.entity';

export class NewTaskRequest {
  @IsNotEmpty()
  description: string;

  @IsOptional()
  deadline?: Date;

  public static fromDomain(task: NewTask): NewTaskRequest {
    const request = new NewTaskRequest();
    request.description = task.data.description;
    request.deadline = task.data.deadline;
    return request;
  }

  public toDomain(): NewTask {
    return new NewTask({
      description: this.description,
      completed: false,
      deadline: this.deadline,
      created_at: new Date(),
    });
  }
}
