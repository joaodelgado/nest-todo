import { Injectable } from '@nestjs/common';
import { TaskDbEntity } from './task.dbentity';
import { TaskRepository } from '../../domain/task/task.repository';
import { NewTask, Task } from '../../domain/task/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskDbRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskDbEntity)
    private taskOrmRepository: Repository<TaskDbEntity>,
  ) { }

  async create(task: NewTask): Promise<Task> {
    const saved = await this.taskOrmRepository.save(
      TaskDbEntity.from_domain(task),
    );
    return saved.to_domain();
  }
}
