import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskDbEntity } from './task.dbentity';
import { TaskRepository } from '../../domain/task/task.repository';
import { NewTask, Task, TaskFilter, UpdateTask } from '../../domain/task/task.entity';
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

  async get_one(filter: TaskFilter): Promise<Task> {
    const result = await this.get_one_db(filter);

    return result.to_domain();
  }

  private async get_one_db(filter: TaskFilter): Promise<TaskDbEntity | undefined> {
    const result = await this.taskOrmRepository.findOne({
      where: this.apply_filter(filter),
      relations: {
        created_by: true,
      }
    });

    if (result == undefined) {
      throw new NotFoundException();
    }

    return result;
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

  async update(task: UpdateTask): Promise<Task> {
    const existing_task = await this.get_one_db(task.data);

    await this.taskOrmRepository.manager.transaction(async () => {
      const result = await this.taskOrmRepository.update(task.data.id, existing_task);
      console.log(result);
      if (result.affected !== 1) {
        throw new ConflictException("Task might have been deleted while updating");
      }
    });


    return existing_task.to_domain();
  }

  async delete(task: TaskFilter): Promise<void> {
    const existing_task = await this.get_one_db(task);
    await this.taskOrmRepository.delete(existing_task.id);
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

    if (filter.completed !== undefined) {
      where['completed'] = Equal(filter.completed);
    }

    return where;
  }

}
