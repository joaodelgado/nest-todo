import { Module } from '@nestjs/common';
import { TaskApiModule } from './task/task.module';

const modules = [TaskApiModule];

@Module({
  imports: modules,
  exports: modules,
})
export class ApiModule { }
