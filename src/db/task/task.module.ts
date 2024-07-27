import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskDbEntity } from './task.dbentity';
import { TaskDbRepository } from './task.dbrepository';
import { TaskRepository } from '../../domain/task/task.repository';

const providers = [{ provide: TaskRepository, useClass: TaskDbRepository }];

@Module({
  imports: [TypeOrmModule.forFeature([TaskDbEntity])],
  providers: providers,
  exports: providers,
})
export class TaskDbModule { }
