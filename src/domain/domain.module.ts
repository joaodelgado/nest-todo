import { Module } from '@nestjs/common';
import { TaskDomainModule } from './task/task.module';

const modules = [TaskDomainModule];

@Module({
  imports: modules,
  exports: modules,
})
export class DomainModule { }
