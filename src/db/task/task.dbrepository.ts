import { Injectable } from '@nestjs/common';
import { TaskDbEntity } from './task.dbentity';
import { TaskRepository } from '../../domain/task/task.repository';
import { NewTask, Task, TaskFilter } from '../../domain/task/task.entity';
import { Equal, FindOptionsWhere, IsNull, LessThan, MoreThanOrEqual, Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedFilter, PaginatedResult } from 'src/domain/utils/pagination.util';
import { paginate, to_paginated_result } from '../utils/pagination.utils';

@Injectable()
export class TaskDbRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskDbEntity)
    private taskOrmRepository: Repository<TaskDbEntity>,
  ) { }

  async get_one(filter: TaskFilter): Promise<Task | undefined> {
    const result = await this.taskOrmRepository.findOne({
      where: this.apply_filter(filter),
      relations: {
        created_by: true,
      }
    });
    return result?.to_domain();
  }

  async list(paged_filter: PaginatedFilter<TaskFilter>): Promise<PaginatedResult<Task>> {
    const query = paginate(
      {
        where: this.apply_filter(paged_filter.filter),
        relations: {
          created_by: true,
        }
      },
      paged_filter
    );

    const results = await this.taskOrmRepository.find(query);

    return to_paginated_result(paged_filter, results, task => task.to_domain());
  }


  async create(task: NewTask): Promise<Task> {
    const saved = await this.taskOrmRepository.save(
      TaskDbEntity.from_domain(task),
    );
    return saved.to_domain();
  }

  private apply_filter(filter: TaskFilter): FindOptionsWhere<TaskDbEntity> {
    const where = {
      created_by: Equal(filter.user.data.id),
    };

    if (filter.id !== undefined) {
      where['id'] = Equal(filter.id);
    }

    if (filter.overdue === true) {
      where['deadline'] = LessThan(new Date());
    } else if (filter.overdue === false) {
      where['deadline'] = Or(
        MoreThanOrEqual(new Date()),
        IsNull(),
      )
    }

    return where;
  }
}
