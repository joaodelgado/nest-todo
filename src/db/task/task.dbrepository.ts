import { Injectable } from '@nestjs/common';
import { TaskDbEntity } from './task.dbentity';
import { TaskRepository } from '../../domain/task/task.repository';
import { NewTask, Task, TaskFilter } from '../../domain/task/task.entity';
import { Equal, IsNull, LessThan, MoreThanOrEqual, Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResult } from 'src/domain/utils/pagination.util';
import { paginate, to_paginated_result } from '../utils/pagination.utils';

@Injectable()
export class TaskDbRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskDbEntity)
    private taskOrmRepository: Repository<TaskDbEntity>,
  ) { }

  async list(filter: TaskFilter): Promise<PaginatedResult<Task>> {
    const where = {
      created_by: Equal(filter.user.data.id),
    };

    if (filter.overdue === true) {
      where['deadline'] = LessThan(new Date());
    } else if (filter.overdue === false) {
      where['deadline'] = Or(
        MoreThanOrEqual(new Date()),
        IsNull(),
      )
    }

    const results = await this.taskOrmRepository.find(paginate(
      {
        where: where,
        relations: {
          created_by: true,
        }
      },
      filter
    ));

    return to_paginated_result(filter, results, task => task.to_domain());
  }


  async create(task: NewTask): Promise<Task> {
    const saved = await this.taskOrmRepository.save(
      TaskDbEntity.from_domain(task),
    );
    return saved.to_domain();
  }
}
