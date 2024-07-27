import { Module } from '@nestjs/common';
import { TaskApiModule } from './task/task.module';
import { AuthApiModule } from './auth/auth.module';

const modules = [AuthApiModule, TaskApiModule];

@Module({
  imports: modules,
  exports: modules,
})
export class ApiModule { }
