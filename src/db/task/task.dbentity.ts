import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NewTask, Task } from '../../domain/task/task.entity';
import { UserDbEntity } from '../user/user.dbentity';

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

  @ManyToOne(() => UserDbEntity)
  @JoinColumn({ name: 'created_by' })
  created_by: UserDbEntity;

  private constructor() { }

  public static from_domain(task: NewTask): TaskDbEntity {
    const dbEntity = new TaskDbEntity();
    dbEntity.description = task.data.description;
    dbEntity.completed = task.data.completed;
    dbEntity.deadline = task.data.deadline;
    dbEntity.created_at = task.data.created_at;
    dbEntity.created_by = UserDbEntity.from_id(task.data.created_by.data.id);
    return dbEntity;
  }

  public to_domain(): Task {
    return new Task({
      id: this.id,
      description: this.description,
      completed: this.completed,
      deadline: this.deadline,
      created_at: this.created_at,
      created_by: this.created_by.to_domain(),
    });
  }
}
