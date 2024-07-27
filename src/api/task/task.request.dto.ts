import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { NewTask, TaskFilter, UpdateTask } from '../../domain/task/task.entity';
import { User } from 'src/domain/user/user.entity';
import { PaginatedRequest } from '../utils/pagination.util';
import { Transform } from 'class-transformer';
import { PaginatedFilter } from 'src/domain/utils/pagination.util';

export class NewTaskRequest {
  @IsNotEmpty()
  description: string;

  @IsOptional()
  deadline?: Date;

  public static from_domain(task: NewTask): NewTaskRequest {
    const request = new NewTaskRequest();
    request.description = task.data.description;
    request.deadline = task.data.deadline;
    return request;
  }

  public to_domain(user: User): NewTask {
    return new NewTask({
      description: this.description,
      completed: false,
      deadline: this.deadline,
      created_at: new Date(),
      created_by: user
    });
  }
}

export class UpdateTaskRequest {
  @IsOptional()
  description: string;

  @IsOptional()
  @IsBoolean()
  @Transform((param) => {
    let value = param.obj[param.key];
    return value === 'true' || value === true || value === 1 || value === '1';
  })
  completed?: boolean;

  @IsOptional()
  deadline?: Date;

  public static from_domain(task: UpdateTask): UpdateTaskRequest {
    const request = new UpdateTaskRequest();
    request.description = task.data.description;
    request.completed = task.data.completed;
    request.deadline = task.data.deadline;
    return request;
  }

  public to_domain(id: number, user: User): UpdateTask {
    return new UpdateTask({
      id: id,
      user: user,
      description: this.description,
      completed: this.completed,
      deadline: this.deadline
    });
  }
}


export class ListTaskRequest extends PaginatedRequest {
  @IsOptional()
  @IsBoolean()
  @Transform((param) => {
    let value = param.obj[param.key];
    return value === 'true' || value === true || value === 1 || value === '1';
  })
  overdue?: boolean;

  public to_domain(user: User): PaginatedFilter<TaskFilter> {
    return {
      page: this.page,
      size: this.size,
      filter: {
        user: user,
        overdue: this.overdue,
      }
    };
  }
}
