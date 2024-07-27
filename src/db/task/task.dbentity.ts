import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { NewTask, Task } from '../../domain/task/task.entity';

@Entity('tasks')
export class TaskDbEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  description: string;

  @Column()
  completed: boolean;

  @Column()
  deadline?: Date;

  @Column()
  created_at: Date;

  private constructor() { }

  public static from_domain(task: NewTask): TaskDbEntity {
    const dbEntity = new TaskDbEntity();
    dbEntity.description = task.data.description;
    dbEntity.completed = task.data.completed;
    dbEntity.deadline = task.data.deadline;
    dbEntity.created_at = task.data.created_at;
    return dbEntity;
  }

  public to_domain(): Task {
    return new Task({
      id: this.id,
      description: this.description,
      completed: this.completed,
      deadline: this.deadline,
      created_at: this.created_at,
    });
  }
}
